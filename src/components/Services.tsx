import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Cpu, Flame, Settings, RefreshCw, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import tornioUrsus from '@/assets/tornio-ursus.jpg';
import cncJupiter from '@/assets/cnc-jupiter.jpg';
import fresatrice from '@/assets/fresatrice.jpg';
import segatrice from '@/assets/segatrice-bianco.jpg';

const services = [
  {
    icon: Cpu,
    title: 'Tornitura e Programmazione CNC',
    description:
      'Lavorazioni di precisione con torni a controllo numerico. Programmazione diretta in macchina per geometrie complesse.',
    keywords: ['Tornitura CNC Puglia', 'Programmazione CNC Trani'],
    image: tornioUrsus,
  },
  {
    icon: Settings,
    title: 'Costruzioni Meccaniche',
    description:
      'Realizzazione di componenti meccanici su misura, dalla prototipazione alla produzione in serie.',
    keywords: ['Costruzioni meccaniche BAT', 'Componenti su misura'],
    image: cncJupiter,
  },
  {
    icon: Flame,
    title: 'Saldature di Precisione',
    description:
      'Saldature TIG, MIG e ad elettrodo per acciaio, inox e alluminio. Riparazioni strutturali e costruzioni.',
    keywords: ['Saldature industriali', 'Riparazioni metallo'],
    image: fresatrice,
  },
  {
    icon: RefreshCw,
    title: 'Manutenzione Impianti',
    description:
      'Interventi di manutenzione ordinaria e straordinaria su macchinari industriali e impianti produttivi.',
    keywords: ['Manutenzione industriale BAT', 'Riparazione macchinari'],
    image: segatrice,
  },
];

const Services = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const scrollToContacts = () => {
    const element = document.querySelector('#contatti');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="servizi" className="section-padding bg-navy relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container relative" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 text-orange-safety font-body text-sm uppercase tracking-[0.3em] mb-4">
            <span className="w-8 h-0.5 bg-orange-safety" />
            I Nostri Servizi
            <span className="w-8 h-0.5 bg-orange-safety" />
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-white font-bold mb-6">
            Competenze al Tuo <span className="text-orange-safety">Servizio</span>
          </h2>
          <p className="text-steel-light text-lg font-body leading-relaxed">
            Dalla tornitura CNC alla ricostruzione di pezzi introvabili,
            offriamo soluzioni complete per l'industria meccanica.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group relative bg-navy-light rounded-lg overflow-hidden hover:shadow-heavy transition-all duration-500"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-light via-navy-light/50 to-transparent" />
                <div className="absolute top-4 left-4 w-12 h-12 rounded-lg bg-orange-safety flex items-center justify-center">
                  <service.icon className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-display text-xl text-white font-semibold mb-3">
                  {service.title}
                </h3>
                <p className="font-body text-steel-light leading-relaxed mb-4">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {service.keywords.map((keyword, i) => (
                    <span
                      key={i}
                      className="text-xs font-body text-orange-safety bg-orange-safety/10 px-3 py-1 rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Superpower Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative bg-gradient-to-r from-orange-safety to-orange-safety-hover rounded-2xl p-8 md:p-12 overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block text-white/80 font-body text-sm uppercase tracking-[0.3em] mb-4">
                Il Nostro Superpotere
              </span>
              <h3 className="font-display text-3xl md:text-4xl text-white font-bold mb-4">
                "Se non esiste più,
                <br />
                noi lo costruiamo"
              </h3>
              <p className="font-body text-white/90 text-lg leading-relaxed mb-6">
                Il tuo pezzo di ricambio è fuori produzione? Portaci il campione rotto o il disegno
                tecnico: lo ricreiamo da zero, identico all'originale o migliorato secondo le tue esigenze.
              </p>
              <Button
                variant="heroOutline"
                onClick={scrollToContacts}
                className="group"
              >
                Richiedi preventivo per il tuo pezzo introvabile
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            <div className="text-center">
              <div className="inline-block">
                <RefreshCw className="w-32 h-32 text-white/20 animate-spin" style={{ animationDuration: '20s' }} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
