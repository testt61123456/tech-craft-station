import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cog, Lightbulb, Thermometer, Volume2, Smartphone, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import servicesBanner from "@/assets/services-banner.jpg";

const AutomationSystems = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: Lightbulb,
      title: "Akıllı Aydınlatma",
      description: "Ses veya uygulama ile kontrol edilebilen akıllı aydınlatma sistemleri"
    },
    {
      icon: Thermometer,
      title: "Klima Kontrolü",
      description: "Akıllı termostat ve otomatik sıcaklık kontrol sistemleri"
    },
    {
      icon: Volume2,
      title: "Ses Sistemleri",
      description: "Multiroom ses sistemleri ve akıllı hoparlör kurulumu"
    },
    {
      icon: Smartphone,
      title: "Uzaktan Erişim",
      description: "Mobil uygulama ile her yerden evinizi kontrol edin"
    },
    {
      icon: Zap,
      title: "Perde Otomasyonu",
      description: "Motorlu perde ve jaluzi sistemleri, sensörlü kontrol"
    },
    {
      icon: Cog,
      title: "Entegre Sistemler",
      description: "Tüm cihazlarınızı tek bir sistemde birleştirin"
    }
  ];

  return (
    <div className="min-h-screen bg-secondary">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[40vh] md:min-h-[50vh] flex items-center bg-gradient-tech overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${servicesBanner})` }}
        />
        <div className="absolute inset-0 bg-gradient-tech opacity-80" />
        <div className="relative container mx-auto px-4 py-12 md:py-16 lg:py-20 text-center">
          <Cog className="w-16 h-16 md:w-20 md:h-20 text-primary mx-auto mb-4 md:mb-6" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6">
            Otomasyon Sistemleri
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto mb-6 md:mb-8">
            Akıllı ev ve ofis çözümleri ile hayatınızı kolaylaştırın
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate("/contact")}
            className="bg-gradient-hero hover:shadow-tech text-base md:text-lg px-6 md:px-8 py-5 md:py-6"
          >
            Demo Talep Edin
          </Button>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 md:py-16 lg:py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">
              Otomasyon Çözümlerimiz
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Evinizi veya ofisinizi akıllı hale getirin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:shadow-tech transition-all group">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-hero rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-white">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 text-center">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Otomasyon Avantajları
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-white/5 rounded-lg">
              <div className="text-5xl font-bold text-primary mb-2">%40</div>
              <p className="text-white">Enerji Tasarrufu</p>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-lg">
              <div className="text-5xl font-bold text-primary mb-2">24/7</div>
              <p className="text-white">Uzaktan Kontrol</p>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-lg">
              <div className="text-5xl font-bold text-primary mb-2">Smart</div>
              <p className="text-white">Akıllı Yaşam</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg" 
              onClick={() => navigate("/contact")}
              className="bg-gradient-hero hover:shadow-tech"
            >
              Detaylı Bilgi Alın
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AutomationSystems;
