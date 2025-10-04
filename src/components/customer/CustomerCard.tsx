import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, ChevronDown, ChevronUp, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CustomerCardProps {
  customer: {
    id: string;
    customer_number: string;
    customer_name: string;
    phone_number: string;
    created_at: string;
  };
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const CustomerCard = ({ customer, isExpanded, onToggle, onEdit, onDelete }: CustomerCardProps) => {
  return (
    <Card className="bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-center justify-between" onClick={onToggle}>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
                <Hash className="h-3 w-3 mr-1" />
                {customer.customer_number}
              </Badge>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">
              {customer.customer_name}
            </h3>
            <div className="flex items-center gap-2 text-gray-300">
              <Phone className="h-4 w-4" />
              <span className="text-sm">{customer.phone_number}</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Kayıt: {new Date(customer.created_at).toLocaleDateString('tr-TR')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Düzenle
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              Sil
            </Button>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-white" />
            ) : (
              <ChevronDown className="h-5 w-5 text-white" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerCard;
