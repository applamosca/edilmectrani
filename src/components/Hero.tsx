import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logoEdilmecHero from '@/assets/logo-edilmec-hero.jpeg';

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
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image - Logo Edilmec */}
      <div className="absolute inset-0">
        <img
          src={logoEdilmecHero}
          alt="EDILMEC - Officina Meccanica di Precisione"
          className="w-full h-full object-contain md:object-cover bg-black"
        />
        {/* Subtle overlay for better contrast on buttons */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content - Only CTA, no title since image has logo */}
      <div className="container relative z-10 flex flex-col items-center justify-end min-h-screen pb-32">
        {/* CTAs at bottom */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button variant="hero" onClick={scrollToContacts}>
            Richiedi Preventivo Gratuito
          </Button>
          <Button variant="heroOutline" onClick={scrollToStory}>
            Scopri la Nostra Storia
          </Button>
        </motion.div>
      </div>

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
