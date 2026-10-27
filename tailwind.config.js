// Themed colours read CSS variables set in src/index.css, so light / dark mode
// swaps them without touching component classes.
const themed = (name) => `rgb(var(--${name}) / <alpha-value>)`;
const slateShades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Tokens from DESIGN.md §2
      colors: {
        brand: {
          primary: '#6366F1',
          accent: '#8B5CF6',
        },
        surface: {
          page: themed('surface-page'),
          card: themed('surface-card'),
        },
        slate: Object.fromEntries(slateShades.map((s) => [s, themed(`slate-${s}`)])),
        // Only the 300 shades are used for text, so only they change per theme.
        red: { 300: themed('red-300') },
        emerald: { 300: themed('emerald-300') },
        amber: { 300: themed('amber-300') },
        violet: { 300: themed('violet-300') },
        text: {
          primary: '#F8FAFC',
          muted: '#94A3B8',
        },
        type: {
          feature: '#10B981',
          bug: '#EF4444',
        },
        due: {
          safe: '#10B981',
          warning: '#F59E0B',
          overdue: '#EF4444',
          neutral: '#64748B',
        },
      },
      // DESIGN.md §3
      fontFamily: {
        sans: ['Inter', '"SF Pro Text"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
