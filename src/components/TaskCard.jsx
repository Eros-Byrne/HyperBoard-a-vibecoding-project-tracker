import { Bug, Sparkles } from 'lucide-react';

// M6: accent stripe + icon + label, so type is never shown by colour alone.
const TYPE_STYLE = {
  feature: { stripe: 'border-l-type-feature', badge: 'text-type-feature bg-type-feature/10', Icon: Sparkles, label: 'Feature' },
  bug:     { stripe: 'border-l-type-bug',     badge: 'text-red-300 bg-type-bug/10',          Icon: Bug,      label: 'Bug' },
};

export default function TaskCard({ task, onOpen }) {
  const type = TYPE_STYLE[task.type];

  return (
    <article
      onClick={() => onOpen(task)}
      className={`cursor-pointer rounded-md border border-l-4 border-slate-700 ${type.stripe} bg-surface-card p-3 hover:brightness-110`}
    >
      <span className={`mb-2 inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-xs ${type.badge}`}>
        <type.Icon size={12} aria-hidden="true" /> {type.label}
      </span>
      <h3 className="text-sm font-medium text-slate-50">
        <button type="button" className="text-left hover:underline" onClick={(e) => { e.stopPropagation(); onOpen(task); }}>
          {task.title}
        </button>
      </h3>
      {task.description && <p className="mt-1 line-clamp-2 text-sm text-slate-400">{task.description}</p>}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
        <span>{task.assignee}</span>
        {task.dueDate && <time dateTime={task.dueDate}>Due {task.dueDate}</time>}
      </div>
    </article>
  );
}
