import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin, MessageCircle } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const whatsappNumber = '393495360705';
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Salve,%20vorrei%20informazioni%20sui%20vostri%20servizi%20di%20lavorazione%20meccanica.`;

  return (
    <footer className="bg-navy-deep text-white">
      {/* Main Footer */}
      <div className="container py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-orange-safety rounded flex items-center justify-center">
                <span className="font-display text-white text-xl font-bold">E</span>
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold tracking-wide">
                  EDILMEC S.A.S.
                </h3>
                <p className="text-steel-light text-xs uppercase tracking-widest">
                  di Di Cugno Savino & C.
                </p>
              </div>
            </div>
            <p className="font-body text-steel-light leading-relaxed mb-6 max-w-md">
              Officina meccanica di precisione a Trani. Specializzati in tornitura CNC,
              costruzioni meccaniche, ricostruzione di pezzi fuori produzione e 
              <strong className="text-white"> Riporto a Freddo</strong> (Spruzzatura Termica) 
              per il recupero di materiali non saldabili.
              <strong className="text-orange-safety"> "Se non esiste più, noi lo costruiamo."</strong>
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {/* WhatsApp - Primary CTA */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-lg bg-[#25D366] flex items-center justify-center hover:bg-[#128C7E] transition-colors duration-300 shadow-lg"
                aria-label="Contattaci su WhatsApp"
                title="Scrivici su WhatsApp"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/edilmec-s-a-s-di-cugno-48469ab8/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-[#0A66C2] flex items-center justify-center hover:bg-[#004182] transition-colors duration-300"
                aria-label="Seguici su LinkedIn"
                title="Seguici su LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6">Link Rapidi</h4>
            <nav className="space-y-3">
              {[
                { label: 'Home', href: '#home' },
                { label: 'La Nostra Storia', href: '#storia' },
                { label: 'Servizi', href: '#servizi' },
                { label: 'Parco Macchine', href: '#parco-macchine' },
                { label: 'Riporto a Freddo', href: '#riporto-freddo' },
                { label: 'Il Metodo', href: '#metodo' },
                { label: 'FAQ', href: '#faq' },
                { label: 'Contatti', href: '#contatti' },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block font-body text-steel-light hover:text-orange-safety transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6">Contatti</h4>
            <address className="not-italic space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-safety flex-shrink-0 mt-1" />
                <div className="font-body text-steel-light text-sm">
                  <p>Piazza Albanese Int. 2 - P.S1 36</p>
                  <p>76125 - TRANI (BT)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-orange-safety flex-shrink-0" />
                <a
                  href="tel:+393495360705"
                  className="font-body text-steel-light text-sm hover:text-orange-safety transition-colors"
                >
                  349 5360705
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-orange-safety flex-shrink-0" />
                <a
                  href="mailto:edilmectrani@gmail.com"
                  className="font-body text-steel-light text-sm hover:text-orange-safety transition-colors"
                >
                  edilmectrani@gmail.com
                </a>
              </div>
              {/* WhatsApp Direct Link */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#25D366]/10 rounded-lg p-3 mt-4 hover:bg-[#25D366]/20 transition-colors group"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#25D366] flex-shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span className="font-body text-[#25D366] text-sm font-medium group-hover:text-white transition-colors">
                  Scrivici su WhatsApp
                </span>
              </a>
            </address>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-steel text-sm text-center md:text-left">
              © {currentYear} EDILMEC S.A.S. di Di Cugno Savino & C. - Tutti i diritti riservati
            </p>
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <p className="font-body text-steel text-sm">
                P.IVA: <span className="text-steel-light">05134830727</span>
              </p>
              <span className="hidden md:inline text-steel">|</span>
              <p className="font-body text-steel text-sm">
                Sito sviluppato da{' '}
                <a
                  href="https://assistenzabat.it/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-steel-light hover:text-orange-safety transition-colors"
                >
                  Antonio Danzi
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Schema.org MachineShop markup for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'MachineShop',
            name: 'Edilmec S.A.S. di Di Cugno Savino & C.',
            description:
              'Officina meccanica specializzata in tornitura CNC, costruzioni meccaniche e recupero componenti tramite riporto a freddo.',
            image: 'https://www.edilmectrani.it/logo.png',
            '@id': 'https://www.edilmectrani.it',
            url: 'https://www.edilmectrani.it',
            telephone: '+39 349 5360705',
            email: 'edilmectrani@gmail.com',
            vatID: 'IT05134830727',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Piazza Albanese Int. 2 - P.S1 36',
              addressLocality: 'Trani',
              addressRegion: 'BT',
              postalCode: '76125',
              addressCountry: 'IT',
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: 41.2769,
              longitude: 16.4163,
            },
            openingHoursSpecification: [
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                opens: '08:00',
                closes: '18:00',
              },
            ],
            priceRange: '$$',
            areaServed: ['Trani', 'Barletta', 'Andria', 'BAT', 'Bari', 'Puglia'],
            knowsAbout: [
              'Tornitura CNC',
              'Fresatura CNC',
              'Costruzioni meccaniche',
              'Saldature di precisione',
              'Ricostruzione pezzi meccanici',
              'Manutenzione industriale',
              'Riporto a Freddo',
              'Spruzzatura Termica',
              'Ripristino sedi cuscinetti',
            ],
          }),
        }}
      />
    </footer>
  );
};

export default Footer;
