import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import contactBanner from "@/assets/contact-banner.jpg";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Banner Section */}
        <section className="relative min-h-[60vh] flex items-center bg-gradient-tech overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
            style={{ backgroundImage: `url(${contactBanner})` }}
          />
          <div className="absolute inset-0 bg-gradient-tech opacity-80" />
          
          <div className="relative container mx-auto px-4 py-20">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Bizimle
                <span className="text-primary block">İletişime Geçin</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
                Teknoloji ihtiyaçlarınız için bizimle iletişime geçin. 
                <strong className="text-primary"> Uzman ekibimiz</strong> size yardımcı olmaya hazır.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                  <div className="text-sm">Destek Hattı</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">15+</div>
                  <div className="text-sm">Yıl Tecrübe</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">1000+</div>
                  <div className="text-sm">Mutlu Müşteri</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">100%</div>
                  <div className="text-sm">Müşteri Memnuniyeti</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                İletişim Formu
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Sorularınız ve talepleriniz için bizimle iletişime geçin
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">
                    Bize Ulaşın
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Mesajınızı gönderin, en kısa sürede size dönüş yapalım
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">
                        Ad Soyad
                      </label>
                      <Input placeholder="Adınız ve soyadınız" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">
                        Telefon
                      </label>
                      <Input placeholder="Telefon numaranız" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      E-posta
                    </label>
                    <Input type="email" placeholder="E-posta adresiniz" />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Konu
                    </label>
                    <Input placeholder="Mesaj konusu" />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Mesajınız
                    </label>
                    <Textarea 
                      placeholder="Mesajınızı buraya yazın..." 
                      rows={5}
                    />
                  </div>
                  
                  <Button className="w-full bg-gradient-hero hover:shadow-tech transition-bounce">
                    Mesajı Gönder
                  </Button>
                </CardContent>
              </Card>

              {/* Contact Info & Map */}
              <div className="space-y-6">
                <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
                  <CardHeader>
                    <CardTitle className="text-xl text-white">
                      İletişim Bilgileri
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Telefon</p>
                        <p className="text-gray-300">+90 (462) 123 45 67</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-white">E-posta</p>
                        <p className="text-gray-300">info@karadenizbilgisayar.com.tr</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Adres</p>
                        <p className="text-gray-300">
                          Atatürk Mahallesi, Teknoloji Cad. No:123<br />
                          61100 Ortahisar / Trabzon
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Çalışma Saatleri</p>
                        <p className="text-gray-300">
                          Pazartesi - Cumartesi: 09:00 - 18:00<br />
                          Pazar: Kapalı
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
                  <CardHeader>
                    <CardTitle className="text-xl text-white">
                      Konumumuz
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-white/5 rounded-lg p-8 aspect-video flex items-center justify-center">
                      <div className="text-center text-gray-300">
                        <MapPin className="w-12 h-12 mx-auto mb-4" />
                        <p>Harita görünümü</p>
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