import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Material {
  id: string;
  material_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface ServiceDetailsProps {
  service: {
    description?: string;
    status: string;
    signature_data?: string;
  };
  materials: Material[];
}

const ServiceDetails = ({ service, materials }: ServiceDetailsProps) => {
  return (
    <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/20 backdrop-blur-sm">
      <div className="p-4 md:p-6 space-y-6">
        {service.description && (
          <div>
            <h4 className="text-sm font-semibold text-white mb-2">Açıklama</h4>
            <p className="text-gray-300 text-sm">{service.description}</p>
          </div>
        )}

        {materials.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Kullanılan Malzemeler</h4>
            <div className="space-y-2">
              {materials.map((material) => (
                <div
                  key={material.id}
                  className="flex items-center justify-between bg-white/5 p-3 rounded-md border border-white/10"
                >
                  <div className="flex-1">
                    <p className="text-white font-medium">{material.material_name}</p>
                    <p className="text-sm text-gray-300">
                      {material.quantity} adet × {material.unit_price}₺
                    </p>
                  </div>
                  <Badge variant="outline" className="text-white border-white/20">
                    {material.total_price}₺
                  </Badge>
                </div>
              ))}
              <div className="flex justify-end pt-2 border-t border-white/10">
                <p className="text-white font-bold">
                  Toplam: {materials.reduce((sum, m) => sum + m.total_price, 0).toFixed(2)}₺
                </p>
              </div>
            </div>
          </div>
        )}

        {service.signature_data && (
          <div>
            <h4 className="text-sm font-semibold text-white mb-2">İmza</h4>
            <div className="bg-white rounded-md p-4 border border-white/20">
              <canvas
                id={`signature-${Math.random()}`}
                className="w-full"
                style={{ maxHeight: "200px" }}
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ServiceDetails;
