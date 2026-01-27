import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Cog, Settings, Zap, Hammer, CircuitBoard, Gauge } from 'lucide-react';

const macchinari = [
  {
    categoria: 'Tornitura',
    icon: Cog,
    items: [
      { nome: 'Tornio CN', specifiche: 'Z 1500mm' },
      { nome: 'Tornio Parallelo', specifiche: 'Z 2500 (Ø sul banco 720mm)' },
      { nome: 'Torni tradizionali', specifiche: 'Z 1500 / Z 800' },
    ],
  },
  {
    categoria: 'Fresatura',
    icon: Settings,
    items: [
      { nome: 'Centro di lavoro 4 assi', specifiche: '1200x600mm' },
      { nome: 'Fresatrice verticale', specifiche: 'Testa inclinabile' },
    ],
  },
  {
    categoria: 'Lavorazioni Speciali',
    icon: Zap,
    items: [
      { nome: 'Stozzatrice', specifiche: 'Corsa 300mm' },
      { nome: 'Elettroerosione', specifiche: 'A tuffo' },
    ],
  },
  {
    categoria: 'Attrezzature',
    icon: Hammer,
    items: [
      { nome: 'Pressa', specifiche: '50 Tonnellate' },
      { nome: 'Spruzzatura termica', specifiche: 'Riporto a freddo' },
    ],
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
          <span className="inline-flex items-center gap-2 text-orange-safety font-body text-sm uppercase tracking-[0.3em] mb-4">
            <span className="w-8 h-0.5 bg-orange-safety" />
            Parco Macchine
            <span className="w-8 h-0.5 bg-orange-safety" />
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-white font-bold mb-6">
            Tecnologia al <span className="text-orange-safety">Servizio</span> della Precisione
          </h2>
          <p className="text-steel-light text-lg font-body leading-relaxed">
            Il nostro parco macchine è attrezzato per affrontare qualsiasi sfida meccanica, 
            dalla tornitura di precisione all'elettroerosione.
          </p>
        </motion.div>

        {/* Machines Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {macchinari.map((categoria, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="bg-navy-light rounded-xl p-6 border border-white/10 hover:border-orange-safety/50 transition-all duration-300 group"
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-orange-safety/20 flex items-center justify-center group-hover:bg-orange-safety transition-colors duration-300">
                  <categoria.icon className="w-6 h-6 text-orange-safety group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-display text-xl text-white font-semibold">
                  {categoria.categoria}
                </h3>
              </div>

              {/* Items List */}
              <ul className="space-y-4">
                {categoria.items.map((item, i) => (
                  <li key={i} className="border-l-2 border-orange-safety/30 pl-4">
                    <p className="font-body text-white font-medium text-sm">
                      {item.nome}
                    </p>
                    <p className="font-body text-steel-light text-xs mt-1">
                      {item.specifiche}
                    </p>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Technical Specs Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
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
              <stat.icon className="w-8 h-8 text-orange-safety mx-auto mb-2" />
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
