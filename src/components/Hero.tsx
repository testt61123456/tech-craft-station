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
      
      <div className="relative container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Main Content */}
          <div className="max-w-4xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight">
              Teknoloji
              <span className="text-primary block">Çözümleri</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mb-6 md:mb-8 leading-relaxed">
              Bilgisayar, yazıcı, güvenlik sistemleri ve otomasyon çözümlerinde 
              <strong className="text-primary"> uzman ekibimizle</strong> yanınızdayız.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-8 md:mb-12">
              <Button 
                size="lg" 
                className="bg-gradient-hero hover:shadow-tech text-base md:text-lg px-6 md:px-8 py-5 md:py-6 transition-bounce"
              >
                Hizmetlerimizi Keşfedin
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-gray-300 text-gray-700 hover:bg-gray-700 hover:text-white text-base md:text-lg px-6 md:px-8 py-5 md:py-6"
              >
                Fiyat Listesi
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-white">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1 md:mb-2">15+</div>
                <div className="text-xs md:text-sm">Yıl Tecrübe</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1 md:mb-2">1000+</div>
                <div className="text-xs md:text-sm">Mutlu Müşteri</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1 md:mb-2">24/7</div>
                <div className="text-xs md:text-sm">Destek</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1 md:mb-2">100%</div>
                <div className="text-xs md:text-sm">Garanti</div>
              </div>
            </div>
          </div>

          {/* Right Column - Campaign Products Carousel */}
          <div className="lg:pl-8 mt-8 lg:mt-0">
            <div className="text-center mb-6 md:mb-8">
              <div className="inline-flex items-center gap-2 mb-2 md:mb-3">
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-primary animate-pulse" />
                <h3 className="text-2xl md:text-3xl font-bold text-white">Kampanyalı Ürünler</h3>
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-primary animate-pulse" />
              </div>
              <p className="text-sm md:text-base text-gray-300">Özel fırsatlarımızı kaçırmayın</p>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-96">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
            ) : campaignProducts && campaignProducts.length > 0 ? (
              <Carousel 
                className="w-full max-w-md md:max-w-xl mx-auto"
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
                        className="group relative bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl border-2 border-primary/30 text-white cursor-pointer hover:border-primary transition-all duration-500 h-[400px] flex flex-col hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(var(--primary),0.3)] overflow-hidden"
                        onClick={() => navigate(`/products/${product.id}`)}
                      >
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-5">
                          <div className="absolute inset-0" style={{ 
                            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                            backgroundSize: '40px 40px'
                          }} />
                        </div>

                        <CardContent className="relative p-0 flex-1 flex flex-col h-full">
                          {/* Image Section */}
                          <div className="relative h-44 flex-shrink-0 overflow-hidden bg-gray-800">
                            <img 
                              src={product.image_url || "/placeholder.svg"} 
                              alt={product.name}
                              className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                            
                            {/* Kampanya Badge */}
                            <div className="absolute top-3 right-3 bg-gradient-to-r from-primary via-primary to-primary/90 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-2xl flex items-center gap-1.5 animate-pulse border border-white/20">
                              <Sparkles className="w-3 h-3" />
                              <span className="tracking-wide">KAMPANYA</span>
                            </div>

                            {/* Glow Effect */}
                            <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-primary/20 blur-3xl rounded-full group-hover:bg-primary/30 transition-all duration-500" />
                          </div>

                          {/* Content Section */}
                          <div className="relative flex-1 flex flex-col justify-between p-5 bg-gradient-to-b from-gray-900/50 to-black/80 min-h-0">
                            <CardTitle className="text-xl font-bold text-white line-clamp-3 group-hover:text-primary transition-colors duration-300 leading-tight mb-3">
                              {product.name}
                            </CardTitle>
                            
                            {product.price && (
                              <div className="pt-3 border-t-2 border-primary/40 flex-shrink-0">
                                <div className="flex items-baseline gap-2">
                                  <span className="text-xs text-gray-400 line-through">
                                    ₺{(Number(product.price) * 1.2).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </span>
                                </div>
                                <div className="text-3xl font-extrabold bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent mt-1">
                                  ₺{Number(product.price).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                                <p className="text-xs text-primary/80 mt-1.5 font-medium">⚡ Özel Kampanya Fiyatı</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="bg-gray-900/90 backdrop-blur-sm border-2 border-primary/50 text-primary hover:bg-primary hover:text-white hover:scale-110 transition-all shadow-lg" />
                <CarouselNext className="bg-gray-900/90 backdrop-blur-sm border-2 border-primary/50 text-primary hover:bg-primary hover:text-white hover:scale-110 transition-all shadow-lg" />
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