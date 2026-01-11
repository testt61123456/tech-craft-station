-- Fix RLS policies on user_roles to ensure they only work for authenticated users
-- Drop existing policies that might allow anonymous access
DROP POLICY IF EXISTS "Kullanıcılar kendi rollerini görebilir" ON public.user_roles;
DROP POLICY IF EXISTS "Yöneticiler tüm rolleri görebilir" ON public.user_roles;
DROP POLICY IF EXISTS "Sadece superadmin rolleri güncelleyebilir" ON public.user_roles;
DROP POLICY IF EXISTS "Sadece superadmin rol atayabilir" ON public.user_roles;

-- Recreate policies with explicit 'TO authenticated' clause to prevent anonymous access
CREATE POLICY "Kullanıcılar kendi rollerini görebilir" 
ON public.user_roles 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Yöneticiler tüm rolleri görebilir" 
ON public.user_roles 
FOR SELECT 
TO authenticated
USING (public.get_user_role(auth.uid()) IN ('superadmin', 'admin'));

CREATE POLICY "Sadece superadmin rolleri güncelleyebilir" 
ON public.user_roles 
FOR UPDATE 
TO authenticated
USING (public.get_user_role(auth.uid()) = 'superadmin')
WITH CHECK (public.get_user_role(auth.uid()) = 'superadmin');

CREATE POLICY "Sadece superadmin rol atayabilir" 
ON public.user_roles 
FOR INSERT 
TO authenticated
WITH CHECK (public.get_user_role(auth.uid()) = 'superadmin');

CREATE POLICY "Sadece superadmin rol silebilir" 
ON public.user_roles 
FOR DELETE 
TO authenticated
USING (public.get_user_role(auth.uid()) = 'superadmin');