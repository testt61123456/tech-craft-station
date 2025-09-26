const Partners = () => {
  const partners = [
    {
      name: "Koç Sistem",
      logo: "https://via.placeholder.com/150x80/ffffff/333333?text=KOÇ+SİSTEM"
    },
    {
      name: "Yapı Kredi",
      logo: "https://via.placeholder.com/150x80/ffffff/333333?text=YAPI+KREDİ"
    },
    {
      name: "Akbank",
      logo: "https://via.placeholder.com/150x80/ffffff/333333?text=AKBANK"
    },
    {
      name: "Halkbank",
      logo: "https://via.placeholder.com/150x80/ffffff/333333?text=HALKBANK"
    }
  ];

  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-6">
            İş Ortaklarımız
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Güvenilir iş ortaklarımızla birlikte size en iyi hizmeti sunuyoruz
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
          {partners.map((partner, index) => (
            <div 
              key={index} 
              className="flex items-center justify-center p-6 bg-white rounded-lg shadow-sm hover:shadow-tech transition-bounce group"
            >
              <img 
                src={partner.logo} 
                alt={partner.name}
                className="max-h-16 max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;