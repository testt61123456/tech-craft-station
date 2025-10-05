-- Update customer_number format to KRDNZ-1
DROP SEQUENCE IF EXISTS customer_number_seq CASCADE;
CREATE SEQUENCE customer_number_seq START WITH 1;

-- Drop existing trigger
DROP TRIGGER IF EXISTS set_customer_number ON customers;

-- Update the function to use KRDNZ format
CREATE OR REPLACE FUNCTION public.generate_customer_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.customer_number IS NULL THEN
    NEW.customer_number := 'KRDNZ-' || nextval('customer_number_seq')::TEXT;
  END IF;
  RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER set_customer_number
  BEFORE INSERT ON customers
  FOR EACH ROW
  EXECUTE FUNCTION generate_customer_number();

-- Add new columns to customer_devices for different status types
ALTER TABLE customer_devices
ADD COLUMN IF NOT EXISTS delivery_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS return_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS warranty_sent_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS waiting_days integer;

-- Update existing customer numbers to new format
DO $$
DECLARE
  customer_record RECORD;
  new_number INTEGER := 1;
BEGIN
  FOR customer_record IN 
    SELECT id, customer_number 
    FROM customers 
    WHERE customer_number LIKE 'MST-%'
    ORDER BY created_at
  LOOP
    UPDATE customers 
    SET customer_number = 'KRDNZ-' || new_number
    WHERE id = customer_record.id;
    new_number := new_number + 1;
  END LOOP;
  
  -- Update sequence to continue from last number
  PERFORM setval('customer_number_seq', new_number);
END $$;