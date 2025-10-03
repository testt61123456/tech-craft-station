import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star, Plus, Edit, Trash2, FolderPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import productsBanner from "@/assets/products-banner.jpg";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const ProductsPage = () => {
  const { userRole } = useAuth();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
    is_campaign: false
  });
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: ''
  });

  const isAdmin = userRole === 'admin' || userRole === 'superadmin';

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const createProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          ...productData,
          price: productData.price ? parseFloat(productData.price) : null
        }])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Ürün başarıyla eklendi');
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error('Ürün eklenirken hata oluştu');
      console.error(error);
    }
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, productData }: { id: string, productData: any }) => {
      const { data, error } = await supabase
        .from('products')
        .update({
          ...productData,
          price: productData.price ? parseFloat(productData.price) : null
        })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Ürün başarıyla güncellendi');
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error('Ürün güncellenirken hata oluştu');
      console.error(error);
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .update({ is_active: false })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Ürün başarıyla silindi');
    },
    onError: (error) => {
      toast.error('Ürün silinirken hata oluştu');
      console.error(error);
    }
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (categoryData: any) => {
      const { data, error } = await supabase
        .from('categories')
        .insert([categoryData])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Kategori başarıyla eklendi');
      setIsCategoryDialogOpen(false);
      setCategoryFormData({ name: '', description: '' });
    },
    onError: (error) => {
      toast.error('Kategori eklenirken hata oluştu');
      console.error(error);
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category_id: '',
      image_url: '',
      is_campaign: false
    });
    setEditingProduct(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, productData: formData });
    } else {
      createProductMutation.mutate(formData);
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price?.toString() || '',
      category_id: product.category_id || '',
      image_url: product.image_url || '',
      is_campaign: product.is_campaign || false
    });
    setIsDialogOpen(true);
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCategoryMutation.mutate(categoryFormData);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      deleteProductMutation.mutate(id);
    }
  };

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
        <section className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
          <img 
            src={productsBanner} 
            alt="Ürünlerimiz Banner" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center px-4">
            <div className="text-center text-white">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 md:mb-4">Ürünlerimiz</h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl">İhtiyaçlarınıza özel teknoloji çözümleri</p>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 lg:py-20 bg-secondary">
          <div className="container mx-auto px-4">
            {isAdmin && (
              <div className="mb-8 flex justify-end gap-3">
                <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <FolderPlus className="h-4 w-4 mr-2" />
                      Yeni Kategori Ekle
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-secondary border-white/20">
                    <DialogHeader>
                      <DialogTitle className="text-white">Yeni Kategori Ekle</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCategorySubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="category-name" className="text-white">Kategori Adı</Label>
                        <Input
                          id="category-name"
                          value={categoryFormData.name}
                          onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                          className="bg-white/10 border-white/20 text-white"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="category-description" className="text-white">Açıklama</Label>
                        <Textarea
                          id="category-description"
                          value={categoryFormData.description}
                          onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                          className="bg-white/10 border-white/20 text-white"
                          rows={2}
                        />
                      </div>
                      <div className="flex gap-3">
                        <Button 
                          type="submit" 
                          className="flex-1"
                          disabled={createCategoryMutation.isPending}
                        >
                          Ekle
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsCategoryDialogOpen(false)}
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          İptal
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={() => {
                        resetForm();
                        setIsDialogOpen(true);
                      }}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Yeni Ürün Ekle
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-secondary border-white/20">
                    <DialogHeader>
                      <DialogTitle className="text-white">
                        {editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name" className="text-white">Ürün Adı</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="bg-white/10 border-white/20 text-white"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="description" className="text-white">Açıklama</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="bg-white/10 border-white/20 text-white"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="price" className="text-white">Fiyat (₺)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category" className="text-white">Kategori</Label>
                        <Select
                          value={formData.category_id}
                          onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                        >
                          <SelectTrigger className="bg-white/10 border-white/20 text-white">
                            <SelectValue placeholder="Kategori seçin" />
                          </SelectTrigger>
                          <SelectContent className="bg-secondary border-white/20 z-50">
                            {categories?.map((category) => (
                              <SelectItem 
                                key={category.id} 
                                value={category.id}
                                className="text-white hover:bg-white/20 focus:bg-white/20"
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="is_campaign"
                          checked={formData.is_campaign}
                          onChange={(e) => setFormData({ ...formData, is_campaign: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <Label htmlFor="is_campaign" className="text-white cursor-pointer">
                          Kampanyalı Ürün
                        </Label>
                      </div>
                      <div>
                        <Label htmlFor="image_url" className="text-white">Görsel URL</Label>
                        <Input
                          id="image_url"
                          type="url"
                          value={formData.image_url}
                          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                      <div className="flex gap-3">
                        <Button 
                          type="submit" 
                          className="flex-1"
                          disabled={createProductMutation.isPending || updateProductMutation.isPending}
                        >
                          {editingProduct ? 'Güncelle' : 'Ekle'}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsDialogOpen(false)}
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          İptal
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            )}

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
                      {product.category && (
                        <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                          {product.category.name}
                        </Badge>
                      )}
                      {product.is_campaign && (
                        <Badge className="absolute top-4 right-4 bg-red-500 text-white">
                          Kampanya
                        </Badge>
                      )}
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
                      {!isAdmin ? (
                        <Button className="bg-gradient-hero hover:shadow-tech transition-bounce">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          İletişim
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button 
                            size="icon" 
                            variant="outline"
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                            onClick={() => handleEdit(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="outline"
                            className="bg-red-500/20 border-red-500/40 text-red-300 hover:bg-red-500/30"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
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