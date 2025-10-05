import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Material {
  id: string;
  material_name: string;
  quantity: number;
  unit_price: number;
}

interface StatusUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deviceId: string;
  customerId: string;
  newStatus: string;
  onSuccess: () => void;
}

const StatusUpdateDialog = ({
  open,
  onOpenChange,
  deviceId,
  customerId,
  newStatus,
  onSuccess,
}: StatusUpdateDialogProps) => {
  const [deliveryDate, setDeliveryDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [warrantySentDate, setWarrantySentDate] = useState<Date>();
  const [waitingDays, setWaitingDays] = useState<number>(0);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addMaterial = () => {
    setMaterials([
      ...materials,
      {
        id: crypto.randomUUID(),
        material_name: "",
        quantity: 1,
        unit_price: 0,
      },
    ]);
  };

  const removeMaterial = (id: string) => {
    setMaterials(materials.filter((m) => m.id !== id));
  };

  const updateMaterial = (id: string, field: keyof Material, value: any) => {
    setMaterials(
      materials.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const updateData: any = { status: newStatus };

      if (newStatus === "completed") {
        if (!deliveryDate) {
          toast.error("Teslim tarihini seçin");
          setIsSubmitting(false);
          return;
        }
        if (materials.length === 0 || materials.some((m) => !m.material_name.trim())) {
          toast.error("En az bir malzeme ekleyin");
          setIsSubmitting(false);
          return;
        }
        updateData.delivery_date = deliveryDate.toISOString();
      } else if (newStatus === "returned") {
        if (!returnDate) {
          toast.error("İade tarihini seçin");
          setIsSubmitting(false);
          return;
        }
        updateData.return_date = returnDate.toISOString();
      } else if (newStatus === "waiting_parts") {
        if (!waitingDays || waitingDays <= 0) {
          toast.error("Geçerli bir gün sayısı girin");
          setIsSubmitting(false);
          return;
        }
        updateData.waiting_days = waitingDays;
      } else if (newStatus === "warranty") {
        if (!warrantySentDate) {
          toast.error("Garantiye gönderilme tarihini seçin");
          setIsSubmitting(false);
          return;
        }
        updateData.warranty_sent_date = warrantySentDate.toISOString();
      }

      const { error: deviceError } = await supabase
        .from("customer_devices")
        .update(updateData)
        .eq("id", deviceId);

      if (deviceError) throw deviceError;

      // Malzemeleri kaydet (sadece completed durumunda)
      if (newStatus === "completed" && materials.length > 0) {
        const materialsData = materials
          .filter((m) => m.material_name.trim())
          .map((m) => ({
            device_id: deviceId,
            material_name: m.material_name.trim(),
            quantity: m.quantity,
            unit_price: m.unit_price,
            total_price: m.quantity * m.unit_price,
          }));

        const { error: materialsError } = await supabase
          .from("materials")
          .insert(materialsData);

        if (materialsError) throw materialsError;
      }

      // Log the status change
      await supabase.from("customer_logs").insert({
        customer_id: customerId,
        action: "status_updated",
        details: { device_id: deviceId, new_status: newStatus },
        performed_by: (await supabase.auth.getUser()).data.user?.id,
      });

      toast.success("Durum güncellendi");
      onSuccess();
      onOpenChange(false);
      
      // Reset form
      setDeliveryDate(undefined);
      setReturnDate(undefined);
      setWarrantySentDate(undefined);
      setWaitingDays(0);
      setMaterials([]);
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("Durum güncellenirken hata oluştu");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDialogTitle = () => {
    switch (newStatus) {
      case "completed":
        return "Sorun Giderildi - Bilgileri Girin";
      case "returned":
        return "İade Edildi - Bilgileri Girin";
      case "waiting_parts":
        return "Parça Bekleniyor - Bilgileri Girin";
      case "warranty":
        return "Garanti Kapsamında - Bilgileri Girin";
      default:
        return "Durum Güncelle";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-secondary border-white/20">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">
            {getDialogTitle()}
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Durum değişikliği için gerekli bilgileri girin
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {newStatus === "completed" && (
            <>
              <div>
                <Label className="text-white">Teslim Tarihi *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-white/10 border-white/20 text-white hover:bg-white/20",
                        !deliveryDate && "text-gray-400"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {deliveryDate ? (
                        format(deliveryDate, "PPP", { locale: tr })
                      ) : (
                        <span>Tarih seçin</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-secondary border-white/20" align="start">
                    <Calendar
                      mode="single"
                      selected={deliveryDate}
                      onSelect={setDeliveryDate}
                      initialFocus
                      locale={tr}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-white">Kullanılan Malzemeler *</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addMaterial}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Malzeme Ekle
                  </Button>
                </div>

                {materials.map((material) => (
                  <Card key={material.id} className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-3">
                          <div className="sm:col-span-2">
                            <Input
                              value={material.material_name}
                              onChange={(e) =>
                                updateMaterial(material.id, "material_name", e.target.value)
                              }
                              placeholder="Malzeme adı"
                              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              min="1"
                              value={material.quantity}
                              onChange={(e) =>
                                updateMaterial(
                                  material.id,
                                  "quantity",
                                  parseInt(e.target.value) || 1
                                )
                              }
                              placeholder="Adet"
                              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={material.unit_price}
                              onChange={(e) =>
                                updateMaterial(
                                  material.id,
                                  "unit_price",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              placeholder="Birim Fiyat"
                              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMaterial(material.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {material.quantity > 0 && material.unit_price > 0 && (
                        <div className="text-right mt-2 text-sm text-gray-300">
                          Toplam: ₺{(material.quantity * material.unit_price).toFixed(2)}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {materials.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">
                    Henüz malzeme eklenmedi. Malzeme ekle butonuna tıklayın.
                  </p>
                )}

                {materials.length > 0 && (
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-semibold">Toplam Tutar:</span>
                      <span className="text-xl font-bold text-white">
                        ₺
                        {materials
                          .reduce((sum, m) => sum + m.quantity * m.unit_price, 0)
                          .toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {newStatus === "returned" && (
            <div>
              <Label className="text-white">İade Tarihi *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-white/10 border-white/20 text-white hover:bg-white/20",
                      !returnDate && "text-gray-400"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {returnDate ? (
                      format(returnDate, "PPP", { locale: tr })
                    ) : (
                      <span>Tarih seçin</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-secondary border-white/20" align="start">
                  <Calendar
                    mode="single"
                    selected={returnDate}
                    onSelect={setReturnDate}
                    initialFocus
                    locale={tr}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          {newStatus === "waiting_parts" && (
            <div>
              <Label className="text-white">Parça Bekleme Süresi (Gün) *</Label>
              <Input
                type="number"
                min="1"
                value={waitingDays || ""}
                onChange={(e) => setWaitingDays(parseInt(e.target.value) || 0)}
                placeholder="Örn: 7"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
          )}

          {newStatus === "warranty" && (
            <div>
              <Label className="text-white">Garantiye Gönderilme Tarihi *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-white/10 border-white/20 text-white hover:bg-white/20",
                      !warrantySentDate && "text-gray-400"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {warrantySentDate ? (
                      format(warrantySentDate, "PPP", { locale: tr })
                    ) : (
                      <span>Tarih seçin</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-secondary border-white/20" align="start">
                  <Calendar
                    mode="single"
                    selected={warrantySentDate}
                    onSelect={setWarrantySentDate}
                    initialFocus
                    locale={tr}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
              disabled={isSubmitting}
            >
              İptal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-gradient-hero hover:shadow-tech"
            >
              {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StatusUpdateDialog;
