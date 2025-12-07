import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-tech.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-tech overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-tech opacity-80" />
      
      <div className="relative container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight">
            Teknoloji
            <span className="text-primary block">Çözümleri</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mb-6 md:mb-8 leading-relaxed max-w-2xl mx-auto">
            Bilgisayar, yazıcı, güvenlik sistemleri ve otomasyon çözümlerinde 
            <strong className="text-primary"> uzman ekibimizle</strong> yanınızdayız.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-8 md:mb-12 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-hero hover:shadow-tech text-base md:text-lg px-6 md:px-8 py-5 md:py-6 transition-bounce"
            >
              Hizmetlerimizi Keşfedin
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-gray-300 text-gray-700 hover:bg-gray-700 hover:text-white text-base md:text-lg px-6 md:px-8 py-5 md:py-6"
            >
              Fiyat Listesi
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-white max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1 md:mb-2">15+</div>
              <div className="text-xs md:text-sm">Yıl Tecrübe</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1 md:mb-2">1000+</div>
              <div className="text-xs md:text-sm">Mutlu Müşteri</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1 md:mb-2">24/7</div>
              <div className="text-xs md:text-sm">Destek</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1 md:mb-2">100%</div>
              <div className="text-xs md:text-sm">Garanti</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
