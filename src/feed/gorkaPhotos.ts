/**
 * Wbudowane zdjęcia okolic Górki (Rabka-Zdrój, Gorce) - pokazywane zawsze,
 * obok zdjęć wgranych w panelu admina. Pliki w /public/photos.
 *
 * Wszystkie na wolnych licencjach z Wikimedia Commons - atrybucja (wymagana
 * licencją CC BY / CC BY-SA) jest wyświetlana na kaflu i zapisana
 * w public/photos/CREDITS.json.
 */
export interface GorkaPhoto {
  /** Ścieżka WZGLĘDNA (bez wiodącego "/") - działa i w dev, i w wersji spakowanej (file://). */
  src: string;
  caption: string;
  credit: string;
}

export const GORKA_PHOTOS: GorkaPhoto[] = [
  {
    src: 'photos/panorama-rabki.jpg',
    caption: 'Rabka-Zdrój, nasze miasto',
    credit: 'fot. Mach240390 · Wikimedia Commons · CC BY-SA 3.0',
  },
  {
    src: 'photos/park-zdrojowy.jpg',
    caption: 'Park Zdrojowy w Rabce-Zdroju',
    credit: 'fot. Mach240390 · Wikimedia Commons · CC BY 4.0',
  },
  {
    src: 'photos/fontanna-park.jpg',
    caption: 'Fontanna w Parku Zdrojowym',
    credit: 'fot. Zalasem1 · Wikimedia Commons · CC BY 4.0',
  },
  {
    src: 'photos/dworzec-rabka.jpg',
    caption: 'Dworzec kolejowy Rabka-Zdrój',
    credit: 'fot. Mach240390 · Wikimedia Commons · CC BY 4.0',
  },
  {
    src: 'photos/hala-turbacz.jpg',
    caption: 'Hala Turbacz w Gorcach',
    credit: 'fot. Jakub Hałun · Wikimedia Commons · CC BY 4.0',
  },
  {
    src: 'photos/turbacz-zima.jpg',
    caption: 'Gorce zimą: Hala Turbacz',
    credit: 'fot. Jakub Hałun · Wikimedia Commons · CC BY-SA 4.0',
  },
];
