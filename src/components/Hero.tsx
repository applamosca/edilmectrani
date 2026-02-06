import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logoEdilmecHero from '@/assets/logo-edilmec-hero-red.jpeg';

const Hero = () => {
  const scrollToContacts = () => {
    const element = document.querySelector('#contatti');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToStory = () => {
    const element = document.querySelector('#storia');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black"
    >
      {/* Logo as Background - Centered */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center justify-center gap-6"
      >
        <img
          src={logoEdilmecHero}
          alt="EDILMEC S.A.S. - Officina Meccanica di Precisione"
          className="w-full max-w-lg md:max-w-3xl lg:max-w-4xl h-auto object-contain px-4"
        />
      </motion.div>

      {/* CTAs - Below the logo */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-6 mt-10"
      >
        <Button variant="hero" onClick={scrollToContacts}>
          Richiedi Preventivo Gratuito
        </Button>
        <Button variant="heroOutline" onClick={scrollToStory}>
          Scopri la Nostra Storia
        </Button>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-white/70 cursor-pointer"
          onClick={scrollToStory}
        >
          <ChevronDown className="w-8 h-8" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
