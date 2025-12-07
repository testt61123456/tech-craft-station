import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowRight, ShoppingBag, Sparkles } from "lucide-react";

const NewProducts = () => {
  const navigate = useNavigate();

  const { data: newProducts, isLoading } = useQuery({
    queryKey: ['new-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(24);
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <section className="py-20 md:py-28 bg-background relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 blur-3xl rounded-full" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-primary/3 blur-3xl rounded-full" />

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                Yeni Eklenenler
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Ürünlerimiz
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl">
              En son eklenen ürünlerimizi keşfedin ve ihtiyacınız olan teknolojiye ulaşın
            </p>
          </div>

          <Button 
            size="lg"
            onClick={() => navigate('/products')}
            className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 group self-start md:self-auto"
          >
            Tüm Ürünler
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : newProducts && newProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {newProducts.map((product, index) => (
              <Card 
                key={product.id}
                className="group bg-card border-border hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 cursor-pointer transition-all duration-500 hover:-translate-y-1 overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => navigate(`/products/${product.id}`)}
              >
                <CardContent className="p-0">
                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <img 
                      src={product.image_url || "/placeholder.svg"} 
                      alt={product.name}
                      className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Category Badge */}
                    {product.category && (
                      <span className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                        {product.category.name}
                      </span>
                    )}

                    {/* Quick View Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 bg-white text-foreground px-4 py-2 rounded-full text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                        Detayları Gör
                      </span>
                    </div>
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-3 min-h-[3rem]">
                      {product.name}
                    </h3>
                    
                    {product.price && (
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-primary">
                          ₺{Number(product.price).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <ShoppingBag className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Henüz ürün bulunmuyor</h3>
            <p className="text-muted-foreground">Yakında yeni ürünler eklenecektir.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewProducts;
