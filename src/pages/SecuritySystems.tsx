import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Camera, Bell, Lock, Eye, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SecuritySystems = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: Camera,
      title: "Kamera Sistemleri",
      description: "IP ve analog güvenlik kamerası kurulumu, 4K çözünürlük desteği"
    },
    {
      icon: Bell,
      title: "Alarm Sistemleri",
      description: "Kablosuz ve kablolu alarm sistemleri, sensör kurulumu"
    },
    {
      icon: Lock,
      title: "Erişim Kontrolü",
      description: "Parmak izi, yüz tanıma ve kartlı geçiş sistemleri"
    },
    {
      icon: Eye,
      title: "7/24 İzleme",
      description: "Uzaktan izleme, mobil uygulama ve bildirim sistemleri"
    },
    {
      icon: Shield,
      title: "Perimeter Güvenlik",
      description: "Çevre güvenlik sistemleri ve lazer bariyerler"
    },
    {
      icon: Clock,
      title: "Bakım ve Destek",
      description: "Düzenli bakım, sistem güncellemeleri ve teknik destek"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center bg-gradient-tech">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative container mx-auto px-4 py-20 text-center">
          <Shield className="w-20 h-20 text-primary mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Güvenlik Sistemleri
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-8">
            İşyeriniz ve eviniz için kapsamlı güvenlik çözümleri
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate("/contact")}
            className="bg-gradient-hero hover:shadow-tech text-lg px-8 py-6"
          >
            Ücretsiz Keşif
          </Button>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Güvenlik Çözümlerimiz
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Modern teknoloji ile maksimum güvenlik
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

      {/* Features Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Neden Güvenlik Sistemi?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-6 bg-white/5 rounded-lg">
              <div className="text-4xl font-bold text-primary mb-2">7/24</div>
              <p className="text-white">Kesintisiz İzleme</p>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-lg">
              <div className="text-4xl font-bold text-primary mb-2">4K</div>
              <p className="text-white">Yüksek Çözünürlük</p>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-lg">
              <div className="text-4xl font-bold text-primary mb-2">Cloud</div>
              <p className="text-white">Bulut Depolama</p>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-lg">
              <div className="text-4xl font-bold text-primary mb-2">AI</div>
              <p className="text-white">Yapay Zeka Analizi</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg" 
              onClick={() => navigate("/contact")}
              className="bg-gradient-hero hover:shadow-tech"
            >
              Teklif Alın
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SecuritySystems;
