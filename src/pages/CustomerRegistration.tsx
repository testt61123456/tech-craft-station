import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash2, Save } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";

const deviceTypes = [
  { value: 'laptop', label: 'Laptop' },
  { value: 'desktop', label: 'Masaüstü' },
  { value: 'printer', label: 'Yazıcı' },
  { value: 'all_in_one', label: 'All-in-One PC' },
  { value: 'server', label: 'Sunucu' },
  { value: 'network_device', label: 'Ağ Cihazı' },
  { value: 'other', label: 'Diğer' }
];

const customerSchema = z.object({
  customerName: z.string().trim().min(2, "Müşteri adı en az 2 karakter olmalıdır").max(100),
  phoneNumber: z.string().trim().min(10, "Geçerli bir telefon numarası girin").max(20),
});

interface Material {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

interface Device {
  id: string;
  type: string;
  problem: string;
  receivedDate: Date;
  materials: Material[];
}

const CustomerRegistration = () => {
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [devices, setDevices] = useState<Device[]>([{
    id: crypto.randomUUID(),
    type: "",
    problem: "",
    receivedDate: new Date(),
    materials: []
  }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const addDevice = () => {
    setDevices([...devices, {
      id: crypto.randomUUID(),
      type: "",
      problem: "",
      receivedDate: new Date(),
      materials: []
    }]);
  };

  const removeDevice = (deviceId: string) => {
    if (devices.length > 1) {
      setDevices(devices.filter(d => d.id !== deviceId));
    }
  };

  const updateDevice = (deviceId: string, field: keyof Device, value: any) => {
    setDevices(devices.map(d => 
      d.id === deviceId ? { ...d, [field]: value } : d
    ));
  };

  const addMaterial = (deviceId: string) => {
    setDevices(devices.map(d => 
      d.id === deviceId 
        ? { 
            ...d, 
            materials: [...d.materials, { 
              id: crypto.randomUUID(), 
              name: "", 
              quantity: 1, 
              unitPrice: 0 
            }] 
          }
        : d
    ));
  };

  const removeMaterial = (deviceId: string, materialId: string) => {
    setDevices(devices.map(d => 
      d.id === deviceId 
        ? { ...d, materials: d.materials.filter(m => m.id !== materialId) }
        : d
    ));
  };

  const updateMaterial = (deviceId: string, materialId: string, field: keyof Material, value: any) => {
    setDevices(devices.map(d => 
      d.id === deviceId 
        ? { 
            ...d, 
            materials: d.materials.map(m => 
              m.id === materialId ? { ...m, [field]: value } : m
            )
          }
        : d
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Form validasyonu
      const validatedData = customerSchema.parse({
        customerName,
        phoneNumber
      });

      // Cihaz validasyonu
      const invalidDevice = devices.find(d => !d.type || !d.problem.trim());
      if (invalidDevice) {
        toast.error("Tüm cihazların tipini ve sorununu girmelisiniz");
        setIsSubmitting(false);
        return;
      }

      // Müşteri kaydı oluştur
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .insert([{
          customer_name: validatedData.customerName,
          phone_number: validatedData.phoneNumber,
          created_by: user.id
        }])
        .select()
        .single();

      if (customerError) throw customerError;

      // Cihazları kaydet
      for (const device of devices) {
        const { data: savedDevice, error: deviceError } = await supabase
          .from('customer_devices')
          .insert([{
            customer_id: customer.id,
            device_type: device.type as any,
            device_problem: device.problem.trim(),
            received_date: device.receivedDate.toISOString(),
            status: 'pending'
          }])
          .select()
          .single();

        if (deviceError) throw deviceError;

        // Malzemeleri kaydet
        if (device.materials.length > 0) {
          const materialsData = device.materials
            .filter(m => m.name.trim())
            .map(m => ({
              device_id: savedDevice.id,
              material_name: m.name.trim(),
              quantity: m.quantity,
              unit_price: m.unitPrice,
              total_price: m.quantity * m.unitPrice
            }));

          if (materialsData.length > 0) {
            const { error: materialsError } = await supabase
              .from('materials')
              .insert(materialsData);

            if (materialsError) throw materialsError;
          }
        }
      }

      toast.success("Müşteri kaydı başarıyla oluşturuldu!");
      
      // Formu sıfırla
      setCustomerName("");
      setPhoneNumber("");
      setDevices([{
        id: crypto.randomUUID(),
        type: "",
        problem: "",
        receivedDate: new Date(),
        materials: []
      }]);

    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        console.error('Kayıt hatası:', error);
        toast.error("Kayıt sırasında bir hata oluştu");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary">
      <Header />
      
      <main className="py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4">
              Müşteri Kayıt
            </h1>
            <p className="text-base md:text-lg text-gray-300">
              Yeni müşteri ve cihaz kaydı oluşturun
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Müşteri Bilgileri */}
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl text-white">Müşteri Bilgileri</CardTitle>
                <CardDescription className="text-gray-300">
                  Müşterinin temel bilgilerini girin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="customerName" className="text-white">Müşteri Adı *</Label>
                  <Input
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Örn: Ahmet Yılmaz"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phoneNumber" className="text-white">Telefon Numarası *</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Örn: 0532 123 45 67"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Cihazlar */}
            {devices.map((device, deviceIndex) => (
              <Card key={device.id} className="bg-white/10 backdrop-blur-sm border border-white/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg md:text-xl text-white">
                        Cihaz #{deviceIndex + 1}
                      </CardTitle>
                      <CardDescription className="text-gray-300">
                        Cihaz bilgilerini ve malzemelerini girin
                      </CardDescription>
                    </div>
                    {devices.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeDevice(device.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">Cihaz Tipi *</Label>
                      <Select
                        value={device.type}
                        onValueChange={(value) => updateDevice(device.id, 'type', value)}
                        required
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Cihaz tipini seçin" />
                        </SelectTrigger>
                        <SelectContent className="bg-secondary border-white/20">
                          {deviceTypes.map((type) => (
                            <SelectItem 
                              key={type.value} 
                              value={type.value}
                              className="text-white hover:bg-white/10"
                            >
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-white">Alındığı Tarih *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal bg-white/10 border-white/20 text-white hover:bg-white/20",
                              !device.receivedDate && "text-gray-400"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {device.receivedDate ? (
                              format(device.receivedDate, "PPP", { locale: tr })
                            ) : (
                              <span>Tarih seçin</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-secondary border-white/20" align="start">
                          <Calendar
                            mode="single"
                            selected={device.receivedDate}
                            onSelect={(date) => date && updateDevice(device.id, 'receivedDate', date)}
                            initialFocus
                            locale={tr}
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div>
                    <Label className="text-white">Cihazın Sorunu *</Label>
                    <Textarea
                      value={device.problem}
                      onChange={(e) => updateDevice(device.id, 'problem', e.target.value)}
                      placeholder="Cihazın sorununu detaylı açıklayın..."
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[100px]"
                      required
                    />
                  </div>

                  {/* Malzemeler */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-white">Malzemeler</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addMaterial(device.id)}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Malzeme Ekle
                      </Button>
                    </div>

                    {device.materials.map((material, materialIndex) => (
                      <Card key={material.id} className="bg-white/5 border-white/10">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-3">
                              <div className="sm:col-span-2">
                                <Input
                                  value={material.name}
                                  onChange={(e) => updateMaterial(device.id, material.id, 'name', e.target.value)}
                                  placeholder="Malzeme adı"
                                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                                />
                              </div>
                              <div>
                                <Input
                                  type="number"
                                  min="1"
                                  value={material.quantity}
                                  onChange={(e) => updateMaterial(device.id, material.id, 'quantity', parseInt(e.target.value) || 1)}
                                  placeholder="Adet"
                                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                                />
                              </div>
                              <div>
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={material.unitPrice}
                                  onChange={(e) => updateMaterial(device.id, material.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                                  placeholder="Birim Fiyat"
                                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                                />
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeMaterial(device.id, material.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          {material.quantity > 0 && material.unitPrice > 0 && (
                            <div className="text-right mt-2 text-sm text-gray-300">
                              Toplam: ₺{(material.quantity * material.unitPrice).toFixed(2)}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={addDevice}
                className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Plus className="h-4 w-4 mr-2" />
                Yeni Cihaz Ekle
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-hero hover:shadow-tech"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CustomerRegistration;