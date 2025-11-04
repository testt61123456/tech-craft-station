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
import { cn } from "@/lib/utils";
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
  const { user, userRole } = useAuth();
  
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServiceRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);
  const [serviceMaterials, setServiceMaterials] = useState<Record<string, ServiceMaterial[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceRecord | null>(null);
  const [editService, setEditService] = useState<ServiceRecord | null>(null);

  useEffect(() => {
    if (user && (userRole === 'admin' || userRole === 'superadmin')) {
      fetchServices();
    }
  }, [user, userRole]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredServices(services);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = services.filter(service => 
      service.company_name.toLowerCase().includes(query) ||
      service.customer_name.toLowerCase().includes(query) ||
      service.phone_number.toLowerCase().includes(query) ||
      service.address.toLowerCase().includes(query)
    );
    setFilteredServices(filtered);
  }, [searchQuery, services]);

  const fetchServices = async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('service_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Servis kayıtları yüklenirken hata:', error);
      toast.error("Servis kayıtları yüklenirken hata oluştu");
    } finally {
      setIsLoading(false);
    }
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
    <div className="min-h-screen bg-secondary">
      <Header />
      
      <main className="py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col gap-4 mb-8 md:mb-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                  Servis Kayıtları
                </h1>
                <p className="text-base md:text-lg text-gray-300">
                  Servis kayıtlarını görüntüleyin ve yönetin
                </p>
              </div>
              <Button
                onClick={() => {
                  setEditService(null);
                  setFormDialogOpen(true);
                }}
                className="bg-gradient-hero hover:shadow-tech"
              >
                <Plus className="h-4 w-4 mr-2" />
                Yeni Servis Kaydı
              </Button>
            </div>

            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Servis ara (kurum, müşteri, telefon)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg mb-4">Henüz servis kaydı bulunmamaktadır.</p>
              <Button
                onClick={() => setFormDialogOpen(true)}
                className="bg-gradient-hero hover:shadow-tech"
              >
                <Plus className="h-4 w-4 mr-2" />
                İlk Servis Kaydını Oluştur
              </Button>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg mb-4">Arama sonucu bulunamadı.</p>
              <Button
                onClick={() => setSearchQuery("")}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Aramayı Temizle
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 [grid-auto-flow:dense]">
                {filteredServices.map((service) => (
                  <div 
                    key={service.id} 
                    className={cn(
                      "space-y-2 transition-all duration-500 ease-in-out",
                      expandedServiceId === service.id && "lg:col-span-2 animate-scale-in"
                    )}
                  >
                    <div className="transform transition-transform duration-300 hover:scale-[1.01]">
                      <ServiceCard
                        service={service}
                        isExpanded={expandedServiceId === service.id}
                        onToggle={() => handleToggleExpand(service.id)}
                        onEdit={() => handleEdit(service)}
                        onDelete={() => handleDelete(service)}
                      />
                    </div>
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
              </div>
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
