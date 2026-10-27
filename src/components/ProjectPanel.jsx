import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { newMilestone } from '../model.js';
import { input, btnGhost } from '../ui.js';

const panel = 'rounded-lg border border-slate-700 bg-surface-card p-4';
const heading = 'mb-3 text-base font-semibold uppercase tracking-wide text-slate-300';

/** FR 2.3 project notes + FR 2.2 milestones. */
export default function ProjectPanel({ project, milestones, tasks, onNotesChange, onMilestonesChange }) {
  const [title, setTitle] = useState('');
  const [due, setDue] = useState('');

  const update = (id, changes) => onMilestonesChange(milestones.map((m) => (m.id === id ? { ...m, ...changes } : m)));

  function add(e) {
    e.preventDefault();
    onMilestonesChange([...milestones, newMilestone({ projectId: project.id, title: title.trim(), dueDate: due || null })]);
    setTitle('');
    setDue('');
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <section aria-labelledby="notes-title" className={panel}>
        <h2 id="notes-title" className={heading}>Project notes</h2>
        <label htmlFor="project-notes" className="sr-only">Project notes: goals, architecture, key info</label>
        <textarea
          id="project-notes"
          rows={6}
          className={`${input} font-mono`}
          placeholder="Goals, architecture notes, links, decisions…"
          value={project.notes}
          onChange={(e) => onNotesChange(e.target.value)}
        />
      </section>

      <section aria-labelledby="milestones-title" className={panel}>
        <h2 id="milestones-title" className={heading}>Milestones</h2>
        {milestones.length === 0 && (
          <p className="mb-3 rounded-md border border-dashed border-slate-700 p-3 text-sm text-slate-400">
            No milestones yet. Add one and attach tasks to it.
          </p>
        )}
        <ul className="mb-3 space-y-2">
          {milestones.map((m) => {
            const linked = tasks.filter((t) => t.milestoneId === m.id);
            const done = linked.filter((t) => t.status === 'done').length;
            return (
              <li key={m.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={m.done}
                  onChange={(e) => update(m.id, { done: e.target.checked })}
                  aria-label={`Mark ${m.title} as reached`}
                  className="h-4 w-4 accent-brand-primary"
                />
                <input
                  className={`flex-1 rounded border border-transparent bg-transparent px-1 py-0.5 hover:border-slate-700 ${m.done ? 'text-slate-400 line-through' : 'text-slate-100'}`}
                  value={m.title}
                  onChange={(e) => update(m.id, { title: e.target.value })}
                  aria-label="Milestone name"
                />
                {m.dueDate && <time className="text-xs text-slate-400" dateTime={m.dueDate}>{m.dueDate}</time>}
                <span className="w-20 text-right font-mono text-xs text-slate-400" title="Tasks done / attached">
                  {done}/{linked.length} tasks
                </span>
                <button
                  type="button"
                  onClick={() => onMilestonesChange(milestones.filter((x) => x.id !== m.id))}
                  className="rounded p-1 text-slate-400 hover:text-red-300"
                  aria-label={`Delete milestone ${m.title}`}
                >
                  <Trash2 size={14} aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
        <form onSubmit={add} className="flex gap-2">
          <label htmlFor="ms-title" className="sr-only">New milestone name</label>
          <input id="ms-title" className={input} placeholder="New milestone" required value={title} onChange={(e) => setTitle(e.target.value)} />
          <label htmlFor="ms-due" className="sr-only">New milestone due date</label>
          <input id="ms-due" type="date" className={`${input} w-40`} value={due} onChange={(e) => setDue(e.target.value)} />
          <button type="submit" className={btnGhost} aria-label="Add milestone">
            <Plus size={16} aria-hidden="true" />
          </button>
        </form>
      </section>
    </div>
  );
}
