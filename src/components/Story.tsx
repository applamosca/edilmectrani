import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Quote, Award, Heart, Target } from 'lucide-react';
import savinoCnc from '@/assets/savino-cnc.jpg';

const Story = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const timelineItems = [
    {
      year: 'Gli Inizi',
      title: 'Mani sporche di olio',
      description:
        'Savino Di Cugno non è nato dietro una scrivania. Ha iniziato come operaio, facendo anni di dura gavetta nei reparti di produzione.',
    },
    {
      year: "L'Esperienza",
      title: 'Il suono delle macchine',
      description:
        'Conosce ogni rumore dei torni, ogni vibrazione delle frese. Ha imparato a "sentire" il metallo prima ancora di lavorarlo.',
    },
    {
      year: '2008',
      title: 'Nasce EDILMEC',
      description:
        "Fonda l'azienda portando con sé l'esperienza pratica del tornitore programmatore CNC e del meccanico generale.",
    },
    {
      year: 'Oggi',
      title: "L'eccellenza artigianale",
      description:
        "EDILMEC è oggi un punto di riferimento per chi cerca qualità, precisione e la capacità di risolvere problemi che altri non sanno affrontare.",
    },
  ];

  return (
    <section id="storia" className="section-padding bg-muted relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-navy/5 to-transparent" />

      <div className="container relative">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 text-orange-safety font-body text-sm uppercase tracking-[0.3em] mb-4">
            <span className="w-8 h-0.5 bg-orange-safety" />
            Chi Siamo
            <span className="w-8 h-0.5 bg-orange-safety" />
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-foreground font-bold mb-6">
            L'Uomo e la <span className="text-orange-safety">Macchina</span>
          </h2>
          <p className="text-muted-foreground text-lg font-body leading-relaxed">
            Dalle mani sporche di olio alla guida dell'azienda. La storia di Savino Di Cugno
            è quella di chi capisce il metallo come solo chi lo ha lavorato per anni può fare.
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
            <div className="relative">
              {/* Main Image */}
              <div className="relative rounded-lg overflow-hidden shadow-heavy">
                <img
                  src={savinoCnc}
                  alt="Savino Di Cugno al lavoro con il tornio CNC"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/50 to-transparent" />
              </div>

              {/* Quote Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute -bottom-6 -right-6 bg-navy text-white p-6 rounded-lg shadow-heavy max-w-xs hidden md:block"
              >
                <Quote className="w-8 h-8 text-orange-safety mb-3" />
                <p className="font-body text-sm leading-relaxed italic">
                  "Ogni pezzo che creo porta con sé anni di esperienza. Quando altri dicono 'impossibile', noi diciamo 'ci pensiamo noi'."
                </p>
                <p className="mt-3 font-display text-orange-safety text-sm">
                  — Savino Di Cugno
                </p>
              </motion.div>

              {/* Orange accent */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-orange-safety/20 rounded-lg -z-10" />
            </div>
          </motion.div>

          {/* Timeline Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            {timelineItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.15 }}
                className="relative pl-8 border-l-2 border-steel/30 hover:border-orange-safety transition-colors duration-300"
              >
                <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-orange-safety" />
                <span className="font-display text-orange-safety text-sm uppercase tracking-wider">
                  {item.year}
                </span>
                <h3 className="font-display text-xl text-foreground font-semibold mt-1 mb-2">
                  {item.title}
                </h3>
                <p className="font-body text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Values Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid md:grid-cols-3 gap-6 mt-20"
        >
          {[
            {
              icon: Heart,
              title: 'Passione',
              description: "L'amore per la meccanica che nasce dalla gavetta.",
            },
            {
              icon: Target,
              title: 'Precisione',
              description: 'Tolleranze al centesimo di millimetro.',
            },
            {
              icon: Award,
              title: 'Affidabilità',
              description: 'Ogni lavoro consegnato è una promessa mantenuta.',
            },
          ].map((value, index) => (
            <div
              key={index}
              className="bg-background p-8 rounded-lg shadow-industrial hover:shadow-heavy transition-shadow duration-300 text-center group"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-navy/10 flex items-center justify-center group-hover:bg-orange-safety/10 transition-colors duration-300">
                <value.icon className="w-8 h-8 text-navy group-hover:text-orange-safety transition-colors duration-300" />
              </div>
              <h4 className="font-display text-lg text-foreground font-semibold mb-2">
                {value.title}
              </h4>
              <p className="font-body text-muted-foreground text-sm">
                {value.description}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Story;
