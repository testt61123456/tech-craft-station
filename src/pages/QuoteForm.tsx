import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Printer, FileText } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";

interface QuoteItem {
  id: number;
  materialType: string;
  quantity: number;
  exchangeRate: number;
  profitMargin: number;
  unitPrice: number;
  totalCost: number;
  quoteUnitPrice: number;
  quoteTotal: number;
}

const QuoteForm = () => {
  const { userRole } = useAuth();
  const [companyName, setCompanyName] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [items, setItems] = useState<QuoteItem[]>([
    {
      id: 1,
      materialType: "",
      quantity: 1,
      exchangeRate: 1,
      profitMargin: 0,
      unitPrice: 0,
      totalCost: 0,
      quoteUnitPrice: 0,
      quoteTotal: 0,
    },
  ]);

  // Sadece admin ve superadmin erişebilir
  if (userRole !== 'admin' && userRole !== 'superadmin') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-foreground">Erişim Reddedildi</h1>
            <p className="text-muted-foreground mt-2">Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const calculateRow = (item: QuoteItem): QuoteItem => {
    const totalCost = item.quantity * item.unitPrice * item.exchangeRate;
    const quoteUnitPrice = item.unitPrice * item.exchangeRate * (1 + item.profitMargin / 100);
    const quoteTotal = item.quantity * quoteUnitPrice;
    
    return {
      ...item,
      totalCost,
      quoteUnitPrice,
      quoteTotal,
    };
  };

  const updateItem = (id: number, field: keyof QuoteItem, value: string | number) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          return calculateRow(updatedItem);
        }
        return item;
      })
    );
  };

  const addRow = () => {
    const newId = Math.max(...items.map((i) => i.id)) + 1;
    setItems([
      ...items,
      {
        id: newId,
        materialType: "",
        quantity: 1,
        exchangeRate: 1,
        profitMargin: 0,
        unitPrice: 0,
        totalCost: 0,
        quoteUnitPrice: 0,
        quoteTotal: 0,
      },
    ]);
  };

  const removeRow = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const grandTotal = items.reduce((sum, item) => sum + item.quoteTotal, 0);
  const totalCostSum = items.reduce((sum, item) => sum + item.totalCost, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <Card className="bg-card border-border shadow-xl">
          <CardHeader className="border-b border-border">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <FileText className="w-10 h-10 text-primary" />
                <CardTitle className="text-2xl font-bold text-foreground">Teklif Formu</CardTitle>
              </div>
              <Button onClick={handlePrint} className="print:hidden">
                <Printer className="w-4 h-4 mr-2" />
                Yazdır
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            {/* Firma Logosu */}
            <div className="text-center mb-8 print:mb-4">
              <h2 className="text-3xl font-bold text-primary">Karadeniz</h2>
              <p className="text-muted-foreground">Bilişim Teknolojileri</p>
            </div>

            {/* Firma Bilgileri */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 print:mb-4">
              <div>
                <Label htmlFor="companyName" className="text-foreground font-medium">Firma Adı</Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Teklif yapılacak firma"
                  className="mt-1 bg-background border-border text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="city" className="text-foreground font-medium">Şehir</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Şehir"
                  className="mt-1 bg-background border-border text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-foreground font-medium">Telefon</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Telefon numarası"
                  className="mt-1 bg-background border-border text-foreground"
                />
              </div>
            </div>

            {/* Tablo */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-secondary text-secondary-foreground">
                    <th className="border border-border px-3 py-2 text-center text-xs font-semibold whitespace-nowrap">Sıra No</th>
                    <th className="border border-border px-3 py-2 text-center text-xs font-semibold whitespace-nowrap min-w-[150px]">Malzeme Cinsi</th>
                    <th className="border border-border px-3 py-2 text-center text-xs font-semibold whitespace-nowrap">Adet</th>
                    <th className="border border-border px-3 py-2 text-center text-xs font-semibold whitespace-nowrap">Kur</th>
                    <th className="border border-border px-3 py-2 text-center text-xs font-semibold whitespace-nowrap">Kar %</th>
                    <th className="border border-border px-3 py-2 text-center text-xs font-semibold whitespace-nowrap">Birim Fiyatı</th>
                    <th className="border border-border px-3 py-2 text-center text-xs font-semibold whitespace-nowrap">Toplam Maliyet</th>
                    <th className="border border-border px-3 py-2 text-center text-xs font-semibold whitespace-nowrap">Teklif B. Fiyatı</th>
                    <th className="border border-border px-3 py-2 text-center text-xs font-semibold whitespace-nowrap">Teklif Toplam</th>
                    <th className="border border-border px-3 py-2 text-center text-xs font-semibold print:hidden">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                      <td className="border border-border px-3 py-2 text-center text-foreground font-medium">
                        {index + 1}
                      </td>
                      <td className="border border-border px-1 py-1">
                        <Input
                          value={item.materialType}
                          onChange={(e) => updateItem(item.id, "materialType", e.target.value)}
                          className="h-8 text-sm bg-background border-0 focus:ring-1 text-foreground"
                          placeholder="Malzeme adı"
                        />
                      </td>
                      <td className="border border-border px-1 py-1">
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                          className="h-8 text-sm bg-background border-0 focus:ring-1 text-center text-foreground w-16"
                        />
                      </td>
                      <td className="border border-border px-1 py-1">
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.exchangeRate}
                          onChange={(e) => updateItem(item.id, "exchangeRate", parseFloat(e.target.value) || 0)}
                          className="h-8 text-sm bg-background border-0 focus:ring-1 text-center text-foreground w-20"
                        />
                      </td>
                      <td className="border border-border px-1 py-1">
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          value={item.profitMargin}
                          onChange={(e) => updateItem(item.id, "profitMargin", parseFloat(e.target.value) || 0)}
                          className="h-8 text-sm bg-background border-0 focus:ring-1 text-center text-foreground w-16"
                        />
                      </td>
                      <td className="border border-border px-1 py-1">
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                          className="h-8 text-sm bg-background border-0 focus:ring-1 text-center text-foreground w-24"
                        />
                      </td>
                      <td className="border border-border px-3 py-2 text-center text-foreground font-medium bg-muted/30">
                        {item.totalCost.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                      </td>
                      <td className="border border-border px-3 py-2 text-center text-foreground font-medium bg-muted/30">
                        {item.quoteUnitPrice.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                      </td>
                      <td className="border border-border px-3 py-2 text-center text-primary font-bold bg-primary/10">
                        {item.quoteTotal.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                      </td>
                      <td className="border border-border px-2 py-1 text-center print:hidden">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeRow(item.id)}
                          className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                          disabled={items.length === 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-secondary">
                    <td colSpan={6} className="border border-border px-3 py-3 text-right text-foreground font-bold">
                      TOPLAM:
                    </td>
                    <td className="border border-border px-3 py-3 text-center text-foreground font-bold">
                      {totalCostSum.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                    </td>
                    <td className="border border-border px-3 py-3 text-center text-foreground font-bold">
                      -
                    </td>
                    <td className="border border-border px-3 py-3 text-center text-primary font-bold text-lg">
                      {grandTotal.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                    </td>
                    <td className="border border-border print:hidden"></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Satır Ekle Butonu */}
            <div className="mt-4 print:hidden">
              <Button onClick={addRow} variant="outline" className="w-full md:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Yeni Satır Ekle
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />

      {/* Print Styles */}
      <style>{`
        @media print {
          header, footer, .print\\:hidden {
            display: none !important;
          }
          main {
            padding-top: 0 !important;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
};

export default QuoteForm;
