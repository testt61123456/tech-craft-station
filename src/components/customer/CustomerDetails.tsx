import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Laptop, Calendar, Package, DollarSign, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import PrintReceipt from "./PrintReceipt";
import StatusUpdateDialog from "./StatusUpdateDialog";

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
  pending: { label: "Beklemede", icon: Clock, color: "bg-yellow-500/80" },
  completed: { label: "Sorun Giderildi", icon: CheckCircle, color: "bg-emerald-500/80" },
  returned: { label: "İade Edildi", icon: XCircle, color: "bg-red-500/80" },
  waiting_parts: { label: "Parça Bekleniyor", icon: Package, color: "bg-orange-500/80" },
  warranty: { label: "Garanti Kapsamında", icon: AlertCircle, color: "bg-blue-500/80" }
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
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const handleStatusChange = async (deviceId: string, newStatus: string) => {
    if (newStatus === 'pending') {
      setUpdatingStatus(deviceId);
      try {
        const { error } = await supabase
          .from('customer_devices')
          .update({ status: newStatus })
          .eq('id', deviceId);

        if (error) throw error;

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
    } else {
      setSelectedDeviceId(deviceId);
      setSelectedStatus(newStatus);
      setStatusDialogOpen(true);
    }
  };

  if (devices.length === 0) {
    return (
      <Card className="bg-zinc-900/80 border border-zinc-700/50 ml-4 mt-2">
        <CardContent className="p-3">
          <p className="text-gray-400 text-center text-sm">Bu müşteriye ait cihaz kaydı bulunmamaktadır.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-2 mt-2 ml-4">
        {devices.map((device) => {
          const StatusIcon = statusConfig[device.status as keyof typeof statusConfig]?.icon || Clock;
          const statusLabel = statusConfig[device.status as keyof typeof statusConfig]?.label || device.status;

          return (
            <Card key={device.id} className="bg-zinc-900/80 border border-zinc-700/50">
              <CardHeader className="border-b border-zinc-700/30 py-2 px-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <CardTitle className="text-sm text-white flex items-center gap-2">
                    <Laptop className="h-4 w-4 text-red-400" />
                    {deviceTypeLabels[device.device_type] || device.device_type}
                  </CardTitle>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Select
                      value={device.status}
                      onValueChange={(value) => handleStatusChange(device.id, value)}
                      disabled={updatingStatus === device.id}
                    >
                      <SelectTrigger className="w-[160px] h-7 text-xs bg-zinc-800 border-zinc-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-600">
                        {Object.entries(statusConfig).map(([key, { label }]) => (
                          <SelectItem key={key} value={key} className="text-white text-xs hover:bg-zinc-700">
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <PrintReceipt customer={customer} device={device} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-3 space-y-2">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Sorun:</p>
                  <p className="text-white text-sm">{device.device_problem}</p>
                </div>
                
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Calendar className="h-3 w-3" />
                    <span>Alındı: {new Date(device.received_date).toLocaleDateString('tr-TR')}</span>
                  </div>

                  {device.status === 'completed' && device.delivery_date && (
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle className="h-3 w-3" />
                      <span>Teslim: {new Date(device.delivery_date).toLocaleDateString('tr-TR')}</span>
                    </div>
                  )}

                  {device.status === 'returned' && device.return_date && (
                    <div className="flex items-center gap-1.5 text-red-400">
                      <XCircle className="h-3 w-3" />
                      <span>İade: {new Date(device.return_date).toLocaleDateString('tr-TR')}</span>
                    </div>
                  )}

                  {device.status === 'warranty' && device.warranty_sent_date && (
                    <div className="flex items-center gap-1.5 text-blue-400">
                      <AlertCircle className="h-3 w-3" />
                      <span>Garanti: {new Date(device.warranty_sent_date).toLocaleDateString('tr-TR')}</span>
                    </div>
                  )}

                  {device.status === 'waiting_parts' && device.waiting_days && (
                    <div className="flex items-center gap-1.5 text-orange-400">
                      <Clock className="h-3 w-3" />
                      <span>Bekleme: {device.waiting_days} gün</span>
                    </div>
                  )}
                </div>

                {device.materials && device.materials.length > 0 && (
                  <div className="pt-2 border-t border-zinc-700/30">
                    <p className="text-xs text-gray-500 mb-1.5 flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      Malzemeler:
                    </p>
                    <div className="space-y-1">
                      {device.materials.map((material) => (
                        <div key={material.id} className="flex justify-between items-center bg-zinc-800/50 p-1.5 rounded text-xs">
                          <div className="flex-1 min-w-0">
                            <p className="text-white truncate">{material.material_name}</p>
                            <p className="text-gray-500">{material.quantity} × ₺{material.unit_price.toFixed(2)}</p>
                          </div>
                          <Badge variant="outline" className="text-xs text-red-400 border-red-500/30 bg-red-500/10">
                            ₺{material.total_price.toFixed(2)}
                          </Badge>
                        </div>
                      ))}
                      <div className="flex justify-end pt-1.5 border-t border-zinc-700/30">
                        <p className="text-sm font-bold text-white">
                          Toplam: <span className="text-red-400">₺{device.materials.reduce((sum, m) => sum + m.total_price, 0).toFixed(2)}</span>
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

      {selectedDeviceId && (
        <StatusUpdateDialog
          open={statusDialogOpen}
          onOpenChange={setStatusDialogOpen}
          deviceId={selectedDeviceId}
          customerId={customerId}
          newStatus={selectedStatus}
          onSuccess={() => {
            onStatusUpdate();
            setSelectedDeviceId(null);
            setSelectedStatus("");
          }}
        />
      )}
    </>
  );
};

export default CustomerDetails;
