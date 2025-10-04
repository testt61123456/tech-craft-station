-- Müşteri işlem logları için tablo
CREATE TABLE IF NOT EXISTS public.customer_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL, -- 'created', 'updated', 'deleted'
  details JSONB, -- İşlem detayları
  performed_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- RLS politikaları
ALTER TABLE public.customer_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Yöneticiler logları görebilir"
ON public.customer_logs
FOR SELECT
USING (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

CREATE POLICY "Yöneticiler log ekleyebilir"
ON public.customer_logs
FOR INSERT
WITH CHECK (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

-- Device status enum'unu genişlet
ALTER TYPE device_type ADD VALUE IF NOT EXISTS 'all_in_one';

-- Customer_devices tablosuna status için yeni değerler ekle
-- Önce mevcut status constraint'i düşür
ALTER TABLE public.customer_devices DROP CONSTRAINT IF EXISTS customer_devices_status_check;

-- Yeni status değerleri için check constraint
ALTER TABLE public.customer_devices 
ADD CONSTRAINT customer_devices_status_check 
CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled', 'waiting_parts'));

-- Customers tablosuna delete policy ekle
CREATE POLICY "Yöneticiler müşterileri silebilir"
ON public.customers
FOR DELETE
USING (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

-- Index'ler ekle (performans için)
CREATE INDEX IF NOT EXISTS idx_customer_logs_customer_id ON public.customer_logs(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_logs_created_at ON public.customer_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON public.customers(created_at DESC);