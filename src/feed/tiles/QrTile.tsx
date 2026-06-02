import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import { TileFrame } from '../TileFrame';

/** Kod QR generowany w locie. Ciemne moduły na białym tle (skanowalność). */
export function QrTile({ label, url }: { label: string; url: string }) {
  const [src, setSrc] = useState<string>('');

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(url, {
      width: 560,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: { dark: '#0A0A0A', light: '#FFFFFF' },
    })
      .then((data) => {
        if (active) setSrc(data);
      })
      .catch((err) => console.error('[QrTile]', err));
    return () => {
      active = false;
    };
  }, [url]);

  return (
    <TileFrame label="Zeskanuj telefonem">
      <div className="flex flex-col items-center gap-[3vh]">
        {src ? (
          <img src={src} alt={label} className="h-[42vh] w-[42vh] rounded-3xl bg-white p-4" />
        ) : (
          <div className="h-[42vh] w-[42vh] animate-pulse rounded-3xl bg-white/10" />
        )}
        <div className="text-hero font-bold">{label}</div>
      </div>
    </TileFrame>
  );
}
