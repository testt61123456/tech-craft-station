import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import productsBanner from "@/assets/products-banner.jpg";

const ProductsPage = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-white">Ürünler yükleniyor...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary">
      <Header />
      <main>
        {/* Banner Section */}
        <section className="relative h-96 overflow-hidden">
          <img 
            src={productsBanner} 
            alt="Ürünlerimiz Banner" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">Ürünlerimiz</h1>
              <p className="text-xl md:text-2xl">İhtiyaçlarınıza özel teknoloji çözümleri</p>
            </div>
          </div>
        </section>

        <section className="py-20 bg-secondary">
          <div className="container mx-auto px-4">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products?.map((product) => (
                <Card key={product.id} className="group hover:shadow-elegant transition-all duration-300 bg-white/10 backdrop-blur-sm border border-white/20">
                  <CardHeader className="p-0">
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <img 
                        src={product.image_url || '/placeholder.svg'} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                        {product.category || 'Genel'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <CardTitle className="text-xl font-semibold mb-3 text-white group-hover:text-primary transition-colors">
                      {product.name}
                    </CardTitle>
                    <CardDescription className="text-gray-300 mb-4 line-clamp-2">
                      {product.description || 'Ürün açıklaması yakında eklenecek.'}
                    </CardDescription>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className="h-4 w-4 fill-yellow-400 text-yellow-400" 
                          />
                        ))}
                        <span className="text-sm text-gray-400 ml-2">(4.8)</span>
                      </div>
                      {product.price && (
                        <span className="text-2xl font-bold text-primary">
                          ₺{product.price.toLocaleString('tr-TR')}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Link to={`/products/${product.id}`} className="flex-1">
                        <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                          Detayları Gör
                        </Button>
                      </Link>
                      <Button className="bg-gradient-hero hover:shadow-tech transition-bounce">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        İletişim
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {(!products || products.length === 0) && (
              <div className="text-center py-12">
                <p className="text-xl text-white">Henüz ürün bulunmamaktadır.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPage;