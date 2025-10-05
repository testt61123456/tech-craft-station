import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ShoppingCart, Star, Phone, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ProductDetail = () => {
  const { id } = useParams();
  
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) throw new Error('Product ID is required');
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name)
        `)
        .eq('id', id)
        .eq('is_active', true)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Ürün bilgileri yükleniyor...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Ürün bulunamadı</h1>
          <Link to="/products">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Ürünlere Dön
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary">
      <Header />
      <main>
        <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-secondary via-secondary/95 to-secondary">
          <div className="container mx-auto px-4">
            <div className="mb-6 md:mb-8">
              <Link to="/products">
                <Button variant="ghost" className="flex items-center gap-2 text-sm md:text-base">
                  <ArrowLeft className="w-4 h-4" />
                  Ürünlere Dön
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <div className="space-y-6">
                <div className="aspect-square overflow-hidden rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-center shadow-tech hover:shadow-hero transition-all">
                  <img 
                    src={product.image_url || '/placeholder.svg'} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Badge className="mb-4 bg-gradient-hero text-white border-0">{product.category?.name || 'Genel'}</Badge>
                  <h1 className="text-3xl font-bold text-white mb-4">{product.name}</h1>
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className="h-5 w-5 fill-yellow-400 text-yellow-400" 
                        />
                      ))}
                    </div>
                    <span className="text-gray-300">(4.8 • 127 değerlendirme)</span>
                  </div>
                </div>

                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-3 text-white">Ürün Açıklaması</h3>
                    <p className="text-gray-300 leading-relaxed">
                      {product.description || "Bu ürün için detaylı açıklama henüz eklenmemiş."}
                    </p>
                  </CardContent>
                </Card>

                <div className="border-t border-white/10 pt-6">
                  {product.price && (
                    <div className="mb-6">
                      <span className="text-3xl font-bold text-white">
                        ₺{product.price.toLocaleString('tr-TR')}
                      </span>
                    </div>
                  )}

                  <Card className="bg-white/5 border-white/10 backdrop-blur-sm mb-6">
                    <CardContent className="p-6 space-y-4">
                      <h3 className="text-lg font-semibold text-white">İletişim & Sipariş</h3>
                      <Button className="w-full bg-gradient-hero hover:shadow-tech transition-bounce flex items-center gap-2 text-white">
                        <Phone className="w-4 h-4" />
                        Hemen Ara: +90 (462) 123 45 67
                      </Button>
                      <Button variant="outline" className="w-full border-white/20 bg-white/10 text-white hover:bg-white/20 flex items-center gap-2">
                        <Mail className="w-4 w-4" />
                        Email Gönder
                      </Button>
                      <p className="text-sm text-gray-400 text-center">
                        Stok durumu ve teslimat süresi için lütfen iletişime geçin
                      </p>
                    </CardContent>
                  </Card>
                </div>
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