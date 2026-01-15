import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type UserRole = 'superadmin' | 'admin' | 'user' | 'dealer';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: UserRole | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  // IMPORTANT: Always resolve role using the DB function which applies role priority.
  // (Avoid reading the first row from user_roles which may not represent the highest privilege.)
  const fetchUserRole = useCallback(async (userId: string, currentRole?: UserRole | null): Promise<UserRole> => {
    try {
      const { data, error } = await supabase.rpc('get_user_role', { user_uuid: userId });

      if (error) {
        console.error('Rol RPC hatası:', error);
        // Hata durumunda mevcut rolü koru, yoksa 'user' döndür
        return currentRole || 'user';
      }

      return (data as UserRole) || currentRole || 'user';
    } catch (error) {
      console.error('Rol alınamadı:', error);
      // Hata durumunda mevcut rolü koru
      return currentRole || 'user';
    }
  }, []);

  const refreshRole = useCallback(async () => {
    if (user) {
      const role = await fetchUserRole(user.id, userRole);
      setUserRole(role);
    }
  }, [user, userRole, fetchUserRole]);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();

        if (!isMounted) return;

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          const role = await fetchUserRole(currentSession.user.id);
          if (isMounted) setUserRole(role);
        }
      } catch (error) {
        console.error('Auth başlatma hatası:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!isMounted) return;

        // Token yenileme olaylarında sadece session/user güncelle, rol değiştirme
        if (event === 'TOKEN_REFRESHED') {
          setSession(newSession);
          setUser(newSession?.user ?? null);
          // Rol zaten mevcut, değiştirme
          return;
        }

        // Yeni giriş veya çıkış durumlarında loading başlat
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          setLoading(true);
        }

        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          // Mevcut rolü parametre olarak geç - hata durumunda korunacak
          const role = await fetchUserRole(newSession.user.id, userRole);
          if (isMounted) setUserRole(role);
        } else {
          setUserRole(null);
        }

        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserRole]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setUserRole(null);
  };

  const value = {
    user,
    session,
    userRole,
    loading,
    signOut,
    refreshRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};