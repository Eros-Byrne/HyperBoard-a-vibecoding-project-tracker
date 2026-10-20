import { useEffect, useState } from 'react';

/** Bottom-right toast with a 200 ms fade (DESIGN.md §7). Remount with a new key for each message. */
export default function Toast({ message, onDone }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const show = requestAnimationFrame(() => setShown(true));
    const hide = setTimeout(() => setShown(false), 2500);
    const done = setTimeout(onDone, 2700);
    return () => {
      cancelAnimationFrame(show);
      clearTimeout(hide);
      clearTimeout(done);
    };
  }, []); // timers run once per message; onDone only clears state

  return (
    <div
      role="status"
      className={`fixed bottom-6 right-6 z-50 rounded-md border border-slate-700 bg-surface-card px-4 py-3 text-sm text-slate-50 shadow-lg transition-opacity duration-200 ${
        shown ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {message}
    </div>
  );
}
