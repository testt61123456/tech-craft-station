import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-secondary text-white relative">
      {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold text-white mb-4">
              Karadeniz<span className="text-primary">.</span>
            </h3>
            <p className="text-white/60 mb-6 leading-relaxed">
              15 yılı aşkın tecrübemizle teknoloji alanında güvenilir çözüm ortağınız. 
              Kaliteli hizmet ve müşteri memnuniyeti önceliğimizdir.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Linkedin, href: "#" }
              ].map((social, index) => (
                <a 
                  key={index}
                  href={social.href} 
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-primary" />
              Hızlı Erişim
            </h4>
            <ul className="space-y-4">
              {[
                { to: "/", label: "Ana Sayfa" },
                { to: "/services", label: "Hizmetlerimiz" },
                { to: "/products", label: "Ürünler" },
                { to: "/about", label: "Hakkımızda" },
                { to: "/contact", label: "İletişim" }
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.to} 
                    className="text-white/60 hover:text-primary transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-primary" />
              Hizmetlerimiz
            </h4>
            <ul className="space-y-4 text-white/60">
              {[
                "Bilgisayar Onarımı",
                "Yazıcı Servisi",
                "Güvenlik Sistemleri",
                "Otomasyon Sistemleri",
                "Sunucu Hizmetleri"
              ].map((service, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary/50 rounded-full" />
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-primary" />
              İletişim
            </h4>
            <div className="space-y-4">
              <a href="tel:+904621234567" className="flex items-center gap-3 text-white/60 hover:text-primary transition-colors">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <span>+90 (462) 123 45 67</span>
              </a>
              <a href="mailto:info@karadenizbilgisayar.com.tr" className="flex items-center gap-3 text-white/60 hover:text-primary transition-colors">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <span className="break-all">info@karadenizbilgisayar.com.tr</span>
              </a>
              <div className="flex items-start gap-3 text-white/60">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <span>
                  Atatürk Mahallesi, Teknoloji Cad. No:123<br />
                  61100 Ortahisar / Trabzon
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/50 text-sm">
              © {new Date().getFullYear()} Karadeniz Bilgisayar. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-white/50 hover:text-primary text-sm transition-colors">
                Gizlilik Politikası
              </a>
              <a href="#" className="text-white/50 hover:text-primary text-sm transition-colors">
                Kullanım Şartları
              </a>
              <Button
                size="sm"
                variant="outline"
                onClick={scrollToTop}
                className="border-white/20 text-white hover:bg-white/10 rounded-full w-10 h-10 p-0"
              >
                <ArrowUp className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
