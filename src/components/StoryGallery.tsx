import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Camera, Images } from 'lucide-react';
import { getOriginPhotos } from '@/lib/gallery-data';
import LazyImage from '@/components/LazyImage';

interface OriginPhoto {
  name: string;
  url: string;
  caption: string;
}

const CAPTIONS = [
  'Io e mio nonno – dove tutto è iniziato',
  'Mio nonno – il maestro che mi ha insegnato tutto',
  'Le mani che mi hanno insegnato il mestiere',
  'Io e un collega delle prime armi',
  'La squadra delle origini',
  'I primi lavori, le prime soddisfazioni',
  'Crescere tra trucioli e passione',
  'Le radici della nostra storia',
];

// Which photo to show as preview (0-indexed, so index 2 = photo 3)
const PREVIEW_INDEX = 1;

const StoryGallery = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [photos, setPhotos] = useState<OriginPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const result: OriginPhoto[] = getOriginPhotos().map((img, index) => ({
      name: img.name,
      url: img.url,
      caption: CAPTIONS[index % CAPTIONS.length],
    }));
    setPhotos(result);
    setLoading(false);
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
  const previewPhoto = photos[PREVIEW_INDEX] || photos[0];

  if (loading) {
    return (
      <div ref={ref} className="flex justify-center py-12">
        <div className="w-8 h-8 border-3 border-red-edilmec border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (photos.length === 0 || !previewPhoto) return null;

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

      {/* Single preview photo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="max-w-2xl mx-auto"
      >
        <div
          className="group relative overflow-hidden rounded-xl cursor-pointer border-2 border-transparent hover:border-red-edilmec/40 transition-all duration-500"
          onClick={() => openLightbox(PREVIEW_INDEX < photos.length ? PREVIEW_INDEX : 0)}
        >
          <div className="relative w-full aspect-[3/2]">
            <LazyImage
              src={previewPhoto.url}
              alt="Foto storica Edilmec - Le origini"
              className="absolute inset-0 w-full h-full object-cover object-top transition-all duration-700 group-hover:scale-105 sepia-[.15] group-hover:sepia-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/70 via-transparent to-transparent group-hover:from-navy-deep/50 transition-all duration-500" />
            
            {/* Caption & gallery hint */}
            <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
              <div>
                <Camera className="w-5 h-5 text-white/80 mb-2" />
                <span className="text-white font-body text-sm md:text-base drop-shadow-lg">
                  {previewPhoto.caption}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2">
                <Images className="w-4 h-4 text-white" />
                <span className="text-white font-body text-xs uppercase tracking-wider">
                  {photos.length} foto
                </span>
              </div>
            </div>
          </div>
        </div>
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
