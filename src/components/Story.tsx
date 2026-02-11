import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Quote, Building2, MapPin, Wrench, Cpu, Users, Lightbulb } from 'lucide-react';
import savinoCnc from '@/assets/savino-cnc.jpg';
import StoryGallery from './StoryGallery';

const Story = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const storyChapters = [
    {
      icon: Users,
      title: 'Le Radici: Un\'Eredità Lunga Ottant\'Anni',
      description:
        'La storia della EDILMEC SAS affonda le sue radici in una tradizione familiare che attraversa tre generazioni. Tutto ha inizio oltre 50 anni fa, grazie all\'esperienza e alla maestria del nonno di Savino di Cugno, che ha saputo tramandare non solo i segreti della lavorazione meccanica, ma soprattutto l\'etica del lavoro e la passione per l\'eccellenza.',
    },
    {
      icon: Wrench,
      title: 'L\'Esperienza: Trent\'anni sul Campo',
      description:
        'Raccogliendo questo prezioso testimone, Savino di Cugno ha consolidato il proprio percorso professionale con oltre 30 anni di attività diretta nel settore della meccanica, della metallurgia e della progettazione. Questa profonda conoscenza tecnica, maturata quotidianamente "sul campo", rappresenta oggi il cuore pulsante dell\'azienda e la garanzia di affidabilità per ogni nostro cliente.',
    },
    {
      icon: Lightbulb,
      title: 'La Visione: Dall\'Idea alla Messa in Opera',
      description:
        'Sotto la guida esperta di Savino di Cugno, la EDILMEC SAS si distingue per la capacità di governare l\'intero processo produttivo. Non siamo semplici esecutori, ma partner strategici che accompagnano il progetto in ogni sua fase.',
    },
  ];

  const processSteps = [
    'Progettazione tecnica avanzata',
    'Lavorazione dei metalli con standard qualitativi elevati',
    'Realizzazione e montaggio finale a regola d\'arte',
  ];

  const companyInfo = [
    { icon: Building2, label: 'Azienda', value: 'Edilmec S.A.S. di Di Cugno Savino & C.' },
    { icon: MapPin, label: 'Sede Operativa', value: 'Via Giorgio Castriota Skanderbeg 15, 76125 Trani (BT)' },
    { icon: Wrench, label: 'Specializzazione Esclusiva', value: 'Ripristino sedi su materiali non saldabili tramite "Riporto a Freddo" (Spruzzatura Termica)' },
    { icon: Cpu, label: 'Core Business', value: 'Lavorazioni meccaniche di precisione, Tornitura, Fresatura e manutenzione impianti' },
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
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 text-red-edilmec font-body text-sm uppercase tracking-[0.3em] mb-4">
            <span className="w-8 h-0.5 bg-red-edilmec" />
            Chi Siamo
            <span className="w-8 h-0.5 bg-red-edilmec" />
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-foreground font-bold mb-6">
            EDILMEC SAS: Una Storia di <span className="text-red-edilmec">Passione, Progetto e Precisione</span>
          </h2>
          <p className="text-muted-foreground text-lg font-body leading-relaxed">
            Oggi, la EDILMEC SAS è la sintesi perfetta tra l'abilità artigianale di un tempo 
            e le più moderne tecnologie industriali.
          </p>
        </motion.div>

        {/* Company Identity Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mb-16 bg-navy-deep rounded-xl p-8 shadow-heavy"
          itemScope
          itemType="https://schema.org/LocalBusiness"
        >
          <h3 className="font-display text-2xl text-white font-bold mb-6 text-center">
            Scheda <span className="text-red-edilmec">Identità</span> Aziendale
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {companyInfo.map((info, index) => (
              <div 
                key={index} 
                className="flex items-start gap-4 bg-white/5 rounded-lg p-4 border border-white/10"
              >
                <div className="w-12 h-12 rounded-lg bg-red-edilmec/20 flex items-center justify-center flex-shrink-0">
                  <info.icon className="w-6 h-6 text-red-edilmec" />
                </div>
                <div>
                  <p className="font-body text-steel-light text-sm uppercase tracking-wider mb-1">
                    {info.label}
                  </p>
                  <p className="font-display text-white font-medium" itemProp={info.label === 'Azienda' ? 'name' : info.label === 'Sede Operativa' ? 'address' : undefined}>
                    {info.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
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
                  loading="lazy"
                  decoding="async"
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
                <Quote className="w-8 h-8 text-red-edilmec mb-3" />
                <p className="font-body text-sm leading-relaxed italic">
                  "Ogni pezzo che creo porta con sé anni di esperienza. Quando altri dicono 'impossibile', noi diciamo 'ci pensiamo noi'."
                </p>
                <p className="mt-3 font-display text-red-edilmec text-sm">
                  — Savino Di Cugno
                </p>
              </motion.div>

              {/* Red accent */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-red-edilmec/20 rounded-lg -z-10" />
            </div>
          </motion.div>

          {/* Story Chapters Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            {storyChapters.map((chapter, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.15 }}
                className="relative pl-8 border-l-2 border-steel/30 hover:border-red-edilmec transition-colors duration-300"
              >
                <div className="absolute -left-5 top-0 w-10 h-10 rounded-full bg-background border-2 border-red-edilmec flex items-center justify-center">
                  <chapter.icon className="w-5 h-5 text-red-edilmec" />
                </div>
                <h3 className="font-display text-xl text-foreground font-semibold mt-1 mb-3">
                  {chapter.title}
                </h3>
                <p className="font-body text-muted-foreground leading-relaxed">
                  {chapter.description}
                </p>
              </motion.div>
            ))}

            {/* Process Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.95 }}
              className="bg-red-edilmec/10 rounded-lg p-6 border border-red-edilmec/20"
            >
              <h4 className="font-display text-lg text-foreground font-semibold mb-4">
                Le nostre fasi:
              </h4>
              <ul className="space-y-3">
                {processSteps.map((step, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-red-edilmec text-white flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <span className="font-body text-muted-foreground">{step}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>

        {/* Origin Photos */}
        <StoryGallery />
      </div>
    </section>
  );
};

export default Story;
