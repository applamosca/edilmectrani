import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Cpu, Wrench, Settings, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const services = [
  {
    icon: Cpu,
    title: 'Tornitura e Fresatura CNC',
    description: 'Lavorazioni di precisione con torni e frese a controllo numerico. Programmazione diretta in macchina per geometrie complesse.',
  },
  {
    icon: Settings,
    title: 'Costruzione Ingranaggi e Componenti',
    description: 'Costruzione di ingranaggi a dentatura dritta e elicoidale, viti senza fine, corone in bronzo, cremagliere e componenti meccanici su misura da campioni o disegni.',
  },
  {
    icon: Wrench,
    title: 'Riparazioni e Saldature',
    description: 'Saldature TIG, MIG e ad elettrodo per acciaio, inox e alluminio. Riparazioni strutturali su macchinari industriali.',
  },
  {
    icon: Sparkles,
    title: 'Ripristino Sedi con RIPORTO A FREDDO',
    description: 'Servizio esclusivo di spruzzatura termica per il ripristino di sedi usurate su materiali non saldabili.',
    isExclusive: true,
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
    <section id="servizi" className="py-20 md:py-32 bg-navy-deep relative overflow-hidden">
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
          <span className="inline-flex items-center gap-2 text-red-edilmec font-body text-sm uppercase tracking-[0.3em] mb-4">
            <span className="w-8 h-0.5 bg-red-edilmec" />
            I Nostri Servizi
            <span className="w-8 h-0.5 bg-red-edilmec" />
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-white font-bold mb-6">
            Competenze al Tuo <span className="text-red-edilmec">Servizio</span>
          </h2>
          <p className="text-steel-light text-lg font-body leading-relaxed">
            Dalla tornitura CNC alla ricostruzione di pezzi introvabili,
            offriamo soluzioni complete per l'industria meccanica.
          </p>
        </motion.div>

        {/* Services List */}
        <div className="max-w-4xl mx-auto mb-16">
          <ul className="space-y-6">
            {services.map((service, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -40 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className={`flex items-start gap-6 p-6 rounded-lg transition-all duration-300 hover:bg-navy-light ${
                  service.isExclusive ? 'bg-navy-light border-l-4 border-red-edilmec' : 'bg-navy'
                }`}
              >
                <div className={`flex-shrink-0 w-14 h-14 rounded-lg flex items-center justify-center ${
                  service.isExclusive ? 'bg-red-edilmec' : 'bg-steel-dark'
                }`}>
                  <service.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-xl text-white font-semibold mb-2 flex items-center gap-3">
                    {service.title}
                    {service.isExclusive && (
                      <span className="text-xs font-body uppercase tracking-wider bg-red-edilmec/20 text-red-edilmec px-3 py-1 rounded-full">
                        Esclusivo
                      </span>
                    )}
                  </h3>
                  <p className="font-body text-steel-light leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Superpower Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative bg-gradient-to-r from-red-edilmec to-red-edilmec-hover rounded-2xl p-8 md:p-12 overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative text-center max-w-2xl mx-auto">
            <span className="inline-block text-white/80 font-body text-sm uppercase tracking-[0.3em] mb-4">
              Il Nostro Superpotere
            </span>
            <h3 className="font-display text-3xl md:text-4xl text-white font-bold mb-4">
              "Se non esiste più, noi lo costruiamo"
            </h3>
            <p className="font-body text-white/90 text-lg leading-relaxed mb-8">
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
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
