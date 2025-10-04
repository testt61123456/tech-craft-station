-- Customers tablosuna unique customer number ekle
ALTER TABLE public.customers 
ADD COLUMN customer_number TEXT UNIQUE;

-- Sıra numarası için sequence oluştur
CREATE SEQUENCE IF NOT EXISTS customer_number_seq START WITH 1;

-- Otomatik customer number ataması için function
CREATE OR REPLACE FUNCTION generate_customer_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.customer_number IS NULL THEN
    NEW.customer_number := 'MST-' || LPAD(nextval('customer_number_seq')::TEXT, 5, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger oluştur
DROP TRIGGER IF EXISTS set_customer_number ON public.customers;
CREATE TRIGGER set_customer_number
  BEFORE INSERT ON public.customers
  FOR EACH ROW
  EXECUTE FUNCTION generate_customer_number();

-- Mevcut müşterilere numara ata
DO $$
DECLARE
  customer_record RECORD;
  counter INT := 1;
BEGIN
  FOR customer_record IN 
    SELECT id FROM public.customers WHERE customer_number IS NULL ORDER BY created_at
  LOOP
    UPDATE public.customers 
    SET customer_number = 'MST-' || LPAD(counter::TEXT, 5, '0')
    WHERE id = customer_record.id;
    counter := counter + 1;
  END LOOP;
  
  -- Sequence'i güncel değere ayarla
  PERFORM setval('customer_number_seq', counter);
END $$;