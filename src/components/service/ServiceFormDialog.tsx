import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Trash2 } from "lucide-react";
import SignaturePad, { SignaturePadRef } from "./SignaturePad";

interface Material {
  material_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface ServiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  editData?: any;
}

const ServiceFormDialog = ({ open, onOpenChange, onSuccess, editData }: ServiceFormDialogProps) => {
  const { user } = useAuth();
  const signaturePadRef = useRef<SignaturePadRef>(null);
  
  const [formData, setFormData] = useState({
    company_name: "",
    phone_number: "",
    address: "",
    description: "",
    service_date: new Date().toISOString().split('T')[0],
    status: "pending",
    customer_name: "",
  });

  const [materials, setMaterials] = useState<Material[]>([]);
  const [currentMaterial, setCurrentMaterial] = useState({
    material_name: "",
    quantity: 1,
    unit_price: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editData) {
      setFormData({
        company_name: editData.company_name || "",
        phone_number: editData.phone_number || "",
        address: editData.address || "",
        description: editData.description || "",
        service_date: editData.service_date ? new Date(editData.service_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        status: editData.status || "pending",
        customer_name: editData.customer_name || "",
      });
      
      if (editData.signature_data && signaturePadRef.current) {
        signaturePadRef.current.loadSignature(editData.signature_data);
      }

      if (editData.materials) {
        setMaterials(editData.materials);
      }
    } else {
      resetForm();
    }
  }, [editData, open]);

  const resetForm = () => {
    setFormData({
      company_name: "",
      phone_number: "",
      address: "",
      description: "",
      service_date: new Date().toISOString().split('T')[0],
      status: "pending",
      customer_name: "",
    });
    setMaterials([]);
    setCurrentMaterial({
      material_name: "",
      quantity: 1,
      unit_price: 0,
    });
    if (signaturePadRef.current) {
      signaturePadRef.current.clearSignature();
    }
  };

  const handleAddMaterial = () => {
    if (!currentMaterial.material_name.trim()) {
      toast.error("Malzeme adı boş olamaz");
      return;
    }

    const total_price = currentMaterial.quantity * currentMaterial.unit_price;
    setMaterials([...materials, { ...currentMaterial, total_price }]);
    setCurrentMaterial({
      material_name: "",
      quantity: 1,
      unit_price: 0,
    });
  };

  const handleRemoveMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Kullanıcı oturumu bulunamadı");
      return;
    }

    setIsSubmitting(true);

    try {
      const signatureData = signaturePadRef.current?.getSignatureData();

      const serviceData = {
        ...formData,
        status: formData.status as "pending" | "in_progress" | "completed" | "cancelled",
        signature_data: signatureData,
        created_by: user.id,
      };

      let serviceId = editData?.id;

      if (editData) {
        const { error } = await supabase
          .from('service_records')
          .update(serviceData)
          .eq('id', editData.id);

        if (error) throw error;

        // Mevcut malzemeleri sil
        await supabase
          .from('service_materials')
          .delete()
          .eq('service_id', editData.id);
      } else {
        const { data, error } = await supabase
          .from('service_records')
          .insert(serviceData)
          .select()
          .single();

        if (error) throw error;
        serviceId = data.id;
      }

      // Malzemeleri ekle
      if (materials.length > 0) {
        const materialsData = materials.map(m => ({
          service_id: serviceId,
          ...m
        }));

        const { error: materialsError } = await supabase
          .from('service_materials')
          .insert(materialsData);

        if (materialsError) throw materialsError;
      }

      toast.success(editData ? "Servis kaydı güncellendi" : "Servis kaydı oluşturuldu");
      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Servis kaydı hatası:', error);
      toast.error("Servis kaydı oluşturulurken hata oluştu");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-secondary border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white">
            {editData ? "Servis Kaydını Düzenle" : "Yeni Servis Kaydı"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company_name" className="text-white">Kurum Adı</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                required
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div>
              <Label htmlFor="customer_name" className="text-white">Müşteri Adı</Label>
              <Input
                id="customer_name"
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                required
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div>
              <Label htmlFor="phone_number" className="text-white">Telefon Numarası</Label>
              <Input
                id="phone_number"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                required
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div>
              <Label htmlFor="service_date" className="text-white">Tarih</Label>
              <Input
                id="service_date"
                type="date"
                value={formData.service_date}
                onChange={(e) => setFormData({ ...formData, service_date: e.target.value })}
                required
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div>
              <Label htmlFor="status" className="text-white">Durum</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Beklemede</SelectItem>
                  <SelectItem value="in_progress">Devam Ediyor</SelectItem>
                  <SelectItem value="completed">Tamamlandı</SelectItem>
                  <SelectItem value="cancelled">İptal Edildi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="address" className="text-white">Adres</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-white">Açıklama</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          {/* Malzeme Ekleme */}
          <div className="space-y-2">
            <Label className="text-white">Malzemeler</Label>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <Input
                placeholder="Malzeme Adı"
                value={currentMaterial.material_name}
                onChange={(e) => setCurrentMaterial({ ...currentMaterial, material_name: e.target.value })}
                className="bg-white/10 border-white/20 text-white md:col-span-2"
              />
              <Input
                type="number"
                placeholder="Adet"
                min="1"
                value={currentMaterial.quantity}
                onChange={(e) => setCurrentMaterial({ ...currentMaterial, quantity: parseInt(e.target.value) || 1 })}
                className="bg-white/10 border-white/20 text-white"
              />
              <Input
                type="number"
                placeholder="Birim Fiyat"
                min="0"
                step="0.01"
                value={currentMaterial.unit_price}
                onChange={(e) => setCurrentMaterial({ ...currentMaterial, unit_price: parseFloat(e.target.value) || 0 })}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <Button
              type="button"
              onClick={handleAddMaterial}
              variant="outline"
              className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Plus className="h-4 w-4 mr-2" />
              Malzeme Ekle
            </Button>
          </div>

          {/* Malzeme Listesi */}
          {materials.length > 0 && (
            <div className="space-y-2">
              <Label className="text-white">Eklenen Malzemeler</Label>
              <div className="space-y-2">
                {materials.map((material, index) => (
                  <div key={index} className="flex items-center justify-between bg-white/5 p-3 rounded-md border border-white/10">
                    <div className="flex-1">
                      <p className="text-white font-medium">{material.material_name}</p>
                      <p className="text-sm text-gray-300">
                        {material.quantity} adet × {material.unit_price}₺ = {material.total_price}₺
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMaterial(index)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="text-right">
                  <p className="text-white font-bold">
                    Toplam: {materials.reduce((sum, m) => sum + m.total_price, 0).toFixed(2)}₺
                  </p>
                </div>
              </div>
            </div>
          )}

          <SignaturePad ref={signaturePadRef} width={600} height={200} />

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              İptal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-hero hover:shadow-tech"
            >
              {isSubmitting ? "Kaydediliyor..." : editData ? "Güncelle" : "Kaydet"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceFormDialog;
