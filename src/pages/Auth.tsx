import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { ArrowLeft, Lock, Mail, User } from "lucide-react";

const authSchema = z.object({
  email: z.string().email({ message: "Geçerli bir e-posta adresi girin" }),
  password: z.string().min(6, { message: "Şifre en az 6 karakter olmalıdır" }),
  fullName: z.string().min(2, { message: "Ad soyad en az 2 karakter olmalıdır" }).optional(),
});

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate("/");
        toast.success("Başarıyla giriş yaptınız!");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validatedData = authSchema.parse({ email, password, fullName });
      
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: validatedData.fullName,
          },
        },
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          toast.error("Bu e-posta adresi zaten kayıtlı. Giriş yapmayı deneyin.");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success("Kayıt başarılı! E-postanızı kontrol edin.");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Bir hata oluştu");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validatedData = authSchema.parse({ email, password });
      
      const { error } = await supabase.auth.signInWithPassword({
        email: validatedData.email,
        password: validatedData.password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("E-posta veya şifre hatalı");
        } else {
          toast.error(error.message);
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Bir hata oluştu");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full" style={{
          backgroundImage: 'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Back Button */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 z-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-3 text-white hover:bg-white/20 hover:border-primary/50 transition-all group"
      >
        <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
      </Link>

      {/* Auth Form Section */}
      <div className="relative flex items-center justify-center min-h-screen py-12 px-4">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Karadeniz<span className="text-primary">.</span>
            </h1>
            <p className="text-gray-400">Hesabınıza güvenli giriş yapın</p>
          </div>

          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">Hoş Geldiniz</CardTitle>
              <CardDescription className="text-gray-400">
                Hesabınıza giriş yapın veya yeni hesap oluşturun
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signin" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 bg-white/5 p-1 rounded-xl">
                  <TabsTrigger 
                    value="signin" 
                    className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-red-600 data-[state=active]:text-white rounded-lg transition-all"
                  >
                    Giriş Yap
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup" 
                    className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-red-600 data-[state=active]:text-white rounded-lg transition-all"
                  >
                    Kayıt Ol
                  </TabsTrigger>
                </TabsList>
              
                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email" className="text-gray-300">E-posta</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <Input
                          id="signin-email"
                          type="email"
                          placeholder="ornek@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-primary h-12 rounded-xl"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password" className="text-gray-300">Şifre</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <Input
                          id="signin-password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-primary h-12 rounded-xl"
                          required
                        />
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-primary to-red-600 hover:from-red-600 hover:to-primary text-white h-12 rounded-xl text-base font-medium" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="w-full text-gray-400 hover:text-primary hover:bg-white/5"
                      onClick={() => toast.info("Şifre sıfırlama özelliği yakında eklenecek")}
                    >
                      Şifremi Unuttum
                    </Button>
                  </form>
                </TabsContent>
              
                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className="text-gray-300">Ad Soyad</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="Adınız Soyadınız"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-primary h-12 rounded-xl"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-gray-300">E-posta</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="ornek@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-primary h-12 rounded-xl"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-gray-300">Şifre</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-primary h-12 rounded-xl"
                          required
                        />
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-primary to-red-600 hover:from-red-600 hover:to-primary text-white h-12 rounded-xl text-base font-medium" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Kayıt oluşturuluyor..." : "Kayıt Ol"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Footer Text */}
          <p className="text-center text-gray-500 text-sm mt-6">
            Giriş yaparak <span className="text-primary hover:underline cursor-pointer">Kullanım Şartları</span> ve{" "}
            <span className="text-primary hover:underline cursor-pointer">Gizlilik Politikası</span>'nı kabul etmiş olursunuz.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;