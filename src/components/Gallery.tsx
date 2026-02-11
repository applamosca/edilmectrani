import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { X, ChevronLeft, ChevronRight, Images } from 'lucide-react';
import { getThumbnailUrl, getLightboxUrl } from '@/lib/image-utils';
import LazyImage from '@/components/LazyImage';

const BUCKET = 'gallery';

// Folders to exclude
const EXCLUDED_FOLDERS = ['fotoinizi'];

// Human-readable category names
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
}

interface CategoryData {
  name: string;
  label: string;
  images: GalleryImage[];
  coverImage: GalleryImage;
}

const Gallery = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  // Lightbox state: which category and which image index
  const [lightbox, setLightbox] = useState<{ categoryIndex: number; imageIndex: number } | null>(null);

  useEffect(() => {
    fetchGallery();
  }, []);

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

      const results: CategoryData[] = [];

      for (const folder of validFolders) {
        const { data: files } = await supabase.storage.from(BUCKET).list(folder.name, {
          limit: 50,
          sortBy: { column: 'name', order: 'asc' },
        });

        if (!files) continue;

        const imageFiles = files.filter(
          (f) => f.metadata?.mimetype?.startsWith('image/')
        );

        if (imageFiles.length === 0) continue;

        const images: GalleryImage[] = imageFiles.map((file) => {
          const { data } = supabase.storage.from(BUCKET).getPublicUrl(`${folder.name}/${file.name}`);
          return { name: file.name, url: data.publicUrl, folder: folder.name };
        });

        results.push({
          name: folder.name,
          label: CATEGORY_LABELS[folder.name] || folder.name,
          images,
          coverImage: images[0],
        });
      }

      setCategoryData(results);
    } catch (err) {
      console.error('Error fetching gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentImages = lightbox !== null ? categoryData[lightbox.categoryIndex]?.images : [];

  const closeLightbox = () => setLightbox(null);
  const goNext = () => {
    if (!lightbox || !currentImages.length) return;
    setLightbox({ ...lightbox, imageIndex: (lightbox.imageIndex + 1) % currentImages.length });
  };
  const goPrev = () => {
    if (!lightbox || !currentImages.length) return;
    setLightbox({ ...lightbox, imageIndex: (lightbox.imageIndex - 1 + currentImages.length) % currentImages.length });
  };

  // Keyboard navigation
  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox, currentImages.length]);

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
            Clicca su una categoria per sfogliare i lavori. Dalla fresatura CNC al riporto a freddo.
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-red-edilmec border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Category Cards - 1 cover per category */}
        {!loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {categoryData.map((cat, catIndex) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: Math.min(catIndex * 0.1, 0.5) }}
                className="group relative overflow-hidden rounded-xl cursor-pointer"
                onClick={() => setLightbox({ categoryIndex: catIndex, imageIndex: 0 })}
              >
                <div className="relative w-full h-48 md:h-64">
                  <LazyImage
                    src={getThumbnailUrl(cat.coverImage.url, true)}
                    alt={`Lavori di ${cat.label} - Edilmec`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/80 via-navy-deep/30 to-transparent group-hover:from-navy-deep/70 transition-all duration-500" />
                  
                  {/* Category label + count */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                    <h3 className="font-display text-white text-lg md:text-xl font-bold mb-1">
                      {cat.label}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Images className="w-4 h-4 text-white/70" />
                      <span className="text-white/70 font-body text-xs uppercase tracking-wider">
                        {cat.images.length} foto
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && categoryData.length === 0 && (
          <p className="text-center text-muted-foreground py-16 font-body text-lg">
            Nessuna foto disponibile.
          </p>
        )}
      </div>

      {/* Lightbox - scrolls through all images of the selected category */}
      <AnimatePresence>
        {lightbox !== null && currentImages[lightbox.imageIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Prev */}
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-4 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            {/* Next */}
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-4 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Image */}
            <motion.img
              key={currentImages[lightbox.imageIndex].url}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              src={getLightboxUrl(currentImages[lightbox.imageIndex].url)}
              alt={`Lavoro ${categoryData[lightbox.categoryIndex]?.label}`}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Counter + Category */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
              <p className="text-white font-display text-sm font-semibold mb-1">
                {categoryData[lightbox.categoryIndex]?.label}
              </p>
              <span className="text-white/50 font-body text-xs">
                {lightbox.imageIndex + 1} / {currentImages.length}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
