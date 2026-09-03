/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Design system GórkaGuesser (Y2K × graffiti × wlepki). Ramp powierzchni
        // i tuszu przełącza się przez tokeny CSS (.light na <html>), akcenty są
        // IDENTYCZNE w obu schematach.
        gg: {
          body: 'var(--gg-body)',
          paper: 'var(--gg-paper)',
          card: 'var(--gg-card)',
          deep: 'var(--gg-deep)',
          track: 'var(--gg-track)',
          ink: 'var(--gg-ink)',
          muted: 'var(--gg-muted)',
          meta: 'var(--gg-meta)',
          rule: 'var(--gg-rule)',
          edge: 'var(--gg-edge)',
          halo: 'var(--gg-halo)',
          pink: '#ff3d9a',
          'pink-deep': '#9c0055',
          yellow: '#ffd02e',
          purple: '#7b2ff2',
          lime: '#8fd41f',
          'lime-ink': '#2f4a08',
          cyan: '#22c9e0',
          orange: '#ff6b1a',
        },
        // Kolor = STATUS, nie dekoracja (paleta GórkaGuesser).
        status: {
          lesson: '#8fd41f', // limonka  - lekcja trwa
          break: '#ffd02e', // żółty    - przerwa zwykła
          long: '#7b2ff2', // fiolet   - długa przerwa
          alarm: '#ff3d9a', // róż      - alarm / pilne
          off: '#22c9e0', // cyjan    - dzień wolny / weekend / święto
        },
      },
      fontFamily: {
        // Zupiter - nagłówki, Palamecia - KAŻDA liczba, Pakenham - etykiety/tekst.
        display: ['Zupiter', 'Pakenham', 'system-ui', 'sans-serif'],
        num: ['Palamecia', 'Pakenham', 'ui-monospace', 'monospace'],
        ui: ['Pakenham', 'system-ui', 'Segoe UI', 'sans-serif'],
        sans: ['Pakenham', 'system-ui', 'Segoe UI', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      fontSize: {
        // Skala "z 5–10 m": jedna informacja = największy element ekranu.
        timer: ['26vh', { lineHeight: '0.95', letterSpacing: '0.01em' }],
        'timer-sm': ['15vh', { lineHeight: '0.95', letterSpacing: '0.01em' }],
        mega: ['12vh', { lineHeight: '1', letterSpacing: '0.01em' }],
        hero: ['7.5vh', { lineHeight: '1.04' }],
        h2: ['5vh', { lineHeight: '1.08' }],
        big: ['3.8vh', { lineHeight: '1.2' }],
        body: ['2.9vh', { lineHeight: '1.3' }],
        chip: ['2vh', { lineHeight: '1.1', letterSpacing: '0.16em' }],
        meta: ['1.7vh', { lineHeight: '1.2', letterSpacing: '0.2em' }],
      },
      keyframes: {
        'pulse-alarm': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        // Ken Burns - powolny zoom/pan zdjęć w feedzie.
        kenburns: {
          '0%': { transform: 'scale(1.02) translate(0, 0)' },
          '100%': { transform: 'scale(1.15) translate(-1.5%, -1%)' },
        },
        // Naklejka unosi się i lekko kołysze (ggfloat z GórkaGuesser).
        ggfloat: {
          '0%, 100%': { transform: 'translateY(0) rotate(var(--r, 0deg))' },
          '50%': { transform: 'translateY(-1.4vh) rotate(calc(var(--r, 0deg) + 3deg))' },
        },
        // Karta „ląduje” jak naklejka: niedobicie, przebicie, osiadanie.
        ggpop: {
          '0%': { transform: 'scale(0.82)', opacity: '0' },
          '60%': { transform: 'scale(1.06)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        // Bicie serca licznika.
        ggtick: {
          '0%, 100%': { transform: 'rotate(-1.5deg) scale(1)' },
          '50%': { transform: 'rotate(-1.5deg) scale(1.03)' },
        },
        ggwobble: {
          '0%, 100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(4deg)' },
        },
        ggblink: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.2', transform: 'scale(0.86)' },
        },
      },
      animation: {
        'pulse-alarm': 'pulse-alarm 1.1s ease-in-out infinite',
        marquee: 'marquee var(--marquee-duration, 40s) linear infinite',
        'fade-in': 'fade-in 0.6s ease-out both',
        kenburns: 'kenburns 24s ease-in-out both',
        ggfloat: 'ggfloat 6s ease-in-out infinite',
        ggpop: 'ggpop 0.34s cubic-bezier(0.2, 1.4, 0.4, 1) backwards',
        ggtick: 'ggtick 1s ease-in-out infinite',
        ggwobble: 'ggwobble 2.4s ease-in-out infinite',
        ggblink: 'ggblink 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
