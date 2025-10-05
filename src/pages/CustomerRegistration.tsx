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
import CustomerCard from "@/components/customer/CustomerCard";
import CustomerDetails from "@/components/customer/CustomerDetails";
import CustomerFormDialog from "@/components/customer/CustomerFormDialog";
import DeleteConfirmDialog from "@/components/customer/DeleteConfirmDialog";

interface Customer {
  id: string;
  customer_number: string;
  customer_name: string;
  phone_number: string;
  created_at: string;
}

interface CustomerDevice {
  id: string;
  device_type: string;
  device_problem: string;
  received_date: string;
  status: string;
  materials: Array<{
    id: string;
    material_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }>;
}

const CustomerRegistration = () => {
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCustomerId, setExpandedCustomerId] = useState<string | null>(null);
  const [customerDevices, setCustomerDevices] = useState<Record<string, CustomerDevice[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);

  const ITEMS_PER_PAGE = 25;

  useEffect(() => {
    if (user && (userRole === 'admin' || userRole === 'superadmin')) {
      fetchCustomers();
    }
  }, [user, userRole]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCustomers(customers);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = customers.filter(customer => 
      customer.customer_number.toLowerCase().includes(query) ||
      customer.customer_name.toLowerCase().includes(query) ||
      customer.phone_number.toLowerCase().includes(query)
    );
    setFilteredCustomers(filtered);
  }, [searchQuery, customers]);

  const fetchCustomers = async (loadMore = false) => {
    try {
      if (loadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      const from = loadMore ? (page + 1) * ITEMS_PER_PAGE : 0;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error, count } = await supabase
        .from('customers')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      if (loadMore) {
        setCustomers(prev => [...prev, ...(data || [])]);
        setPage(prev => prev + 1);
      } else {
        setCustomers(data || []);
        setPage(0);
      }

      setHasMore((count || 0) > (loadMore ? (page + 2) : 1) * ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Müşteriler yüklenirken hata:', error);
      toast.error("Müşteriler yüklenirken hata oluştu");
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const fetchCustomerDevices = async (customerId: string) => {
    try {
      const { data: devices, error: devicesError } = await supabase
        .from('customer_devices')
        .select('*')
        .eq('customer_id', customerId)
        .order('received_date', { ascending: false });

      if (devicesError) throw devicesError;

      const devicesWithMaterials = await Promise.all(
        (devices || []).map(async (device) => {
          const { data: materials, error: materialsError } = await supabase
            .from('materials')
            .select('*')
            .eq('device_id', device.id);

          if (materialsError) throw materialsError;

          return {
            ...device,
            materials: materials || []
          };
        })
      );

      setCustomerDevices(prev => ({
        ...prev,
        [customerId]: devicesWithMaterials
      }));
    } catch (error) {
      console.error('Cihazlar yüklenirken hata:', error);
      toast.error("Cihaz bilgileri yüklenirken hata oluştu");
    }
  };

  const handleToggleExpand = async (customerId: string) => {
    if (expandedCustomerId === customerId) {
      setExpandedCustomerId(null);
    } else {
      setExpandedCustomerId(customerId);
      if (!customerDevices[customerId]) {
        await fetchCustomerDevices(customerId);
      }
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditCustomer(customer);
    setFormDialogOpen(true);
  };

  const handleDelete = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCustomer || !user) return;

    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', selectedCustomer.id);

      if (error) throw error;

      await supabase.from('customer_logs').insert({
        customer_id: selectedCustomer.id,
        action: 'deleted',
        details: { customer_name: selectedCustomer.customer_name },
        performed_by: user.id
      });

      toast.success("Müşteri silindi");
      setDeleteDialogOpen(false);
      setSelectedCustomer(null);
      fetchCustomers();
    } catch (error) {
      console.error('Silme hatası:', error);
      toast.error("Müşteri silinirken hata oluştu");
    }
  };

  const handleLoadMore = () => {
    fetchCustomers(true);
  };

  // Admin kontrolü
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
                  Müşteri Yönetimi
                </h1>
                <p className="text-base md:text-lg text-gray-300">
                  Müşteri kayıtlarını görüntüleyin ve yönetin
                </p>
              </div>
              <Button
                onClick={() => {
                  setEditCustomer(null);
                  setFormDialogOpen(true);
                }}
                className="bg-gradient-hero hover:shadow-tech"
              >
                <Plus className="h-4 w-4 mr-2" />
                Yeni Müşteri Ekle
              </Button>
            </div>

            {/* Arama Çubuğu */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Müşteri ara (numara, isim veya telefon)..."
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
          ) : customers.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg mb-4">Henüz müşteri kaydı bulunmamaktadır.</p>
              <Button
                onClick={() => setFormDialogOpen(true)}
                className="bg-gradient-hero hover:shadow-tech"
              >
                <Plus className="h-4 w-4 mr-2" />
                İlk Müşteri Kaydını Oluştur
              </Button>
            </div>
          ) : filteredCustomers.length === 0 ? (
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredCustomers.map((customer) => (
                  <div key={customer.id} className="space-y-2">
                    <CustomerCard
                      customer={customer}
                      isExpanded={expandedCustomerId === customer.id}
                      onToggle={() => handleToggleExpand(customer.id)}
                      onEdit={() => handleEdit(customer)}
                      onDelete={() => handleDelete(customer)}
                    />
                    {expandedCustomerId === customer.id && (
                      <CustomerDetails
                        customer={{
                          customer_number: customer.customer_number,
                          customer_name: customer.customer_name,
                          phone_number: customer.phone_number
                        }}
                        devices={customerDevices[customer.id] || []}
                        customerId={customer.id}
                        onStatusUpdate={() => fetchCustomerDevices(customer.id)}
                      />
                    )}
                  </div>
                ))}
              </div>

              {!searchQuery && hasMore && (
                <div className="flex justify-center pt-6">
                  <Button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    {isLoadingMore ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Yükleniyor...
                      </>
                    ) : (
                      'Daha Fazla Göster'
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <CustomerFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        onSuccess={() => {
          fetchCustomers();
          setEditCustomer(null);
        }}
        editData={editCustomer}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        customerName={selectedCustomer?.customer_name || ""}
      />

      <Footer />
    </div>
  );
};

export default CustomerRegistration;