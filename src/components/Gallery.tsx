import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { X, ChevronLeft, ChevronRight, Images } from 'lucide-react';
import { getThumbnailUrl, getLightboxUrl } from '@/lib/image-utils';
import LazyImage from '@/components/LazyImage';

const BUCKET = 'gallery';
const EXCLUDED_FOLDERS = ['fotoinizi'];

const CATEGORY_LABELS: Record<string, string> = {
  fotolavoridiriparazione: 'Riparazioni',
  lavoridielettroerosione: 'Elettroerosione',
  lavoridifresatura: 'Fresatura',
  lavoridiriportoafreddo: 'Riporto a Freddo',
  lavoridisaldatura: 'Saldatura',
  lavoriditornitura: 'Tornitura',
};

interface GalleryImage {
  name: string;
  url: string;
  folder: string;
  label: string;
}

const Gallery = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [allImages, setAllImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data: folders } = await supabase.storage.from(BUCKET).list('', {
          limit: 100,
          sortBy: { column: 'name', order: 'asc' },
        });

        if (!folders) return;

        const validFolders = folders.filter(
          (f) => f.id === null && !EXCLUDED_FOLDERS.includes(f.name)
        );

        const images: GalleryImage[] = [];

        for (const folder of validFolders) {
          const { data: files } = await supabase.storage.from(BUCKET).list(folder.name, {
            limit: 50,
            sortBy: { column: 'name', order: 'asc' },
          });

          if (!files) continue;

          const imageFiles = files.filter(
            (f) => f.metadata?.mimetype?.startsWith('image/')
          );

          const label = CATEGORY_LABELS[folder.name] || folder.name;

          for (const file of imageFiles) {
            const { data } = supabase.storage.from(BUCKET).getPublicUrl(`${folder.name}/${file.name}`);
            images.push({ name: file.name, url: data.publicUrl, folder: folder.name, label });
          }
        }

        setAllImages(images);
      } catch (err) {
        console.error('Error fetching gallery:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const closeLightbox = () => setLightboxIndex(null);
  const goNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % allImages.length);
  };
  const goPrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + allImages.length) % allImages.length);
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
  }, [lightboxIndex, allImages.length]);

  return (
    <section id="galleria" className="py-20 md:py-32 bg-background relative overflow-hidden">
      <div className="container" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="inline-flex items-center gap-2 text-red-edilmec font-body text-sm uppercase tracking-[0.3em] mb-4">
            <span className="w-8 h-0.5 bg-red-edilmec" />
            I Nostri Lavori
            <span className="w-8 h-0.5 bg-red-edilmec" />
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-foreground font-bold mb-6">
            Galleria <span className="text-red-edilmec">Lavori</span>
          </h2>
          <p className="text-muted-foreground text-lg font-body leading-relaxed">
            Tutti i nostri lavori: dalla fresatura CNC al riporto a freddo, dalla saldatura alla tornitura.
          </p>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-red-edilmec border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* All Photos Grid */}
        {!loading && allImages.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {allImages.map((img, index) => (
              <motion.div
                key={img.url}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.6) }}
                className="group relative overflow-hidden rounded-lg cursor-pointer aspect-square"
                onClick={() => setLightboxIndex(index)}
              >
                <LazyImage
                  src={getThumbnailUrl(img.url, false)}
                  alt={`${img.label} - Edilmec`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white font-body text-xs font-medium">{img.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && allImages.length === 0 && (
          <p className="text-center text-muted-foreground py-16 font-body text-lg">
            Nessuna foto disponibile.
          </p>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && allImages[lightboxIndex] && (
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
              key={allImages[lightboxIndex].url}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              src={getLightboxUrl(allImages[lightboxIndex].url)}
              alt={`${allImages[lightboxIndex].label} - Edilmec`}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
              <p className="text-white font-display text-sm font-semibold mb-1">
                {allImages[lightboxIndex].label}
              </p>
              <span className="text-white/50 font-body text-xs">
                {lightboxIndex + 1} / {allImages.length}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
