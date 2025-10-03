-- Müşteri kayıtları tablosu
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Cihaz tipleri enum
CREATE TYPE device_type AS ENUM (
  'laptop',
  'desktop',
  'printer',
  'all_in_one',
  'server',
  'network_device',
  'other'
);

-- Müşteri cihazları tablosu
CREATE TABLE public.customer_devices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  device_type device_type NOT NULL,
  device_problem TEXT NOT NULL,
  received_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Malzemeler tablosu
CREATE TABLE public.materials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id UUID NOT NULL REFERENCES public.customer_devices(id) ON DELETE CASCADE,
  material_name TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit_price NUMERIC(10,2),
  total_price NUMERIC(10,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS politikaları
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;

-- Sadece admin ve superadmin kullanıcılar müşterileri görebilir
CREATE POLICY "Yöneticiler müşterileri görebilir"
  ON public.customers
  FOR SELECT
  USING (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

-- Sadece admin ve superadmin kullanıcılar müşteri ekleyebilir
CREATE POLICY "Yöneticiler müşteri ekleyebilir"
  ON public.customers
  FOR INSERT
  WITH CHECK (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

-- Sadece admin ve superadmin kullanıcılar müşterileri güncelleyebilir
CREATE POLICY "Yöneticiler müşterileri güncelleyebilir"
  ON public.customers
  FOR UPDATE
  USING (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

-- Cihazlar için RLS politikaları
CREATE POLICY "Yöneticiler cihazları görebilir"
  ON public.customer_devices
  FOR SELECT
  USING (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

CREATE POLICY "Yöneticiler cihaz ekleyebilir"
  ON public.customer_devices
  FOR INSERT
  WITH CHECK (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

CREATE POLICY "Yöneticiler cihazları güncelleyebilir"
  ON public.customer_devices
  FOR UPDATE
  USING (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

CREATE POLICY "Yöneticiler cihazları silebilir"
  ON public.customer_devices
  FOR DELETE
  USING (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

-- Malzemeler için RLS politikaları
CREATE POLICY "Yöneticiler malzemeleri görebilir"
  ON public.materials
  FOR SELECT
  USING (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

CREATE POLICY "Yöneticiler malzeme ekleyebilir"
  ON public.materials
  FOR INSERT
  WITH CHECK (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

CREATE POLICY "Yöneticiler malzemeleri güncelleyebilir"
  ON public.materials
  FOR UPDATE
  USING (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

CREATE POLICY "Yöneticiler malzemeleri silebilir"
  ON public.materials
  FOR DELETE
  USING (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

-- Trigger'lar için updated_at otomatik güncellemesi
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customer_devices_updated_at
  BEFORE UPDATE ON public.customer_devices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Index'ler performans için
CREATE INDEX idx_customers_phone ON public.customers(phone_number);
CREATE INDEX idx_customer_devices_customer_id ON public.customer_devices(customer_id);
CREATE INDEX idx_materials_device_id ON public.materials(device_id);