import { motion } from 'framer-motion';
import { ChevronDown, Wrench, Cog, Zap } from 'lucide-react';
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
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={lavorazioneScintille}
          alt="Lavorazione di precisione con scintille"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/90 to-navy-deep/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-transparent to-navy-deep/50" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-10 hidden lg:block">
        <motion.div
          initial={{ opacity: 0, rotate: -90 }}
          animate={{ opacity: 0.1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <Cog className="w-64 h-64 text-white" />
        </motion.div>
      </div>

      {/* Content */}
      <div className="container relative z-10">
        <div className="max-w-4xl">
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="w-12 h-0.5 bg-orange-safety" />
            <span className="text-orange-safety font-body text-sm uppercase tracking-[0.3em]">
              Officina Meccanica a Trani dal 2008
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl text-white font-bold leading-tight mb-6"
          >
            L'Arte della{' '}
            <span className="text-orange-safety">Meccanica</span>
            <br />
            di Precisione
          </motion.h1>

          {/* Subheadline - The Superpower */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-steel-light font-body leading-relaxed mb-8 max-w-2xl"
          >
            <strong className="text-white">Se non esiste più, noi lo costruiamo.</strong>
            <br />
            Ricostruiamo pezzi meccanici fuori produzione partendo dal campione rotto o dal disegno tecnico.
          </motion.p>

          {/* Key Points */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap gap-6 mb-10"
          >
            {[
              { icon: Wrench, text: 'Tornitura CNC' },
              { icon: Zap, text: 'Saldature di Precisione' },
              { icon: Cog, text: 'Ricambi Introvabili' },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 text-white/80">
                <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-orange-safety" />
                </div>
                <span className="font-body text-sm uppercase tracking-wider">
                  {item.text}
                </span>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
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
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-white/50 cursor-pointer"
          onClick={scrollToStory}
        >
          <ChevronDown className="w-8 h-8" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
