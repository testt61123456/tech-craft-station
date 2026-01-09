import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Printer, Package } from "lucide-react";
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
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);

  useEffect(() => {
    if (!service.signature_data || !signatureCanvasRef.current) return;
    
    // Dispose previous canvas if exists
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.dispose();
    }

    const canvas = new FabricCanvas(signatureCanvasRef.current, { 
      width: 280, 
      height: 100, 
      backgroundColor: '#ffffff' 
    });
    fabricCanvasRef.current = canvas;

    (async () => {
      try {
        const json = typeof service.signature_data === 'string' ? JSON.parse(service.signature_data) : service.signature_data;
        await canvas.loadFromJSON(json);
        
        // Scale signature to fit smaller canvas
        const objects = canvas.getObjects();
        if (objects.length > 0) {
          const group = new (await import('fabric')).Group(objects);
          const scaleX = 260 / (group.width || 260);
          const scaleY = 80 / (group.height || 80);
          const scale = Math.min(scaleX, scaleY, 0.5);
          
          objects.forEach(obj => {
            obj.scale(scale);
          });
        }
        
        canvas.renderAll();
        canvas.isDrawingMode = false;
      } catch (e) {
        console.error('İmza yüklenirken hata:', e);
      }
    })();

    return () => { 
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, [service.signature_data]);

  return (
    <Card className="bg-zinc-900/80 border border-zinc-700/50 ml-4 mt-2">
      <div className="p-3 md:p-4 space-y-3">
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrint}
            className="h-7 px-2 text-gray-400 hover:text-white hover:bg-zinc-700"
          >
            <Printer className="h-3.5 w-3.5 mr-1.5" />
            Yazdır
          </Button>
        </div>

        {service.description && (
          <div>
            <h4 className="text-xs font-semibold text-gray-400 mb-1">Açıklama</h4>
            <p className="text-gray-300 text-sm">{service.description}</p>
          </div>
        )}

        {materials.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1.5">
              <Package className="h-3.5 w-3.5" />
              Malzemeler
            </h4>
            <div className="space-y-1.5">
              {materials.map((material) => (
                <div
                  key={material.id}
                  className="flex items-center justify-between bg-zinc-800/50 p-2 rounded border border-zinc-700/30"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{material.material_name}</p>
                    <p className="text-xs text-gray-500">
                      {material.quantity} × {material.unit_price}₺
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs text-red-400 border-red-500/30 bg-red-500/10">
                    {material.total_price}₺
                  </Badge>
                </div>
              ))}
              <div className="flex justify-end pt-2 border-t border-zinc-700/30">
                <p className="text-white text-sm font-bold">
                  Toplam: <span className="text-red-400">{materials.reduce((sum, m) => sum + m.total_price, 0).toFixed(2)}₺</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {service.signature_data && (
          <div>
            <h4 className="text-xs font-semibold text-gray-400 mb-1.5">İmza</h4>
            <div className="bg-white rounded border border-zinc-600 inline-block">
              <canvas
                ref={signatureCanvasRef}
                width={280}
                height={100}
                className="block"
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ServiceDetails;
