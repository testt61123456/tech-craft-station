-- Güvenlik açıklarını kapatmak için RLS politikalarını güncelle
-- Anonim erişimi kapat ve sadece authenticated kullanıcıları kabul et

-- 1. customers tablosu - Anonim erişimi engelle
DROP POLICY IF EXISTS "Yöneticiler müşterileri görebilir" ON public.customers;
DROP POLICY IF EXISTS "Yöneticiler müşterileri güncelleyebilir" ON public.customers;
DROP POLICY IF EXISTS "Yöneticiler müşterileri silebilir" ON public.customers;

CREATE POLICY "Yöneticiler müşterileri görebilir" ON public.customers
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Yöneticiler müşterileri güncelleyebilir" ON public.customers
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Yöneticiler müşterileri silebilir" ON public.customers
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'superadmin')
    )
  );

-- 2. service_records tablosu - Anonim erişimi engelle
DROP POLICY IF EXISTS "Yöneticiler servis kayıtlarını görebilir" ON public.service_records;
DROP POLICY IF EXISTS "Yöneticiler servis kayıtlarını güncelleyebilir" ON public.service_records;
DROP POLICY IF EXISTS "Yöneticiler servis kayıtlarını silebilir" ON public.service_records;

CREATE POLICY "Yöneticiler servis kayıtlarını görebilir" ON public.service_records
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Yöneticiler servis kayıtlarını güncelleyebilir" ON public.service_records
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Yöneticiler servis kayıtlarını silebilir" ON public.service_records
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'superadmin')
    )
  );

-- 3. quotes tablosu - Anonim erişimi engelle
DROP POLICY IF EXISTS "Yöneticiler teklifleri görebilir" ON public.quotes;
DROP POLICY IF EXISTS "Yöneticiler teklifleri güncelleyebilir" ON public.quotes;
DROP POLICY IF EXISTS "Yöneticiler teklifleri silebilir" ON public.quotes;

CREATE POLICY "Yöneticiler teklifleri görebilir" ON public.quotes
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Yöneticiler teklifleri güncelleyebilir" ON public.quotes
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Yöneticiler teklifleri silebilir" ON public.quotes
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'superadmin')
    )
  );

-- 4. customer_devices tablosu - Anonim erişimi engelle
DROP POLICY IF EXISTS "Yöneticiler cihazları görebilir" ON public.customer_devices;
DROP POLICY IF EXISTS "Yöneticiler cihazları güncelleyebilir" ON public.customer_devices;
DROP POLICY IF EXISTS "Yöneticiler cihazları silebilir" ON public.customer_devices;

CREATE POLICY "Yöneticiler cihazları görebilir" ON public.customer_devices
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Yöneticiler cihazları güncelleyebilir" ON public.customer_devices
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Yöneticiler cihazları silebilir" ON public.customer_devices
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'superadmin')
    )
  );

-- 5. customer_logs tablosu - Anonim erişimi engelle
DROP POLICY IF EXISTS "Yöneticiler logları görebilir" ON public.customer_logs;

CREATE POLICY "Yöneticiler logları görebilir" ON public.customer_logs
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'superadmin')
    )
  );

-- 6. materials tablosu - Anonim erişimi engelle
DROP POLICY IF EXISTS "Yöneticiler malzemeleri görebilir" ON public.materials;
DROP POLICY IF EXISTS "Yöneticiler malzemeleri güncelleyebilir" ON public.materials;
DROP POLICY IF EXISTS "Yöneticiler malzemeleri silebilir" ON public.materials;

CREATE POLICY "Yöneticiler malzemeleri görebilir" ON public.materials
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Yöneticiler malzemeleri güncelleyebilir" ON public.materials
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Yöneticiler malzemeleri silebilir" ON public.materials
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'superadmin')
    )
  );

-- 7. service_materials tablosu - Anonim erişimi engelle
DROP POLICY IF EXISTS "Yöneticiler servis malzemelerini görebilir" ON public.service_materials;
DROP POLICY IF EXISTS "Yöneticiler servis malzemelerini güncelleyebilir" ON public.service_materials;
DROP POLICY IF EXISTS "Yöneticiler servis malzemelerini silebilir" ON public.service_materials;

CREATE POLICY "Yöneticiler servis malzemelerini görebilir" ON public.service_materials
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Yöneticiler servis malzemelerini güncelleyebilir" ON public.service_materials
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Yöneticiler servis malzemelerini silebilir" ON public.service_materials
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'superadmin')
    )
  );

-- 8. profiles tablosu - Kullanıcı kendi profilini görsün, başkalarınınkini göremesin
DROP POLICY IF EXISTS "Kullanıcılar kendi profillerini görebilir" ON public.profiles;
DROP POLICY IF EXISTS "Kullanıcılar kendi profillerini güncelleyebilir" ON public.profiles;
DROP POLICY IF EXISTS "Yöneticiler tüm profilleri görebilir" ON public.profiles;

CREATE POLICY "Kullanıcılar kendi profillerini görebilir" ON public.profiles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Kullanıcılar kendi profillerini güncelleyebilir" ON public.profiles
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Yöneticiler tüm profilleri görebilir" ON public.profiles
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'superadmin')
    )
  );

-- 9. user_roles tablosu - Sadece authenticated kullanıcılar
DROP POLICY IF EXISTS "Kullanıcılar kendi rollerini görebilir" ON public.user_roles;
DROP POLICY IF EXISTS "Yöneticiler tüm rolleri görebilir" ON public.user_roles;
DROP POLICY IF EXISTS "Sadece superadmin rolleri güncelleyebilir" ON public.user_roles;

CREATE POLICY "Kullanıcılar kendi rollerini görebilir" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Yöneticiler tüm rolleri görebilir" ON public.user_roles
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() 
      AND ur.role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Sadece superadmin rolleri güncelleyebilir" ON public.user_roles
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'superadmin'
    )
  );