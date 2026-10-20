import { Bug, Sparkles } from 'lucide-react';

// M6: accent stripe + icon + label, so type is never shown by colour alone.
const TYPE_STYLE = {
  feature: { stripe: 'border-l-type-feature', badge: 'text-type-feature bg-type-feature/10', Icon: Sparkles, label: 'Feature' },
  bug:     { stripe: 'border-l-type-bug',     badge: 'text-red-300 bg-type-bug/10',          Icon: Bug,      label: 'Bug' },
};

const initials = (name) => name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();

const miniSelect = 'rounded border border-slate-700 bg-surface-page px-1.5 py-1 text-xs text-slate-200';

export default function TaskCard({ task, members, onOpen, onHandOff }) {
  const type = TYPE_STYLE[task.type];
  const others = members.filter((m) => m !== task.assignee);

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

      <div className="mt-3 flex items-center justify-between gap-2 text-xs text-slate-400">
        {/* M7: owner badge */}
        <span className="flex items-center gap-1.5 text-slate-200">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 font-mono text-[10px] font-medium" aria-hidden="true">
            {initials(task.assignee)}
          </span>
          <span className="sr-only">Assigned to</span>
          {task.assignee}
        </span>
        {task.dueDate && <time dateTime={task.dueDate}>Due {task.dueDate}</time>}
      </div>

      {/* Controls don't open the modal when used */}
      <div className="mt-3 flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
        <select
          className={miniSelect}
          aria-label={`Hand off "${task.title}" to`}
          value=""
          disabled={!others.length}
          title={others.length ? undefined : 'Invite teammates to hand off tasks'}
          onChange={(e) => onHandOff(task, e.target.value)}
        >
          <option value="" disabled>Hand off to…</option>
          {others.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </div>
    </article>
  );
}
