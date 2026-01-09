import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, ChevronDown, ChevronUp, Hash, Clock, CheckCircle, XCircle, Package, AlertCircle, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CustomerCardProps {
  customer: {
    id: string;
    customer_number: string;
    customer_name: string;
    phone_number: string;
    created_at: string;
  };
  devices?: Array<{
    id: string;
    status: string;
  }>;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const statusConfig = {
  pending: { icon: Clock, color: "bg-yellow-500/80" },
  completed: { icon: CheckCircle, color: "bg-emerald-500/80" },
  returned: { icon: XCircle, color: "bg-red-500/80" },
  waiting_parts: { icon: Package, color: "bg-orange-500/80" },
  warranty: { icon: AlertCircle, color: "bg-blue-500/80" }
};

const CustomerCard = ({ customer, devices, isExpanded, onToggle, onEdit, onDelete }: CustomerCardProps) => {
  return (
    <Card className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-800 border border-zinc-700/50 hover:border-red-500/30 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-red-500/10">
      <CardContent className="p-3 md:p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3" onClick={onToggle}>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30 text-xs px-2 py-0.5">
                <Hash className="h-3 w-3 mr-1" />
                {customer.customer_number}
              </Badge>
            </div>
            <h3 className="text-base md:text-lg font-bold text-white mb-1 truncate">
              {customer.customer_name}
            </h3>
            <div className="flex items-center gap-4 text-xs md:text-sm">
              <div className="flex items-center gap-1.5 text-gray-400">
                <Phone className="h-3.5 w-3.5 text-red-400" />
                <span>{customer.phone_number}</span>
              </div>
              <span className="text-gray-500">
                {new Date(customer.created_at).toLocaleDateString('tr-TR')}
              </span>
            </div>
          </div>
          
          {/* Durum Simgeleri */}
          {devices && devices.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {devices.map((device) => {
                const StatusIcon = statusConfig[device.status as keyof typeof statusConfig]?.icon || Clock;
                const statusColor = statusConfig[device.status as keyof typeof statusConfig]?.color || "bg-gray-500/80";
                return (
                  <div 
                    key={device.id} 
                    className={`${statusColor} rounded-md p-1.5 flex items-center justify-center shadow-sm`}
                  >
                    <StatusIcon className="h-5 w-5 text-white" />
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex gap-1.5">
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
      </CardContent>
    </Card>
  );
};

export default CustomerCard;
