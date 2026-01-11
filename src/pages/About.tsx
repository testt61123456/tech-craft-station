import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Award, Lightbulb, Clock, Shield, Zap, Heart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AboutPage = () => {
  const values = [
    {
      icon: Target,
      title: "Misyonumuz",
      description: "Teknoloji alanında müşterilerimize en kaliteli hizmeti sunarak, dijital dönüşümlerinde güvenilir partner olmak.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Lightbulb,
      title: "Vizyonumuz",
      description: "Teknoloji sektöründe öncü firma olarak, yenilikçi çözümlerle sektöre değer katmak ve örnek olmak.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Shield,
      title: "Değerlerimiz",
      description: "Güvenilirlik, kalite, müşteri memnuniyeti ve sürekli gelişim prensiplerimizle hareket ederiz.",
      gradient: "from-red-500 to-orange-500"
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

  const whyUs = [
    {
      icon: Clock,
      title: "Hızlı Servis",
      description: "Acil durumlarınızda 24 saat içinde müdahale ve hızlı çözüm garantisi",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      icon: Award,
      title: "Kaliteli Hizmet",
      description: "Orijinal yedek parça kullanımı ve uzman teknisyen kadrosu ile kaliteli hizmet",
      gradient: "from-amber-500 to-yellow-500"
    },
    {
      icon: Shield,
      title: "Güvence",
      description: "Tüm işlemlerimize garanti ve müşteri memnuniyeti odaklı hizmet anlayışı",
      gradient: "from-indigo-500 to-blue-500"
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
            <div className="absolute top-20 right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
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
                <Heart className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary font-medium">15 Yıldır Sizinle</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-normal">
                Hakkımızda
                <span className="block bg-gradient-to-r from-primary via-red-400 to-primary bg-clip-text text-transparent pb-2">
                  Karadeniz Bilgisayar
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                2008 yılından bu yana teknoloji alanında 
                <span className="text-primary font-semibold"> güvenilir hizmet</span> anlayışıyla hizmet veriyoruz.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                {[
                  { value: "15+", label: "Yıl Tecrübe" },
                  { value: "1000+", label: "Mutlu Müşteri" },
                  { value: "5000+", label: "Tamamlanan Proje" },
                  { value: "24/7", label: "Destek Hizmeti" }
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

        {/* Story & Values Section */}
        <section className="py-20 bg-secondary relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
          
          <div className="container mx-auto px-4 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-20">
              <div>
                <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-2 mb-6">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-sm text-primary font-medium">Hikayemiz</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8">
                  Teknolojiye Olan
                  <span className="text-primary"> Tutkumuz</span>
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
                  <Card key={index} className="group bg-white/5 backdrop-blur-sm border border-white/10 hover:border-primary/50 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center space-y-0 pb-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${value.gradient} rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <value.icon className="w-7 h-7 text-white" />
                      </div>
                      <CardTitle className="text-xl text-white group-hover:text-primary transition-colors">
                        {value.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-400 text-base leading-relaxed">
                        {value.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Team Section */}
            <div className="mb-20">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-2 mb-6">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm text-primary font-medium">Uzman Kadro</span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                  Ekibimiz
                </h2>
                <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                  Alanında uzman ve deneyimli ekibimizle size en iyi hizmeti sunuyoruz
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {team.map((member, index) => (
                  <Card key={index} className="group bg-white/5 backdrop-blur-sm border border-white/10 hover:border-primary/50 transition-all duration-300 text-center hover:-translate-y-2">
                    <CardHeader className="pb-4">
                      <div className="w-24 h-24 bg-gradient-to-br from-primary to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <Users className="w-12 h-12 text-white" />
                      </div>
                      <CardTitle className="text-xl text-white group-hover:text-primary transition-colors">
                        {member.name}
                      </CardTitle>
                      <CardDescription className="text-primary font-medium">
                        {member.role}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400 text-sm">
                        {member.experience}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Why Choose Us Section */}
            <div>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-2 mb-6">
                  <Award className="w-4 h-4 text-primary" />
                  <span className="text-sm text-primary font-medium">Neden Biz?</span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                  Neden Bizi Tercih Etmelisiniz?
                </h2>
                <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                  Müşterilerimizin bizi tercih etmesinin sebepleri
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {whyUs.map((item, index) => (
                  <Card key={index} className="group bg-white/5 backdrop-blur-sm border border-white/10 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2">
                    <CardHeader className="text-center">
                      <div className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <item.icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-xl text-white group-hover:text-primary transition-colors">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-400 text-center leading-relaxed">
                        {item.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
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