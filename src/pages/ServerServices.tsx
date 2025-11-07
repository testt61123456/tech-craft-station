import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Server, Database, Network, HardDrive, Shield, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import servicesBanner from "@/assets/services-banner.jpg";

const ServerServices = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: Server,
      title: "Sunucu Kurulumu",
      description: "Windows Server, Linux sunucu kurulumu ve yapılandırması"
    },
    {
      icon: Database,
      title: "Veri Yedekleme",
      description: "Otomatik yedekleme sistemleri ve felaket kurtarma planları"
    },
    {
      icon: Network,
      title: "Ağ Yapılandırması",
      description: "Router, switch, firewall kurulumu ve ağ altyapısı"
    },
    {
      icon: HardDrive,
      title: "NAS Sistemleri",
      description: "Network Attached Storage kurulumu ve yönetimi"
    },
    {
      icon: Shield,
      title: "Güvenlik Duvarı",
      description: "Firewall kurulumu, güvenlik politikaları ve izleme"
    },
    {
      icon: Settings,
      title: "Sistem Bakımı",
      description: "Düzenli bakım, güncelleme ve performans optimizasyonu"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[40vh] md:min-h-[50vh] flex items-center bg-gradient-tech overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${servicesBanner})` }}
        />
        <div className="absolute inset-0 bg-gradient-tech opacity-80" />
        <div className="relative container mx-auto px-4 py-12 md:py-16 lg:py-20 text-center">
          <Server className="w-16 h-16 md:w-20 md:h-20 text-primary mx-auto mb-4 md:mb-6" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6">
            Sunucu Hizmetleri
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto mb-6 md:mb-8">
            Kurumsal sunucu çözümleri ve veri merkezi hizmetleri
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate("/contact")}
            className="bg-gradient-hero hover:shadow-tech text-base md:text-lg px-6 md:px-8 py-5 md:py-6"
          >
            Danışmanlık Alın
          </Button>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 md:py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">
              Sunucu Hizmetlerimiz
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              İşletmeniz için güvenilir ve ölçeklenebilir sunucu altyapısı
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="bg-card border-white/10 hover:border-primary/50 transition-all group">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-hero rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-white">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400 text-center">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Features */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Kurumsal Destek
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-6 bg-white/5 rounded-lg">
              <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
              <p className="text-white">Uptime Garantisi</p>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-lg">
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <p className="text-white">Teknik Destek</p>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-lg">
              <div className="text-4xl font-bold text-primary mb-2">RAID</div>
              <p className="text-white">Veri Güvenliği</p>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-lg">
              <div className="text-4xl font-bold text-primary mb-2">SLA</div>
              <p className="text-white">Hizmet Garantisi</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg" 
              onClick={() => navigate("/contact")}
              className="bg-gradient-hero hover:shadow-tech"
            >
              Teklif İsteyin
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServerServices;
