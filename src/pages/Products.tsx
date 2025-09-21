import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ProductsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const allProducts = [
    // Gaming Bilgisayarlar
    { id: 1, category: "Gaming Bilgisayarlar", name: "Gaming PC - RTX 4060", price: "₺25.000", specs: "i5-13400F, 16GB RAM, 1TB SSD" },
    { id: 2, category: "Gaming Bilgisayarlar", name: "Gaming PC - RTX 4070", price: "₺35.000", specs: "i7-13700F, 32GB RAM, 1TB SSD" },
    { id: 3, category: "Gaming Bilgisayarlar", name: "Gaming PC - RTX 4080", price: "₺55.000", specs: "i9-13900F, 32GB RAM, 2TB SSD" },
    { id: 4, category: "Gaming Bilgisayarlar", name: "Gaming PC - RTX 4090", price: "₺75.000", specs: "i9-14900K, 64GB RAM, 2TB SSD" },
    { id: 5, category: "Gaming Bilgisayarlar", name: "Gaming PC - GTX 1660 Super", price: "₺18.000", specs: "i5-12400F, 16GB RAM, 512GB SSD" },
    
    // Notebook & Laptop
    { id: 6, category: "Notebook & Laptop", name: "ASUS VivoBook 15", price: "₺15.500", specs: "i5-1235U, 8GB RAM, 512GB SSD" },
    { id: 7, category: "Notebook & Laptop", name: "Lenovo ThinkPad E14", price: "₺22.000", specs: "i7-1265U, 16GB RAM, 512GB SSD" },
    { id: 8, category: "Notebook & Laptop", name: "HP Pavilion Gaming", price: "₺28.500", specs: "i5-12500H, RTX 3050, 16GB RAM" },
    { id: 9, category: "Notebook & Laptop", name: "Dell Inspiron 15", price: "₺12.500", specs: "i3-1215U, 8GB RAM, 256GB SSD" },
    { id: 10, category: "Notebook & Laptop", name: "ASUS ROG Strix G15", price: "₺45.000", specs: "AMD Ryzen 7, RTX 4060, 16GB RAM" },
    
    // Yazıcılar
    { id: 11, category: "Yazıcılar", name: "HP LaserJet Pro M15w", price: "₺2.850", specs: "Mono Lazer, WiFi, 18 ppm" },
    { id: 12, category: "Yazıcılar", name: "Canon PIXMA G3420", price: "₺4.200", specs: "Renkli Mürekkep Tanklı, WiFi" },
    { id: 13, category: "Yazıcılar", name: "Epson L3250", price: "₺3.650", specs: "Renkli Mürekkep Tanklı, Tarayıcı" },
    { id: 14, category: "Yazıcılar", name: "Brother DCP-T820DW", price: "₺5.200", specs: "Renkli Tanklı, Dublex, WiFi" },
    { id: 15, category: "Yazıcılar", name: "HP Smart Tank 615", price: "₺4.800", specs: "Renkli Tanklı, Faks, WiFi" },
    
    // Bilgisayar Parçaları
    { id: 16, category: "Bilgisayar Parçaları", name: "Intel Core i5-13400F", price: "₺8.500", specs: "10 Çekirdek, 2.5-4.6 GHz" },
    { id: 17, category: "Bilgisayar Parçaları", name: "AMD Ryzen 5 7600X", price: "₺9.200", specs: "6 Çekirdek, 4.7-5.3 GHz" },
    { id: 18, category: "Bilgisayar Parçaları", name: "NVIDIA RTX 4070", price: "₺28.000", specs: "12GB GDDR6X, 2610 MHz" },
    { id: 19, category: "Bilgisayar Parçaları", name: "Corsair Vengeance LPX 32GB", price: "₺4.500", specs: "DDR4-3200, 2x16GB Kit" },
    { id: 20, category: "Bilgisayar Parçaları", name: "Samsung 980 PRO 1TB", price: "₺3.200", specs: "NVMe SSD, 7000 MB/s Okuma" },
    { id: 21, category: "Bilgisayar Parçaları", name: "ASUS ROG Strix B550-F", price: "₺6.800", specs: "AMD B550, ATX, WiFi 6" },
    { id: 22, category: "Bilgisayar Parçaları", name: "Corsair RM850x", price: "₺4.200", specs: "850W, 80+ Gold, Modüler" },
    
    // Güvenlik Sistemleri
    { id: 23, category: "Güvenlik Sistemleri", name: "Hikvision DS-2CE76D0T", price: "₺850", specs: "2MP, IR 20m, Gece Görüş" },
    { id: 24, category: "Güvenlik Sistemleri", name: "Dahua XVR5104HS-4KL-X", price: "₺2.400", specs: "4 Kanal, 4K, H.265+" },
    { id: 25, category: "Güvenlik Sistemleri", name: "Paradox MG5050 Alarm", price: "₺1.850", specs: "32 Zone, GSM Modül" },
  ];

  const totalPages = Math.ceil(allProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = allProducts.slice(startIndex, startIndex + itemsPerPage);

  const categories = [...new Set(allProducts.map(product => product.category))];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-6">
                Ürün Fiyat Listesi
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Güncel ürün fiyatlarımız ve teknik özellikleri. Detaylı bilgi için bizimle iletişime geçin.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {currentProducts.map((product) => (
                <Card key={product.id} className="bg-gradient-card hover:shadow-tech transition-bounce group">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-lg group-hover:text-primary transition-smooth">
                        {product.name}
                      </CardTitle>
                      <Badge variant="secondary" className="bg-gradient-hero text-white border-0">
                        {product.price}
                      </Badge>
                    </div>
                    <Badge variant="outline" className="w-fit text-xs">
                      {product.category}
                    </Badge>
                    <CardDescription className="text-sm text-muted-foreground">
                      {product.specs}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to={`/products/${product.id}`}>
                      <Button 
                        variant="outline" 
                        className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      >
                        Detaylı Bilgi Al
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center space-x-4">
              <Button 
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Önceki
              </Button>
              
              <span className="text-muted-foreground">
                Sayfa {currentPage} / {totalPages}
              </span>
              
              <Button 
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Sonraki
              </Button>
            </div>

            <div className="text-center mt-16">
              <Link to="/products/all">
                <Button size="lg" className="bg-gradient-hero hover:shadow-tech transition-bounce">
                  Tüm Ürünleri Gör ({allProducts.length} Ürün)
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPage;