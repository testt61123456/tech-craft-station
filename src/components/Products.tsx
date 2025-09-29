import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const Products = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products-homepage'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <section id="products" className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-white">Ürünler yükleniyor...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Yeni Eklenen Ürünler
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            En son eklediğimiz ürünler ve teknoloji çözümleri. Daha fazlası için tüm ürünler sayfasını ziyaret edin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
                <CardTitle className="text-lg font-semibold mb-3 text-white group-hover:text-primary transition-colors line-clamp-2">
                  {product.name}
                </CardTitle>
                <CardDescription className="text-gray-300 mb-4 line-clamp-2 text-sm">
                  {product.description || 'Ürün açıklaması yakında eklenecek.'}
                </CardDescription>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="h-3 w-3 fill-yellow-400 text-yellow-400" 
                      />
                    ))}
                    <span className="text-xs text-gray-400 ml-1">(4.8)</span>
                  </div>
                  {product.price && (
                    <span className="text-lg font-bold text-primary">
                      ₺{product.price.toLocaleString('tr-TR')}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Link to={`/products/${product.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                      Detay
                    </Button>
                  </Link>
                  <Button size="sm" className="bg-gradient-hero hover:shadow-tech transition-bounce">
                    <ShoppingCart className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {(!products || products.length === 0) && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-300">Henüz ürün bulunmamaktadır.</p>
          </div>
        )}

        <div className="text-center mt-16">
          <p className="text-gray-300 mb-4">
            Daha fazla ürün ve güncel fiyat bilgileri için
          </p>
          <Link to="/products">
            <Button size="lg" className="bg-gradient-hero hover:shadow-tech transition-bounce">
              Tüm Ürünleri Gör
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Products;