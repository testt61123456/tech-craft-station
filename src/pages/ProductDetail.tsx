import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ProductDetail = () => {
  const { id } = useParams();

  // Mock product data - in real app, this would come from API
  const product = {
    id: Number(id),
    category: "Gaming Bilgisayarlar",
    name: "Gaming PC - RTX 4070",
    price: "₺35.000",
    specs: "i7-13700F, 32GB RAM, 1TB SSD",
    description: "Yüksek performanslı gaming bilgisayarı. En son nesil işlemci ve ekran kartı ile donatılmış bu sistem, tüm modern oyunları maksimum ayarlarda sorunsuz çalıştırır.",
    detailedSpecs: {
      "İşlemci": "Intel Core i7-13700F (16 Çekirdek, 24 Thread)",
      "Ekran Kartı": "NVIDIA GeForce RTX 4070 12GB GDDR6X", 
      "RAM": "32GB DDR4-3200 MHz",
      "Depolama": "1TB NVMe SSD",
      "Anakart": "ASUS ROG Strix B760-F Gaming",
      "Güç Kaynağı": "750W 80+ Gold Sertifikalı",
      "Kasa": "RGB Aydınlatmalı Gaming Kasa",
      "Soğutma": "Liquid Cooler CPU Soğutucu"
    },
    features: [
      "4K Gaming Desteği",
      "Ray Tracing Teknolojisi",
      "DLSS 3.0 Desteği",
      "RGB Aydınlatma",
      "Sessiz Çalışma",
      "3 Yıl Garanti"
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <Link to="/products">
                <Button variant="ghost" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Ürünlere Dön
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Product Image & Info */}
              <div>
                <div className="bg-gradient-card rounded-lg p-8 mb-6 aspect-square flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <div className="text-4xl mb-4">🖥️</div>
                    <p>Ürün Görseli</p>
                  </div>
                </div>
                
                <Card className="bg-gradient-card">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <Badge variant="outline" className="mb-2">
                          {product.category}
                        </Badge>
                        <CardTitle className="text-2xl text-secondary">
                          {product.name}
                        </CardTitle>
                      </div>
                      <Badge variant="secondary" className="bg-gradient-hero text-white border-0 text-lg px-4 py-2">
                        {product.price}
                      </Badge>
                    </div>
                    <CardDescription className="text-base">
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>

              {/* Specifications & Features */}
              <div className="space-y-6">
                <Card className="bg-gradient-card">
                  <CardHeader>
                    <CardTitle className="text-xl text-secondary">
                      Teknik Özellikler
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(product.detailedSpecs).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center py-2 border-b border-muted">
                          <span className="font-medium text-muted-foreground">{key}:</span>
                          <span className="text-secondary text-right">{value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-card">
                  <CardHeader>
                    <CardTitle className="text-xl text-secondary">
                      Öne Çıkan Özellikler
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {product.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-muted-foreground">
                          <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-card">
                  <CardHeader>
                    <CardTitle className="text-xl text-secondary">
                      İletişim & Sipariş
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full bg-gradient-hero hover:shadow-tech transition-bounce flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Hemen Ara: +90 (462) 123 45 67
                    </Button>
                    <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Gönder
                    </Button>
                    <p className="text-sm text-muted-foreground text-center">
                      Stok durumu ve teslimat süresi için lütfen iletişime geçin
                    </p>
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

export default ProductDetail;