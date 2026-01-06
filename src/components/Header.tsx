import { Button } from "@/components/ui/button";
import { Menu, LogOut, User, X, ChevronDown, Settings } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const Header = () => {
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { to: "/services", label: "Hizmetlerimiz" },
    { to: "/products", label: "Ürünler" },
    { to: "/about", label: "Hakkımızda" },
    { to: "/contact", label: "İletişim" }
  ];

  const adminLinks = [
    { to: "/customer-registration", label: "Müşteri Kayıt" },
    { to: "/service-records", label: "Servis Kayıtları" },
    { to: "/quote-form", label: "Teklif Formu" }
  ];

  const superadminLinks = [
    { to: "/admin-panel", label: "Yönetim Paneli", icon: Settings }
  ];

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled 
        ? "bg-secondary/95 backdrop-blur-md shadow-lg" 
        : "bg-transparent"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 group">
            <h1 className="text-xl md:text-2xl font-bold text-white">
              Karadeniz<span className="text-primary group-hover:text-primary/80 transition-colors">.</span>
            </h1>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link 
                key={link.to}
                to={link.to} 
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                  isActive(link.to)
                    ? "bg-primary text-white"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                )}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Admin Links */}
            {(userRole === 'admin' || userRole === 'superadmin') && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full text-sm font-medium"
                  >
                    Yönetim
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-secondary border-white/10">
                  {adminLinks.map((link) => (
                    <DropdownMenuItem 
                      key={link.to}
                      onClick={() => navigate(link.to)}
                      className="text-white hover:bg-white/10 cursor-pointer"
                    >
                      {link.label}
                    </DropdownMenuItem>
                  ))}
                  {userRole === 'superadmin' && superadminLinks.map((link) => (
                    <DropdownMenuItem 
                      key={link.to}
                      onClick={() => navigate(link.to)}
                      className="text-white hover:bg-white/10 cursor-pointer"
                    >
                      <link.icon className="h-4 w-4 mr-2" />
                      {link.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-white/20 text-white hover:bg-white/10 rounded-full"
                  >
                    <User className="h-4 w-4 mr-2" />
                    {getRoleLabel(userRole)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-secondary border-white/10">
                  <DropdownMenuItem 
                    onClick={handleSignOut} 
                    className="text-white hover:bg-white/10 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Çıkış Yap
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                size="sm"
                className="bg-primary hover:bg-primary/90 text-white rounded-full px-6"
                onClick={() => navigate("/auth")}
              >
                Giriş Yap
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden text-white hover:bg-white/10 rounded-full w-10 h-10 p-0"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className={cn(
          "md:hidden overflow-hidden transition-all duration-300",
          isMobileMenuOpen ? "max-h-[500px] pb-6" : "max-h-0"
        )}>
          <nav className="flex flex-col gap-2 pt-4 border-t border-white/10">
            {navLinks.map((link) => (
              <Link 
                key={link.to}
                to={link.to} 
                className={cn(
                  "px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  isActive(link.to)
                    ? "bg-primary text-white"
                    : "text-white/80 hover:bg-white/10"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Admin Links - Mobile */}
            {(userRole === 'admin' || userRole === 'superadmin') && adminLinks.map((link) => (
              <Link 
                key={link.to}
                to={link.to} 
                className={cn(
                  "px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  isActive(link.to)
                    ? "bg-primary text-white"
                    : "text-white/80 hover:bg-white/10"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Superadmin Links - Mobile */}
            {userRole === 'superadmin' && superadminLinks.map((link) => (
              <Link 
                key={link.to}
                to={link.to} 
                className={cn(
                  "px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2",
                  isActive(link.to)
                    ? "bg-primary text-white"
                    : "text-white/80 hover:bg-white/10"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
            
            {/* Auth Button - Mobile */}
            <div className="pt-4 mt-2 border-t border-white/10">
              {user ? (
                <Button 
                  variant="outline" 
                  className="w-full border-white/20 text-white hover:bg-white/10 rounded-full"
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
                  className="w-full bg-primary hover:bg-primary/90 text-white rounded-full"
                  onClick={() => {
                    navigate("/auth");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Giriş Yap
                </Button>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
