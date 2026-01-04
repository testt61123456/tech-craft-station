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
    <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 border-white/20 backdrop-blur-sm hover:shadow-tech transition-all duration-300 cursor-pointer print:break-inside-avoid print:page-break-inside-avoid print:mb-4">
      <div className="p-3 md:p-4" onClick={onToggle}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base md:text-lg font-bold text-white truncate">
                {service.company_name}
              </h3>
              <Badge variant={statusInfo.variant} className="text-xs shrink-0">
                {statusInfo.label}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs md:text-sm">
              <div className="flex items-center gap-1.5 text-gray-300 truncate">
                <User className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="truncate">{service.customer_name}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-300 truncate">
                <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="truncate">{service.phone_number}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-300 truncate">
                <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>{format(new Date(service.service_date), "d MMM yyyy", { locale: tr })}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-300 truncate">
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="truncate">{service.address}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-1.5 print:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-8 px-2"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20 h-8 px-2"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-8 px-2"
            >
              {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ServiceCard;
