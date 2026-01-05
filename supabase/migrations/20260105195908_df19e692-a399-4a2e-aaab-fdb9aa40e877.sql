-- Update the search_path on the update_updated_at_column function for security
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Drop all existing SELECT/UPDATE/DELETE policies and recreate with TO authenticated
-- This ensures no anonymous access is possible

-- ============= CUSTOMERS TABLE =============
DROP POLICY IF EXISTS "Yöneticiler müşterileri görebilir" ON public.customers;
DROP POLICY IF EXISTS "Yöneticiler müşterileri güncelleyebilir" ON public.customers;
DROP POLICY IF EXISTS "Yöneticiler müşterileri silebilir" ON public.customers;
DROP POLICY IF EXISTS "Yöneticiler müşteri ekleyebilir" ON public.customers;

CREATE POLICY "Yöneticiler müşterileri görebilir" ON public.customers
FOR SELECT TO authenticated
USING (get_user_role(auth.uid()) IN ('superadmin', 'admin'));

CREATE POLICY "Yöneticiler müşterileri güncelleyebilir" ON public.customers
FOR UPDATE TO authenticated
USING (get_user_role(auth.uid()) IN ('superadmin', 'admin'));

CREATE POLICY "Yöneticiler müşterileri silebilir" ON public.customers
FOR DELETE TO authenticated
USING (get_user_role(auth.uid()) IN ('superadmin', 'admin'));

CREATE POLICY "Yöneticiler müşteri ekleyebilir" ON public.customers
FOR INSERT TO authenticated
WITH CHECK (get_user_role(auth.uid()) IN ('superadmin', 'admin'));

-- ============= CUSTOMER_DEVICES TABLE =============
DROP POLICY IF EXISTS "Yöneticiler cihazları görebilir" ON public.customer_devices;
DROP POLICY IF EXISTS "Yöneticiler cihazları güncelleyebilir" ON public.customer_devices;
DROP POLICY IF EXISTS "Yöneticiler cihazları silebilir" ON public.customer_devices;
DROP POLICY IF EXISTS "Yöneticiler cihaz ekleyebilir" ON public.customer_devices;

CREATE POLICY "Yöneticiler cihazları görebilir" ON public.customer_devices
FOR SELECT TO authenticated
USING (get_user_role(auth.uid()) IN ('superadmin', 'admin'));

CREATE POLICY "Yöneticiler cihazları güncelleyebilir" ON public.customer_devices
FOR UPDATE TO authenticated
USING (get_user_role(auth.uid()) IN ('superadmin', 'admin'));

CREATE POLICY "Yöneticiler cihazları silebilir" ON public.customer_devices
FOR DELETE TO authenticated
USING (get_user_role(auth.uid()) IN ('superadmin', 'admin'));

CREATE POLICY "Yöneticiler cihaz ekleyebilir" ON public.customer_devices
FOR INSERT TO authenticated
WITH CHECK (get_user_role(auth.uid()) IN ('superadmin', 'admin'));

-- ============= CUSTOMER_LOGS TABLE =============
DROP POLICY IF EXISTS "Yöneticiler logları görebilir" ON public.customer_logs;
DROP POLICY IF EXISTS "Yöneticiler log ekleyebilir" ON public.customer_logs;

CREATE POLICY "Yöneticiler logları görebilir" ON public.customer_logs
FOR SELECT TO authenticated
USING (get_user_role(auth.uid()) IN ('superadmin', 'admin'));

CREATE POLICY "Yöneticiler log ekleyebilir" ON public.customer_logs
FOR INSERT TO authenticated
WITH CHECK (get_user_role(auth.uid()) IN ('superadmin', 'admin'));

-- ============= MATERIALS TABLE =============
DROP POLICY IF EXISTS "Yöneticiler malzemeleri görebilir" ON public.materials;
DROP POLICY IF EXISTS "Yöneticiler malzemeleri güncelleyebilir" ON public.materials;
DROP POLICY IF EXISTS "Yöneticiler malzemeleri silebilir" ON public.materials;
DROP POLICY IF EXISTS "Yöneticiler malzeme ekleyebilir" ON public.materials;

CREATE POLICY "Yöneticiler malzemeleri görebilir" ON public.materials
FOR SELECT TO authenticated
USING (get_user_role(auth.uid()) IN ('superadmin', 'admin'));

CREATE POLICY "Yöneticiler malzemeleri güncelleyebilir" ON public.materials
FOR UPDATE TO authenticated
USING (get_user_role(auth.uid()) IN ('superadmin', 'admin'));

CREATE POLICY "Yöneticiler malzemeleri silebilir" ON public.materials
FOR DELETE TO authenticated
USING (get_user_role(auth.uid()) IN ('superadmin', 'admin'));

CREATE POLICY "Yöneticiler malzeme ekleyebilir" ON public.materials
FOR INSERT TO authenticated
WITH CHECK (get_user_role(auth.uid()) IN ('superadmin', 'admin'));

-- ============= SERVICE_RECORDS TABLE =============
DROP POLICY IF EXISTS "Yöneticiler servis kayıtlarını görebilir" ON public.service_records;
DROP POLICY IF EXISTS "Yöneticiler servis kayıtlarını güncelleyebilir" ON public.service_records;
DROP POLICY IF EXISTS "Yöneticiler servis kayıtlarını silebilir" ON public.service_records;
DROP POLICY IF EXISTS "Yöneticiler servis kaydı ekleyebilir" ON public.service_records;

CREATE POLICY "Yöneticiler servis kayıtlarını görebilir" ON public.service_records
FOR SELECT TO authenticated
USING (get_user_role(auth.uid()) IN ('superadmin', 'admin'));

CREATE POLICY "Yöneticiler servis kayıtlarını güncelleyebilir" ON public.service_records
FOR UPDATE TO authenticated
USING (get_user_role(auth.uid()) IN ('superadmin', 'admin'));

CREATE POLICY "Yöneticiler servis kayıtlarını silebilir" ON public.service_records
FOR DELETE TO authenticated
USING (get_user_role(auth.uid()) IN ('superadmin', 'admin'));

CREATE POLICY "Yöneticiler servis kaydı ekleyebilir" ON public.service_records
FOR INSERT TO authenticated
WITH CHECK (get_user_role(auth.uid()) IN ('superadmin', 'admin'));

-- ============= SERVICE_MATERIALS TABLE =============
DROP POLICY IF EXISTS "Yöneticiler servis malzemelerini görebilir" ON public.service_materials;
DROP POLICY IF EXISTS "Yöneticiler servis malzemelerini güncelleyebilir" ON public.service_materials;
DROP POLICY IF EXISTS "Yöneticiler servis malzemelerini silebilir" ON public.service_materials;
DROP POLICY IF EXISTS "Yöneticiler servis malzemesi ekleyebilir" ON public.service_materials;

CREATE POLICY "Yöneticiler servis malzemelerini görebilir" ON public.service_materials
FOR SELECT TO authenticated
USING (get_user_role(auth.uid()) IN ('superadmin', 'admin'));

CREATE POLICY "Yöneticiler servis malzemelerini güncelleyebilir" ON public.service_materials
FOR UPDATE TO authenticated
USING (get_user_role(auth.uid()) IN ('superadmin', 'admin'));

CREATE POLICY "Yöneticiler servis malzemelerini silebilir" ON public.service_materials
FOR DELETE TO authenticated
USING (get_user_role(auth.uid()) IN ('superadmin', 'admin'));

CREATE POLICY "Yöneticiler servis malzemesi ekleyebilir" ON public.service_materials
FOR INSERT TO authenticated
WITH CHECK (get_user_role(auth.uid()) IN ('superadmin', 'admin'));

-- ============= QUOTES TABLE =============
DROP POLICY IF EXISTS "Yöneticiler teklifleri görebilir" ON public.quotes;
DROP POLICY IF EXISTS "Yöneticiler teklifleri güncelleyebilir" ON public.quotes;
DROP POLICY IF EXISTS "Yöneticiler teklifleri silebilir" ON public.quotes;
DROP POLICY IF EXISTS "Yöneticiler teklif ekleyebilir" ON public.quotes;

CREATE POLICY "Yöneticiler teklifleri görebilir" ON public.quotes
FOR SELECT TO authenticated
USING (get_user_role(auth.uid()) IN ('superadmin', 'admin'));

CREATE POLICY "Yöneticiler teklifleri güncelleyebilir" ON public.quotes
FOR UPDATE TO authenticated
USING (get_user_role(auth.uid()) IN ('superadmin', 'admin'));

CREATE POLICY "Yöneticiler teklifleri silebilir" ON public.quotes
FOR DELETE TO authenticated
USING (get_user_role(auth.uid()) IN ('superadmin', 'admin'));

CREATE POLICY "Yöneticiler teklif ekleyebilir" ON public.quotes
FOR INSERT TO authenticated
WITH CHECK (get_user_role(auth.uid()) IN ('superadmin', 'admin'));

-- ============= PROFILES TABLE =============
DROP POLICY IF EXISTS "Kullanıcılar kendi profillerini görebilir" ON public.profiles;
DROP POLICY IF EXISTS "Kullanıcılar kendi profillerini güncelleyebilir" ON public.profiles;
DROP POLICY IF EXISTS "Kullanıcılar profil oluşturabilir" ON public.profiles;
DROP POLICY IF EXISTS "Yöneticiler tüm profilleri görebilir" ON public.profiles;

CREATE POLICY "Kullanıcılar kendi profillerini görebilir" ON public.profiles
FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Kullanıcılar kendi profillerini güncelleyebilir" ON public.profiles
FOR UPDATE TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Kullanıcılar profil oluşturabilir" ON public.profiles
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Yöneticiler tüm profilleri görebilir" ON public.profiles
FOR SELECT TO authenticated
USING (get_user_role(auth.uid()) IN ('superadmin', 'admin'));

-- ============= USER_ROLES TABLE =============
DROP POLICY IF EXISTS "Kullanıcılar kendi rollerini görebilir" ON public.user_roles;
DROP POLICY IF EXISTS "Sadece superadmin rol atayabilir" ON public.user_roles;
DROP POLICY IF EXISTS "Sadece superadmin rolleri güncelleyebilir" ON public.user_roles;
DROP POLICY IF EXISTS "Yöneticiler tüm rolleri görebilir" ON public.user_roles;

CREATE POLICY "Kullanıcılar kendi rollerini görebilir" ON public.user_roles
FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Sadece superadmin rol atayabilir" ON public.user_roles
FOR INSERT TO authenticated
WITH CHECK (get_user_role(auth.uid()) = 'superadmin');

CREATE POLICY "Sadece superadmin rolleri güncelleyebilir" ON public.user_roles
FOR UPDATE TO authenticated
USING (get_user_role(auth.uid()) = 'superadmin');

CREATE POLICY "Yöneticiler tüm rolleri görebilir" ON public.user_roles
FOR SELECT TO authenticated
USING (get_user_role(auth.uid()) IN ('superadmin', 'admin'));

-- ============= CATEGORIES TABLE =============
DROP POLICY IF EXISTS "Herkes kategorileri görebilir" ON public.categories;
DROP POLICY IF EXISTS "Yöneticiler kategorileri yönetebilir" ON public.categories;

-- Kategoriler herkese açık olabilir (aktif olanlar)
CREATE POLICY "Aktif kategoriler herkes tarafından görülebilir" ON public.categories
FOR SELECT
USING (is_active = true);

CREATE POLICY "Yöneticiler kategorileri yönetebilir" ON public.categories
FOR ALL TO authenticated
USING (get_user_role(auth.uid()) IN ('superadmin', 'admin'))
WITH CHECK (get_user_role(auth.uid()) IN ('superadmin', 'admin'));

-- ============= PRODUCTS TABLE =============
DROP POLICY IF EXISTS "Herkes ürünleri görebilir" ON public.products;
DROP POLICY IF EXISTS "Yöneticiler ürünleri yönetebilir" ON public.products;

-- Ürünler herkese açık olabilir (aktif olanlar)
CREATE POLICY "Aktif ürünler herkes tarafından görülebilir" ON public.products
FOR SELECT
USING (is_active = true);

CREATE POLICY "Yöneticiler ürünleri yönetebilir" ON public.products
FOR ALL TO authenticated
USING (get_user_role(auth.uid()) IN ('superadmin', 'admin'))
WITH CHECK (get_user_role(auth.uid()) IN ('superadmin', 'admin'));