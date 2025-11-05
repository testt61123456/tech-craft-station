import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { Canvas as FabricCanvas } from "fabric";

interface Material {
  id: string;
  material_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface ServiceDetailsProps {
  service: {
    company_name: string;
    customer_name: string;
    phone_number: string;
    address: string;
    service_date: string;
    description?: string;
    status: string;
    signature_data?: string;
  };
  materials: Material[];
}

const ServiceDetails = ({ service, materials }: ServiceDetailsProps) => {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Servis Fişi - ${service.company_name}</title>
          <style>
            @page {
              size: A4;
              margin: 20mm;
            }
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: Arial, sans-serif;
              font-size: 10pt;
              line-height: 1.4;
            }
            
            .header {
              text-align: center;
              margin-bottom: 10mm;
              padding-bottom: 5mm;
              border-bottom: 2px solid #000;
            }
            
            .company-name {
              font-size: 16pt;
              font-weight: bold;
              margin-bottom: 3mm;
            }
            
            .info-section {
              margin-bottom: 8mm;
            }
            
            .info-row {
              margin-bottom: 3mm;
              display: flex;
              gap: 5mm;
            }
            
            .label {
              font-weight: bold;
              min-width: 30mm;
            }
            
            .value {
              flex: 1;
            }
            
            .materials-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 5mm;
            }
            
            .materials-table th,
            .materials-table td {
              border: 1px solid #000;
              padding: 3mm;
              text-align: left;
            }
            
            .materials-table th {
              background-color: #f0f0f0;
              font-weight: bold;
            }
            
            .total-row {
              font-weight: bold;
              text-align: right;
            }
            
            .signature-section {
              margin-top: 15mm;
              border-top: 1px dashed #000;
              padding-top: 5mm;
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
            <div class="company-name">${service.company_name}</div>
            <div>Servis Formu</div>
          </div>
          
          <div class="info-section">
            <div class="info-row">
              <span class="label">Müşteri Adı:</span>
              <span class="value">${service.customer_name}</span>
            </div>
            
            <div class="info-row">
              <span class="label">Telefon:</span>
              <span class="value">${service.phone_number}</span>
            </div>
            
            <div class="info-row">
              <span class="label">Adres:</span>
              <span class="value">${service.address}</span>
            </div>
            
            <div class="info-row">
              <span class="label">Servis Tarihi:</span>
              <span class="value">${new Date(service.service_date).toLocaleDateString('tr-TR')}</span>
            </div>
            
            ${service.description ? `
              <div class="info-row">
                <span class="label">Açıklama:</span>
                <span class="value">${service.description}</span>
              </div>
            ` : ''}
          </div>
          
          ${materials.length > 0 ? `
            <div class="info-section">
              <h3 style="margin-bottom: 3mm;">Kullanılan Malzemeler</h3>
              <table class="materials-table">
                <thead>
                  <tr>
                    <th>Malzeme Adı</th>
                    <th>Miktar</th>
                    <th>Birim Fiyat</th>
                    <th>Toplam</th>
                  </tr>
                </thead>
                <tbody>
                  ${materials.map(m => `
                    <tr>
                      <td>${m.material_name}</td>
                      <td>${m.quantity}</td>
                      <td>${m.unit_price}₺</td>
                      <td>${m.total_price}₺</td>
                    </tr>
                  `).join('')}
                  <tr class="total-row">
                    <td colspan="3">Genel Toplam:</td>
                    <td>${materials.reduce((sum, m) => sum + m.total_price, 0).toFixed(2)}₺</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ` : ''}
          
          <div class="signature-section">
            <div style="text-align: center; margin-top: 20mm;">
              <div>Müşteri İmzası</div>
              <div style="border-top: 1px solid #000; width: 50mm; margin: 5mm auto;"></div>
            </div>
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

  const signatureCanvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (!service.signature_data || !signatureCanvasRef.current) return;
    const canvas = new FabricCanvas(signatureCanvasRef.current, { width: 600, height: 200, backgroundColor: '#ffffff' });
    (async () => {
      try {
        const json = typeof service.signature_data === 'string' ? JSON.parse(service.signature_data) : service.signature_data;
        await canvas.loadFromJSON(json);
        canvas.renderAll();
        canvas.isDrawingMode = false;
      } catch (e) {
        console.error('İmza yüklenirken hata:', e);
      }
    })();
    return () => { canvas.dispose(); };
  }, [service.signature_data]);

  return (
    <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 border-white/20 backdrop-blur-sm">
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Printer className="h-4 w-4 mr-2" />
            Yazdır
          </Button>
        </div>
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
                ref={signatureCanvasRef}
                width={600}
                height={200}
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
