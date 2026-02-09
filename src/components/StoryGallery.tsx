import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';

const BUCKET = 'gallery';
const FOLDER = 'fotoinizi';

interface OriginPhoto {
  name: string;
  url: string;
  caption: string;
}

const CAPTIONS = [
  'Io e mio nonno – dove tutto è iniziato',
  'I primi colleghi, i primi passi',
  'Le mani che mi hanno insegnato il mestiere',
  'In officina con il nonno',
  'La squadra delle origini',
  'I primi lavori, le prime soddisfazioni',
  'Crescere tra trucioli e passione',
  'Le radici della nostra storia',
];

const StoryGallery = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [photos, setPhotos] = useState<OriginPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const { data: files } = await supabase.storage.from(BUCKET).list(FOLDER, {
          limit: 50,
          sortBy: { column: 'name', order: 'asc' },
        });

        if (!files) return;

        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif'];
        const imageFiles = files.filter(
          (f) => {
            const ext = f.name.toLowerCase();
            return imageExtensions.some(e => ext.endsWith(e)) || f.metadata?.mimetype?.startsWith('image/');
          }
        );

        const result: OriginPhoto[] = imageFiles.map((file, index) => {
          const { data } = supabase.storage.from(BUCKET).getPublicUrl(`${FOLDER}/${file.name}`);
          return { name: file.name, url: data.publicUrl, caption: CAPTIONS[index % CAPTIONS.length] };
        });

        setPhotos(result);
      } catch (err) {
        console.error('Error fetching origin photos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const goNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % photos.length);
  };
  const goPrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length);
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
  }, [lightboxIndex, photos.length]);

  const isReady = !loading && photos.length > 0;

  if (loading) {
    return (
      <div ref={ref} className="flex justify-center py-12">
        <div className="w-8 h-8 border-3 border-red-edilmec border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (photos.length === 0) return null;

  return (
    <div ref={ref}>
      {/* Section intro */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.7 }}
        className="text-center max-w-3xl mx-auto mb-10 mt-20"
      >
        <span className="inline-flex items-center gap-2 text-red-edilmec font-body text-sm uppercase tracking-[0.3em] mb-4">
          <span className="w-8 h-0.5 bg-red-edilmec" />
          Le Origini
          <span className="w-8 h-0.5 bg-red-edilmec" />
        </span>
        <h3 className="font-display text-3xl md:text-4xl text-foreground font-bold mb-4">
          Dove Tutto è <span className="text-red-edilmec">Iniziato</span>
        </h3>
        <p className="text-muted-foreground text-lg font-body leading-relaxed">
          Le foto che raccontano le nostre radici: dal nonno ai primi colleghi, 
          un viaggio nella storia della nostra passione per la meccanica.
        </p>
      </motion.div>

      {/* Photo grid - vintage feel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
      >
        {photos.map((photo, index) => (
          <motion.div
            key={photo.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isReady ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, delay: Math.min(index * 0.08, 0.6) }}
            className={`group relative overflow-hidden rounded-lg cursor-pointer border-2 border-transparent hover:border-red-edilmec/40 transition-all duration-500 ${
              index === 0 ? 'col-span-2 row-span-2' : ''
            }`}
            onClick={() => openLightbox(index)}
          >
            <div className={`relative w-full ${index === 0 ? 'h-64 md:h-[420px]' : 'h-40 md:h-56'}`}>
              <img
                src={photo.url}
                alt="Foto storica Edilmec - Le origini"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 sepia-[.15] group-hover:sepia-0"
              />
              {/* Warm vintage overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/60 via-transparent to-muted/10 group-hover:from-navy-deep/40 transition-all duration-500" />
              {/* Hover icon + caption */}
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Camera className="w-6 h-6 text-white drop-shadow-lg mb-2" />
                <span className="text-white text-xs md:text-sm font-body text-center px-3 drop-shadow-lg">
                  {photo.caption}
                </span>
              </div>
              {/* Always-visible caption on mobile */}
              <div className="absolute bottom-0 left-0 right-0 bg-navy-deep/70 px-2 py-1.5 md:hidden">
                <span className="text-white text-xs font-body">{photo.caption}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && photos[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-4 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-4 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
            <motion.img
              key={photos[lightboxIndex].url}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              src={photos[lightboxIndex].url}
              alt="Foto storica Edilmec"
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
              <p className="text-white font-body text-sm mb-1">{photos[lightboxIndex].caption}</p>
              <span className="text-white/50 font-body text-xs">{lightboxIndex + 1} / {photos.length}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StoryGallery;
