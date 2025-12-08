import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Monitor, Printer, Shield, Cog, Server, ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ServicesPage = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: Monitor,
      title: "Bilgisayar Hizmetleri",
      description: "Bilgisayar, all-in-one PC, notebook ve gaming bilgisayar onarımı, bakımı ve satışı",
      features: ["Donanım Onarımı", "Yazılım Kurulumu", "Performans Optimizasyonu", "Gaming Setup"],
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Printer,
      title: "Yazıcı Servisi",
      description: "Tüm marka yazıcıların satışı, onarımı ve bakım hizmetleri",
      features: ["Toner Değişimi", "Mekanik Onarım", "Ağ Kurulumu", "Bakım Anlaşması"],
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Shield,
      title: "Güvenlik Sistemleri",
      description: "Kapsamlı güvenlik sistemleri kurulum, satış ve bakım hizmetleri",
      features: ["Kamera Sistemleri", "Alarm Sistemleri", "Erişim Kontrolü", "7/24 İzleme"],
      gradient: "from-red-500 to-orange-500"
    },
    {
      icon: Cog,
      title: "Otomasyon Sistemleri",
      description: "Akıllı ev ve ofis otomasyon sistemleri kurulum ve bakımı",
      features: ["Akıllı Aydınlatma", "Klima Kontrolü", "Ses Sistemleri", "Uzaktan Erişim"],
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Server,
      title: "Sunucu Hizmetleri",
      description: "Veri yazarı kasa kurulum, yapılandırma ve onarım hizmetleri",
      features: ["Sunucu Kurulumu", "Veri Yedekleme", "Ağ Yapılandırması", "Sistem Bakımı"],
      gradient: "from-amber-500 to-yellow-500"
    }
  ];

  return (
    <div className="min-h-screen bg-secondary">
      <Header />
      <main>
        {/* Hero Banner Section */}
        <section className="relative min-h-[60vh] flex items-center overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/95 to-secondary" />
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="h-full w-full" style={{
              backgroundImage: 'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }} />
          </div>
          
          <div className="relative container mx-auto px-4 py-16 md:py-24">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-sm text-primary font-medium">Profesyonel Çözümler</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Teknoloji
                <span className="block bg-gradient-to-r from-primary via-red-400 to-primary bg-clip-text text-transparent">
                  Hizmetlerimiz
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                15 yılı aşkın tecrübemizle, teknoloji ihtiyaçlarınız için 
                <span className="text-primary font-semibold"> kapsamlı ve profesyonel</span> çözümler sunuyoruz
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                {[
                  { value: "5+", label: "Hizmet Alanı" },
                  { value: "15+", label: "Yıl Tecrübe" },
                  { value: "1000+", label: "Mutlu Müşteri" },
                  { value: "24/7", label: "Teknik Destek" }
                ].map((stat, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-6">
                    <div className="text-2xl md:text-3xl font-bold text-primary mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid Section */}
        <section className="py-20 bg-secondary relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
          
          <div className="container mx-auto px-4 relative">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Hizmet Alanlarımız
              </h2>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                Her bir alanda uzmanlaşmış ekibimizle, kaliteli ve güvenilir hizmet sunuyoruz
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Card 
                  key={index} 
                  className="group bg-white/5 backdrop-blur-sm border border-white/10 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_-12px_rgba(239,68,68,0.3)] overflow-hidden"
                >
                  <CardHeader className="pb-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-white group-hover:text-primary transition-colors">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-300">
                          <CheckCircle className="w-4 h-4 text-primary mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="flex gap-3">
                      <Button 
                        onClick={() => navigate("/contact")}
                        className="flex-1 bg-gradient-to-r from-primary to-red-600 hover:from-red-600 hover:to-primary text-white rounded-xl group/btn"
                      >
                        Teklif Al
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => navigate("/contact")}
                        className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-primary/50 rounded-xl"
                      >
                        Detaylı Bilgi
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* CTA Section */}
            <div className="mt-20 text-center">
              <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border border-primary/30 rounded-3xl p-8 md:p-12 backdrop-blur-sm">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Hizmetlerimiz Hakkında Bilgi Almak İster Misiniz?
                </h3>
                <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                  Uzman ekibimiz sizinle iletişime geçerek ihtiyaçlarınıza özel çözümler sunmaya hazır
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg"
                    onClick={() => navigate("/contact")}
                    className="bg-gradient-to-r from-primary to-red-600 hover:from-red-600 hover:to-primary text-white rounded-full px-8"
                  >
                    Bize Ulaşın
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    onClick={() => window.open("tel:+904621234567")}
                    className="bg-white/5 border-white/20 text-white hover:bg-white/10 rounded-full px-8"
                  >
                    Hemen Ara: +90 (462) 123 45 67
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;