import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface PrintReceiptProps {
  customer: {
    customer_number: string;
    customer_name: string;
    phone_number: string;
  };
  device: {
    device_type: string;
    device_problem: string;
  };
}

const deviceTypeLabels: Record<string, string> = {
  laptop: "Laptop",
  desktop: "Masaüstü",
  printer: "Yazıcı",
  all_in_one: "All-in-One PC",
  server: "Sunucu",
  network_device: "Ağ Cihazı",
  other: "Diğer"
};

const PrintReceipt = ({ customer, device }: PrintReceiptProps) => {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Müşteri Fişi - ${customer.customer_number}</title>
          <style>
            @page {
              size: 60mm 40mm;
              margin: 0;
            }
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              width: 60mm;
              height: 40mm;
              padding: 2mm;
              font-family: Arial, sans-serif;
              font-size: 7pt;
              line-height: 1.2;
            }
            
            .header {
              text-align: center;
              margin-bottom: 1mm;
              padding-bottom: 1mm;
              border-bottom: 1px solid #000;
            }
            
            .customer-id {
              font-size: 9pt;
              font-weight: bold;
              margin-bottom: 0.5mm;
            }
            
            .info-row {
              margin-bottom: 0.5mm;
              display: flex;
              gap: 1mm;
            }
            
            .label {
              font-weight: bold;
              min-width: 12mm;
            }
            
            .value {
              flex: 1;
              word-wrap: break-word;
            }
            
            .problem {
              margin-top: 1mm;
              padding-top: 1mm;
              border-top: 1px dashed #000;
              font-size: 6pt;
            }
            
            @media print {
              body {
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="customer-id">${customer.customer_number}</div>
          </div>
          
          <div class="info-row">
            <span class="label">Ad:</span>
            <span class="value">${customer.customer_name}</span>
          </div>
          
          <div class="info-row">
            <span class="label">Tel:</span>
            <span class="value">${customer.phone_number}</span>
          </div>
          
          <div class="info-row">
            <span class="label">Cihaz:</span>
            <span class="value">${deviceTypeLabels[device.device_type] || device.device_type}</span>
          </div>
          
          <div class="problem">
            <div style="font-weight: bold; margin-bottom: 0.5mm;">Arıza:</div>
            <div>${device.device_problem}</div>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 100);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handlePrint}
      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
    >
      <Printer className="h-4 w-4 mr-2" />
      Yazdır
    </Button>
  );
};

export default PrintReceipt;
