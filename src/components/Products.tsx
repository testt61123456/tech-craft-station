import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Products = () => {
  const productCategories = [
    {
      title: "Gaming Bilgisayarlar",
      products: [
        { name: "Gaming PC - RTX 4060", price: "₺25.000", specs: "i5-13400F, 16GB RAM, 1TB SSD" },
        { name: "Gaming PC - RTX 4070", price: "₺35.000", specs: "i7-13700F, 32GB RAM, 1TB SSD" },
        { name: "Gaming PC - RTX 4080", price: "₺55.000", specs: "i9-13900F, 32GB RAM, 2TB SSD" }
      ]
    },
    {
      title: "Notebook & Laptop",
      products: [
        { name: "ASUS VivoBook 15", price: "₺15.500", specs: "i5-1235U, 8GB RAM, 512GB SSD" },
        { name: "Lenovo ThinkPad E14", price: "₺22.000", specs: "i7-1265U, 16GB RAM, 512GB SSD" },
        { name: "HP Pavilion Gaming", price: "₺28.500", specs: "i5-12500H, RTX 3050, 16GB RAM" }
      ]
    },
    {
      title: "Yazıcılar",
      products: [
        { name: "HP LaserJet Pro M15w", price: "₺2.850", specs: "Mono Lazer, WiFi, 18 ppm" },
        { name: "Canon PIXMA G3420", price: "₺4.200", specs: "Renkli Mürekkep Tanklı, WiFi" },
        { name: "Epson L3250", price: "₺3.650", specs: "Renkli Mürekkep Tanklı, Tarayıcı" }
      ]
    }
  ];

  return (
    <section id="products" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-6">
            Ürün Fiyat Listesi
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Güncel ürün fiyatlarımız ve teknik özellikleri. Detaylı bilgi için bizimle iletişime geçin.
          </p>
        </div>

        <div className="space-y-12">
          {productCategories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h3 className="text-2xl font-bold text-secondary mb-8 text-center">
                {category.title}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.products.map((product, productIndex) => (
                  <Card key={productIndex} className="bg-gradient-card hover:shadow-tech transition-bounce group">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-lg group-hover:text-primary transition-smooth">
                          {product.name}
                        </CardTitle>
                        <Badge variant="secondary" className="bg-gradient-hero text-white border-0">
                          {product.price}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm text-muted-foreground">
                        {product.specs}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        variant="outline" 
                        className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      >
                        Detaylı Bilgi Al
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">
            Daha fazla ürün ve güncel fiyat bilgileri için
          </p>
          <Button size="lg" className="bg-gradient-hero hover:shadow-tech transition-bounce">
            Tüm Ürünleri Gör
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Products;