/** Zamienia ścieżkę zdjęcia z configu na URL możliwy do wyświetlenia. */
export function resolveAsset(p: string, adminBase: string): string {
  if (/^(https?:|data:|blob:|file:)/.test(p)) return p;
  // Zdjęcia wgrane w panelu trafiają do /uploads (serwowane przez serwer admina).
  if (p.startsWith('/uploads')) return `${adminBase}${p}`;
  // Bezwzględna ścieżka systemowa -> file:// (działa w wersji spakowanej).
  if (p.startsWith('/') || /^[A-Za-z]:[\\/]/.test(p)) return `file://${p}`;
  return p;
}
