-- Servis durumları için enum
CREATE TYPE service_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');

-- Servis kayıtları tablosu
CREATE TABLE public.service_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  address TEXT NOT NULL,
  description TEXT,
  service_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status service_status NOT NULL DEFAULT 'pending',
  customer_name TEXT NOT NULL,
  signature_data TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Servis malzemeleri tablosu
CREATE TABLE public.service_materials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID NOT NULL REFERENCES public.service_records(id) ON DELETE CASCADE,
  material_name TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit_price NUMERIC,
  total_price NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS politikaları
ALTER TABLE public.service_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_materials ENABLE ROW LEVEL SECURITY;

-- Servis kayıtları için politikalar
CREATE POLICY "Yöneticiler servis kayıtlarını görebilir"
ON public.service_records
FOR SELECT
USING (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

CREATE POLICY "Yöneticiler servis kaydı ekleyebilir"
ON public.service_records
FOR INSERT
WITH CHECK (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

CREATE POLICY "Yöneticiler servis kayıtlarını güncelleyebilir"
ON public.service_records
FOR UPDATE
USING (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

CREATE POLICY "Yöneticiler servis kayıtlarını silebilir"
ON public.service_records
FOR DELETE
USING (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

-- Servis malzemeleri için politikalar
CREATE POLICY "Yöneticiler servis malzemelerini görebilir"
ON public.service_materials
FOR SELECT
USING (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

CREATE POLICY "Yöneticiler servis malzemesi ekleyebilir"
ON public.service_materials
FOR INSERT
WITH CHECK (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

CREATE POLICY "Yöneticiler servis malzemelerini güncelleyebilir"
ON public.service_materials
FOR UPDATE
USING (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

CREATE POLICY "Yöneticiler servis malzemelerini silebilir"
ON public.service_materials
FOR DELETE
USING (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

-- Updated_at için trigger
CREATE TRIGGER update_service_records_updated_at
BEFORE UPDATE ON public.service_records
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();