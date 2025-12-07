import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import NewProducts from "@/components/NewProducts";
import Partners from "@/components/Partners";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Services />
      <NewProducts />
      <Partners />
      <Footer />
    </div>
  );
};

export default Index;