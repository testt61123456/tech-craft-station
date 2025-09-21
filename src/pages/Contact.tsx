import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-6">
                İletişim
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Teknoloji ihtiyaçlarınız için bizimle iletişime geçin. Uzman ekibimiz size yardımcı olmaya hazır.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card className="bg-gradient-card">
                <CardHeader>
                  <CardTitle className="text-2xl text-secondary">
                    Bize Ulaşın
                  </CardTitle>
                  <CardDescription>
                    Mesajınızı gönderin, en kısa sürede size dönüş yapalım
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">
                        Ad Soyad
                      </label>
                      <Input placeholder="Adınız ve soyadınız" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">
                        Telefon
                      </label>
                      <Input placeholder="Telefon numaranız" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      E-posta
                    </label>
                    <Input type="email" placeholder="E-posta adresiniz" />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Konu
                    </label>
                    <Input placeholder="Mesaj konusu" />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
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
                <Card className="bg-gradient-card">
                  <CardHeader>
                    <CardTitle className="text-xl text-secondary">
                      İletişim Bilgileri
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-secondary">Telefon</p>
                        <p className="text-muted-foreground">+90 (462) 123 45 67</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-secondary">E-posta</p>
                        <p className="text-muted-foreground">info@karadenizbilgisayar.com.tr</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-secondary">Adres</p>
                        <p className="text-muted-foreground">
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
                        <p className="font-medium text-secondary">Çalışma Saatleri</p>
                        <p className="text-muted-foreground">
                          Pazartesi - Cumartesi: 09:00 - 18:00<br />
                          Pazar: Kapalı
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-card">
                  <CardHeader>
                    <CardTitle className="text-xl text-secondary">
                      Konumumuz
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted rounded-lg p-8 aspect-video flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
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