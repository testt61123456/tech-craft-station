import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-primary mb-4">
              Karadeniz Bilgisayar
            </h3>
            <p className="text-muted-foreground mb-4">
              15 yılı aşkın tecrübemizle teknoloji alanında güvenilir çözüm ortağınız. 
              Kaliteli hizmet ve müşteri memnuniyeti önceliğimizdir.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors"
              >
                <Twitter className="w-5 h-5 text-white" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-primary mb-4">Hızlı Erişim</h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link 
                  to="/services" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Hizmetlerimiz
                </Link>
              </li>
              <li>
                <Link 
                  to="/products" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Ürünler
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold text-primary mb-4">Hizmetlerimiz</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li>Bilgisayar Onarımı</li>
              <li>Yazıcı Servisi</li>
              <li>Güvenlik Sistemleri</li>
              <li>Otomasyon Sistemleri</li>
              <li>Sunucu Hizmetleri</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-primary mb-4">İletişim</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">+90 (462) 123 45 67</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">info@karadenizbilgisayar.com.tr</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">
                  Atatürk Mahallesi, Teknoloji Cad. No:123<br />
                  61100 Ortahisar / Trabzon
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-muted mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © 2024 Karadeniz Bilgisayar. Tüm hakları saklıdır.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                Gizlilik Politikası
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                Kullanım Şartları
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;