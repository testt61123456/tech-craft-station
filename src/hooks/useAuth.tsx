import { useState, useEffect, createContext, useContext, useCallback, useRef } from "react";
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
  
  // Ref to track current role to avoid stale closure issues
  const userRoleRef = useRef<UserRole | null>(null);
  
  // Keep ref in sync with state
  useEffect(() => {
    userRoleRef.current = userRole;
  }, [userRole]);

  // IMPORTANT: Always resolve role using the DB function which applies role priority.
  const fetchUserRole = useCallback(async (userId: string): Promise<UserRole> => {
    try {
      const { data, error } = await supabase.rpc('get_user_role', { user_uuid: userId });

      if (error) {
        console.error('Rol RPC hatası:', error);
        // Hata durumunda mevcut rolü koru
        return userRoleRef.current || 'user';
      }

      const role = (data as UserRole) || 'user';
      return role;
    } catch (error) {
      console.error('Rol alınamadı:', error);
      // Hata durumunda mevcut rolü koru
      return userRoleRef.current || 'user';
    }
  }, []);

  const refreshRole = useCallback(async () => {
    if (user) {
      const role = await fetchUserRole(user.id);
      setUserRole(role);
    }
  }, [user, fetchUserRole]);

  useEffect(() => {
    let isMounted = true;

    // Listener FIRST (sync only) to avoid missing events and to prevent deadlocks
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (!isMounted) return;

      // Only synchronous state updates here (avoid Supabase calls inside this callback)
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (event === 'SIGNED_OUT') {
        setUserRole(null);
        setLoading(false);
      }

      // Role will be resolved in a separate effect
      if (event === 'SIGNED_IN') {
        setLoading(true);
      }
    });

    // THEN check existing session
    supabase.auth
      .getSession()
      .then(({ data: { session: currentSession } }) => {
        if (!isMounted) return;

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (!currentSession?.user) {
          setLoading(false);
        } else {
          // user exists => role will be fetched in the role effect
          setLoading(true);
        }
      })
      .catch((error) => {
        console.error('Auth başlatma hatası:', error);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Resolve role whenever user changes (outside onAuthStateChange to avoid deadlocks)
  useEffect(() => {
    let cancelled = false;

    if (!user?.id) return;

    setLoading(true);
    fetchUserRole(user.id)
      .then((role) => {
        if (!cancelled) setUserRole(role);
      })
      .catch((error) => {
        console.error('Rol alınamadı:', error);
        if (!cancelled) setUserRole((prev) => prev || 'user');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user?.id, fetchUserRole]);

  const signOut = async () => {
    const timeoutMs = 6000;

    try {
      await Promise.race([
        supabase.auth.signOut(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('signOut timeout')), timeoutMs)
        ),
      ]);
    } catch (error) {
      console.error('Çıkış hatası:', error);

      // Fallback: localStorage'daki Supabase auth tokenlarını temizle
      try {
        const keys = Object.keys(localStorage).filter(
          (k) => k.startsWith('sb-') && k.endsWith('-auth-token')
        );
        keys.forEach((k) => localStorage.removeItem(k));
      } catch {
        // ignore
      }
    } finally {
      // Her durumda state'i temizle
      setUser(null);
      setSession(null);
      setUserRole(null);
      setLoading(false);
    }
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
