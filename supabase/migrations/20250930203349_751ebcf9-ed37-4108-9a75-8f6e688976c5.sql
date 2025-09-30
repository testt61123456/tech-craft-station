-- Kategoriler tablosunu oluştur
CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- RLS politikalarını etkinleştir
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Herkes aktif kategorileri görebilir
CREATE POLICY "Herkes kategorileri görebilir" 
ON public.categories 
FOR SELECT 
USING (is_active = true);

-- Yöneticiler kategorileri yönetebilir
CREATE POLICY "Yöneticiler kategorileri yönetebilir" 
ON public.categories 
FOR ALL 
USING (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

-- Updated_at trigger'ı ekle
CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Products tablosundaki category alanını foreign key yap
ALTER TABLE public.products 
DROP COLUMN IF EXISTS category;

ALTER TABLE public.products 
ADD COLUMN category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL;