import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Cog, Hammer, CircuitBoard, Gauge } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const macchinari = [
  {
    nome: 'Centro di Lavoro 4 Assi',
    capacita: 'Tavola 1200x600, Corsa X 1000, Y 600, Z 600',
    utilizzo: 'Fresatura complessa di precisione',
  },
  {
    nome: 'Tornio CN',
    capacita: 'Z 1500mm, Ø carro 360mm, Ø banco 590mm, Passaggio barra 105mm',
    utilizzo: 'Tornitura automatizzata grandi diametri',
  },
  {
    nome: 'Tornio Tradizionale (Grande)',
    capacita: 'Z 2500, Ø banco 720mm, Passaggio barra 105mm',
    utilizzo: 'Lavorazione alberi lunghi e pesanti',
  },
  {
    nome: 'Stozzatrice / Limatrice',
    capacita: 'Corsa 300mm',
    utilizzo: 'Esecuzione chiavette su alberi lunghi ciechi',
  },
  {
    nome: 'Elettroerosione a Tuffo',
    capacita: 'Corsa Z 220x350, Y 260',
    utilizzo: 'Lavorazioni su metalli duri e sagome complesse',
  },
  {
    nome: 'Reparto Saldatura',
    capacita: 'TIG AC/DC, Filo Continuo, Elettrodo, Ossiacetilenica',
    utilizzo: 'Carpenteria e riparazioni strutturali',
  },
  {
    nome: 'Pressa Idraulica',
    capacita: '50 Tonnellate, Luce 1500mm',
    utilizzo: 'Raddrizzatura e montaggi',
  },
];

const ParcoMacchine = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="parco-macchine" className="section-padding bg-navy-deep relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5V16h16v2H24v2.5a.5.5 0 01-.5.5h-3a.5.5 0 01-.5-.5zM0 20h20v2.5a.5.5 0 00.5.5h3a.5.5 0 00.5-.5V20h16v2H24v2.5a.5.5 0 01-.5.5h-3a.5.5 0 01-.5-.5V22H0v-2z'/%3E%3C/g%3E%3C/svg%3E")`,
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
            Parco Macchine
            <span className="w-8 h-0.5 bg-red-edilmec" />
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-white font-bold mb-6">
            Tecnologia al <span className="text-red-edilmec">Servizio</span> della Precisione
          </h2>
          <p className="text-steel-light text-lg font-body leading-relaxed">
            Il nostro parco macchine è attrezzato per affrontare qualsiasi sfida meccanica, 
            dalla tornitura di precisione all'elettroerosione. Ecco i dati tecnici delle nostre attrezzature.
          </p>
        </motion.div>

        {/* Technical Specifications Table */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-navy-light rounded-xl border border-white/10 overflow-hidden mb-12"
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-red-edilmec font-display text-base py-5 px-6">
                    Macchinario
                  </TableHead>
                  <TableHead className="text-red-edilmec font-display text-base py-5 px-6">
                    Capacità / Corsa (Dati Tecnici)
                  </TableHead>
                  <TableHead className="text-red-edilmec font-display text-base py-5 px-6">
                    Utilizzo Tipico
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {macchinari.map((macchina, index) => (
                  <TableRow 
                    key={index} 
                    className="border-white/10 hover:bg-white/5 transition-colors"
                  >
                    <TableCell className="font-display text-white font-medium py-4 px-6">
                      {macchina.nome}
                    </TableCell>
                    <TableCell className="font-body text-steel-light py-4 px-6">
                      {macchina.capacita}
                    </TableCell>
                    <TableCell className="font-body text-steel-light py-4 px-6">
                      {macchina.utilizzo}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </motion.div>

        {/* Technical Specs Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { icon: CircuitBoard, label: 'CNC 4 Assi', value: 'Controllo Numerico' },
            { icon: Gauge, label: 'Max Ø', value: '720mm' },
            { icon: Cog, label: 'Max Lunghezza', value: '2500mm' },
            { icon: Hammer, label: 'Pressa', value: '50 Tonnellate' },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white/5 rounded-lg p-4 text-center border border-white/10"
            >
              <stat.icon className="w-8 h-8 text-red-edilmec mx-auto mb-2" />
              <p className="font-display text-white font-bold text-lg">{stat.value}</p>
              <p className="font-body text-steel-light text-xs uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ParcoMacchine;
