import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Story from '@/components/Story';
import Services from '@/components/Services';
import ParcoMacchine from '@/components/ParcoMacchine';
import RiportoFreddo from '@/components/RiportoFreddo';
import Gallery from '@/components/Gallery';
import Method from '@/components/Method';
import FAQ from '@/components/FAQ';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Story />
      <Gallery />
      <Services />
      <ParcoMacchine />
      <RiportoFreddo />
      <Method />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  );
};

export default Index;
