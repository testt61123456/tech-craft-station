import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-secondary text-secondary-foreground shadow-card sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <h1 className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
                Karadeniz Bilgisayar
              </h1>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/services" className="text-secondary-foreground hover:text-primary transition-smooth">
              Hizmetlerimiz
            </Link>
            <Link to="/products" className="text-secondary-foreground hover:text-primary transition-smooth">
              Ürünler
            </Link>
            <Link to="/contact" className="text-secondary-foreground hover:text-primary transition-smooth">
              İletişim
            </Link>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              Admin Girişi
            </Button>
          </nav>

          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;