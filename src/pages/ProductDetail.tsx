import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, Phone, Mail, Shield, Truck, CheckCircle } from "lucide-react";
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
      <div className="min-h-screen bg-secondary">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-400">Ürün bilgileri yükleniyor...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-secondary">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Ürün bulunamadı</h1>
          <Link to="/products">
            <Button className="bg-gradient-to-r from-primary to-red-600">
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
        <section className="py-12 md:py-16 lg:py-20 relative">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          </div>
          
          <div className="container mx-auto px-4 relative">
            <div className="mb-8">
              <Link to="/products">
                <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/5 group">
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  Ürünlere Dön
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Product Image */}
              <div className="space-y-6">
                <div className="aspect-square overflow-hidden rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-center shadow-2xl group">
                  <img 
                    src={product.image_url || '/placeholder.svg'} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { icon: Shield, label: "Garantili Ürün" },
                    { icon: Truck, label: "Hızlı Teslimat" },
                    { icon: CheckCircle, label: "Orijinal Ürün" }
                  ].map((badge, index) => (
                    <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                      <badge.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                      <p className="text-xs text-gray-400">{badge.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <Badge className="mb-4 bg-gradient-to-r from-primary to-red-600 text-white border-0 px-4 py-1">
                    {product.category?.name || 'Genel'}
                  </Badge>
                  {product.is_campaign && (
                    <Badge className="ml-2 bg-amber-500 text-white border-0 px-4 py-1">
                      Kampanya
                    </Badge>
                  )}
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{product.name}</h1>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className="h-5 w-5 fill-amber-400 text-amber-400" 
                        />
                      ))}
                    </div>
                    <span className="text-gray-400">(4.8 • 127 değerlendirme)</span>
                  </div>
                </div>

                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-3 text-white">Ürün Açıklaması</h3>
                    <p className="text-gray-400 leading-relaxed">
                      {product.description || "Bu ürün için detaylı açıklama henüz eklenmemiş."}
                    </p>
                  </CardContent>
                </Card>

                <div className="border-t border-white/10 pt-6">
                  {product.price && (
                    <div className="mb-6 bg-gradient-to-r from-primary/20 to-red-600/20 border border-primary/30 rounded-2xl p-6">
                      <p className="text-sm text-gray-400 mb-1">Fiyat</p>
                      <span className="text-4xl font-bold text-white">
                        ₺{product.price.toLocaleString('tr-TR')}
                      </span>
                    </div>
                  )}

                  <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                    <CardContent className="p-6 space-y-4">
                      <h3 className="text-lg font-semibold text-white">İletişim & Sipariş</h3>
                      <Button 
                        className="w-full bg-gradient-to-r from-primary to-red-600 hover:from-red-600 hover:to-primary text-white h-14 rounded-xl text-base"
                        onClick={() => window.open("tel:+904621234567")}
                      >
                        <Phone className="w-5 h-5 mr-2" />
                        Hemen Ara: +90 (462) 123 45 67
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-primary/50 h-14 rounded-xl"
                        onClick={() => window.open("mailto:info@karadenizbilgisayar.com.tr")}
                      >
                        <Mail className="w-5 h-5 mr-2" />
                        Email Gönder
                      </Button>
                      <p className="text-sm text-gray-500 text-center">
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