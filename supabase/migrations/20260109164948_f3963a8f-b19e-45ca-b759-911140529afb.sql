-- =====================================================
-- KAPSAMLI GÜVENLİK GÜNCELLEMESİ
-- Tüm RLS politikalarını TO authenticated ile sıkılaştır
-- =====================================================

-- 1. audit_logs tablosu
DROP POLICY IF EXISTS "Superadmin audit logları görebilir" ON public.audit_logs;
DROP POLICY IF EXISTS "Yöneticiler audit log ekleyebilir" ON public.audit_logs;

CREATE POLICY "Superadmin audit logları görebilir" ON public.audit_logs
FOR SELECT TO authenticated
USING (get_user_role(auth.uid()) = 'superadmin'::app_role);

CREATE POLICY "Yöneticiler audit log ekleyebilir" ON public.audit_logs
FOR INSERT TO authenticated
WITH CHECK (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

-- 2. customer_devices tablosu
DROP POLICY IF EXISTS "Yöneticiler cihazları görebilir" ON public.customer_devices;
DROP POLICY IF EXISTS "Yöneticiler cihazları güncelleyebilir" ON public.customer_devices;
DROP POLICY IF EXISTS "Yöneticiler cihazları silebilir" ON public.customer_devices;
DROP POLICY IF EXISTS "Yöneticiler cihaz ekleyebilir" ON public.customer_devices;

CREATE POLICY "Yöneticiler cihazları görebilir" ON public.customer_devices
FOR SELECT TO authenticated
USING (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

CREATE POLICY "Yöneticiler cihaz ekleyebilir" ON public.customer_devices
FOR INSERT TO authenticated
WITH CHECK (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

CREATE POLICY "Yöneticiler cihazları güncelleyebilir" ON public.customer_devices
FOR UPDATE TO authenticated
USING (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

CREATE POLICY "Yöneticiler cihazları silebilir" ON public.customer_devices
FOR DELETE TO authenticated
USING (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

-- 3. customer_logs tablosu
DROP POLICY IF EXISTS "Yöneticiler logları görebilir" ON public.customer_logs;
DROP POLICY IF EXISTS "Yöneticiler log ekleyebilir" ON public.customer_logs;

CREATE POLICY "Yöneticiler logları görebilir" ON public.customer_logs
FOR SELECT TO authenticated
USING (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

CREATE POLICY "Yöneticiler log ekleyebilir" ON public.customer_logs
FOR INSERT TO authenticated
WITH CHECK (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

-- 4. customers tablosu
DROP POLICY IF EXISTS "Yöneticiler müşterileri görebilir" ON public.customers;
DROP POLICY IF EXISTS "Yöneticiler müşteri ekleyebilir" ON public.customers;
DROP POLICY IF EXISTS "Yöneticiler müşterileri güncelleyebilir" ON public.customers;
DROP POLICY IF EXISTS "Yöneticiler müşterileri silebilir" ON public.customers;

CREATE POLICY "Yöneticiler müşterileri görebilir" ON public.customers
FOR SELECT TO authenticated
USING (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

CREATE POLICY "Yöneticiler müşteri ekleyebilir" ON public.customers
FOR INSERT TO authenticated
WITH CHECK (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

CREATE POLICY "Yöneticiler müşterileri güncelleyebilir" ON public.customers
FOR UPDATE TO authenticated
USING (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

CREATE POLICY "Yöneticiler müşterileri silebilir" ON public.customers
FOR DELETE TO authenticated
USING (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

-- 5. materials tablosu
DROP POLICY IF EXISTS "Yöneticiler malzemeleri görebilir" ON public.materials;
DROP POLICY IF EXISTS "Yöneticiler malzeme ekleyebilir" ON public.materials;
DROP POLICY IF EXISTS "Yöneticiler malzemeleri güncelleyebilir" ON public.materials;
DROP POLICY IF EXISTS "Yöneticiler malzemeleri silebilir" ON public.materials;

CREATE POLICY "Yöneticiler malzemeleri görebilir" ON public.materials
FOR SELECT TO authenticated
USING (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

CREATE POLICY "Yöneticiler malzeme ekleyebilir" ON public.materials
FOR INSERT TO authenticated
WITH CHECK (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

CREATE POLICY "Yöneticiler malzemeleri güncelleyebilir" ON public.materials
FOR UPDATE TO authenticated
USING (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

CREATE POLICY "Yöneticiler malzemeleri silebilir" ON public.materials
FOR DELETE TO authenticated
USING (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

-- 6. profiles tablosu
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
USING (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

-- 7. quotes tablosu
DROP POLICY IF EXISTS "Yöneticiler teklifleri görebilir" ON public.quotes;
DROP POLICY IF EXISTS "Yöneticiler teklif ekleyebilir" ON public.quotes;
DROP POLICY IF EXISTS "Yöneticiler teklifleri güncelleyebilir" ON public.quotes;
DROP POLICY IF EXISTS "Yöneticiler teklifleri silebilir" ON public.quotes;

CREATE POLICY "Yöneticiler teklifleri görebilir" ON public.quotes
FOR SELECT TO authenticated
USING (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

CREATE POLICY "Yöneticiler teklif ekleyebilir" ON public.quotes
FOR INSERT TO authenticated
WITH CHECK (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

CREATE POLICY "Yöneticiler teklifleri güncelleyebilir" ON public.quotes
FOR UPDATE TO authenticated
USING (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

CREATE POLICY "Yöneticiler teklifleri silebilir" ON public.quotes
FOR DELETE TO authenticated
USING (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

-- 8. service_materials tablosu
DROP POLICY IF EXISTS "Yöneticiler servis malzemelerini görebilir" ON public.service_materials;
DROP POLICY IF EXISTS "Yöneticiler servis malzemesi ekleyebilir" ON public.service_materials;
DROP POLICY IF EXISTS "Yöneticiler servis malzemelerini güncelleyebilir" ON public.service_materials;
DROP POLICY IF EXISTS "Yöneticiler servis malzemelerini silebilir" ON public.service_materials;

CREATE POLICY "Yöneticiler servis malzemelerini görebilir" ON public.service_materials
FOR SELECT TO authenticated
USING (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

CREATE POLICY "Yöneticiler servis malzemesi ekleyebilir" ON public.service_materials
FOR INSERT TO authenticated
WITH CHECK (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

CREATE POLICY "Yöneticiler servis malzemelerini güncelleyebilir" ON public.service_materials
FOR UPDATE TO authenticated
USING (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

CREATE POLICY "Yöneticiler servis malzemelerini silebilir" ON public.service_materials
FOR DELETE TO authenticated
USING (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

-- 9. service_records tablosu
DROP POLICY IF EXISTS "Yöneticiler servis kayıtlarını görebilir" ON public.service_records;
DROP POLICY IF EXISTS "Yöneticiler servis kaydı ekleyebilir" ON public.service_records;
DROP POLICY IF EXISTS "Yöneticiler servis kayıtlarını güncelleyebilir" ON public.service_records;
DROP POLICY IF EXISTS "Yöneticiler servis kayıtlarını silebilir" ON public.service_records;

CREATE POLICY "Yöneticiler servis kayıtlarını görebilir" ON public.service_records
FOR SELECT TO authenticated
USING (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

CREATE POLICY "Yöneticiler servis kaydı ekleyebilir" ON public.service_records
FOR INSERT TO authenticated
WITH CHECK (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

CREATE POLICY "Yöneticiler servis kayıtlarını güncelleyebilir" ON public.service_records
FOR UPDATE TO authenticated
USING (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

CREATE POLICY "Yöneticiler servis kayıtlarını silebilir" ON public.service_records
FOR DELETE TO authenticated
USING (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

-- 10. site_settings tablosu
DROP POLICY IF EXISTS "Herkes site ayarlarını okuyabilir" ON public.site_settings;
DROP POLICY IF EXISTS "Superadmin site ayarlarını yönetebilir" ON public.site_settings;

CREATE POLICY "Herkes site ayarlarını okuyabilir" ON public.site_settings
FOR SELECT
USING (true);

CREATE POLICY "Superadmin site ayarlarını yönetebilir" ON public.site_settings
FOR ALL TO authenticated
USING (get_user_role(auth.uid()) = 'superadmin'::app_role)
WITH CHECK (get_user_role(auth.uid()) = 'superadmin'::app_role);

-- 11. user_roles tablosu
DROP POLICY IF EXISTS "Kullanıcılar kendi rollerini görebilir" ON public.user_roles;
DROP POLICY IF EXISTS "Yöneticiler tüm rolleri görebilir" ON public.user_roles;
DROP POLICY IF EXISTS "Sadece superadmin rol atayabilir" ON public.user_roles;
DROP POLICY IF EXISTS "Sadece superadmin rolleri güncelleyebilir" ON public.user_roles;

CREATE POLICY "Kullanıcılar kendi rollerini görebilir" ON public.user_roles
FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Yöneticiler tüm rolleri görebilir" ON public.user_roles
FOR SELECT TO authenticated
USING (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

CREATE POLICY "Sadece superadmin rol atayabilir" ON public.user_roles
FOR INSERT TO authenticated
WITH CHECK (get_user_role(auth.uid()) = 'superadmin'::app_role);

CREATE POLICY "Sadece superadmin rolleri güncelleyebilir" ON public.user_roles
FOR UPDATE TO authenticated
USING (get_user_role(auth.uid()) = 'superadmin'::app_role);

-- 12. categories tablosu (public read allowed for active categories)
DROP POLICY IF EXISTS "Aktif kategoriler herkes tarafından görülebilir" ON public.categories;
DROP POLICY IF EXISTS "Yöneticiler kategorileri yönetebilir" ON public.categories;

CREATE POLICY "Aktif kategoriler herkes tarafından görülebilir" ON public.categories
FOR SELECT
USING (is_active = true);

CREATE POLICY "Yöneticiler kategorileri yönetebilir" ON public.categories
FOR ALL TO authenticated
USING (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]))
WITH CHECK (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

-- 13. products tablosu (public read allowed for active products)
DROP POLICY IF EXISTS "Aktif ürünler herkes tarafından görülebilir" ON public.products;
DROP POLICY IF EXISTS "Yöneticiler ürünleri yönetebilir" ON public.products;

CREATE POLICY "Aktif ürünler herkes tarafından görülebilir" ON public.products
FOR SELECT
USING (is_active = true);

CREATE POLICY "Yöneticiler ürünleri yönetebilir" ON public.products
FOR ALL TO authenticated
USING (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]))
WITH CHECK (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));