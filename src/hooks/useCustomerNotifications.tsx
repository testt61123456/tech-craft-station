import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export const useCustomerNotifications = () => {
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
      .channel('global-customer-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'customers'
        },
        (payload) => {
          const newCustomer = payload.new as any;
          
          // Eğer kaydı ekleyen kişi mevcut kullanıcı değilse bildirim göster
          if (newCustomer.created_by !== user.id) {
            const title = 'Yeni Müşteri Kaydı';
            const body = `${newCustomer.customer_name} adlı müşteri eklendi`;
            
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
