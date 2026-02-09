import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { getThumbnailUrl, getLightboxUrl } from '@/lib/image-utils';

const BUCKET = 'gallery';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

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

const Gallery = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [categories, setCategories] = useState<string[]>([]);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      // List all folders
      const { data: folders } = await supabase.storage.from(BUCKET).list('', {
        limit: 100,
        sortBy: { column: 'name', order: 'asc' },
      });

      if (!folders) return;

      const validFolders = folders.filter(
        (f) => f.id === null && !EXCLUDED_FOLDERS.includes(f.name)
      );

      const folderNames: string[] = [];
      const allImages: GalleryImage[] = [];

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

        folderNames.push(folder.name);

        for (const file of imageFiles) {
          const { data } = supabase.storage.from(BUCKET).getPublicUrl(`${folder.name}/${file.name}`);
          allImages.push({
            name: file.name,
            url: data.publicUrl,
            folder: folder.name,
          });
        }
      }

      setCategories(folderNames);
      setImages(allImages);
    } catch (err) {
      console.error('Error fetching gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredImages =
    activeCategory === 'all'
      ? images
      : images.filter((img) => img.folder === activeCategory);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filteredImages.length);
  };

  const goPrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filteredImages.length) % filteredImages.length);
  };

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxIndex, filteredImages.length]);

  const getCategoryLabel = (name: string) =>
    CATEGORY_LABELS[name] || name.replace(/^(foto|lavoridi)/, '').replace(/([A-Z])/g, ' $1');

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
            Una selezione dei nostri lavori più rappresentativi, dalla fresatura CNC al riporto a freddo.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-5 py-2.5 rounded-full font-body text-sm font-semibold uppercase tracking-wider transition-all duration-300 ${
              activeCategory === 'all'
                ? 'bg-red-edilmec text-white shadow-lg'
                : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
          >
            Tutti
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full font-body text-sm font-semibold uppercase tracking-wider transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-red-edilmec text-white shadow-lg'
                  : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              {getCategoryLabel(cat)}
            </button>
          ))}
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-red-edilmec border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Image Grid - Masonry-like */}
        {!loading && (
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredImages.map((img, index) => (
                <motion.div
                  key={img.url}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5) }}
                  className={`group relative overflow-hidden rounded-lg cursor-pointer ${
                    index % 5 === 0 ? 'row-span-2' : ''
                  }`}
                  onClick={() => openLightbox(index)}
                >
                  <div className={`relative w-full ${index % 5 === 0 ? 'h-64 md:h-[500px]' : 'h-48 md:h-60'}`}>
                    <img
                      src={getThumbnailUrl(img.url, index % 5 === 0)}
                      alt={`Lavoro ${getCategoryLabel(img.folder)}`}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-navy-deep/0 group-hover:bg-navy-deep/60 transition-all duration-500 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-2">
                        <ZoomIn className="w-8 h-8 text-white" />
                        <span className="text-white font-body text-xs uppercase tracking-widest">
                          {getCategoryLabel(img.folder)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filteredImages.length === 0 && (
          <p className="text-center text-muted-foreground py-16 font-body text-lg">
            Nessuna foto in questa categoria.
          </p>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && filteredImages[lightboxIndex] && (
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
              key={filteredImages[lightboxIndex].url}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              src={getLightboxUrl(filteredImages[lightboxIndex].url)}
              alt="Galleria lavori Edilmec"
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 font-body text-sm">
              {lightboxIndex + 1} / {filteredImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
