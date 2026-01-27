import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import lavorazioneScintille from '@/assets/lavorazione-scintille.jpg';

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
      {/* Background Image - Sparks/Lathe */}
      <div className="absolute inset-0">
        <img
          src={lavorazioneScintille}
          alt="Lavorazione al tornio con scintille"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay 80% opacity */}
        <div className="absolute inset-0 bg-black/80" />
      </div>

      {/* Content */}
      <div className="container relative z-10 flex flex-col items-center justify-center text-center px-4">
        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-orange-safety mb-4"
        >
          EDILMEC S.A.S.
        </motion.h1>
        
        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-body text-xl md:text-2xl lg:text-3xl text-white mb-12"
        >
          Officina Meccanica di Precisione
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-6"
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
