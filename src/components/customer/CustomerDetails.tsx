import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Laptop, Calendar, Package, DollarSign, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import PrintReceipt from "./PrintReceipt";

interface Device {
  id: string;
  device_type: string;
  device_problem: string;
  received_date: string;
  status: string;
  delivery_date?: string;
  return_date?: string;
  warranty_sent_date?: string;
  waiting_days?: number;
  materials: Array<{
    id: string;
    material_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }>;
}

interface CustomerDetailsProps {
  customer: {
    customer_number: string;
    customer_name: string;
    phone_number: string;
  };
  devices: Device[];
  customerId: string;
  onStatusUpdate: () => void;
}

const statusConfig = {
  pending: { label: "Beklemede", icon: Clock, color: "bg-yellow-500" },
  completed: { label: "Sorun Giderildi", icon: CheckCircle, color: "bg-green-500" },
  returned: { label: "İade Edildi", icon: XCircle, color: "bg-red-500" },
  waiting_parts: { label: "Parça Bekleniyor", icon: Package, color: "bg-orange-500" },
  warranty: { label: "Garanti Kapsamında", icon: AlertCircle, color: "bg-blue-500" }
};

const deviceTypeLabels: Record<string, string> = {
  laptop: "Laptop",
  desktop: "Masaüstü",
  printer: "Yazıcı",
  all_in_one: "All-in-One PC",
  server: "Sunucu",
  network_device: "Ağ Cihazı",
  other: "Diğer"
};

const CustomerDetails = ({ customer, devices, customerId, onStatusUpdate }: CustomerDetailsProps) => {
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const handleStatusChange = async (deviceId: string, newStatus: string) => {
    setUpdatingStatus(deviceId);
    try {
      const { error } = await supabase
        .from('customer_devices')
        .update({ status: newStatus })
        .eq('id', deviceId);

      if (error) throw error;

      // Log the status change
      await supabase.from('customer_logs').insert({
        customer_id: customerId,
        action: 'status_updated',
        details: { device_id: deviceId, new_status: newStatus },
        performed_by: (await supabase.auth.getUser()).data.user?.id
      });

      toast.success("Durum güncellendi");
      onStatusUpdate();
    } catch (error) {
      console.error('Status update error:', error);
      toast.error("Durum güncellenirken hata oluştu");
    } finally {
      setUpdatingStatus(null);
    }
  };

  if (devices.length === 0) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-4">
          <p className="text-gray-400 text-center">Bu müşteriye ait cihaz kaydı bulunmamaktadır.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 mt-4">
      {devices.map((device) => {
        const StatusIcon = statusConfig[device.status as keyof typeof statusConfig]?.icon || Clock;
        const statusLabel = statusConfig[device.status as keyof typeof statusConfig]?.label || device.status;
        const statusColor = statusConfig[device.status as keyof typeof statusConfig]?.color || "bg-gray-500";

        return (
          <Card key={device.id} className="bg-white/5 border-white/10">
            <CardHeader>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <Laptop className="h-5 w-5" />
                    {deviceTypeLabels[device.device_type] || device.device_type}
                  </CardTitle>
                  <div className="flex items-center gap-2 flex-wrap">
                    <PrintReceipt
                      customer={customer}
                      device={device}
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusIcon className={`h-5 w-5 text-white ${statusColor} rounded-full p-1`} />
                  <Select
                    value={device.status}
                    onValueChange={(value) => handleStatusChange(device.id, value)}
                    disabled={updatingStatus === device.id}
                  >
                    <SelectTrigger className="w-[200px] bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-secondary border-white/20">
                      {Object.entries(statusConfig).map(([key, { label }]) => (
                        <SelectItem key={key} value={key} className="text-white hover:bg-white/10">
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-400 mb-1">Sorun:</p>
                <p className="text-white">{device.device_problem}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Alındığı Tarih: {new Date(device.received_date).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                {device.status === 'completed' && device.delivery_date && (
                  <div className="flex items-center gap-2 text-sm text-green-300">
                    <CheckCircle className="h-4 w-4" />
                    <span>
                      Teslim Tarihi: {new Date(device.delivery_date).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                )}

                {device.status === 'returned' && device.return_date && (
                  <div className="flex items-center gap-2 text-sm text-red-300">
                    <XCircle className="h-4 w-4" />
                    <span>
                      İade Tarihi: {new Date(device.return_date).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                )}

                {device.status === 'warranty' && device.warranty_sent_date && (
                  <div className="flex items-center gap-2 text-sm text-blue-300">
                    <AlertCircle className="h-4 w-4" />
                    <span>
                      Garantiye Gönderilme: {new Date(device.warranty_sent_date).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                )}

                {device.status === 'waiting_parts' && device.waiting_days && (
                  <div className="flex items-center gap-2 text-sm text-orange-300">
                    <Clock className="h-4 w-4" />
                    <span>Parça Bekleme Süresi: {device.waiting_days} gün</span>
                  </div>
                )}
              </div>

              {device.materials && device.materials.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Malzemeler:
                  </p>
                  <div className="space-y-2">
                    {device.materials.map((material) => (
                      <div key={material.id} className="flex justify-between items-center bg-white/5 p-2 rounded">
                        <div className="flex-1">
                          <p className="text-white">{material.material_name}</p>
                          <p className="text-xs text-gray-400">
                            Adet: {material.quantity} x ₺{material.unit_price.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-semibold flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            ₺{material.total_price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-end pt-2 border-t border-white/10">
                      <p className="text-lg font-bold text-white">
                        Toplam: ₺{device.materials.reduce((sum, m) => sum + m.total_price, 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CustomerDetails;
