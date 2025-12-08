import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-secondary">
      <Header />
      <main>
        {/* Hero Banner Section */}
        <section className="relative min-h-[60vh] flex items-center overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/95 to-secondary" />
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
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
                <MessageCircle className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary font-medium">7/24 Destek</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Bizimle
                <span className="block bg-gradient-to-r from-primary via-red-400 to-primary bg-clip-text text-transparent">
                  İletişime Geçin
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                Teknoloji ihtiyaçlarınız için bizimle iletişime geçin. 
                <span className="text-primary font-semibold"> Uzman ekibimiz</span> size yardımcı olmaya hazır.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                {[
                  { value: "24/7", label: "Destek Hattı" },
                  { value: "15+", label: "Yıl Tecrübe" },
                  { value: "1000+", label: "Mutlu Müşteri" },
                  { value: "100%", label: "Müşteri Memnuniyeti" }
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

        {/* Contact Section */}
        <section className="py-20 bg-secondary relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
          
          <div className="container mx-auto px-4 relative">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                İletişim Formu
              </h2>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                Sorularınız ve talepleriniz için bizimle iletişime geçin
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Contact Form */}
              <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-red-600 rounded-xl flex items-center justify-center">
                      <Send className="w-5 h-5 text-white" />
                    </div>
                    Bize Ulaşın
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Mesajınızı gönderin, en kısa sürede size dönüş yapalım
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">
                        Ad Soyad
                      </label>
                      <Input 
                        placeholder="Adınız ve soyadınız" 
                        className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">
                        Telefon
                      </label>
                      <Input 
                        placeholder="Telefon numaranız" 
                        className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-primary"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      E-posta
                    </label>
                    <Input 
                      type="email" 
                      placeholder="E-posta adresiniz" 
                      className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Konu
                    </label>
                    <Input 
                      placeholder="Mesaj konusu" 
                      className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Mesajınız
                    </label>
                    <Textarea 
                      placeholder="Mesajınızı buraya yazın..." 
                      rows={5}
                      className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-primary resize-none"
                    />
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-primary to-red-600 hover:from-red-600 hover:to-primary text-white rounded-xl py-6 text-lg">
                    <Send className="w-5 h-5 mr-2" />
                    Mesajı Gönder
                  </Button>
                </CardContent>
              </Card>

              {/* Contact Info & Map */}
              <div className="space-y-6">
                <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-xl text-white">
                      İletişim Bilgileri
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {[
                      { icon: Phone, label: "Telefon", value: "+90 (462) 123 45 67", href: "tel:+904621234567" },
                      { icon: Mail, label: "E-posta", value: "info@karadenizbilgisayar.com.tr", href: "mailto:info@karadenizbilgisayar.com.tr" }
                    ].map((item, index) => (
                      <a 
                        key={index}
                        href={item.href}
                        className="flex items-center gap-4 group hover:bg-white/5 p-3 rounded-xl transition-colors -mx-3"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-red-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                          <item.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{item.label}</p>
                          <p className="text-gray-400 group-hover:text-primary transition-colors">{item.value}</p>
                        </div>
                      </a>
                    ))}
                    
                    <div className="flex items-start gap-4 p-3 -mx-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-red-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Adres</p>
                        <p className="text-gray-400">
                          Atatürk Mahallesi, Teknoloji Cad. No:123<br />
                          61100 Ortahisar / Trabzon
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-3 -mx-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-red-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Çalışma Saatleri</p>
                        <p className="text-gray-400">
                          Pazartesi - Cumartesi: 09:00 - 18:00<br />
                          Pazar: Kapalı
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-xl text-white">
                      Konumumuz
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-white/5 rounded-xl p-8 aspect-video flex items-center justify-center border border-white/10">
                      <div className="text-center text-gray-400">
                        <MapPin className="w-12 h-12 mx-auto mb-4 text-primary" />
                        <p className="font-medium text-white mb-1">Harita görünümü</p>
                        <p className="text-sm">Google Maps entegrasyonu</p>
                      </div>
                    </div>
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

export default ContactPage;