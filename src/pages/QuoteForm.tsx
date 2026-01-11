import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Printer, RefreshCw, Save, FolderOpen, Edit, Search, Download } from "lucide-react";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import karadenizLogo from "@/assets/karadeniz-logo.png";
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
  quote_number: string | null;
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
  
  // Görüntüleme para birimi (sayfadaki tüm hesaplamalar için)
  const [displayCurrency, setDisplayCurrency] = useState<'TRY' | 'USD' | 'EUR'>('TRY');
  
  const [items, setItems] = useState<QuoteItem[]>([
    { id: 1, materialType: "", quantity: 1, price: 0, currency: 'USD', profitMargin: 20, kdvRate: 20 }
  ]);

  // Kayıtlı teklifler
  const [savedQuotes, setSavedQuotes] = useState<SavedQuote[]>([]);
  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const [showQuotesDialog, setShowQuotesDialog] = useState(false);
  const [editingQuoteId, setEditingQuoteId] = useState<string | null>(null);
  const [editingQuoteNumber, setEditingQuoteNumber] = useState<string | null>(null);
  const [deleteQuoteId, setDeleteQuoteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

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
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Sadece admin ve superadmin erişebilir
  if (userRole !== 'admin' && userRole !== 'superadmin') {
    return (
      <div className="min-h-screen bg-secondary">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-secondary-foreground">Erişim Reddedildi</h1>
            <p className="text-muted-foreground mt-2">Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
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

  // Görüntü para birimine göre formatla
  const formatDisplayCurrency = (valueTRY: number): string => {
    if (displayCurrency === 'USD') {
      const valueUSD = valueTRY / dollarRate;
      return valueUSD.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " $";
    } else if (displayCurrency === 'EUR') {
      const valueEUR = valueTRY / euroRate;
      return valueEUR.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
    }
    return valueTRY.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " ₺";
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " ₺";
  };

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    const element = printRef.current;
    if (!element) return;

    try {
      // Capture element as canvas with high quality
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      // Calculate dimensions for A4 format
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Add image with margins
      const margin = 10;
      const contentWidth = imgWidth - (margin * 2);
      const contentHeight = (canvas.height * contentWidth) / canvas.width;

      // Handle multi-page content if needed
      let heightLeft = contentHeight;
      let position = margin;

      pdf.addImage(
        canvas.toDataURL('image/jpeg', 0.98),
        'JPEG',
        margin,
        position,
        contentWidth,
        contentHeight
      );

      heightLeft -= (pageHeight - margin * 2);

      while (heightLeft > 0) {
        position = heightLeft - contentHeight + margin;
        pdf.addPage();
        pdf.addImage(
          canvas.toDataURL('image/jpeg', 0.98),
          'JPEG',
          margin,
          position,
          contentWidth,
          contentHeight
        );
        heightLeft -= (pageHeight - margin * 2);
      }

      // Save PDF
      pdf.save(`teklif-${editingQuoteNumber || 'yeni'}.pdf`);
    } catch (error) {
      console.error('PDF oluşturma hatası:', error);
      toast.error('PDF oluşturulamadı');
    }
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
    setEditingQuoteNumber(quote.quote_number);
    setShowQuotesDialog(false);
    setShowSearchResults(false);
    setSearchQuery("");
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
    setEditingQuoteNumber(null);
    setSearchQuery("");
    setShowSearchResults(false);
    toast.success("Yeni teklif formu hazır");
  };

  // Arama sonuçlarını filtrele
  const filteredQuotes = savedQuotes.filter(quote => {
    const query = searchQuery.toLowerCase();
    return (
      quote.company_name.toLowerCase().includes(query) ||
      (quote.quote_number && quote.quote_number.toLowerCase().includes(query)) ||
      (quote.city && quote.city.toLowerCase().includes(query)) ||
      (quote.phone && quote.phone.includes(query))
    );
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('tr-TR');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <Card className="bg-[#141414] border-[#2a2a2a] shadow-2xl">
          {/* Modern Header with Logo */}
          <div className="p-6 border-b border-[#2a2a2a]">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Logo and Editing Info */}
              <div className="flex items-center gap-4">
                <img src={karadenizLogo} alt="Karadeniz Logo" className="h-14 w-auto" />
                {editingQuoteId && editingQuoteNumber && (
                  <span className="text-sm bg-primary/20 text-primary px-3 py-1 rounded-full font-medium">
                    {editingQuoteNumber} - Düzenleniyor
                  </span>
                )}
              </div>
              
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (e.target.value.length > 0) {
                        setShowSearchResults(true);
                        fetchSavedQuotes();
                      } else {
                        setShowSearchResults(false);
                      }
                    }}
                    onFocus={() => {
                      if (searchQuery.length > 0) {
                        setShowSearchResults(true);
                      }
                    }}
                    placeholder="Teklif ara (No, Kurum, Şehir...)"
                    className="pl-10 bg-[#1a1a1a] border-[#333] text-white placeholder:text-gray-500 focus:border-primary"
                  />
                </div>
                {/* Search Results Dropdown */}
                {showSearchResults && searchQuery.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
                    {loadingQuotes ? (
                      <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                      </div>
                    ) : filteredQuotes.length === 0 ? (
                      <p className="text-gray-400 text-center py-4 text-sm">Sonuç bulunamadı</p>
                    ) : (
                      <div className="py-1">
                        {filteredQuotes.slice(0, 10).map((quote) => (
                          <button
                            key={quote.id}
                            onClick={() => handleLoadQuote(quote)}
                            className="w-full text-left px-4 py-3 hover:bg-[#252525] transition-colors border-b border-[#252525] last:border-b-0"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-primary font-mono text-xs mr-2">{quote.quote_number}</span>
                                <span className="text-white font-medium">{quote.company_name}</span>
                              </div>
                              <span className="text-gray-400 text-xs">{formatDate(quote.quote_date)}</span>
                            </div>
                            <p className="text-gray-400 text-xs mt-1">
                              {quote.city && `${quote.city} • `}{formatCurrency(quote.grand_total)}
                            </p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 print:hidden items-center">
                <Button 
                  variant="outline" 
                  onClick={handleNewQuote} 
                  className="bg-[#1a1a1a] border-[#333] text-gray-300 hover:bg-[#252525] hover:text-white hover:border-[#444]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni
                </Button>
                <Dialog open={showQuotesDialog} onOpenChange={setShowQuotesDialog}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      onClick={fetchSavedQuotes} 
                      className="bg-[#1a1a1a] border-[#333] text-gray-300 hover:bg-[#252525] hover:text-white hover:border-[#444]"
                    >
                      <FolderOpen className="w-4 h-4 mr-2" />
                      Kayıtlı Teklifler
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-[#1a1a1a] border-[#333]">
                    <DialogHeader>
                      <DialogTitle className="text-white">Kayıtlı Teklifler</DialogTitle>
                    </DialogHeader>
                    {loadingQuotes ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : savedQuotes.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">Kayıtlı teklif bulunmuyor</p>
                    ) : (
                      <div className="space-y-3">
                        {savedQuotes.map((quote) => (
                          <div key={quote.id} className="flex items-center justify-between p-4 bg-[#252525] rounded-lg border border-[#333] hover:border-[#444] transition-colors">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-primary font-mono text-xs">{quote.quote_number}</span>
                                <h4 className="font-semibold text-white">{quote.company_name}</h4>
                              </div>
                              <p className="text-sm text-gray-400">
                                {formatDate(quote.quote_date)} • {formatCurrency(quote.grand_total)}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleLoadQuote(quote)} className="bg-[#1a1a1a] border-[#333] text-gray-300 hover:bg-[#2a2a2a] hover:text-white">
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
                {/* Görüntü Kuru Seçimi */}
                <Select value={displayCurrency} onValueChange={(value: 'TRY' | 'USD' | 'EUR') => setDisplayCurrency(value)}>
                  <SelectTrigger className="w-28 bg-[#1a1a1a] border-[#333] text-white hover:border-[#444]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-[#333]">
                    <SelectItem value="TRY">₺ TRY</SelectItem>
                    <SelectItem value="USD">$ USD</SelectItem>
                    <SelectItem value="EUR">€ EUR</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleSaveQuote} disabled={saving} className="bg-green-600 hover:bg-green-700 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Kaydediliyor..." : editingQuoteId ? "Güncelle" : "Kaydet"}
                </Button>
                <Button onClick={handlePrint} className="bg-primary hover:bg-primary/90">
                  <Printer className="w-4 h-4 mr-2" />
                  Yazdır
                </Button>
                <Button onClick={handleDownloadPdf} variant="outline" className="bg-[#1a1a1a] border-[#333] text-gray-300 hover:bg-[#252525] hover:text-white hover:border-[#444]">
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>
              </div>
            </div>
          </div>
          
          <CardContent className="p-6">
            {/* Düzenleme Alanı - Sadece Ekranda */}
            <div className="print:hidden">

              {/* Firma Bilgileri & Kur Ayarları */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Sol - Firma Bilgileri */}
                <div className="bg-[#1a1a1a] rounded-xl p-5 border border-[#2a2a2a] space-y-4">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Müşteri Bilgileri</h3>
                  <div className="flex items-center gap-3">
                    <Label className="w-20 text-gray-400 font-medium">Kurum:</Label>
                    <Input
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Teklif yapılacak firma"
                      className="flex-1 bg-[#252525] border-[#333] text-white placeholder:text-gray-500 focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Label className="w-20 text-gray-400 font-medium">Şehir:</Label>
                    <Input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Şehir"
                      className="flex-1 bg-[#252525] border-[#333] text-white placeholder:text-gray-500 focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Label className="w-20 text-gray-400 font-medium">Telefon:</Label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Telefon numarası"
                      className="flex-1 bg-[#252525] border-[#333] text-white placeholder:text-gray-500 focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                </div>
                
                {/* Sağ - Tarih & Kur Ayarları */}
                <div className="bg-[#1a1a1a] rounded-xl p-5 border border-[#2a2a2a] space-y-4">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Tarih & Kur Ayarları</h3>
                  <div className="flex items-center gap-3">
                    <Label className="w-20 text-gray-400 font-medium">Tarih:</Label>
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="flex-1 bg-[#252525] border-[#333] text-white focus:border-primary [color-scheme:dark]"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Label className="w-20 text-gray-400 font-medium">Dolar ($):</Label>
                    <Input
                      type="number"
                      step="0.0001"
                      value={dollarRate}
                      onChange={(e) => setDollarRate(parseFloat(e.target.value) || 0)}
                      className="flex-1 bg-[#252525] border-[#333] text-white focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={fetchExchangeRates} 
                      disabled={loadingRates}
                      className="bg-[#252525] border-[#333] text-gray-300 hover:bg-[#2a2a2a] hover:text-white hover:border-[#444]"
                    >
                      <RefreshCw className={`w-4 h-4 ${loadingRates ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                  <div className="flex items-center gap-3">
                    <Label className="w-20 text-gray-400 font-medium">Euro (€):</Label>
                    <Input
                      type="number"
                      step="0.0001"
                      value={euroRate}
                      onChange={(e) => setEuroRate(parseFloat(e.target.value) || 0)}
                      className="flex-1 bg-[#252525] border-[#333] text-white focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Label className="w-20 text-gray-400 font-medium">Çıktı Kuru:</Label>
                    <Select value={printCurrency} onValueChange={(value: 'TRY' | 'USD' | 'EUR') => setPrintCurrency(value)}>
                      <SelectTrigger className="flex-1 bg-[#252525] border-[#333] text-white hover:border-[#444]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-[#333]">
                        <SelectItem value="TRY">₺ Türk Lirası</SelectItem>
                        <SelectItem value="USD">$ Amerikan Doları</SelectItem>
                        <SelectItem value="EUR">€ Euro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Tablo - Düzenleme */}
              <div className="overflow-x-auto rounded-xl border border-[#2a2a2a]">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-primary to-primary/80 text-white">
                      <th className="border-b border-[#333] px-3 py-3 text-center font-semibold w-12">NO</th>
                      <th className="border-b border-[#333] px-3 py-3 text-left font-semibold min-w-[180px]">MALZEME CİNSİ</th>
                      <th className="border-b border-[#333] px-3 py-3 text-center font-semibold w-16">ADET</th>
                      <th className="border-b border-[#333] px-3 py-3 text-center font-semibold w-24">FİYAT</th>
                      <th className="border-b border-[#333] px-3 py-3 text-center font-semibold w-24">KUR</th>
                      <th className="border-b border-[#333] px-3 py-3 text-center font-semibold w-16">KÂR %</th>
                      <th className="border-b border-[#333] px-3 py-3 text-center font-semibold w-16">KDV %</th>
                      <th className="border-b border-[#333] px-3 py-3 text-right font-semibold w-28">BİRİM FİYATI</th>
                      <th className="border-b border-[#333] px-3 py-3 text-right font-semibold w-28">TOPLAM FİYATI</th>
                      <th className="border-b border-[#333] px-3 py-3 text-right font-semibold w-28">TKLF BİRİM FYT</th>
                      <th className="border-b border-[#333] px-3 py-3 text-right font-semibold w-28">TEKLİF TOPLAM</th>
                      <th className="border-b border-[#333] px-3 py-3 text-center w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={item.id} className="hover:bg-[#1f1f1f] transition-colors bg-[#181818] border-b border-[#252525]">
                        <td className="px-3 py-2 text-center text-gray-300 font-medium">
                          {index + 1}
                        </td>
                        <td className="px-1 py-1">
                          <Input
                            value={item.materialType}
                            onChange={(e) => updateItem(item.id, "materialType", e.target.value)}
                            className="h-9 text-sm bg-[#252525] border-[#333] text-white placeholder:text-gray-500 focus:border-primary"
                            placeholder="Malzeme adı"
                          />
                        </td>
                        <td className="px-1 py-1">
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 1)}
                            className="h-9 text-sm bg-[#252525] border-[#333] text-white text-center focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </td>
                        <td className="px-1 py-1">
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.price}
                            onChange={(e) => updateItem(item.id, "price", parseFloat(e.target.value) || 0)}
                            className="h-9 text-sm bg-[#252525] border-[#333] text-white text-right focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </td>
                        <td className="px-1 py-1">
                          <Select 
                            value={item.currency} 
                            onValueChange={(value: 'USD' | 'EUR' | 'TRY') => updateItem(item.id, 'currency', value)}
                          >
                            <SelectTrigger className="h-9 text-sm bg-[#252525] border-[#333] text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1a1a1a] border-[#333]">
                              <SelectItem value="USD">$ USD</SelectItem>
                              <SelectItem value="EUR">€ EUR</SelectItem>
                              <SelectItem value="TRY">₺ TRY</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-1 py-1">
                          <Input
                            type="number"
                            step="1"
                            min="0"
                            max="100"
                            value={item.profitMargin}
                            onChange={(e) => updateItem(item.id, "profitMargin", parseFloat(e.target.value) || 0)}
                            className="h-9 text-sm bg-[#252525] border-[#333] text-white text-center focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </td>
                        <td className="px-1 py-1">
                          <Input
                            type="number"
                            step="1"
                            min="0"
                            max="100"
                            value={item.kdvRate}
                            onChange={(e) => updateItem(item.id, "kdvRate", parseFloat(e.target.value) || 0)}
                            className="h-9 text-sm bg-[#252525] border-[#333] text-white text-center focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </td>
                        <td className="px-3 py-2 text-right text-gray-300 font-mono bg-[#1f1f1f]">
                          {formatDisplayCurrency(calculateUnitPriceTRY(item))}
                        </td>
                        <td className="px-3 py-2 text-right text-gray-300 font-mono bg-[#1f1f1f]">
                          {formatDisplayCurrency(calculateTotalPrice(item))}
                        </td>
                        <td className="px-3 py-2 text-right text-emerald-400 font-mono bg-emerald-950/30">
                          {formatDisplayCurrency(calculateQuoteUnitPrice(item))}
                        </td>
                        <td className="px-3 py-2 text-right text-primary font-mono font-bold bg-primary/10">
                          {formatDisplayCurrency(calculateQuoteTotalWithoutKdv(item))}
                        </td>
                        <td className="px-2 py-1 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeRow(item.id)}
                            className="h-8 w-8 p-0 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
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
                <Button 
                  onClick={addRow} 
                  variant="outline" 
                  className="w-full md:w-auto bg-[#1a1a1a] border-[#333] border-dashed text-gray-300 hover:bg-[#252525] hover:text-white hover:border-primary/50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni Satır Ekle
                </Button>
              </div>

              {/* Toplamlar - Düzenleme */}
              <div className="flex justify-end mt-6">
                <div className="w-full md:w-96 space-y-2">
                  <div className="flex justify-between items-center py-3 px-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg">
                    <span className="font-medium text-gray-400">Toplam:</span>
                    <span className="font-mono text-white">{formatDisplayCurrency(teklifToplam)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 px-4 bg-emerald-950/30 border border-emerald-900/50 rounded-lg">
                    <span className="font-medium text-emerald-400">Kâr:</span>
                    <span className="font-mono text-emerald-400">{formatDisplayCurrency(karGenel)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 px-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg">
                    <span className="font-medium text-gray-400">KDV ({avgKdvRate.toFixed(0)}%):</span>
                    <span className="font-mono text-white">{formatDisplayCurrency(teklifKdv)}</span>
                  </div>
                  <div className="flex justify-between items-center py-4 px-4 bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg font-bold text-lg shadow-lg shadow-primary/20">
                    <span>GENEL TOPLAM:</span>
                    <span className="font-mono">{formatDisplayCurrency(genelToplamTeklif)}</span>
                  </div>
                </div>
              </div>

              {/* Alt Bilgi */}
              <div className="mt-8 pt-4 border-t border-[#2a2a2a] text-sm text-gray-400">
                <p>📞 Fiyat teklifi 15 gün süre geçerlidir.</p>
                <p className="mt-1">İletişim: 0(506) 389 68 00</p>
              </div>
            </div>

            {/* YAZDIRMA ALANI - A4 Modern Tasarım */}
            <div ref={printRef} className="hidden print:block print-area" style={{ background: 'white' }}>
              {/* Header - Logo Daha Büyük ve Teklif No */}
              <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-gray-300">
                {/* Sol - Logo Büyük */}
                <img src={karadenizLogo} alt="Logo" className="h-20 w-auto" />
                
                {/* Sağ - Teklif No, Tarih ve Kur */}
                <div className="text-right text-xs">
                  {editingQuoteNumber && (
                    <p className="font-bold text-gray-900 text-sm mb-1">No: {editingQuoteNumber.replace('TKL-', '')}</p>
                  )}
                  <p className="font-semibold text-gray-800">
                    {new Date(date).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-gray-500">1 $ = {dollarRate.toFixed(2)} ₺</p>
                  {printCurrency === 'EUR' && (
                    <p className="text-gray-500">1 € = {euroRate.toFixed(2)} ₺</p>
                  )}
                </div>
              </div>

              {/* Firma Bilgileri */}
              <div className="mb-4 text-xs text-gray-700">
                <p><span className="font-semibold">Kurum:</span> {companyName}</p>
                {city && <p><span className="font-semibold">Şehir:</span> {city}</p>}
                {phone && <p><span className="font-semibold">Telefon:</span> {phone}</p>}
              </div>

              {/* Tablo - Yazdırma */}
              <table className="w-full border-collapse text-xs mb-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-2 py-1.5 text-center font-semibold w-8 text-gray-800">NO</th>
                    <th className="border border-gray-300 px-2 py-1.5 text-left font-semibold text-gray-800">MALZEME CİNSİ</th>
                    <th className="border border-gray-300 px-2 py-1.5 text-center font-semibold w-12 text-gray-800">ADET</th>
                    <th className="border border-gray-300 px-2 py-1.5 text-right font-semibold w-28 text-gray-800">BİRİM FİYAT</th>
                    <th className="border border-gray-300 px-2 py-1.5 text-right font-semibold w-32 text-gray-800">TOPLAM</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id}>
                      <td className="border border-gray-300 px-2 py-1 text-center text-gray-700">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-left text-gray-700">
                        {item.materialType || '-'}
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-center text-gray-700">
                        {item.quantity}
                      </td>
                      <td className="border border-gray-300 px-2 py-1.5 text-right font-mono text-gray-700 whitespace-nowrap">
                        {formatPrintCurrency(calculateQuoteUnitPrice(item))}
                      </td>
                      <td className="border border-gray-300 px-2 py-1.5 text-right font-mono font-medium text-gray-800 whitespace-nowrap">
                        {formatPrintCurrency(calculateQuoteTotalWithoutKdv(item))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Footer ve Toplamlar - Sayfanın En Altına Sabitlenecek */}
              <div className="print-bottom-section">
                <div className="flex justify-between items-end">
                  {/* Footer - İletişim - Sol Alt */}
                  <div className="text-xs text-gray-500">
                    <p>Fiyat teklifi 15 gün süre geçerlidir.</p>
                    <p>İletişim: 0(506) 389 68 00</p>
                  </div>

                  {/* Toplamlar - Sağ Alt - Tablo Formatı */}
                  <table className="w-72 border-collapse text-sm totals-table">
                    <tbody>
                      <tr>
                        <td className="border border-gray-400 px-3 py-1.5 text-left text-gray-700 font-medium bg-white">Toplam:</td>
                        <td className="border border-gray-400 px-3 py-1.5 text-right font-mono font-medium text-gray-800 bg-white whitespace-nowrap">{formatPrintCurrency(teklifToplam)}</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-400 px-3 py-1.5 text-left text-gray-700 font-medium bg-white">Toplam KDV (%{avgKdvRate.toFixed(0)}):</td>
                        <td className="border border-gray-400 px-3 py-1.5 text-right font-mono font-medium text-gray-800 bg-white whitespace-nowrap">{formatPrintCurrency(teklifKdv)}</td>
                      </tr>
                      <tr className="bg-gray-100">
                        <td className="border border-gray-400 px-3 py-2 text-left font-bold text-gray-900">GENEL TOPLAM:</td>
                        <td className="border border-gray-400 px-3 py-2 text-right font-mono font-bold text-gray-900 whitespace-nowrap">{formatPrintCurrency(genelToplamTeklif)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteQuoteId} onOpenChange={() => setDeleteQuoteId(null)}>
        <AlertDialogContent className="bg-[#1a1a1a] border-[#333]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Teklifi Sil</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Bu teklifi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#252525] text-white border-[#333] hover:bg-[#2a2a2a]">İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteQuote} className="bg-destructive text-white hover:bg-destructive/90">
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Print Styles - A4 Optimized - Single Page */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            box-sizing: border-box !important;
          }
          
          html, body {
            width: 210mm !important;
            height: auto !important;
            max-height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            overflow: hidden !important;
          }
          
          /* Hide everything except print area */
          body > * {
            display: none !important;
          }
          
          .print-area {
            display: block !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 190mm !important;
            max-height: 277mm !important;
            background: white !important;
            padding: 5mm !important;
            margin: 0 !important;
            overflow: hidden !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
          }
          
          .print-area,
          .print-area * {
            visibility: visible !important;
          }
          
          header, footer, nav, .print\\:hidden {
            display: none !important;
          }
          
          /* Remove all dark backgrounds and shadows */
          div, main, section, article {
            background: transparent !important;
            box-shadow: none !important;
          }
          
          /* Keep table borders */
          .print-area table,
          .print-area th,
          .print-area td {
            border: 1px solid #d1d5db !important;
          }
          
          /* Totals table special styling */
          .print-area .totals-table,
          .print-area .totals-table th,
          .print-area .totals-table td {
            border: 1px solid #9ca3af !important;
          }
          
          .print-area .bg-gray-100 {
            background-color: #f3f4f6 !important;
          }
          
          /* Bottom section at the end */
          .print-bottom-section {
            margin-top: auto !important;
            padding-top: 10px !important;
            border-top: 1px solid #e5e7eb !important;
          }
          
          /* Prevent page break */
          .print-area table {
            page-break-inside: avoid !important;
          }
          
          .print-area table tr {
            page-break-inside: avoid !important;
            page-break-after: auto !important;
          }
        }
      `}</style>
    </div>
  );
};

export default QuoteForm;
