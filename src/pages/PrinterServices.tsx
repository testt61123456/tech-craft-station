import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Printer, Droplets, Network, FileText, Settings, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import servicesBanner from "@/assets/services-banner.jpg";

const PrinterServices = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: Droplets,
      title: "Toner Değişimi",
      description: "Orijinal ve muadil toner, kartuş satışı ve değişimi"
    },
    {
      icon: Wrench,
      title: "Mekanik Onarım",
      description: "Tüm marka yazıcıların mekanik arıza ve bakım onarımları"
    },
    {
      icon: Network,
      title: "Ağ Kurulumu",
      description: "Ağ yazıcısı kurulumu ve paylaşımlı kullanım ayarları"
    },
    {
      icon: FileText,
      title: "Bakım Anlaşması",
      description: "Kurumsal bakım anlaşmaları ve düzenli kontrol hizmetleri"
    },
    {
      icon: Settings,
      title: "Sürücü Kurulumu",
      description: "Yazıcı sürücüleri ve yazılım kurulum hizmetleri"
    },
    {
      icon: Printer,
      title: "Yazıcı Satışı",
      description: "Lazer, inkjet ve çok fonksiyonlu yazıcı satışı"
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
          <Printer className="w-16 h-16 md:w-20 md:h-20 text-primary mx-auto mb-4 md:mb-6" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6">
            Yazıcı Servisi
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto mb-6 md:mb-8">
            Tüm marka yazıcıların satışı, onarımı ve bakım hizmetleri
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate("/contact")}
            className="bg-gradient-hero hover:shadow-tech text-base md:text-lg px-6 md:px-8 py-5 md:py-6"
          >
            Randevu Alın
          </Button>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 md:py-16 lg:py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">
              Yazıcı Hizmetlerimiz
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              HP, Canon, Epson, Brother ve tüm markalarda uzman servis
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

      {/* Brands Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Servis Verdiğimiz Markalar
            </h2>
            <p className="text-gray-300 mb-8">
              Tüm markalarda profesyonel onarım ve bakım hizmeti
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {["HP", "Canon", "Epson", "Brother", "Samsung", "Xerox", "Ricoh", "Kyocera"].map((brand) => (
              <div key={brand} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center">
                <p className="text-white font-semibold text-lg">{brand}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg" 
              onClick={() => navigate("/contact")}
              className="bg-gradient-hero hover:shadow-tech"
            >
              Hemen İletişime Geçin
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrinterServices;
