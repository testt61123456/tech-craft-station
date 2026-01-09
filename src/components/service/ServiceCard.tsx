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

const statusLabels: Record<string, { label: string; className: string }> = {
  pending: { label: "Beklemede", className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  in_progress: { label: "Devam Ediyor", className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  completed: { label: "Tamamlandı", className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  cancelled: { label: "İptal Edildi", className: "bg-red-500/20 text-red-400 border-red-500/30" },
};

const ServiceCard = ({ service, isExpanded, onToggle, onEdit, onDelete }: ServiceCardProps) => {
  const statusInfo = statusLabels[service.status] || statusLabels.pending;

  return (
    <Card className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-800 border border-zinc-700/50 hover:border-red-500/30 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-red-500/10 print:break-inside-avoid print:page-break-inside-avoid print:mb-4">
      <div className="p-3 md:p-4" onClick={onToggle}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base md:text-lg font-bold text-white truncate">
                {service.company_name}
              </h3>
              <Badge variant="outline" className={`text-xs shrink-0 ${statusInfo.className}`}>
                {statusInfo.label}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs md:text-sm">
              <div className="flex items-center gap-1.5 text-gray-400 truncate">
                <User className="h-3.5 w-3.5 text-red-400 shrink-0" />
                <span className="truncate">{service.customer_name}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400 truncate">
                <Phone className="h-3.5 w-3.5 text-red-400 shrink-0" />
                <span className="truncate">{service.phone_number}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400 truncate">
                <Calendar className="h-3.5 w-3.5 text-red-400 shrink-0" />
                <span>{format(new Date(service.service_date), "d MMM yyyy", { locale: tr })}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400 truncate">
                <MapPin className="h-3.5 w-3.5 text-red-400 shrink-0" />
                <span className="truncate">{service.address}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-1.5 print:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="h-8 px-2 text-gray-400 hover:text-white hover:bg-zinc-700"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="h-8 px-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              className="h-8 px-2 text-gray-400 hover:text-white hover:bg-zinc-700"
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
