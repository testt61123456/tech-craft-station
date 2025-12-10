import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Printer, FileText } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";

interface QuoteItem {
  id: number;
  materialType: string;
  quantity: number;
  price: number;
  currency: 'USD' | 'EUR' | 'TRY';
  profitMargin: number;
}

const QuoteForm = () => {
  const { userRole, loading } = useAuth();
  const [companyName, setCompanyName] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Kur değerleri
  const [dollarRate, setDollarRate] = useState(35);
  const [euroRate, setEuroRate] = useState(38);
  const [kdvRate, setKdvRate] = useState(20);
  
  const [items, setItems] = useState<QuoteItem[]>([
    { id: 1, materialType: "", quantity: 1, price: 0, currency: 'USD', profitMargin: 20 }
  ]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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

  // Birim fiyatı hesaplama (kura göre TL'ye çevir)
  const calculateUnitPriceTRY = (item: QuoteItem): number => {
    if (item.currency === 'USD') {
      return item.price * dollarRate;
    } else if (item.currency === 'EUR') {
      return item.price * euroRate;
    }
    return item.price; // TRY ise direkt
  };

  // Toplam fiyat (maliyet)
  const calculateTotalPrice = (item: QuoteItem): number => {
    return calculateUnitPriceTRY(item) * item.quantity;
  };

  // Teklif birim fiyatı (kar dahil)
  const calculateQuoteUnitPrice = (item: QuoteItem): number => {
    return calculateUnitPriceTRY(item) * (1 + item.profitMargin / 100);
  };

  // Teklif toplam
  const calculateQuoteTotal = (item: QuoteItem): number => {
    return calculateQuoteUnitPrice(item) * item.quantity;
  };

  const updateItem = (id: number, field: keyof QuoteItem, value: string | number) => {
    setItems((prevItems) =>
      prevItems.map((item) => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const addRow = () => {
    const newId = items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
    setItems([
      ...items,
      { id: newId, materialType: "", quantity: 1, price: 0, currency: 'USD', profitMargin: 20 }
    ]);
  };

  const removeRow = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  // Toplamlar
  const totalCost = items.reduce((sum, item) => sum + calculateTotalPrice(item), 0);
  const totalProfit = items.reduce((sum, item) => sum + (calculateQuoteTotal(item) - calculateTotalPrice(item)), 0);
  const subTotal = items.reduce((sum, item) => sum + calculateQuoteTotal(item), 0);
  const kdvAmount = subTotal * (kdvRate / 100);
  const grandTotal = subTotal + kdvAmount;

  const formatCurrency = (value: number) => {
    return value.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " ₺";
  };

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

            {/* Firma Bilgileri & Kur Ayarları */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 print:mb-4">
              {/* Sol - Firma Bilgileri */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Label className="w-20 text-foreground font-medium">Kurum:</Label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Teklif yapılacak firma"
                    className="flex-1 bg-background border-border text-foreground"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Label className="w-20 text-foreground font-medium">Şehir:</Label>
                  <Input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Şehir"
                    className="flex-1 bg-background border-border text-foreground"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Label className="w-20 text-foreground font-medium">Telefon:</Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Telefon numarası"
                    className="flex-1 bg-background border-border text-foreground"
                  />
                </div>
              </div>
              
              {/* Sağ - Tarih & Kur Ayarları */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Label className="w-20 text-foreground font-medium">Tarih:</Label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="flex-1 bg-background border-border text-foreground"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Label className="w-20 text-foreground font-medium">Dolar ($):</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={dollarRate}
                    onChange={(e) => setDollarRate(parseFloat(e.target.value) || 0)}
                    className="flex-1 bg-background border-border text-foreground"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Label className="w-20 text-foreground font-medium">Euro (€):</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={euroRate}
                    onChange={(e) => setEuroRate(parseFloat(e.target.value) || 0)}
                    className="flex-1 bg-background border-border text-foreground"
                  />
                </div>
              </div>
            </div>

            {/* Tablo */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-primary text-primary-foreground">
                    <th className="border border-border px-2 py-2 text-center font-semibold w-12">NO</th>
                    <th className="border border-border px-2 py-2 text-left font-semibold min-w-[180px]">MALZEME CİNSİ</th>
                    <th className="border border-border px-2 py-2 text-center font-semibold w-16">ADET</th>
                    <th className="border border-border px-2 py-2 text-center font-semibold w-24">FİYAT</th>
                    <th className="border border-border px-2 py-2 text-center font-semibold w-24">KUR</th>
                    <th className="border border-border px-2 py-2 text-center font-semibold w-16">KÂR %</th>
                    <th className="border border-border px-2 py-2 text-right font-semibold w-28">BİRİM FİYATI</th>
                    <th className="border border-border px-2 py-2 text-right font-semibold w-28">TOPLAM FİYATI</th>
                    <th className="border border-border px-2 py-2 text-right font-semibold w-28">TKLF BİRİM FYT</th>
                    <th className="border border-border px-2 py-2 text-right font-semibold w-28">TEKLİF TOPLAM</th>
                    <th className="border border-border px-2 py-2 text-center w-12 print:hidden"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                      <td className="border border-border px-2 py-1 text-center text-foreground font-medium">
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
                          onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 1)}
                          className="h-8 text-sm bg-background border-0 focus:ring-1 text-center text-foreground"
                        />
                      </td>
                      <td className="border border-border px-1 py-1">
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.price}
                          onChange={(e) => updateItem(item.id, "price", parseFloat(e.target.value) || 0)}
                          className="h-8 text-sm bg-background border-0 focus:ring-1 text-right text-foreground"
                        />
                      </td>
                      <td className="border border-border px-1 py-1">
                        <Select 
                          value={item.currency} 
                          onValueChange={(value: 'USD' | 'EUR' | 'TRY') => updateItem(item.id, 'currency', value)}
                        >
                          <SelectTrigger className="h-8 text-sm border-0 bg-background text-foreground">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">$ USD</SelectItem>
                            <SelectItem value="EUR">€ EUR</SelectItem>
                            <SelectItem value="TRY">₺ TRY</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="border border-border px-1 py-1">
                        <Input
                          type="number"
                          step="1"
                          min="0"
                          max="100"
                          value={item.profitMargin}
                          onChange={(e) => updateItem(item.id, "profitMargin", parseFloat(e.target.value) || 0)}
                          className="h-8 text-sm bg-background border-0 focus:ring-1 text-center text-foreground"
                        />
                      </td>
                      <td className="border border-border px-2 py-1 text-right text-foreground font-mono bg-muted/30">
                        {formatCurrency(calculateUnitPriceTRY(item))}
                      </td>
                      <td className="border border-border px-2 py-1 text-right text-foreground font-mono bg-muted/30">
                        {formatCurrency(calculateTotalPrice(item))}
                      </td>
                      <td className="border border-border px-2 py-1 text-right text-foreground font-mono bg-green-100 dark:bg-green-950/40">
                        {formatCurrency(calculateQuoteUnitPrice(item))}
                      </td>
                      <td className="border border-border px-2 py-1 text-right text-primary font-mono font-bold bg-green-100 dark:bg-green-950/40">
                        {formatCurrency(calculateQuoteTotal(item))}
                      </td>
                      <td className="border border-border px-1 py-1 text-center print:hidden">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeRow(item.id)}
                          className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                          disabled={items.length === 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Satır Ekle Butonu */}
            <div className="mt-4 print:hidden">
              <Button onClick={addRow} variant="outline" className="w-full md:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Yeni Satır Ekle
              </Button>
            </div>

            {/* Toplamlar */}
            <div className="flex justify-end mt-6">
              <div className="w-full md:w-96 space-y-2">
                <div className="flex justify-between items-center py-2 px-4 bg-muted/50 rounded">
                  <span className="font-medium text-foreground">Maliyet Toplam:</span>
                  <span className="font-mono text-foreground">{formatCurrency(totalCost)}</span>
                </div>
                <div className="flex justify-between items-center py-2 px-4 bg-muted/50 rounded">
                  <span className="font-medium text-foreground">Kâr:</span>
                  <span className="font-mono text-green-600 dark:text-green-400">{formatCurrency(totalProfit)}</span>
                </div>
                <div className="flex justify-between items-center py-2 px-4 bg-primary/10 rounded">
                  <span className="font-medium text-foreground">Toplam:</span>
                  <span className="font-mono font-semibold text-foreground">{formatCurrency(subTotal)}</span>
                </div>
                <div className="flex justify-between items-center py-2 px-4 bg-muted/50 rounded">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">KDV %</span>
                    <Input 
                      type="number"
                      min="0"
                      max="100"
                      value={kdvRate}
                      onChange={(e) => setKdvRate(parseFloat(e.target.value) || 0)}
                      className="w-16 h-7 text-sm text-center bg-background border-border text-foreground"
                    />
                  </div>
                  <span className="font-mono text-foreground">{formatCurrency(kdvAmount)}</span>
                </div>
                <div className="flex justify-between items-center py-3 px-4 bg-primary text-primary-foreground rounded font-bold text-lg">
                  <span>GENEL TOPLAM:</span>
                  <span className="font-mono">{formatCurrency(grandTotal)}</span>
                </div>
              </div>
            </div>

            {/* Alt Bilgi */}
            <div className="mt-6 pt-4 border-t border-border text-sm text-muted-foreground">
              <p>📞 Fiyat teklifi 15 gün süre geçerlidir.</p>
              <p className="mt-1">İletişim: 0(506) 389 68 00</p>
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
