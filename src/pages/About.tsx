import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Award, Lightbulb, Clock, Shield } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import aboutBanner from "@/assets/about-banner.jpg";

const AboutPage = () => {
  const values = [
    {
      icon: Target,
      title: "Misyonumuz",
      description: "Teknoloji alanında müşterilerimize en kaliteli hizmeti sunarak, dijital dönüşümlerinde güvenilir partner olmak."
    },
    {
      icon: Lightbulb,
      title: "Vizyonumuz",
      description: "Teknoloji sektöründe öncü firma olarak, yenilikçi çözümlerle sektöre değer katmak ve örnek olmak."
    },
    {
      icon: Shield,
      title: "Değerlerimiz",
      description: "Güvenilirlik, kalite, müşteri memnuniyeti ve sürekli gelişim prensiplerimizle hareket ederiz."
    }
  ];

  const team = [
    {
      name: "Ahmet Yılmaz",
      role: "Kurucu & Genel Müdür",
      experience: "20+ yıl teknoloji sektörü deneyimi"
    },
    {
      name: "Mehmet Demir",
      role: "Teknik Müdür",
      experience: "15+ yıl donanım uzmanı"
    },
    {
      name: "Ayşe Kaya",
      role: "İş Geliştirme Müdürü",
      experience: "12+ yıl satış ve pazarlama"
    },
    {
      name: "Fatma Öztürk",
      role: "Müşteri Hizmetleri Müdürü",
      experience: "10+ yıl müşteri deneyimi"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Banner Section */}
        <section className="relative min-h-[60vh] flex items-center bg-gradient-tech overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
            style={{ backgroundImage: `url(${aboutBanner})` }}
          />
          <div className="absolute inset-0 bg-gradient-tech opacity-80" />
          
          <div className="relative container mx-auto px-4 py-20">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Hakkımızda
                <span className="text-primary block">Karadeniz Bilgisayar</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
                2008 yılından bu yana teknoloji alanında 
                <strong className="text-primary"> güvenilir hizmet</strong> anlayışıyla hizmet veriyoruz.
              </p>

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
                  <div className="text-3xl font-bold text-primary mb-2">5000+</div>
                  <div className="text-sm">Tamamlanan Proje</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                  <div className="text-sm">Destek Hizmeti</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Content Section */}
        <section className="py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                  Hikayemiz
                </h2>
                <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                  <p>
                    Karadeniz Bilgisayar, 2008 yılında Trabzon'da küçük bir atölye olarak başladığı yolculuğunda, 
                    bugün bölgenin en güvenilir teknoloji hizmet sağlayıcılarından biri haline gelmiştir.
                  </p>
                  <p>
                    15 yılı aşkın süre boyunca, bilgisayar onarımından güvenlik sistemlerine, 
                    yazıcı servisinden otomasyon çözümlerine kadar geniş bir yelpazede hizmet sunarak, 
                    binlerce müşterimizin teknoloji ihtiyaçlarını karşıladık.
                  </p>
                  <p>
                    Uzman ekibimiz ve kaliteli hizmet anlayışımızla, hem bireysel hem de kurumsal 
                    müşterilerimize teknoloji alanındaki tüm ihtiyaçları için kapsamlı çözümler sunuyoruz.
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                {values.map((value, index) => (
                  <Card key={index} className="bg-white/10 backdrop-blur-sm border border-white/20">
                    <CardHeader className="flex flex-row items-center space-y-0 pb-4">
                      <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center mr-4">
                        <value.icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-xl text-white">
                        {value.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-300 text-base">
                        {value.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Team Section */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ekibimiz
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Alanında uzman ve deneyimli ekibimizle size en iyi hizmeti sunuyoruz
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 text-center">
                  <CardHeader className="pb-4">
                    <div className="w-20 h-20 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-10 h-10 text-white" />
                    </div>
                    <CardTitle className="text-xl text-white">
                      {member.name}
                    </CardTitle>
                    <CardDescription className="text-primary font-medium">
                      {member.role}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-sm">
                      {member.experience}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Why Choose Us Section */}
            <div className="mt-20">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Neden Bizi Tercih Etmelisiniz?
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  Müşterilerimizin bizi tercih etmesinin sebepleri
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-hero rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-white">
                      Hızlı Servis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-300 text-center">
                      Acil durumlarınızda 24 saat içinde müdahale ve hızlı çözüm garantisi
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-hero rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-white">
                      Kaliteli Hizmet
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-300 text-center">
                      Orijinal yedek parça kullanımı ve uzman teknisyen kadrosu ile kaliteli hizmet
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-hero rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-white">
                      Güvence
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-300 text-center">
                      Tüm işlemlerimize garanti ve müşteri memnuniyeti odaklı hizmet anlayışı
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;