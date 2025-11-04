import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export const useServiceNotifications = () => {
  const { user, userRole } = useAuth();

  useEffect(() => {
    // Sadece admin veya superadmin için çalışır
    if (!user || (userRole !== 'admin' && userRole !== 'superadmin')) {
      return;
    }

    // Bildirim izni iste
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Realtime subscription kur
    const channel = supabase
      .channel('global-service-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'service_records'
        },
        (payload) => {
          const newService = payload.new as any;
          
          // Eğer kaydı ekleyen kişi mevcut kullanıcı değilse bildirim göster
          if (newService.created_by !== user.id) {
            const title = 'Yeni Servis Kaydı';
            const body = `${newService.company_name} için yeni servis kaydı eklendi`;
            
            // Browser notification
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(title, { body, icon: '/favicon.ico' });
            }
            
            // Toast notification - Kullanıcı kapatana kadar açık kalır
            toast.info(title, { 
              description: body,
              duration: Infinity,
              action: {
                label: "Kapat",
                onClick: () => {}
              }
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, userRole]);
};
