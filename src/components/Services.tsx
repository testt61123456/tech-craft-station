import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Monitor, Printer, Shield, Cog, Server, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Services = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: Monitor,
      title: "Bilgisayar Hizmetleri",
      description: "Bilgisayar, all-in-one PC, notebook ve gaming bilgisayar onarımı, bakımı ve satışı",
      features: ["Donanım Onarımı", "Yazılım Kurulumu", "Performans Optimizasyonu", "Gaming Setup"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Printer,
      title: "Yazıcı Servisi",
      description: "Tüm marka yazıcıların satışı, onarımı ve bakım hizmetleri",
      features: ["Toner Değişimi", "Mekanik Onarım", "Ağ Kurulumu", "Bakım Anlaşması"],
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Shield,
      title: "Güvenlik Sistemleri",
      description: "Kapsamlı güvenlik sistemleri kurulum, satış ve bakım hizmetleri",
      features: ["Kamera Sistemleri", "Alarm Sistemleri", "Erişim Kontrolü", "7/24 İzleme"],
      color: "from-orange-500 to-amber-500"
    },
    {
      icon: Cog,
      title: "Otomasyon Sistemleri",
      description: "Akıllı ev ve ofis otomasyon sistemleri kurulum ve bakımı",
      features: ["Akıllı Aydınlatma", "Klima Kontrolü", "Ses Sistemleri", "Uzaktan Erişim"],
      color: "from-purple-500 to-violet-500"
    },
    {
      icon: Server,
      title: "Sunucu Hizmetleri",
      description: "Sunucu kurulum, yapılandırma ve onarım hizmetleri",
      features: ["Sunucu Kurulumu", "Veri Yedekleme", "Ağ Yapılandırması", "Sistem Bakımı"],
      color: "from-primary to-red-400"
    }
  ];

  return (
    <section id="services" className="py-20 md:py-28 bg-gradient-to-b from-secondary to-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '48px 48px'
        }} />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
            Profesyonel Hizmetler
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Neler Yapıyoruz?
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Teknoloji alanında ihtiyacınız olan tüm çözümler için uzman ekibimiz hizmetinizde
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="group bg-white/5 backdrop-blur-sm border-white/10 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
            >
              {/* Gradient Top Bar */}
              <div className={`h-1 bg-gradient-to-r ${service.color}`} />
              
              <CardHeader className="pt-8 pb-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <service.icon className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl text-white group-hover:text-primary transition-colors">
                  {service.title}
                </CardTitle>
                <CardDescription className="text-white/60 leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pb-8">
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-white/70">
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${service.color} mr-3 flex-shrink-0`} />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <div className="flex gap-3">
                  <Button 
                    onClick={() => navigate("/contact")}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-full"
                  >
                    Teklif Al
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate("/contact")}
                    className="flex-1 border-white/20 text-white hover:bg-white/10 rounded-full"
                  >
                    Detaylı Bilgi
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button 
            size="lg"
            onClick={() => navigate("/contact")}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full px-8 py-6 group"
          >
            Tüm Hizmetlerimizi Görün
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;
