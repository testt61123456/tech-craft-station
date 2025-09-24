-- Rol türleri için enum oluştur
CREATE TYPE public.app_role AS ENUM ('superadmin', 'admin', 'user', 'dealer');

-- Kullanıcı profilleri tablosu
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Kullanıcı rolleri tablosu
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  assigned_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Ürünler tablosu
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  category TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS'yi etkinleştir
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Güvenlik fonksiyonu - recursive RLS'den kaçınmak için
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS app_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.user_roles 
  WHERE user_id = user_uuid 
  ORDER BY 
    CASE role 
      WHEN 'superadmin' THEN 1
      WHEN 'admin' THEN 2
      WHEN 'dealer' THEN 3
      WHEN 'user' THEN 4
    END
  LIMIT 1;
$$;

-- Profiller için RLS politikaları
CREATE POLICY "Kullanıcılar kendi profillerini görebilir" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar kendi profillerini güncelleyebilir" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar profil oluşturabilir" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Yöneticiler tüm profilleri görebilir"
ON public.profiles FOR SELECT
USING (public.get_user_role(auth.uid()) IN ('superadmin', 'admin'));

-- Roller için RLS politikaları
CREATE POLICY "Kullanıcılar kendi rollerini görebilir" 
ON public.user_roles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Sadece superadmin rol atayabilir" 
ON public.user_roles FOR INSERT 
WITH CHECK (public.get_user_role(auth.uid()) = 'superadmin');

CREATE POLICY "Sadece superadmin rolleri güncelleyebilir" 
ON public.user_roles FOR UPDATE 
USING (public.get_user_role(auth.uid()) = 'superadmin');

CREATE POLICY "Yöneticiler tüm rolleri görebilir"
ON public.user_roles FOR SELECT
USING (public.get_user_role(auth.uid()) IN ('superadmin', 'admin'));

-- Ürünler için RLS politikaları
CREATE POLICY "Herkes ürünleri görebilir" 
ON public.products FOR SELECT 
USING (is_active = true);

CREATE POLICY "Yöneticiler ürünleri yönetebilir" 
ON public.products FOR ALL 
USING (public.get_user_role(auth.uid()) IN ('superadmin', 'admin'));

-- Profil oluşturma fonksiyonu
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Profil oluştur
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  
  -- Varsayılan kullanıcı rolü ata
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Trigger oluştur
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Güncelleme fonksiyonu
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Güncelleme triggerları
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- İlk superadmin'i manuel olarak oluşturmak için hazır veri
INSERT INTO public.products (name, description, price, category, image_url) VALUES
('Teknoloji Çözümü A', 'Gelişmiş teknoloji çözümü', 1500.00, 'Teknoloji', '/placeholder.svg'),
('Danışmanlık Hizmeti B', 'Uzman danışmanlık hizmeti', 2500.00, 'Danışmanlık', '/placeholder.svg'),
('Eğitim Paketi C', 'Kapsamlı eğitim programı', 750.00, 'Eğitim', '/placeholder.svg');