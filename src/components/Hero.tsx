import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Loader2, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-tech.jpg";
import Autoplay from "embla-carousel-autoplay";

const Hero = () => {
  const navigate = useNavigate();

  const { data: campaignProducts, isLoading } = useQuery({
    queryKey: ['campaign-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name)
        `)
        .eq('is_campaign', true)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-tech overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-tech opacity-80" />
      
      <div className="relative container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Main Content */}
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Teknoloji
              <span className="text-primary block">Çözümleri</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
              Bilgisayar, yazıcı, güvenlik sistemleri ve otomasyon çözümlerinde 
              <strong className="text-primary"> uzman ekibimizle</strong> yanınızdayız.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button 
                size="lg" 
                className="bg-gradient-hero hover:shadow-tech text-lg px-8 py-6 transition-bounce"
              >
                Hizmetlerimizi Keşfedin
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-gray-300 text-gray-700 hover:bg-gray-700 hover:text-white text-lg px-8 py-6"
              >
                Fiyat Listesi
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">15+</div>
                <div className="text-sm">Yıl Tecrübe</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">1000+</div>
                <div className="text-sm">Mutlu Müşteri</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm">Destek</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm">Garanti</div>
              </div>
            </div>
          </div>

          {/* Right Column - Campaign Products Carousel */}
          <div className="lg:pl-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-3">
                <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                <h3 className="text-3xl font-bold text-white">Kampanyalı Ürünler</h3>
                <Sparkles className="w-6 h-6 text-primary animate-pulse" />
              </div>
              <p className="text-gray-300">Özel fırsatlarımızı kaçırmayın</p>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-96">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
            ) : campaignProducts && campaignProducts.length > 0 ? (
              <Carousel 
                className="w-full max-w-xl mx-auto"
                opts={{
                  align: "start",
                  loop: true,
                }}
                plugins={[
                  Autoplay({
                    delay: 3000,
                    stopOnInteraction: true,
                  })
                ]}
              >
                <CarouselContent>
                  {campaignProducts.map((product) => (
                    <CarouselItem key={product.id}>
                      <Card 
                        className="group bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md border-white/30 text-white cursor-pointer hover:from-white/25 hover:to-white/10 transition-all duration-500 h-[450px] flex flex-col hover:scale-[1.02] hover:shadow-2xl"
                        onClick={() => navigate(`/products/${product.id}`)}
                      >
                        <CardContent className="p-0 flex-1 flex flex-col">
                          <div className="relative h-56 overflow-hidden rounded-t-lg">
                            <img 
                              src={product.image_url || "/placeholder.svg"} 
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute top-3 right-3 bg-gradient-to-r from-primary to-primary/80 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-1.5 animate-pulse">
                              <Sparkles className="w-4 h-4" />
                              Kampanya
                            </div>
                            {product.category && (
                              <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-primary px-3 py-1 rounded-full text-xs font-medium">
                                {product.category.name}
                              </div>
                            )}
                          </div>
                          <div className="p-6 flex flex-col flex-1">
                            <CardTitle className="text-xl text-white mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                              {product.name}
                            </CardTitle>
                            <CardDescription className="text-gray-300 text-sm leading-relaxed line-clamp-3 flex-1">
                              {product.description}
                            </CardDescription>
                            {product.price && (
                              <div className="mt-4 pt-4 border-t border-white/20">
                                <div className="text-3xl font-bold text-primary">
                                  ₺{Number(product.price).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                                <p className="text-xs text-gray-400 mt-1">KDV Dahil</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/40 hover:scale-110 transition-all" />
                <CarouselNext className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/40 hover:scale-110 transition-all" />
              </Carousel>
            ) : (
              <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border-white/20 text-white h-72 flex items-center justify-center">
                <CardContent className="text-center">
                  <Sparkles className="w-12 h-12 text-primary/50 mx-auto mb-4" />
                  <p className="text-gray-300">Şu anda kampanyalı ürün bulunmamaktadır.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;