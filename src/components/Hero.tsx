import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Monitor, Printer, Shield, Cog, Server } from "lucide-react";
import heroImage from "@/assets/hero-tech.jpg";

const Hero = () => {
  const services = [
    {
      icon: Monitor,
      title: "Bilgisayar Hizmetleri",
      description: "Bilgisayar, all-in-one PC, notebook ve gaming bilgisayar onarımı"
    },
    {
      icon: Printer,
      title: "Yazıcı Servisi",
      description: "Tüm marka yazıcıların satışı, onarımı ve bakım hizmetleri"
    },
    {
      icon: Shield,
      title: "Güvenlik Sistemleri",
      description: "Kapsamlı güvenlik sistemleri kurulum ve bakım hizmetleri"
    },
    {
      icon: Cog,
      title: "Otomasyon Sistemleri",
      description: "Akıllı ev ve ofis otomasyon sistemleri kurulum"
    },
    {
      icon: Server,
      title: "Sunucu Hizmetleri",
      description: "Veri yazarı kasa kurulum, yapılandırma ve onarım"
    }
  ];

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

          {/* Right Column - Services Carousel */}
          <div className="lg:pl-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Hizmetlerimiz</h3>
              <p className="text-gray-300 text-sm">Sunduğumuz teknoloji çözümleri</p>
            </div>
            
            <Carousel className="w-full max-w-xl mx-auto">
              <CarouselContent>
                {services.map((service, index) => (
                  <CarouselItem key={index}>
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white h-56">
                      <CardHeader className="text-center pb-4 px-6">
                        <div className="w-16 h-16 bg-gradient-hero rounded-lg flex items-center justify-center mx-auto mb-4">
                          <service.icon className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-xl text-white mb-2">
                          {service.title}
                        </CardTitle>
                        <CardDescription className="text-gray-300 text-sm leading-relaxed">
                          {service.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="bg-white/20 border-white/30 text-white hover:bg-white/30" />
              <CarouselNext className="bg-white/20 border-white/30 text-white hover:bg-white/30" />
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;