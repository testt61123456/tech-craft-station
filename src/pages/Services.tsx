import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, Printer, Shield, Cog, Server } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import servicesBanner from "@/assets/services-banner.jpg";

const ServicesPage = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: Monitor,
      title: "Bilgisayar Hizmetleri",
      description: "Bilgisayar, all-in-one PC, notebook ve gaming bilgisayar onarımı, bakımı ve satışı",
      features: ["Donanım Onarımı", "Yazılım Kurulumu", "Performans Optimizasyonu", "Gaming Setup"],
      link: "/services/computer"
    },
    {
      icon: Printer,
      title: "Yazıcı Servisi",
      description: "Tüm marka yazıcıların satışı, onarımı ve bakım hizmetleri",
      features: ["Toner Değişimi", "Mekanik Onarım", "Ağ Kurulumu", "Bakım Anlaşması"],
      link: "/services/printer"
    },
    {
      icon: Shield,
      title: "Güvenlik Sistemleri",
      description: "Kapsamlı güvenlik sistemleri kurulum, satış ve bakım hizmetleri",
      features: ["Kamera Sistemleri", "Alarm Sistemleri", "Erişim Kontrolü", "7/24 İzleme"],
      link: "/services/security"
    },
    {
      icon: Cog,
      title: "Otomasyon Sistemleri",
      description: "Akıllı ev ve ofis otomasyon sistemleri kurulum ve bakımı",
      features: ["Akıllı Aydınlatma", "Klima Kontrolü", "Ses Sistemleri", "Uzaktan Erişim"],
      link: "/services/automation"
    },
    {
      icon: Server,
      title: "Sunucu Hizmetleri",
      description: "Veri yazarı kasa kurulum, yapılandırma ve onarım hizmetleri",
      features: ["Sunucu Kurulumu", "Veri Yedekleme", "Ağ Yapılandırması", "Sistem Bakımı"],
      link: "/services/server"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Banner Section */}
        <section className="relative min-h-[50vh] md:min-h-[60vh] flex items-center bg-gradient-tech overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
            style={{ backgroundImage: `url(${servicesBanner})` }}
          />
          <div className="absolute inset-0 bg-gradient-tech opacity-80" />
          
          <div className="relative container mx-auto px-4 py-12 md:py-16 lg:py-20">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight">
                Profesyonel
                <span className="text-primary block">Hizmetlerimiz</span>
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mb-6 md:mb-8 leading-relaxed">
                Teknoloji alanında ihtiyacınız olan tüm çözümler için 
                <strong className="text-primary"> uzman ekibimizle</strong> yanınızdayız
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-white">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-1 md:mb-2">5+</div>
                  <div className="text-xs md:text-sm">Hizmet Alanı</div>
                </div>
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
                  <div className="text-xs md:text-sm">Teknik Destek</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid Section */}
        <section className="py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Hizmet Alanlarımız
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Her bir alanda uzmanlaşmış ekibimizle, kaliteli ve güvenilir hizmet sunuyoruz
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Card 
                  key={index} 
                  className="bg-white/10 backdrop-blur-sm border-white/20 hover:shadow-tech transition-bounce group h-full cursor-pointer"
                  onClick={() => navigate(service.link)}
                >
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-gradient-hero rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-bounce">
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-white group-hover:text-primary transition-smooth">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-300">
                          <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;