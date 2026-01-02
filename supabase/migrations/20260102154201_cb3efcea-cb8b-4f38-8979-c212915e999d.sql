-- Add unique quote number with auto-increment
CREATE SEQUENCE IF NOT EXISTS quote_number_seq START WITH 1001;

-- Add quote_number column to quotes table
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS quote_number TEXT;

-- Create function to generate quote number
CREATE OR REPLACE FUNCTION public.generate_quote_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.quote_number IS NULL THEN
    NEW.quote_number := 'TKL-' || nextval('quote_number_seq')::TEXT;
  END IF;
  RETURN NEW;
END;
$function$;

-- Create trigger to auto-generate quote number
DROP TRIGGER IF EXISTS set_quote_number ON public.quotes;
CREATE TRIGGER set_quote_number
  BEFORE INSERT ON public.quotes
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_quote_number();