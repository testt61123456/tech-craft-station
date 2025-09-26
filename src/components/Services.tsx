import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, Printer, Shield, Cog, Server } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Monitor,
      title: "Bilgisayar Hizmetleri",
      description: "Bilgisayar, all-in-one PC, notebook ve gaming bilgisayar onarımı, bakımı ve satışı",
      features: ["Donanım Onarımı", "Yazılım Kurulumu", "Performans Optimizasyonu", "Gaming Setup"]
    },
    {
      icon: Printer,
      title: "Yazıcı Servisi",
      description: "Tüm marka yazıcıların satışı, onarımı ve bakım hizmetleri",
      features: ["Toner Değişimi", "Mekanik Onarım", "Ağ Kurulumu", "Bakım Anlaşması"]
    },
    {
      icon: Shield,
      title: "Güvenlik Sistemleri",
      description: "Kapsamlı güvenlik sistemleri kurulum, satış ve bakım hizmetleri",
      features: ["Kamera Sistemleri", "Alarm Sistemleri", "Erişim Kontrolü", "7/24 İzleme"]
    },
    {
      icon: Cog,
      title: "Otomasyon Sistemleri",
      description: "Akıllı ev ve ofis otomasyon sistemleri kurulum ve bakımı",
      features: ["Akıllı Aydınlatma", "Klima Kontrolü", "Ses Sistemleri", "Uzaktan Erişim"]
    },
    {
      icon: Server,
      title: "Sunucu Hizmetleri",
      description: "Veri yazarı kasa kurulum, yapılandırma ve onarım hizmetleri",
      features: ["Sunucu Kurulumu", "Veri Yedekleme", "Ağ Yapılandırması", "Sistem Bakımı"]
    }
  ];

  return (
    <section id="services" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Hizmetlerimiz
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Teknoloji alanında ihtiyacınız olan tüm çözümler için uzman ekibimiz hizmetinizde
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="bg-gradient-card hover:shadow-tech transition-bounce border-0 group h-full"
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
  );
};

export default Services;