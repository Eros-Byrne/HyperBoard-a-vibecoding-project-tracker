// DESIGN.md §6: "Hyper" in text-primary, "Board" in brand-primary, heavy weight.
export default function Wordmark({ className = 'text-2xl' }) {
  return (
    <span className={`font-extrabold tracking-tight ${className}`}>
      <span className="text-slate-50">Hyper</span>
      <span className="text-brand-primary">Board</span>
    </span>
  );
}
