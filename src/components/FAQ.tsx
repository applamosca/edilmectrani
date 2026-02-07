import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'In cosa consiste il riporto a freddo eseguito da Edilmec?',
    answer:
      "È una tecnica di spruzzatura termica che permette di rigenerare superfici metalliche usurate senza shock termici, ideale per sedi di cuscinetti e componenti di precisione. A differenza della saldatura tradizionale, il riporto a freddo non provoca deformazioni né cricche, rendendolo perfetto per materiali non saldabili come ghisa e alluminio.",
  },
  {
    question: 'Quali dimensioni massime potete tornire?',
    answer:
      "Possiamo lavorare pezzi fino a 2500mm di lunghezza e 720mm di diametro sul banco grazie ai nostri torni paralleli. Il tornio CN arriva a Z 1500mm con diametro sul banco di 590mm e passaggio barra di 105mm. Per fresature, il centro di lavoro 4 assi ha una tavola di 1200x600mm.",
  },
  {
    question: 'Dove si trova l\'officina Edilmec?',
    answer:
      "L'officina meccanica si trova a Trani (BT), in Via Giorgio Castriota Skanderbeg 15, operativa per le province di Barletta-Andria-Trani e Bari. Serviamo tutta la Puglia e per progetti importanti lavoriamo anche a livello nazionale con spedizione del prodotto finito.",
  },
  {
    question: 'Chi realizza pezzi meccanici fuori produzione a Trani?',
    answer:
      "EDILMEC S.a.s. di Di Cugno Savino è specializzata nella ricostruzione di pezzi meccanici fuori produzione. Con sede a Trani (BT), offriamo servizi di tornitura CNC e costruzioni meccaniche per ricreare ricambi introvabili partendo da campioni o disegni tecnici.",
  },
  {
    question: 'Dove trovare un tornitore esperto per riparazioni urgenti nella provincia BAT?',
    answer:
      "EDILMEC a Trani offre servizi di tornitura CNC e riparazioni meccaniche urgenti per tutta la provincia di Barletta-Andria-Trani. Savino Di Cugno, con anni di esperienza come tornitore programmatore, garantisce interventi rapidi e precisi anche per i lavori più complessi.",
  },
  {
    question: 'Cosa fa EDILMEC S.a.s.?',
    answer:
      "EDILMEC S.a.s. è un'officina meccanica di precisione specializzata in: Tornitura e programmazione CNC, Costruzioni meccaniche e saldature, Manutenzione e riparazione impianti industriali, Ricostruzione di pezzi meccanici fuori produzione, e Riporto a Freddo (spruzzatura termica) per il recupero di pezzi critici. Lavoriamo per l'industria, l'agricoltura e i privati in tutta la Puglia.",
  },
  {
    question: 'È possibile ricostruire un pezzo meccanico partendo da uno rotto?',
    answer:
      "Sì, è la nostra specialità! Se hai un pezzo rotto o usurato che non è più in commercio, portacelo: lo misuriamo, progettiamo la lavorazione e lo ricreiamo identico all'originale o con migliorie. Lavoriamo acciaio, inox, alluminio, bronzo e altri materiali.",
  },
  {
    question: 'Quanto tempo ci vuole per realizzare un pezzo su misura?',
    answer:
      "I tempi variano in base alla complessità del pezzo. Per componenti semplici, possiamo consegnare in 2-3 giorni lavorativi. Per pezzi complessi o lavorazioni speciali, forniamo sempre una stima precisa dopo l'analisi tecnica. Per urgenze, offriamo servizio prioritario.",
  },
  {
    question: 'EDILMEC offre preventivi gratuiti?',
    answer:
      "Assolutamente sì! Tutti i nostri preventivi sono gratuiti e senza impegno. Contattaci telefonicamente al 349 5360705, via email o compilando il form sul sito. Dopo aver valutato la tua richiesta, ti forniremo un preventivo dettagliato con tempi e costi.",
  },
  {
    question: 'Quali materiali lavorate?',
    answer:
      "Lavoriamo una vasta gamma di materiali metallici: Acciaio al carbonio e legato, Acciaio inossidabile (inox 304, 316, ecc.), Alluminio e leghe leggere, Bronzo e ottone, Ghisa, Materie plastiche tecniche. Ogni materiale richiede competenze specifiche che abbiamo maturato in anni di esperienza.",
  },
];

const FAQ = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="faq" className="section-padding bg-muted">
      <div className="container" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 text-red-edilmec font-body text-sm uppercase tracking-[0.3em] mb-4">
            <span className="w-8 h-0.5 bg-red-edilmec" />
            Domande Frequenti
            <span className="w-8 h-0.5 bg-red-edilmec" />
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-foreground font-bold mb-6">
            Hai <span className="text-red-edilmec">Domande</span>?
          </h2>
          <p className="text-muted-foreground text-lg font-body leading-relaxed">
            Ecco le risposte alle domande più comuni sui nostri servizi.
            Non trovi quello che cerchi? Contattaci direttamente.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-background rounded-lg shadow-industrial border-none px-6 data-[state=open]:shadow-heavy transition-shadow duration-300"
              >
                <AccordionTrigger className="font-display text-foreground text-left text-lg hover:text-red-edilmec hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="font-body text-muted-foreground text-base leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Schema.org FAQ markup for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map((faq) => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: faq.answer,
                },
              })),
            }),
          }}
        />
      </div>
    </section>
  );
};

export default FAQ;
