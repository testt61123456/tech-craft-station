import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Bize Ulaşın
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Teknoloji ihtiyaçlarınız için uzman ekibimizden destek alın
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <MapPin className="w-6 h-6 mr-3" />
                  Adresimiz
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Merkez Mahallesi, Teknoloji Sokak No:15<br />
                  61000 Ortahisar/Trabzon
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Phone className="w-6 h-6 mr-3" />
                  İletişim
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-gray-300">
                  <strong>Telefon:</strong> +90 462 123 4567
                </p>
                <p className="text-gray-300">
                  <strong>WhatsApp:</strong> +90 532 123 4567
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Mail className="w-6 h-6 mr-3" />
                  E-posta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">info@karadenizbilgisayar.com.tr</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Clock className="w-6 h-6 mr-3" />
                  Çalışma Saatleri
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-gray-300">
                  <p><strong>Pazartesi - Cuma:</strong> 09:00 - 18:00</p>
                  <p><strong>Cumartesi:</strong> 09:00 - 16:00</p>
                  <p><strong>Pazar:</strong> Kapalı</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-white/10 rounded-lg p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-6">Hızlı İletişim</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Adınız Soyadınız"
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="email"
                placeholder="E-posta Adresiniz"
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="tel"
                placeholder="Telefon Numaranız"
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <textarea
                placeholder="Mesajınız..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
              <Button className="w-full bg-gradient-hero hover:shadow-tech transition-bounce text-lg py-6">
                Mesaj Gönder
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;