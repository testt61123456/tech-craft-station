import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import ServiceCard from "@/components/service/ServiceCard";
import ServiceDetails from "@/components/service/ServiceDetails";
import ServiceFormDialog from "@/components/service/ServiceFormDialog";
import DeleteConfirmDialog from "@/components/customer/DeleteConfirmDialog";

interface ServiceRecord {
  id: string;
  company_name: string;
  customer_name: string;
  phone_number: string;
  address: string;
  description?: string;
  service_date: string;
  status: string;
  signature_data?: string;
  created_at: string;
}

interface ServiceMaterial {
  id: string;
  material_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

const ServiceRecords = () => {
  const navigate = useNavigate();
  const { user, userRole, loading: authLoading } = useAuth();
  
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServiceRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);
  const [serviceMaterials, setServiceMaterials] = useState<Record<string, ServiceMaterial[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceRecord | null>(null);
  const [editService, setEditService] = useState<ServiceRecord | null>(null);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    if (!authLoading && user && (userRole === 'admin' || userRole === 'superadmin')) {
      fetchServices();
    }
  }, [user, userRole, authLoading]);

  // services değiştiğinde filteredServices'ı güncelle (arama yoksa)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredServices(services);
    }
  }, [services, searchQuery]);

  // Arama işlemi - veritabanında ara
  useEffect(() => {
    if (!searchQuery.trim()) {
      return;
    }

    const searchDatabase = async () => {
      const query = searchQuery.toLowerCase().trim();
      try {
        const { data, error } = await supabase
          .from('service_records')
          .select('*')
          .or(`company_name.ilike.%${query}%,customer_name.ilike.%${query}%,phone_number.ilike.%${query}%,address.ilike.%${query}%`)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;
        setFilteredServices(data || []);
      } catch (error) {
        console.error('Arama hatası:', error);
      }
    };

    const debounceTimer = setTimeout(searchDatabase, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const fetchServices = async (loadMore = false) => {
    try {
      if (loadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      const currentPage = loadMore ? page + 1 : 0;
      const from = currentPage * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error, count } = await supabase
        .from('service_records')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      const newServices = data || [];
      
      if (loadMore) {
        setServices(prev => [...prev, ...newServices]);
        setPage(currentPage);
      } else {
        setServices(newServices);
        setPage(0);
      }

      const totalLoaded = loadMore ? (currentPage + 1) * ITEMS_PER_PAGE : ITEMS_PER_PAGE;
      setHasMore((count || 0) > totalLoaded);
    } catch (error) {
      console.error('Servis kayıtları yüklenirken hata:', error);
      toast.error("Servis kayıtları yüklenirken hata oluştu");
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    fetchServices(true);
  };

  const fetchServiceMaterials = async (serviceId: string) => {
    try {
      const { data, error } = await supabase
        .from('service_materials')
        .select('*')
        .eq('service_id', serviceId);

      if (error) throw error;

      setServiceMaterials(prev => ({
        ...prev,
        [serviceId]: data || []
      }));
    } catch (error) {
      console.error('Malzemeler yüklenirken hata:', error);
      toast.error("Malzeme bilgileri yüklenirken hata oluştu");
    }
  };

  const handleToggleExpand = async (serviceId: string) => {
    if (expandedServiceId === serviceId) {
      setExpandedServiceId(null);
    } else {
      setExpandedServiceId(serviceId);
      if (!serviceMaterials[serviceId]) {
        await fetchServiceMaterials(serviceId);
      }
    }
  };

  const handleEdit = async (service: ServiceRecord) => {
    // Malzemeleri yükle
    if (!serviceMaterials[service.id]) {
      await fetchServiceMaterials(service.id);
    }
    
    setEditService({
      ...service,
      materials: serviceMaterials[service.id] || []
    } as any);
    setFormDialogOpen(true);
  };

  const handleDelete = (service: ServiceRecord) => {
    setSelectedService(service);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedService) return;

    try {
      const { error } = await supabase
        .from('service_records')
        .delete()
        .eq('id', selectedService.id);

      if (error) throw error;

      toast.success("Servis kaydı silindi");
      setDeleteDialogOpen(false);
      setSelectedService(null);
      fetchServices();
    } catch (error) {
      console.error('Silme hatası:', error);
      toast.error("Servis kaydı silinirken hata oluştu");
    }
  };

  // Auth yüklenirken bekle
  if (authLoading) {
    return (
      <div className="min-h-screen bg-secondary">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!user || (userRole !== 'admin' && userRole !== 'superadmin')) {
    return (
      <div className="min-h-screen bg-secondary">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Erişim Engellendi</h1>
          <p className="text-gray-300 mb-8">Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
          <Button onClick={() => navigate("/")}>Ana Sayfaya Dön</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />
      
      <main className="py-6 md:py-10">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                  Servis Kayıtları
                </h1>
                <p className="text-sm text-gray-400">
                  Servis kayıtlarını görüntüleyin ve yönetin
                </p>
              </div>
              <Button
                onClick={() => {
                  setEditService(null);
                  setFormDialogOpen(true);
                }}
                className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20"
              >
                <Plus className="h-4 w-4 mr-2" />
                Yeni Servis Kaydı
              </Button>
            </div>

            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Servis ara (kurum, müşteri, telefon)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 bg-zinc-900 border-zinc-700 text-white placeholder:text-gray-500 focus:border-red-500/50 focus:ring-red-500/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-red-400" />
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 mb-4">Henüz servis kaydı bulunmamaktadır.</p>
              <Button
                onClick={() => setFormDialogOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                İlk Servis Kaydını Oluştur
              </Button>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 mb-4">Arama sonucu bulunamadı.</p>
              <Button
                onClick={() => setSearchQuery("")}
                variant="outline"
                className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
              >
                Aramayı Temizle
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredServices.map((service) => (
                <div 
                  key={service.id} 
                  className="transition-all duration-300 ease-in-out"
                >
                  <ServiceCard
                    service={service}
                    isExpanded={expandedServiceId === service.id}
                    onToggle={() => handleToggleExpand(service.id)}
                    onEdit={() => handleEdit(service)}
                    onDelete={() => handleDelete(service)}
                  />
                  {expandedServiceId === service.id && (
                    <div className="animate-fade-in">
                      <ServiceDetails
                        service={service}
                        materials={serviceMaterials[service.id] || []}
                      />
                    </div>
                  )}
                </div>
              ))}
              
              {/* Daha Fazla Yükle */}
              {hasMore && !searchQuery && (
                <div className="flex justify-center pt-4">
                  <Button
                    onClick={handleLoadMore}
                    variant="outline"
                    className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
                    disabled={isLoadingMore}
                  >
                    {isLoadingMore ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Yükleniyor...
                      </>
                    ) : (
                      "Daha Fazla Yükle"
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <ServiceFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        onSuccess={() => {
          fetchServices();
          setEditService(null);
        }}
        editData={editService}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        customerName={selectedService?.company_name || ""}
      />

      <Footer />
    </div>
  );
};

export default ServiceRecords;
