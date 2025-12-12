-- Teklif formları tablosu
CREATE TABLE public.quotes (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    company_name text NOT NULL,
    city text,
    phone text,
    quote_date timestamp with time zone NOT NULL DEFAULT now(),
    dollar_rate numeric NOT NULL DEFAULT 35,
    euro_rate numeric NOT NULL DEFAULT 38,
    items jsonb NOT NULL DEFAULT '[]'::jsonb,
    total_amount numeric NOT NULL DEFAULT 0,
    total_kdv numeric NOT NULL DEFAULT 0,
    grand_total numeric NOT NULL DEFAULT 0,
    profit_amount numeric NOT NULL DEFAULT 0,
    print_currency text NOT NULL DEFAULT 'TRY',
    notes text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- RLS aktif et
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- Yöneticiler teklif ekleyebilir
CREATE POLICY "Yöneticiler teklif ekleyebilir" 
ON public.quotes 
FOR INSERT 
WITH CHECK (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

-- Yöneticiler teklifleri görebilir
CREATE POLICY "Yöneticiler teklifleri görebilir" 
ON public.quotes 
FOR SELECT 
USING (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

-- Yöneticiler teklifleri güncelleyebilir
CREATE POLICY "Yöneticiler teklifleri güncelleyebilir" 
ON public.quotes 
FOR UPDATE 
USING (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

-- Yöneticiler teklifleri silebilir
CREATE POLICY "Yöneticiler teklifleri silebilir" 
ON public.quotes 
FOR DELETE 
USING (get_user_role(auth.uid()) = ANY (ARRAY['superadmin'::app_role, 'admin'::app_role]));

-- updated_at trigger
CREATE TRIGGER update_quotes_updated_at
BEFORE UPDATE ON public.quotes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();