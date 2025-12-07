import { Handshake } from "lucide-react";

const Partners = () => {
  const partners = [
    { name: "HP", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/HP_logo_2012.svg/150px-HP_logo_2012.svg.png" },
    { name: "Dell", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Dell_Logo.svg/150px-Dell_Logo.svg.png" },
    { name: "Lenovo", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Lenovo_logo_2015.svg/150px-Lenovo_logo_2015.svg.png" },
    { name: "ASUS", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/ASUS_Logo.svg/150px-ASUS_Logo.svg.png" },
    { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/150px-Microsoft_logo_%282012%29.svg.png" },
    { name: "Canon", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Canon_wordmark.svg/150px-Canon_wordmark.svg.png" }
  ];

  return (
    <section className="py-20 md:py-28 bg-secondary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Handshake className="w-5 h-5 text-primary" />
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Güvenilir Markalar
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            İş Ortaklarımız
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Dünya çapında güvenilir markalarla çalışarak size en iyi hizmeti sunuyoruz
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {partners.map((partner, index) => (
            <div 
              key={index} 
              className="group flex items-center justify-center h-24 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 hover:border-primary/30 transition-all duration-300"
            >
              <img 
                src={partner.logo} 
                alt={partner.name}
                className="max-h-10 max-w-[100px] object-contain filter brightness-0 invert opacity-60 group-hover:opacity-100 transition-all duration-300"
                onError={(e) => {
                  // Fallback to text if image fails
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="text-white/60 font-semibold text-lg group-hover:text-white transition-colors">${partner.name}</span>`;
                }}
              />
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-8 mt-16">
          {[
            { icon: "✓", text: "Yetkili Servis" },
            { icon: "✓", text: "Orijinal Parça" },
            { icon: "✓", text: "Garantili Hizmet" }
          ].map((badge, index) => (
            <div key={index} className="flex items-center gap-2 text-white/70">
              <span className="w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm">
                {badge.icon}
              </span>
              <span>{badge.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
