import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: 'Messaggio inviato!',
      description: 'Ti risponderemo il prima possibile.',
    });

    setFormData({ name: '', email: '', phone: '', message: '' });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Indirizzo',
      content: 'Via Giorgio Castriota Skanderbeg, 15',
      subcontent: '76125 - Trani (BT)',
    },
    {
      icon: Phone,
      title: 'Telefono',
      content: 'Chiamaci per un preventivo',
      subcontent: 'Rispondiamo sempre',
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'edilmectrani@pec.it',
      subcontent: 'PEC ufficiale',
    },
    {
      icon: Clock,
      title: 'Orari',
      content: 'Lun - Ven: 08:00 - 18:00',
      subcontent: 'Sab: su appuntamento',
    },
  ];

  return (
    <section id="contatti" className="section-padding bg-navy relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-red-edilmec/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-edilmec/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />

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
            Contattaci
            <span className="w-8 h-0.5 bg-red-edilmec" />
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-white font-bold mb-6">
            Richiedi un <span className="text-red-edilmec">Preventivo</span>
          </h2>
          <p className="text-steel-light text-lg font-body leading-relaxed">
            Hai un pezzo introvabile o un progetto speciale? Contattaci senza impegno.
            Ti risponderemo entro 24 ore.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {contactInfo.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-red-edilmec/20 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-red-edilmec" />
                </div>
                <div>
                  <h4 className="font-display text-white font-semibold mb-1">
                    {item.title}
                  </h4>
                  <p className="font-body text-steel-light text-sm">{item.content}</p>
                  <p className="font-body text-steel text-xs">{item.subcontent}</p>
                </div>
              </div>
            ))}

            {/* Map */}
            <div className="relative rounded-lg overflow-hidden h-48 bg-navy-light">
              <iframe
                src="https://www.google.com/maps/embed?pb=!4v1770062853833!6m8!1m7!1s6b6Ah25bdJNanEyt7hfQAQ!2m2!1d41.28269283042127!2d16.3970624169135!3f315.5976708629224!4f0.40963636398043946!5f0.7820865974627469"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mappa EDILMEC - Via Giorgio Castriota Skanderbeg 15, Trani"
              />
            </div>

            {/* Navigation Link */}
            <a
              href="https://www.google.com/maps/dir//Via+Giorgio+Castriota+Skanderbeg+15,+76125+Trani+BT,+Italia"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-3 rounded-lg bg-red-edilmec hover:bg-red-edilmec/90 text-white font-body font-medium transition-colors duration-300"
            >
              <MapPin className="w-5 h-5" />
              Apri in Google Maps
            </a>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-3"
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl p-8 shadow-heavy"
            >
              <h3 className="font-display text-2xl text-foreground font-bold mb-6">
                Compila il Form
              </h3>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="font-body text-sm text-muted-foreground">
                    Nome e Cognome *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Mario Rossi"
                    className="border-border focus:border-red-edilmec"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="font-body text-sm text-muted-foreground">
                    Email *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="mario@esempio.it"
                    className="border-border focus:border-red-edilmec"
                  />
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <label htmlFor="phone" className="font-body text-sm text-muted-foreground">
                  Telefono
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+39 333 1234567"
                  className="border-border focus:border-red-edilmec"
                />
              </div>

              <div className="space-y-2 mb-8">
                <label htmlFor="message" className="font-body text-sm text-muted-foreground">
                  Descrivi il tuo progetto o problema *
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Descrivi il pezzo che ti serve, allega eventuali dettagli su materiali, dimensioni o urgenza..."
                  rows={5}
                  className="border-border focus:border-red-edilmec resize-none"
                />
              </div>

              <Button
                type="submit"
                variant="cta"
                size="xl"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Invio in corso...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Invia Richiesta
                  </>
                )}
              </Button>

              <p className="text-center text-xs text-muted-foreground mt-4">
                <CheckCircle2 className="w-4 h-4 inline mr-1 text-green-500" />
                I tuoi dati sono al sicuro. Non li condivideremo mai con terzi.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
