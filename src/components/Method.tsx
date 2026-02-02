import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { MessageSquare, Search, Wrench, CheckCircle2, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: MessageSquare,
    title: 'Contatto',
    description:
      'Raccontaci il tuo problema. Che sia un pezzo rotto, un ricambio introvabile o una nuova costruzione, iniziamo da qui.',
    highlight: 'Chiamaci o compila il form',
  },
  {
    number: '02',
    icon: Search,
    title: 'Analisi',
    description:
      'Studiamo la fattibilità tecnica. Se hai un campione, lo misuriamo. Se hai un disegno, lo analizziamo. Valutiamo materiali e tolleranze.',
    highlight: 'Preventivo gratuito e dettagliato',
  },
  {
    number: '03',
    icon: Wrench,
    title: 'Realizzazione',
    description:
      'Le nostre macchine CNC entrano in azione. Ogni pezzo è lavorato con precisione, controllato e rifinito secondo le specifiche.',
    highlight: 'Controllo qualità certificato',
  },
  {
    number: '04',
    icon: CheckCircle2,
    title: 'Consegna',
    description:
      'Il pezzo finito viene consegnato pronto per essere installato. Offriamo anche supporto post-vendita per qualsiasi necessità.',
    highlight: 'Garanzia su ogni lavorazione',
  },
];

const Method = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="metodo" className="section-padding bg-background relative">
      <div className="container" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="inline-flex items-center gap-2 text-red-edilmec font-body text-sm uppercase tracking-[0.3em] mb-4">
            <span className="w-8 h-0.5 bg-red-edilmec" />
            Il Metodo
            <span className="w-8 h-0.5 bg-red-edilmec" />
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-foreground font-bold mb-6">
            Dal <span className="text-red-edilmec">Problema</span> alla Soluzione
          </h2>
          <p className="text-muted-foreground text-lg font-body leading-relaxed">
            Un processo semplice e trasparente che ti accompagna
            dalla prima richiesta fino alla consegna del pezzo finito.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-border">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="h-full bg-red-edilmec origin-left"
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.2 }}
                className="relative"
              >
                {/* Step Card */}
                <div className="bg-card rounded-xl p-6 shadow-industrial hover:shadow-heavy transition-all duration-300 h-full group">
                  {/* Number and Icon */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-navy flex items-center justify-center group-hover:bg-red-edilmec transition-colors duration-300">
                        <step.icon className="w-7 h-7 text-white" />
                      </div>
                      <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-edilmec text-white font-display text-sm flex items-center justify-center font-bold">
                        {step.number}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="font-display text-xl text-foreground font-semibold mb-3">
                    {step.title}
                  </h3>
                  <p className="font-body text-muted-foreground leading-relaxed mb-4">
                    {step.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-body text-red-edilmec">
                    <CheckCircle2 className="w-4 h-4" />
                    {step.highlight}
                  </span>
                </div>

                {/* Arrow - Desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-20 -right-3 z-10">
                    <ArrowRight className="w-6 h-6 text-red-edilmec" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center mt-16"
        >
          <p className="font-body text-muted-foreground mb-6 text-lg">
            Pronto a iniziare? Contattaci per un preventivo gratuito.
          </p>
          <a
            href="#contatti"
            className="inline-flex items-center gap-2 bg-navy text-white px-8 py-4 rounded-lg font-body font-semibold uppercase tracking-wide hover:bg-navy-light transition-colors duration-300"
          >
            Inizia Ora
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Method;
