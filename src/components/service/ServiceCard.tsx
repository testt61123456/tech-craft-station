import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Phone, User, ChevronDown, ChevronUp, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface ServiceCardProps {
  service: {
    id: string;
    company_name: string;
    customer_name: string;
    phone_number: string;
    address: string;
    service_date: string;
    status: string;
  };
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Beklemede", variant: "outline" },
  in_progress: { label: "Devam Ediyor", variant: "secondary" },
  completed: { label: "Tamamlandı", variant: "default" },
  cancelled: { label: "İptal Edildi", variant: "destructive" },
};

const ServiceCard = ({ service, isExpanded, onToggle, onEdit, onDelete }: ServiceCardProps) => {
  const statusInfo = statusLabels[service.status] || statusLabels.pending;

  return (
    <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 border-white/20 backdrop-blur-sm hover:shadow-tech transition-all duration-300">
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-1">
                  {service.company_name}
                </h3>
                <Badge variant={statusInfo.variant} className="text-xs">
                  {statusInfo.label}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2 text-gray-300">
                <User className="h-4 w-4 text-primary" />
                <span>{service.customer_name}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Phone className="h-4 w-4 text-primary" />
                <span>{service.phone_number}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{format(new Date(service.service_date), "d MMMM yyyy", { locale: tr })}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="truncate">{service.address}</span>
              </div>
            </div>
          </div>

          <div className="flex md:flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="flex-1 md:flex-none bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Edit className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Düzenle</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="flex-1 md:flex-none bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
            >
              <Trash2 className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Sil</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onToggle}
              className="flex-1 md:flex-none bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ServiceCard;
