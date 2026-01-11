-- Fix site_settings RLS policy to restrict public access
-- Drop the policy that allows public (anonymous) access
DROP POLICY IF EXISTS "Herkes site ayarlarını okuyabilir" ON public.site_settings;

-- Create new policy that only allows authenticated users to read
CREATE POLICY "Kimliği doğrulanmış kullanıcılar site ayarlarını okuyabilir" 
ON public.site_settings 
FOR SELECT 
TO authenticated
USING (true);