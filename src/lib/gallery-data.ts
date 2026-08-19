// Static gallery data source.
// Le foto vengono lette da src/assets/gallery/<categoria>/*.{jpg,jpeg,png,webp}
// e incluse nel build da Vite — nessun backend, nessuna chiamata di rete.
// Per aggiungere/aggiornare foto: metti i file nella cartella giusta e rideploy.

const CATEGORY_LABELS: Record<string, string> = {
  fotolavoridiriparazione: 'Riparazioni',
  lavoridielettroerosione: 'Elettroerosione',
  lavoridifresatura: 'Fresatura',
  lavoridiriportoafreddo: 'Riporto a Freddo',
  lavoridisaldatura: 'Saldatura',
  lavoriditornitura: 'Tornitura',
};

const ORIGIN_FOLDER = 'fotoinizi';

export interface GalleryImage {
  name: string;
  url: string;
  folder: string;
  label: string;
}

export interface CategoryGroup {
  folder: string;
  label: string;
  images: GalleryImage[];
  cover: GalleryImage;
}

// Import eagerly: le immagini finiscono nel bundle come asset con URL statico.
const modules = import.meta.glob<{ default: string }>(
  '/src/assets/gallery/*/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  { eager: true }
);

function parsePath(path: string): { folder: string; name: string } {
  const parts = path.split('/');
  return { folder: parts[parts.length - 2], name: parts[parts.length - 1] };
}

const allImages: GalleryImage[] = Object.entries(modules)
  .map(([path, mod]) => {
    const { folder, name } = parsePath(path);
    return { name, url: mod.default, folder, label: CATEGORY_LABELS[folder] || folder };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

/** Categorie "I Nostri Lavori" (esclude le foto storiche). */
export function getWorkCategories(): CategoryGroup[] {
  const byFolder = new Map<string, GalleryImage[]>();
  for (const img of allImages) {
    if (img.folder === ORIGIN_FOLDER) continue;
    if (!byFolder.has(img.folder)) byFolder.set(img.folder, []);
    byFolder.get(img.folder)!.push(img);
  }
  return Array.from(byFolder.entries()).map(([folder, images]) => ({
    folder,
    label: CATEGORY_LABELS[folder] || folder,
    images,
    cover: images[0],
  }));
}

/** Foto storiche per la sezione "Le Origini". */
export function getOriginPhotos(): GalleryImage[] {
  return allImages.filter((img) => img.folder === ORIGIN_FOLDER);
}
