import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Loader2, Search, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import CustomerCard from "@/components/customer/CustomerCard";
import CustomerDetails from "@/components/customer/CustomerDetails";
import CustomerFormDialog from "@/components/customer/CustomerFormDialog";
import DeleteConfirmDialog from "@/components/customer/DeleteConfirmDialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

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
  const [customerDeviceStatuses, setCustomerDeviceStatuses] = useState<Record<string, Array<{ id: string; status: string }>>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [overdueDevices, setOverdueDevices] = useState<Array<{id: string, customer_name: string, days: number}>>([]);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    if (user && (userRole === 'admin' || userRole === 'superadmin')) {
      fetchCustomers();
      requestNotificationPermission();
      setupDeviceStatusSubscription();
      checkOverdueDevices();
      
      // Her 2 saatte bir kontrol et
      const interval = setInterval(checkOverdueDevices, 2 * 60 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [user, userRole]);

  // customers değiştiğinde filteredCustomers'ı güncelle (arama yoksa)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCustomers(customers);
    }
  }, [customers, searchQuery]);

  // Arama işlemi
  useEffect(() => {
    if (!searchQuery.trim()) {
      return;
    }

    // Veritabanında arama yap
    const searchDatabase = async () => {
      const query = searchQuery.toLowerCase().trim();
      try {
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .or(`customer_number.ilike.%${query}%,customer_name.ilike.%${query}%,phone_number.ilike.%${query}%`)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;
        
        setFilteredCustomers(data || []);
        
        // Bulunan müşterilerin cihaz durumlarını da yükle
        if (data && data.length > 0) {
          const customerIds = data.map(c => c.id);
          const { data: allDevices, error: devicesError } = await supabase
            .from('customer_devices')
            .select('id, customer_id, status')
            .in('customer_id', customerIds);

          if (!devicesError && allDevices) {
            const devicesByCustomer = allDevices.reduce((acc, device) => {
              if (!acc[device.customer_id]) {
                acc[device.customer_id] = [];
              }
              acc[device.customer_id].push({ id: device.id, status: device.status });
              return acc;
            }, {} as Record<string, Array<{ id: string; status: string }>>);

            setCustomerDeviceStatuses(prev => ({
              ...prev,
              ...devicesByCustomer
            }));
          }
        }
      } catch (error) {
        console.error('Arama hatası:', error);
      }
    };

    const debounceTimer = setTimeout(searchDatabase, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const fetchCustomers = async (loadMore = false) => {
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
        .from('customers')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      const newCustomers = data || [];
      
      if (loadMore) {
        setCustomers(prev => [...prev, ...newCustomers]);
        setPage(currentPage);
      } else {
        setCustomers(newCustomers);
        setPage(0);
      }

      // Toplam kayıt sayısı yüklenen kayıtlardan fazlaysa daha fazla var demektir
      const totalLoaded = loadMore ? (currentPage + 1) * ITEMS_PER_PAGE : ITEMS_PER_PAGE;
      setHasMore((count || 0) > totalLoaded);
      
      // Tüm müşterilerin cihazlarını yükle (sadece id ve status)
      if (data && data.length > 0) {
        const customerIds = data.map(c => c.id);
        const { data: allDevices, error: devicesError } = await supabase
          .from('customer_devices')
          .select('id, customer_id, status')
          .in('customer_id', customerIds);

        if (!devicesError && allDevices) {
          const devicesByCustomer = allDevices.reduce((acc, device) => {
            if (!acc[device.customer_id]) {
              acc[device.customer_id] = [];
            }
            acc[device.customer_id].push({ id: device.id, status: device.status });
            return acc;
          }, {} as Record<string, Array<{ id: string; status: string }>>);

          setCustomerDeviceStatuses(prev => ({
            ...prev,
            ...devicesByCustomer
          }));
        }
      }
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
      
      // Kartlardaki durum simgelerini de güncelle
      setCustomerDeviceStatuses(prev => ({
        ...prev,
        [customerId]: devicesWithMaterials.map(d => ({ id: d.id, status: d.status }))
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

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  const showNotification = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/favicon.ico' });
    }
    toast.info(title, { description: body });
  };

  const setupDeviceStatusSubscription = () => {
    const channel = supabase
      .channel('device-status-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'customer_devices'
        },
        (payload) => {
          checkOverdueDevices();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'customer_devices'
        },
        (payload) => {
          checkOverdueDevices();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const checkOverdueDevices = async () => {
    try {
      const { data: devices, error } = await supabase
        .from('customer_devices')
        .select(`
          id,
          received_date,
          status,
          customer_id,
          customers!inner(customer_name)
        `)
        .eq('status', 'pending');

      if (error) throw error;

      const now = new Date();
      const overdue: Array<{id: string, customer_name: string, days: number}> = [];
      
      devices?.forEach((device: any) => {
        const receivedDate = new Date(device.received_date);
        const daysDiff = Math.floor((now.getTime() - receivedDate.getTime()) / (1000 * 60 * 60 * 24));
        
        // 7 gün kontrolü
        const lastNotified7 = localStorage.getItem(`notified_7_${device.id}`);
        if (daysDiff >= 7 && !lastNotified7) {
          overdue.push({
            id: device.id,
            customer_name: device.customers.customer_name,
            days: daysDiff
          });
          localStorage.setItem(`notified_7_${device.id}`, now.toISOString());
          showNotification(
            '7 Günlük Bekleyen Cihaz',
            `${device.customers.customer_name} müşterisinin cihazı ${daysDiff} gündür bekliyor`
          );
        }
        
      // 15 gün kontrolü (7 gün sonra)
      if (daysDiff >= 15) {
        const lastNotified15 = localStorage.getItem(`notified_15_${device.id}`);
        const lastNotified7Date = lastNotified7 ? new Date(lastNotified7) : null;
        const daysSinceLastNotification = lastNotified7Date 
          ? Math.floor((now.getTime() - lastNotified7Date.getTime()) / (1000 * 60 * 60 * 24))
          : 0;
        
        if (daysSinceLastNotification >= 8 && !lastNotified15) {
          localStorage.setItem(`notified_15_${device.id}`, now.toISOString());
          showNotification(
            '15 Günlük Bekleyen Cihaz - Acil!',
            `${device.customers.customer_name} müşterisinin cihazı ${daysDiff} gündür bekliyor!`
          );
        }
      }

      // 7 gün veya daha fazla bekleyen cihazları listeye ekle
      if (daysDiff >= 7) {
        overdue.push({
          id: device.id,
          customer_name: device.customers.customer_name,
          days: daysDiff
        });
      }
      });

      setOverdueDevices(overdue);
    } catch (error) {
      console.error('Bekleyen cihazlar kontrol edilirken hata:', error);
    }
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
            {overdueDevices.length > 0 && (
              <Alert className="bg-destructive/10 border-destructive/50">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <AlertDescription className="text-white">
                  <strong>{overdueDevices.length} cihaz 7 günden fazla bekliyor:</strong>
                  <ul className="mt-2 space-y-1">
                    {overdueDevices.slice(0, 3).map(device => (
                      <li key={device.id}>
                        {device.customer_name} - {device.days} gün
                      </li>
                    ))}
                    {overdueDevices.length > 3 && (
                      <li className="text-gray-300">ve {overdueDevices.length - 3} tane daha...</li>
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
            
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
              <div className="grid grid-cols-1 gap-4">
                {filteredCustomers.map((customer) => (
                  <div 
                    key={customer.id} 
                    className={cn(
                      "space-y-2 transition-all duration-500 ease-in-out",
                      expandedCustomerId === customer.id && "animate-scale-in"
                    )}
                  >
                    <div className="transform transition-transform duration-300 hover:scale-[1.01]">
                      <CustomerCard
                        customer={customer}
                        devices={customerDeviceStatuses[customer.id]}
                        isExpanded={expandedCustomerId === customer.id}
                        onToggle={() => handleToggleExpand(customer.id)}
                        onEdit={() => handleEdit(customer)}
                        onDelete={() => handleDelete(customer)}
                      />
                    </div>
                    {expandedCustomerId === customer.id && (
                      <div className="animate-fade-in">
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
                      </div>
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