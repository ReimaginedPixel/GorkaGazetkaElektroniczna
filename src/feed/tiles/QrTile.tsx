import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import { GGHeading, GGSurface } from '../../gg';
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
      color: { dark: '#141118', light: '#FFFFFF' },
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
    <TileFrame label="Zeskanuj telefonem" icon={['ui', 'play']} tone="cyan">
      <div className="flex items-center gap-[4vw]">
        <GGSurface tilt="l2" className="!bg-white p-[1.2vh]">
          {src ? (
            <img src={src} alt={label} className="block h-[28vh] w-[28vh]" />
          ) : (
            <div className="h-[28vh] w-[28vh] animate-pulse bg-gg-track" />
          )}
        </GGSurface>
        <GGHeading className="max-w-[40vw] text-left text-h2">{label}</GGHeading>
      </div>
    </TileFrame>
  );
}
