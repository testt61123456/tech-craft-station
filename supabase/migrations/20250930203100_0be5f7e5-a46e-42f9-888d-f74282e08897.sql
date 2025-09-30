-- Ürünler tablosuna kampanya alanı ekle
ALTER TABLE public.products 
ADD COLUMN is_campaign boolean DEFAULT false;