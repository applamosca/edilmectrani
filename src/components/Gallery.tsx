import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getWorkCategories, type CategoryGroup } from '@/lib/gallery-data';
import LazyImage from '@/components/LazyImage';

const Gallery = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [categories, setCategories] = useState<CategoryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<CategoryGroup | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    setCategories(getWorkCategories());
    setLoading(false);
  }, []);

  const currentImages = activeCategory?.images || [];

  const closeLightbox = () => setLightboxIndex(null);
  const goNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % currentImages.length);
  };
  const goPrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + currentImages.length) % currentImages.length);
  };

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxIndex, currentImages.length]);

  return (
    <section id="galleria" className="py-24 md:py-36 bg-background relative overflow-hidden">
      {/* Decorative background accent - signals this is a lead section */}
      <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-navy/5 to-transparent" />

      <div className="container relative" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <span className="inline-flex items-center gap-2 text-red-edilmec font-body text-sm uppercase tracking-[0.3em] mb-4">
            <span className="w-8 h-0.5 bg-red-edilmec" />
            I Nostri Lavori
            <span className="w-8 h-0.5 bg-red-edilmec" />
          </span>
          <h2 className="font-display text-5xl md:text-6xl text-foreground font-bold mb-6">
            Galleria <span className="text-red-edilmec">Lavori</span>
          </h2>
          <p className="text-muted-foreground text-xl font-body leading-relaxed">
            Clicca su una categoria per sfogliare i lavori. Dalla fresatura CNC al riporto a freddo.
          </p>
        </motion.div>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-red-edilmec border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && categories.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
            {categories.map((cat, index) => (
              <motion.div
                key={cat.folder}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: Math.min(index * 0.1, 0.5) }}
                className="group relative overflow-hidden rounded-xl cursor-pointer aspect-[4/3] shadow-lg hover:shadow-2xl transition-shadow duration-300"
                onClick={() => {
                  setActiveCategory(cat);
                  setLightboxIndex(0);
                }}
              >
                <LazyImage
                  src={cat.cover.url}
                  alt={`${cat.label} - Edilmec`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/75 via-navy-deep/25 to-transparent group-hover:from-navy-deep/85 transition-all duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                  <h3 className="text-white font-display text-xl md:text-2xl font-bold">{cat.label}</h3>
                  <span className="text-white/60 font-body text-sm">{cat.images.length} foto</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && categories.length === 0 && (
          <p className="text-center text-muted-foreground py-16 font-body text-lg">
            Nessuna foto disponibile.
          </p>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && currentImages[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button onClick={closeLightbox} className="absolute top-4 right-4 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              <X className="w-6 h-6 text-white" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); goPrev(); }} className="absolute left-4 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); goNext(); }} className="absolute right-4 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
            <motion.img
              key={currentImages[lightboxIndex].url}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              src={currentImages[lightboxIndex].url}
              alt={`${currentImages[lightboxIndex].label} - Edilmec`}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
              <p className="text-white font-display text-sm font-semibold mb-1">
                {activeCategory?.label}
              </p>
              <span className="text-white/50 font-body text-xs">
                {lightboxIndex + 1} / {currentImages.length}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
