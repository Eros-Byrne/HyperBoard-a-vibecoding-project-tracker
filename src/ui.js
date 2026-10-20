// Shared Tailwind class strings so buttons and inputs look the same everywhere (DESIGN.md §4).

export const btnPrimary =
  'inline-flex items-center gap-1.5 rounded-md bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-accent disabled:opacity-50';

export const btnGhost =
  'inline-flex items-center gap-1.5 rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:border-brand-accent hover:text-white';

export const btnDanger =
  'inline-flex items-center gap-1.5 rounded-md border border-red-500/60 px-3 py-2 text-sm text-red-300 hover:bg-red-500/10';

export const input =
  'w-full rounded-md border border-slate-700 bg-surface-page px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500';

export const label = 'mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400';
