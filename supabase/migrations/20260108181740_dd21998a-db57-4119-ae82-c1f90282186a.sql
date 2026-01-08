-- Site ayarları tablosu
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- RLS aktif et
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilir (genel site ayarları için)
CREATE POLICY "Herkes site ayarlarını okuyabilir"
ON public.site_settings
FOR SELECT
TO authenticated
USING (true);

-- Sadece superadmin yazabilir
CREATE POLICY "Superadmin site ayarlarını yönetebilir"
ON public.site_settings
FOR ALL
TO authenticated
USING (get_user_role(auth.uid()) = 'superadmin')
WITH CHECK (get_user_role(auth.uid()) = 'superadmin');

-- Varsayılan ayarları ekle
INSERT INTO public.site_settings (key, value) VALUES
  ('site_name', 'Karadeniz Teknik'),
  ('site_email', 'info@karadenizteknik.com'),
  ('site_phone', '+90 555 123 4567'),
  ('site_address', 'Trabzon, Türkiye'),
  ('auto_activate_users', 'true'),
  ('email_notifications', 'false'),
  ('maintenance_mode', 'false');

-- Audit log tablosu (rol değişiklikleri için)
CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  performed_by uuid NOT NULL,
  action text NOT NULL,
  target_user_id uuid,
  details jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- RLS aktif et
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Sadece superadmin görebilir
CREATE POLICY "Superadmin audit logları görebilir"
ON public.audit_logs
FOR SELECT
TO authenticated
USING (get_user_role(auth.uid()) = 'superadmin');

-- Yöneticiler log ekleyebilir
CREATE POLICY "Yöneticiler audit log ekleyebilir"
ON public.audit_logs
FOR INSERT
TO authenticated
WITH CHECK (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

-- Trigger: updated_at otomatik güncelleme
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();