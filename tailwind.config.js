/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Tło kiosku — bardzo ciemne, wysoki kontrast (digital signage).
        ink: '#0A0A0A',
        'ink-soft': '#141414',
        'ink-card': '#1C1C1E',
        // Kolor = STATUS, nie dekoracja.
        status: {
          lesson: '#22C55E', // zielony  — lekcja trwa
          break: '#F59E0B', // bursztyn — przerwa zwykła
          long: '#A855F7', // fiolet   — długa przerwa
          alarm: '#EF4444', // czerwony — alarm / pilne
          off: '#3B82F6', // niebieski — dzień wolny / weekend / święto
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'SF Pro Display',
          'SF Pro Text',
          '-apple-system',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      fontSize: {
        // Skala "z 5–10 m": jedna informacja = największy element ekranu.
        timer: ['28vh', { lineHeight: '0.9', letterSpacing: '-0.03em' }],
        'timer-sm': ['18vh', { lineHeight: '0.92', letterSpacing: '-0.02em' }],
        mega: ['12vh', { lineHeight: '1', letterSpacing: '-0.02em' }],
        hero: ['8vh', { lineHeight: '1.02' }],
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
        // Ken Burns — powolny zoom/pan zdjęć w feedzie.
        kenburns: {
          '0%': { transform: 'scale(1.02) translate(0, 0)' },
          '100%': { transform: 'scale(1.15) translate(-1.5%, -1%)' },
        },
        // Wolno dryfująca poświata tła w kolorze statusu.
        aurora: {
          '0%, 100%': { transform: 'translate(-4%, -2%) scale(1)' },
          '50%': { transform: 'translate(5%, 4%) scale(1.15)' },
        },
      },
      animation: {
        'pulse-alarm': 'pulse-alarm 1.1s ease-in-out infinite',
        marquee: 'marquee var(--marquee-duration, 40s) linear infinite',
        'fade-in': 'fade-in 0.6s ease-out both',
        kenburns: 'kenburns 24s ease-in-out both',
        aurora: 'aurora 18s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
