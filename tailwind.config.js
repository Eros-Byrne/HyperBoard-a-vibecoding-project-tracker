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
          page: '#0F172A',
          card: '#1E293B',
        },
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
