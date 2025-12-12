import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Printer, FileText, RefreshCw, Save, FolderOpen, Edit, Download } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface QuoteItem {
  id: number;
  materialType: string;
  quantity: number;
  price: number;
  currency: 'USD' | 'EUR' | 'TRY';
  profitMargin: number;
  kdvRate: number;
}

interface SavedQuote {
  id: string;
  company_name: string;
  city: string | null;
  phone: string | null;
  quote_date: string;
  dollar_rate: number;
  euro_rate: number;
  items: QuoteItem[];
  total_amount: number;
  grand_total: number;
  profit_amount: number;
  print_currency: string;
  created_at: string;
}

const QuoteForm = () => {
  const { userRole, loading, user } = useAuth();
  const [companyName, setCompanyName] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [printCurrency, setPrintCurrency] = useState<'TRY' | 'USD' | 'EUR'>('TRY');
  
  // Kur değerleri
  const [dollarRate, setDollarRate] = useState(35);
  const [euroRate, setEuroRate] = useState(38);
  const [loadingRates, setLoadingRates] = useState(false);
  
  const [items, setItems] = useState<QuoteItem[]>([
    { id: 1, materialType: "", quantity: 1, price: 0, currency: 'USD', profitMargin: 20, kdvRate: 20 }
  ]);

  // Kayıtlı teklifler
  const [savedQuotes, setSavedQuotes] = useState<SavedQuote[]>([]);
  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const [showQuotesDialog, setShowQuotesDialog] = useState(false);
  const [editingQuoteId, setEditingQuoteId] = useState<string | null>(null);
  const [deleteQuoteId, setDeleteQuoteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // TCMB'den kur çekme
  const fetchExchangeRates = async () => {
    setLoadingRates(true);
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/TRY');
      const data = await response.json();
      if (data.rates) {
        const usdRate = 1 / data.rates.USD;
        const eurRate = 1 / data.rates.EUR;
        setDollarRate(parseFloat(usdRate.toFixed(4)));
        setEuroRate(parseFloat(eurRate.toFixed(4)));
        toast.success("Kurlar güncellendi");
      }
    } catch (error) {
      console.error("Kur çekme hatası:", error);
      toast.error("Kurlar çekilemedi, varsayılan değerler kullanılıyor");
    } finally {
      setLoadingRates(false);
    }
  };

  const fetchSavedQuotes = async () => {
    setLoadingQuotes(true);
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedQuotes = (data || []).map(q => ({
        ...q,
        items: Array.isArray(q.items) ? q.items as unknown as QuoteItem[] : []
      }));
      
      setSavedQuotes(formattedQuotes);
    } catch (error) {
      console.error("Teklifler yüklenemedi:", error);
      toast.error("Kayıtlı teklifler yüklenemedi");
    } finally {
      setLoadingQuotes(false);
    }
  };

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Sadece admin ve superadmin erişebilir
  if (userRole !== 'admin' && userRole !== 'superadmin') {
    return (
      <div className="min-h-screen bg-slate-950">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-white">Erişim Reddedildi</h1>
            <p className="text-slate-400 mt-2">Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Birim Fiyatı = Fiyat * Kur (TL'ye çevir)
  const calculateUnitPriceTRY = (item: QuoteItem): number => {
    if (item.currency === 'USD') {
      return item.price * dollarRate;
    } else if (item.currency === 'EUR') {
      return item.price * euroRate;
    }
    return item.price;
  };

  // Toplam Fiyat = Birim Fiyat * Adet
  const calculateTotalPrice = (item: QuoteItem): number => {
    return calculateUnitPriceTRY(item) * item.quantity;
  };

  // Teklif Birim Fiyat = (Birim Fiyat * Kâr) + Birim Fiyat
  const calculateQuoteUnitPrice = (item: QuoteItem): number => {
    const unitPrice = calculateUnitPriceTRY(item);
    return (unitPrice * item.profitMargin / 100) + unitPrice;
  };

  // Teklif Toplam Fiyat = Teklif Birim Fiyat * Adet
  const calculateQuoteTotalWithoutKdv = (item: QuoteItem): number => {
    return calculateQuoteUnitPrice(item) * item.quantity;
  };

  // Döviz cinsine göre fiyat formatla
  const formatPrintCurrency = (valueTRY: number): string => {
    if (printCurrency === 'USD') {
      const valueUSD = valueTRY / dollarRate;
      return valueUSD.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " $";
    } else if (printCurrency === 'EUR') {
      const valueEUR = valueTRY / euroRate;
      return valueEUR.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
    }
    return valueTRY.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " ₺";
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
      { id: newId, materialType: "", quantity: 1, price: 0, currency: 'USD', profitMargin: 20, kdvRate: 20 }
    ]);
  };

  const removeRow = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  // Maliyet Toplam Fiyat = Toplam Fiyat Sütunu Toplamı
  const maliyetToplam = items.reduce((sum, item) => sum + calculateTotalPrice(item), 0);
  
  // Teklif Toplam Fiyat = Teklif Toplam Sütunu Toplamı
  const teklifToplam = items.reduce((sum, item) => sum + calculateQuoteTotalWithoutKdv(item), 0);
  
  // Kâr Toplam Fiyat = Teklif Toplam Fiyat – Maliyet Toplam Fiyat
  const karToplam = teklifToplam - maliyetToplam;
  
  // Maliyet Toplam Fiyat KDV = Maliyet Toplam Fiyat * KDV (ortalama KDV kullan)
  const avgKdvRate = items.length > 0 ? items.reduce((sum, item) => sum + item.kdvRate, 0) / items.length : 20;
  const maliyetKdv = maliyetToplam * avgKdvRate / 100;
  
  // Teklif Toplam Fiyat KDV = Teklif Toplam Fiyat * KDV
  const teklifKdv = teklifToplam * avgKdvRate / 100;
  
  // Kâr KDV Fiyat = Teklif Toplam Fiyat KDV - Maliyet Toplam Fiyat KDV
  const karKdv = teklifKdv - maliyetKdv;
  
  // Genel Toplam Maliyet = Maliyet Toplam Fiyat + Maliyet Toplam Fiyat KDV
  const genelToplamMaliyet = maliyetToplam + maliyetKdv;
  
  // Kâr = Kâr Toplam Fiyat + Kâr KDV Fiyat
  const karGenel = karToplam + karKdv;
  
  // Genel Toplam Teklif Fiyat = Teklif Toplam Fiyat + Teklif Toplam Fiyat KDV
  const genelToplamTeklif = teklifToplam + teklifKdv;

  const formatCurrency = (value: number) => {
    return value.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " ₺";
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveQuote = async () => {
    if (!companyName.trim()) {
      toast.error("Lütfen kurum adı girin");
      return;
    }

    setSaving(true);
    try {
      const quoteData = {
        company_name: companyName,
        city: city || null,
        phone: phone || null,
        quote_date: new Date(date).toISOString(),
        dollar_rate: dollarRate,
        euro_rate: euroRate,
        items: JSON.parse(JSON.stringify(items)),
        total_amount: teklifToplam,
        total_kdv: teklifKdv,
        grand_total: genelToplamTeklif,
        profit_amount: karGenel,
        print_currency: printCurrency,
        created_by: user?.id || null
      };

      if (editingQuoteId) {
        const { error } = await supabase
          .from('quotes')
          .update(quoteData)
          .eq('id', editingQuoteId);
        
        if (error) throw error;
        toast.success("Teklif güncellendi");
        setEditingQuoteId(null);
      } else {
        const { error } = await supabase
          .from('quotes')
          .insert([quoteData]);
        
        if (error) throw error;
        toast.success("Teklif kaydedildi");
      }

      await fetchSavedQuotes();
    } catch (error) {
      console.error("Kaydetme hatası:", error);
      toast.error("Teklif kaydedilemedi");
    } finally {
      setSaving(false);
    }
  };

  const handleLoadQuote = (quote: SavedQuote) => {
    setCompanyName(quote.company_name);
    setCity(quote.city || "");
    setPhone(quote.phone || "");
    setDate(quote.quote_date.split('T')[0]);
    setDollarRate(Number(quote.dollar_rate));
    setEuroRate(Number(quote.euro_rate));
    setItems(quote.items);
    setPrintCurrency(quote.print_currency as 'TRY' | 'USD' | 'EUR');
    setEditingQuoteId(quote.id);
    setShowQuotesDialog(false);
    toast.success("Teklif yüklendi");
  };

  const handleDeleteQuote = async () => {
    if (!deleteQuoteId) return;

    try {
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', deleteQuoteId);
      
      if (error) throw error;
      toast.success("Teklif silindi");
      await fetchSavedQuotes();
    } catch (error) {
      console.error("Silme hatası:", error);
      toast.error("Teklif silinemedi");
    } finally {
      setDeleteQuoteId(null);
    }
  };

  const handleNewQuote = () => {
    setCompanyName("");
    setCity("");
    setPhone("");
    setDate(new Date().toISOString().split('T')[0]);
    setItems([{ id: 1, materialType: "", quantity: 1, price: 0, currency: 'USD', profitMargin: 20, kdvRate: 20 }]);
    setEditingQuoteId(null);
    toast.success("Yeni teklif formu hazır");
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('tr-TR');
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <Card className="bg-slate-900 border-slate-700 shadow-xl">
          <CardHeader className="border-b border-slate-700">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <FileText className="w-10 h-10 text-primary" />
                <div>
                  <CardTitle className="text-2xl font-bold text-white">Teklif Formu</CardTitle>
                  {editingQuoteId && (
                    <span className="text-sm text-primary">Düzenleniyor</span>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 print:hidden">
                <Button variant="outline" onClick={handleNewQuote} className="border-slate-600 text-slate-300 hover:bg-slate-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni
                </Button>
                <Dialog open={showQuotesDialog} onOpenChange={setShowQuotesDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" onClick={fetchSavedQuotes} className="border-slate-600 text-slate-300 hover:bg-slate-700">
                      <FolderOpen className="w-4 h-4 mr-2" />
                      Kayıtlı Teklifler
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-slate-900 border-slate-700">
                    <DialogHeader>
                      <DialogTitle className="text-white">Kayıtlı Teklifler</DialogTitle>
                    </DialogHeader>
                    {loadingQuotes ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : savedQuotes.length === 0 ? (
                      <p className="text-slate-400 text-center py-8">Kayıtlı teklif bulunmuyor</p>
                    ) : (
                      <div className="space-y-3">
                        {savedQuotes.map((quote) => (
                          <div key={quote.id} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700">
                            <div>
                              <h4 className="font-semibold text-white">{quote.company_name}</h4>
                              <p className="text-sm text-slate-400">
                                {formatDate(quote.quote_date)} • {formatCurrency(quote.grand_total)}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleLoadQuote(quote)} className="border-slate-600 text-slate-300 hover:bg-slate-700">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => setDeleteQuoteId(quote.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                <Button onClick={handleSaveQuote} disabled={saving} className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Kaydediliyor..." : editingQuoteId ? "Güncelle" : "Kaydet"}
                </Button>
                <Button onClick={handlePrint}>
                  <Printer className="w-4 h-4 mr-2" />
                  Yazdır
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            {/* Düzenleme Alanı - Sadece Ekranda */}
            <div className="print:hidden">
              {/* Firma Logosu */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-primary">Karadeniz</h2>
                <p className="text-slate-400">Bilişim Teknolojileri</p>
              </div>

              {/* Firma Bilgileri & Kur Ayarları */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Sol - Firma Bilgileri */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Label className="w-20 text-slate-300 font-medium">Kurum:</Label>
                    <Input
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Teklif yapılacak firma"
                      className="flex-1 bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Label className="w-20 text-slate-300 font-medium">Şehir:</Label>
                    <Input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Şehir"
                      className="flex-1 bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Label className="w-20 text-slate-300 font-medium">Telefon:</Label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Telefon numarası"
                      className="flex-1 bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>
                </div>
                
                {/* Sağ - Tarih & Kur Ayarları */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Label className="w-20 text-slate-300 font-medium">Tarih:</Label>
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="flex-1 bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Label className="w-20 text-slate-300 font-medium">Dolar ($):</Label>
                    <Input
                      type="number"
                      step="0.0001"
                      value={dollarRate}
                      onChange={(e) => setDollarRate(parseFloat(e.target.value) || 0)}
                      className="flex-1 bg-slate-800 border-slate-600 text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={fetchExchangeRates} 
                      disabled={loadingRates}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <RefreshCw className={`w-4 h-4 ${loadingRates ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                  <div className="flex items-center gap-3">
                    <Label className="w-20 text-slate-300 font-medium">Euro (€):</Label>
                    <Input
                      type="number"
                      step="0.0001"
                      value={euroRate}
                      onChange={(e) => setEuroRate(parseFloat(e.target.value) || 0)}
                      className="flex-1 bg-slate-800 border-slate-600 text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Label className="w-20 text-slate-300 font-medium">Çıktı Kuru:</Label>
                    <Select value={printCurrency} onValueChange={(value: 'TRY' | 'USD' | 'EUR') => setPrintCurrency(value)}>
                      <SelectTrigger className="flex-1 bg-slate-800 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TRY">₺ Türk Lirası</SelectItem>
                        <SelectItem value="USD">$ Amerikan Doları</SelectItem>
                        <SelectItem value="EUR">€ Euro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Tablo - Düzenleme */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-primary text-primary-foreground">
                      <th className="border border-slate-600 px-2 py-2 text-center font-semibold w-12">NO</th>
                      <th className="border border-slate-600 px-2 py-2 text-left font-semibold min-w-[180px]">MALZEME CİNSİ</th>
                      <th className="border border-slate-600 px-2 py-2 text-center font-semibold w-16">ADET</th>
                      <th className="border border-slate-600 px-2 py-2 text-center font-semibold w-24">FİYAT</th>
                      <th className="border border-slate-600 px-2 py-2 text-center font-semibold w-24">KUR</th>
                      <th className="border border-slate-600 px-2 py-2 text-center font-semibold w-16">KÂR %</th>
                      <th className="border border-slate-600 px-2 py-2 text-center font-semibold w-16">KDV %</th>
                      <th className="border border-slate-600 px-2 py-2 text-right font-semibold w-28">BİRİM FİYATI</th>
                      <th className="border border-slate-600 px-2 py-2 text-right font-semibold w-28">TOPLAM FİYATI</th>
                      <th className="border border-slate-600 px-2 py-2 text-right font-semibold w-28">TKLF BİRİM FYT</th>
                      <th className="border border-slate-600 px-2 py-2 text-right font-semibold w-28">TEKLİF TOPLAM</th>
                      <th className="border border-slate-600 px-2 py-2 text-center w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={item.id} className="hover:bg-slate-800/50 transition-colors bg-slate-800">
                        <td className="border border-slate-600 px-2 py-1 text-center text-white font-medium">
                          {index + 1}
                        </td>
                        <td className="border border-slate-600 px-1 py-1">
                          <Input
                            value={item.materialType}
                            onChange={(e) => updateItem(item.id, "materialType", e.target.value)}
                            className="h-8 text-sm bg-slate-700 border-0 focus:ring-1 text-white"
                            placeholder="Malzeme adı"
                          />
                        </td>
                        <td className="border border-slate-600 px-1 py-1">
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 1)}
                            className="h-8 text-sm bg-slate-700 border-0 focus:ring-1 text-center text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </td>
                        <td className="border border-slate-600 px-1 py-1">
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.price}
                            onChange={(e) => updateItem(item.id, "price", parseFloat(e.target.value) || 0)}
                            className="h-8 text-sm bg-slate-700 border-0 focus:ring-1 text-right text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </td>
                        <td className="border border-slate-600 px-1 py-1">
                          <Select 
                            value={item.currency} 
                            onValueChange={(value: 'USD' | 'EUR' | 'TRY') => updateItem(item.id, 'currency', value)}
                          >
                            <SelectTrigger className="h-8 text-sm border-0 bg-slate-700 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USD">$ USD</SelectItem>
                              <SelectItem value="EUR">€ EUR</SelectItem>
                              <SelectItem value="TRY">₺ TRY</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="border border-slate-600 px-1 py-1">
                          <Input
                            type="number"
                            step="1"
                            min="0"
                            max="100"
                            value={item.profitMargin}
                            onChange={(e) => updateItem(item.id, "profitMargin", parseFloat(e.target.value) || 0)}
                            className="h-8 text-sm bg-slate-700 border-0 focus:ring-1 text-center text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </td>
                        <td className="border border-slate-600 px-1 py-1">
                          <Input
                            type="number"
                            step="1"
                            min="0"
                            max="100"
                            value={item.kdvRate}
                            onChange={(e) => updateItem(item.id, "kdvRate", parseFloat(e.target.value) || 0)}
                            className="h-8 text-sm bg-slate-700 border-0 focus:ring-1 text-center text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </td>
                        <td className="border border-slate-600 px-2 py-1 text-right text-white font-mono bg-slate-700/50">
                          {formatCurrency(calculateUnitPriceTRY(item))}
                        </td>
                        <td className="border border-slate-600 px-2 py-1 text-right text-white font-mono bg-slate-700/50">
                          {formatCurrency(calculateTotalPrice(item))}
                        </td>
                        <td className="border border-slate-600 px-2 py-1 text-right text-white font-mono bg-green-900/40">
                          {formatCurrency(calculateQuoteUnitPrice(item))}
                        </td>
                        <td className="border border-slate-600 px-2 py-1 text-right text-primary font-mono font-bold bg-primary/20">
                          {formatCurrency(calculateQuoteTotalWithoutKdv(item))}
                        </td>
                        <td className="border border-slate-600 px-1 py-1 text-center">
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
              <div className="mt-4">
                <Button onClick={addRow} variant="outline" className="w-full md:w-auto border-slate-600 text-slate-300 hover:bg-slate-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni Satır Ekle
                </Button>
              </div>

              {/* Toplamlar - Düzenleme */}
              <div className="flex justify-end mt-6">
                <div className="w-full md:w-96 space-y-2">
                  <div className="flex justify-between items-center py-2 px-4 bg-slate-800 rounded">
                    <span className="font-medium text-slate-300">Toplam:</span>
                    <span className="font-mono text-white">{formatCurrency(teklifToplam)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-4 bg-slate-800 rounded">
                    <span className="font-medium text-slate-300">Kâr:</span>
                    <span className="font-mono text-green-400">{formatCurrency(karGenel)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-4 bg-slate-800 rounded">
                    <span className="font-medium text-slate-300">KDV ({avgKdvRate.toFixed(0)}%):</span>
                    <span className="font-mono text-white">{formatCurrency(teklifKdv)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 px-4 bg-primary text-primary-foreground rounded font-bold text-lg">
                    <span>GENEL TOPLAM:</span>
                    <span className="font-mono">{formatCurrency(genelToplamTeklif)}</span>
                  </div>
                </div>
              </div>

              {/* Alt Bilgi */}
              <div className="mt-6 pt-4 border-t border-slate-700 text-sm text-slate-400">
                <p>📞 Fiyat teklifi 15 gün süre geçerlidir.</p>
                <p className="mt-1">İletişim: 0(506) 389 68 00</p>
              </div>
            </div>

            {/* YAZDIRMA ALANI - A4 Modern Tasarım */}
            <div className="hidden print:block print-area">
              {/* Header - Logo Sol, Kur/Tarih Sağ */}
              <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-gray-800">
                {/* Sol - Logo ve Firma Bilgileri */}
                <div className="flex flex-col">
                  <div className="mb-3">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">KARADENIZ</h1>
                    <p className="text-sm text-gray-600 font-medium">Bilişim Teknolojileri</p>
                  </div>
                  <div className="text-sm text-gray-700 space-y-0.5">
                    <p><strong>Kurum:</strong> {companyName}</p>
                    {city && <p><strong>Şehir:</strong> {city}</p>}
                    {phone && <p><strong>Telefon:</strong> {phone}</p>}
                  </div>
                </div>

                {/* Sağ - Tarih ve Kur */}
                <div className="text-right">
                  <div className="bg-gray-100 rounded-lg p-3 inline-block">
                    <p className="text-lg font-bold text-gray-800 mb-1">
                      {new Date(date).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                    {printCurrency === 'USD' && (
                      <p className="text-sm text-gray-600">1 $ = {dollarRate.toFixed(2)} ₺</p>
                    )}
                    {printCurrency === 'EUR' && (
                      <p className="text-sm text-gray-600">1 € = {euroRate.toFixed(2)} ₺</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Tablo - Yazdırma */}
              <table className="w-full border-collapse text-sm mb-6">
                <thead>
                  <tr className="bg-gray-800 text-white">
                    <th className="border border-gray-400 px-3 py-2 text-center font-semibold w-12">NO</th>
                    <th className="border border-gray-400 px-3 py-2 text-left font-semibold">MALZEME CİNSİ</th>
                    <th className="border border-gray-400 px-3 py-2 text-center font-semibold w-16">ADET</th>
                    <th className="border border-gray-400 px-3 py-2 text-right font-semibold w-32">BİRİM FİYAT</th>
                    <th className="border border-gray-400 px-3 py-2 text-right font-semibold w-32">TOPLAM FİYAT</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-gray-300 px-3 py-2 text-center font-medium">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-left">
                        {item.materialType || '-'}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center">
                        {item.quantity}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-right font-mono">
                        {formatPrintCurrency(calculateQuoteUnitPrice(item))}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-right font-mono font-semibold">
                        {formatPrintCurrency(calculateQuoteTotalWithoutKdv(item))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Toplamlar - Yazdırma */}
              <div className="flex justify-end">
                <div className="w-72">
                  <div className="flex justify-between items-center py-2 px-4 border-b border-gray-300">
                    <span className="font-medium text-gray-700">Toplam:</span>
                    <span className="font-mono font-semibold">{formatPrintCurrency(teklifToplam)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-4 border-b border-gray-300">
                    <span className="font-medium text-gray-700">KDV ({avgKdvRate.toFixed(0)}%):</span>
                    <span className="font-mono font-semibold">{formatPrintCurrency(teklifKdv)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 px-4 bg-gray-800 text-white rounded-b-lg font-bold text-lg">
                    <span>GENEL TOPLAM:</span>
                    <span className="font-mono">{formatPrintCurrency(genelToplamTeklif)}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-4 border-t border-gray-300 text-sm text-gray-600">
                <p className="font-medium">📞 Fiyat teklifi 15 gün süre geçerlidir.</p>
                <p className="mt-1">İletişim: 0(506) 389 68 00</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteQuoteId} onOpenChange={() => setDeleteQuoteId(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Teklifi Sil</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Bu teklifi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 text-white border-slate-600 hover:bg-slate-700">İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteQuote} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Print Styles - A4 */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 15mm;
          }
          
          html, body {
            width: 210mm;
            height: 297mm;
          }
          
          header, footer, .print\\:hidden, nav {
            display: none !important;
          }
          
          main {
            padding: 0 !important;
            margin: 0 !important;
          }
          
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            background-color: white !important;
            color: black !important;
          }
          
          .print-area {
            display: block !important;
            background: white !important;
          }
          
          * {
            box-shadow: none !important;
          }
          
          .bg-slate-900, .bg-slate-950 {
            background-color: white !important;
          }
          
          .border-slate-700 {
            border-color: transparent !important;
          }
          
          .shadow-xl {
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default QuoteForm;
