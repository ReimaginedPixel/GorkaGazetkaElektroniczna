import { useEffect, useState } from 'react';

/** Adres bazowy serwera admina (do ładowania wgranych zdjęć z /uploads). */
export function useAdminBase(): string {
  const [base, setBase] = useState('http://localhost:8137');
  useEffect(() => {
    window.gazetka
      ?.getAdminInfo()
      .then((info) => setBase(`http://localhost:${info.port}`))
      .catch(() => {});
  }, []);
  return base;
}
