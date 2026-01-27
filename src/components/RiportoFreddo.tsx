import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Flame, ShieldCheck, ThermometerSnowflake, Zap, CheckCircle } from 'lucide-react';
import spruzzaturaTermica from '@/assets/spruzzatura-termica.jpeg';

const RiportoFreddo = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const vantaggi = [
    {
      icon: ThermometerSnowflake,
      title: 'No Deformazione Termica',
      description: 'Intervento a bassissima temperatura che evita le deformazioni tipiche della saldatura.',
    },
    {
      icon: ShieldCheck,
      title: 'Materiali Non Saldabili',
      description: 'Ideale per ghisa, alluminio e leghe speciali impossibili da saldare tradizionalmente.',
    },
    {
      icon: Zap,
      title: 'Recupero Pezzi Critici',
      description: 'Ripristino di sedi cuscinetti, paraoli e superfici di accoppiamento usurate.',
    },
  ];

  const applicazioni = [
    'Ripristino sedi cuscinetti',
    'Ricostruzione sedi paraoli',
    'Recupero alberi usurati',
    'Riparazione carter e basamenti',
    'Rigenerazione superfici di tenuta',
    'Recupero componenti di precisione',
  ];

  return (
    <section id="riporto-freddo" className="section-padding bg-muted relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-safety/5 via-transparent to-navy/5" />

      <div className="container relative" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 text-orange-safety font-body text-sm uppercase tracking-[0.3em] mb-4">
            <span className="w-8 h-0.5 bg-orange-safety" />
            Servizio Esclusivo
            <span className="w-8 h-0.5 bg-orange-safety" />
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-foreground font-bold mb-6">
            Recupero Funzionale tramite{' '}
            <span className="text-orange-safety">Spruzzatura Termica</span>
            <br />
            <span className="text-2xl md:text-3xl text-muted-foreground">(Riporto a Freddo)</span>
          </h2>
          <p className="text-muted-foreground text-lg font-body leading-relaxed">
            Una tecnologia avanzata che permette di rigenerare superfici metalliche usurate 
            senza gli shock termici della saldatura tradizionale. Ideale per il{' '}
            <strong className="text-foreground">ripristino sedi cuscinetti</strong> e componenti di precisione 
            su materiali che non possono essere saldati.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-xl overflow-hidden shadow-heavy">
              <img
                src={spruzzaturaTermica}
                alt="Spruzzatura termica - Riporto a freddo per ripristino sedi cuscinetti"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/60 to-transparent" />
              
              {/* Overlay badge */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-orange-safety/90 backdrop-blur-sm rounded-lg p-4 flex items-center gap-3">
                  <Flame className="w-8 h-8 text-white flex-shrink-0" />
                  <div>
                    <p className="font-display text-white font-bold">Tecnologia Esclusiva</p>
                    <p className="font-body text-white/90 text-sm">Recupero pezzi critici senza deformazione</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative accent */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-safety/20 rounded-lg -z-10" />
          </motion.div>

          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Advantages */}
            <div className="space-y-6">
              {vantaggi.map((vantaggio, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="flex gap-4 bg-background p-5 rounded-lg shadow-industrial hover:shadow-heavy transition-shadow"
                >
                  <div className="w-12 h-12 rounded-lg bg-orange-safety/10 flex items-center justify-center flex-shrink-0">
                    <vantaggio.icon className="w-6 h-6 text-orange-safety" />
                  </div>
                  <div>
                    <h3 className="font-display text-foreground font-semibold mb-1">
                      {vantaggio.title}
                    </h3>
                    <p className="font-body text-muted-foreground text-sm leading-relaxed">
                      {vantaggio.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Applications Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-navy-deep rounded-xl p-6"
            >
              <h3 className="font-display text-white font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-orange-safety" />
                Applicazioni Tipiche
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {applicazioni.map((app, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 text-steel-light font-body text-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-safety flex-shrink-0" />
                    {app}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Technical Note for SEO */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-16 bg-navy/5 border border-navy/10 rounded-xl p-8 text-center"
        >
          <p className="font-body text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            <strong className="text-foreground">Come funziona il Riporto a Freddo?</strong>
            <br />
            La spruzzatura termica proietta particelle metalliche fuse ad alta velocità sulla superficie da ripristinare. 
            A differenza della saldatura, il pezzo base rimane a temperatura ambiente, 
            evitando cricche, deformazioni e alterazioni strutturali. 
            Questa tecnica è l'unica soluzione per il <em>recupero pezzi critici</em> in ghisa, 
            alluminio e leghe speciali non saldabili.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default RiportoFreddo;