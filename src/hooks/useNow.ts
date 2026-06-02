import { useEffect, useState } from 'react';

/**
 * Zwraca bieżący czas, odświeżany co `intervalMs`.
 * Domyślnie co 1s (zegar/timer). Stan jest liczony z czasu lokalnego —
 * nie wymaga ręcznego odświeżania.
 */
export function useNow(intervalMs = 1000): Date {
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}
