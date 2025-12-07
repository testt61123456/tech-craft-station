import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowRight, Package } from "lucide-react";

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
        .limit(4);
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <section className="py-16 md:py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <Package className="w-6 h-6 text-primary" />
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
              Yeni Ürünler
            </h2>
          </div>
          <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
            En son eklenen ürünlerimizi keşfedin
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : newProducts && newProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newProducts.map((product) => (
                <Card 
                  key={product.id}
                  className="group bg-white/10 backdrop-blur-sm border-white/20 text-white cursor-pointer hover:border-primary hover:scale-105 transition-all duration-300 overflow-hidden"
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  <CardContent className="p-0">
                    <div className="relative h-48 overflow-hidden bg-gray-800">
                      <img 
                        src={product.image_url || "/placeholder.svg"} 
                        alt={product.name}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                      
                      {product.category && (
                        <span className="absolute top-3 left-3 bg-primary/90 text-white px-3 py-1 rounded-full text-xs font-medium">
                          {product.category.name}
                        </span>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <CardTitle className="text-lg font-semibold text-white line-clamp-2 group-hover:text-primary transition-colors mb-3">
                        {product.name}
                      </CardTitle>
                      
                      {product.price && (
                        <div className="text-xl font-bold text-primary">
                          ₺{Number(product.price).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-10">
              <Button 
                size="lg"
                onClick={() => navigate('/products')}
                className="bg-gradient-hero hover:shadow-tech text-base md:text-lg px-8 py-6 transition-bounce"
              >
                Daha Fazla
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-400 py-12">
            <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Henüz ürün bulunmamaktadır.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewProducts;
