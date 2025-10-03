import { Button } from "@/components/ui/button";
import { Menu, LogOut, User, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getRoleLabel = (role: string | null) => {
    switch (role) {
      case 'superadmin': return 'Süper Admin';
      case 'admin': return 'Yönetici';
      case 'dealer': return 'Bayi';
      case 'user': return 'Kullanıcı';
      default: return 'Kullanıcı';
    }
  };

  return (
    <header className="bg-secondary text-secondary-foreground shadow-card sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex-shrink-0">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
              Karadeniz Bilgisayar
            </h1>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-8">
            <Link to="/services" className="text-sm lg:text-base text-secondary-foreground hover:text-primary transition-smooth">
              Hizmetlerimiz
            </Link>
            <Link to="/products" className="text-sm lg:text-base text-secondary-foreground hover:text-primary transition-smooth">
              Ürünler
            </Link>
            <Link to="/about" className="text-sm lg:text-base text-secondary-foreground hover:text-primary transition-smooth">
              Hakkımızda
            </Link>
            <Link to="/contact" className="text-sm lg:text-base text-secondary-foreground hover:text-primary transition-smooth">
              İletişim
            </Link>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    <User className="h-4 w-4 mr-2" />
                    <span className="hidden lg:inline">{getRoleLabel(userRole)}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-secondary border-white/20">
                  <DropdownMenuItem onClick={handleSignOut} className="text-white hover:bg-white/10">
                    <LogOut className="h-4 w-4 mr-2" />
                    Çıkış Yap
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={() => navigate("/auth")}
              >
                Giriş Yap
              </Button>
            )}
          </nav>

          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-3 border-t border-white/10 pt-4">
            <Link 
              to="/services" 
              className="block text-secondary-foreground hover:text-primary transition-smooth py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Hizmetlerimiz
            </Link>
            <Link 
              to="/products" 
              className="block text-secondary-foreground hover:text-primary transition-smooth py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Ürünler
            </Link>
            <Link 
              to="/about" 
              className="block text-secondary-foreground hover:text-primary transition-smooth py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Hakkımızda
            </Link>
            <Link 
              to="/contact" 
              className="block text-secondary-foreground hover:text-primary transition-smooth py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              İletişim
            </Link>
            
            {user ? (
              <Button 
                variant="outline" 
                className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={() => {
                  handleSignOut();
                  setIsMobileMenuOpen(false);
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Çıkış Yap
              </Button>
            ) : (
              <Button 
                variant="outline" 
                className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={() => {
                  navigate("/auth");
                  setIsMobileMenuOpen(false);
                }}
              >
                Giriş Yap
              </Button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;