import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, Cpu, HardDrive, Wrench, Zap, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ComputerServices = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: Wrench,
      title: "Donanım Onarımı",
      description: "Ekran kartı, anakart, işlemci ve tüm donanım arızalarının profesyonel onarımı"
    },
    {
      icon: HardDrive,
      title: "Yazılım Kurulumu",
      description: "İşletim sistemi, ofis programları ve özel yazılım kurulumları"
    },
    {
      icon: TrendingUp,
      title: "Performans Optimizasyonu",
      description: "Bilgisayarınızın hızını ve performansını artırma hizmetleri"
    },
    {
      icon: Cpu,
      title: "Gaming Setup",
      description: "Oyun bilgisayarı kurulumu ve optimizasyonu, overclock işlemleri"
    },
    {
      icon: Monitor,
      title: "All-in-One PC",
      description: "All-in-one bilgisayar satışı, kurulumu ve teknik desteği"
    },
    {
      icon: Zap,
      title: "Hızlı Destek",
      description: "Acil durumlarda hızlı yerinde veya uzaktan teknik destek hizmeti"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center bg-gradient-tech">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative container mx-auto px-4 py-20 text-center">
          <Monitor className="w-20 h-20 text-primary mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Bilgisayar Hizmetleri
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-8">
            Masaüstü, dizüstü ve gaming bilgisayarlarınız için profesyonel onarım, bakım ve satış hizmetleri
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate("/contact")}
            className="bg-gradient-hero hover:shadow-tech text-lg px-8 py-6"
          >
            Randevu Alın
          </Button>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Neler Yapıyoruz?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Bilgisayarınızla ilgili her türlü sorunun çözümü için buradayız
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

      {/* Why Choose Us */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Neden Bizi Tercih Etmelisiniz?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-2">15+</div>
              <p className="text-white">Yıl Tecrübe</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-2">24/7</div>
              <p className="text-white">Teknik Destek</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-2">%100</div>
              <p className="text-white">Müşteri Memnuniyeti</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg" 
              onClick={() => navigate("/contact")}
              className="bg-gradient-hero hover:shadow-tech"
            >
              İletişime Geçin
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ComputerServices;
