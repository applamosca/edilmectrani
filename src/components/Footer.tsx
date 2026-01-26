import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

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
              costruzioni meccaniche e ricostruzione di pezzi fuori produzione.
              <strong className="text-white"> "Se non esiste più, noi lo costruiamo."</strong>
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {[Facebook, Instagram, Linkedin].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-orange-safety transition-colors duration-300"
                  aria-label="Social media"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
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
                <Mail className="w-5 h-5 text-orange-safety flex-shrink-0" />
                <a
                  href="mailto:edilmectrani@pec.it"
                  className="font-body text-steel-light text-sm hover:text-orange-safety transition-colors"
                >
                  edilmectrani@pec.it
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-orange-safety flex-shrink-0" />
                <span className="font-body text-steel-light text-sm">
                  Chiamaci per info
                </span>
              </div>
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
            <p className="font-body text-steel text-sm">
              P.IVA: <span className="text-steel-light">05134830727</span>
            </p>
          </div>
        </div>
      </div>

      {/* Schema.org Local Business markup for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: 'EDILMEC S.A.S. di Di Cugno Savino & C.',
            description:
              'Officina meccanica di precisione specializzata in tornitura CNC, costruzioni meccaniche e ricostruzione pezzi fuori produzione a Trani (Puglia).',
            image: 'https://edilmec.it/logo.png',
            '@id': 'https://edilmec.it',
            url: 'https://edilmec.it',
            telephone: '',
            email: 'edilmectrani@pec.it',
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
            priceRange: '€€',
            areaServed: ['Trani', 'Barletta', 'Andria', 'BAT', 'Puglia'],
            knowsAbout: [
              'Tornitura CNC',
              'Costruzioni meccaniche',
              'Saldature di precisione',
              'Ricostruzione pezzi meccanici',
              'Manutenzione industriale',
            ],
          }),
        }}
      />
    </footer>
  );
};

export default Footer;
