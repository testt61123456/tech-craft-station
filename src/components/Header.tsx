import { Button } from "@/components/ui/button";
import { Menu, LogOut, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();

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
            <Link to="/about" className="text-secondary-foreground hover:text-primary transition-smooth">
              Hakkımızda
            </Link>
            <Link to="/contact" className="text-secondary-foreground hover:text-primary transition-smooth">
              İletişim
            </Link>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    <User className="h-4 w-4 mr-2" />
                    {getRoleLabel(userRole)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Çıkış Yap
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={() => navigate("/auth")}
              >
                Giriş Yap
              </Button>
            )}
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