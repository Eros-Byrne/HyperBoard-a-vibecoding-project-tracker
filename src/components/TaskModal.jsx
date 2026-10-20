import { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { STAGES, TASK_TYPES, AI_TOOLS, uid } from '../model.js';
import { btnPrimary, btnGhost, btnDanger, input, label } from '../ui.js';
import Modal from './Modal.jsx';

/** One modal for both "New Task" and editing an existing task. */
export default function TaskModal({ task, isNew, members, milestones, onSave, onDelete, onClose }) {
  const [draft, setDraft] = useState(task);
  const set = (field) => (e) => setDraft({ ...draft, [field]: e.target.value });

  function remove() {
    if (window.confirm('Delete task? This action is permanent.')) onDelete(task.id);
  }

  const setPrompt = (id, field, value) =>
    setDraft({ ...draft, prompts: draft.prompts.map((p) => (p.id === id ? { ...p, [field]: value } : p)) });

  const addPrompt = () =>
    setDraft({
      ...draft,
      prompts: [...draft.prompts, { id: uid(), tool: draft.contextTool ?? AI_TOOLS[0], prompt: '', result: '', createdAt: new Date().toISOString() }],
    });

  const removePrompt = (id) => setDraft({ ...draft, prompts: draft.prompts.filter((p) => p.id !== id) });

  function save() {
    const contextChanged = draft.context !== task.context || (draft.contextTool || null) !== task.contextTool;
    onSave({
      ...draft,
      title: draft.title.trim(),
      dueDate: draft.dueDate || null,
      milestoneId: draft.milestoneId || null,
      contextTool: draft.contextTool || null,
      contextUpdatedAt: contextChanged ? new Date().toISOString() : draft.contextUpdatedAt,
      prompts: draft.prompts.filter((p) => p.prompt.trim() || p.result.trim()),
    });
  }

  return (
    <Modal title={isNew ? 'New Task' : 'Edit task'} onClose={onClose} wide>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <div>
          <label htmlFor="task-title" className={label}>Title</label>
          <input id="task-title" className={input} required value={draft.title} onChange={set('title')} />
        </div>
        <div>
          <label htmlFor="task-desc" className={label}>Description</label>
          <textarea id="task-desc" rows={3} className={input} value={draft.description} onChange={set('description')} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="task-type" className={label}>Type</label>
            <select id="task-type" className={input} value={draft.type} onChange={set('type')}>
              {TASK_TYPES.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="task-status" className={label}>Status</label>
            <select id="task-status" className={input} value={draft.status} onChange={set('status')}>
              {STAGES.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="task-assignee" className={label}>Assignee</label>
            <select id="task-assignee" className={input} value={draft.assignee} onChange={set('assignee')}>
              {members.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="task-due" className={label}>Due date</label>
            <input id="task-due" type="date" className={`${input} [color-scheme:dark]`} value={draft.dueDate ?? ''} onChange={set('dueDate')} />
          </div>
          <div className="col-span-2">
            <label htmlFor="task-milestone" className={label}>Milestone</label>
            <select id="task-milestone" className={input} value={draft.milestoneId ?? ''} onChange={set('milestoneId')}>
              <option value="">None</option>
              {milestones.map((m) => (
                <option key={m.id} value={m.id}>{m.title}</option>
              ))}
            </select>
          </div>
        </div>

        {/* M9: curated briefing for the next AI / teammate */}
        <fieldset className="space-y-3 rounded-md border border-slate-700 p-4">
          <legend className="px-1 text-sm font-semibold text-slate-200">AI context</legend>
          <div>
            <label htmlFor="task-tool" className={label}>AI agent used</label>
            <select id="task-tool" className={input} value={draft.contextTool ?? ''} onChange={set('contextTool')}>
              <option value="">None</option>
              {AI_TOOLS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="task-context" className={label}>Context</label>
            <textarea
              id="task-context"
              rows={4}
              className={`${input} font-mono`}
              placeholder="What the next person (or AI) needs to know: goal, decisions so far, what's left."
              value={draft.context}
              onChange={set('context')}
            />
            {draft.contextUpdatedAt && (
              <p className="mt-1 text-xs text-slate-400">Last updated {new Date(draft.contextUpdatedAt).toLocaleString()}</p>
            )}
          </div>
        </fieldset>

        {/* FR 3.1: log prompts that worked and what they produced */}
        <fieldset className="space-y-3 rounded-md border border-slate-700 p-4">
          <legend className="px-1 text-sm font-semibold text-slate-200">Prompt log</legend>
          {draft.prompts.length === 0 && (
            <p className="rounded-md border border-dashed border-slate-700 p-3 text-sm text-slate-400">
              No prompts logged yet. Save the ones that worked so the team can reuse them.
            </p>
          )}
          {draft.prompts.map((p, i) => (
            <div key={p.id} className="space-y-2 rounded-md bg-surface-page/60 p-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-slate-400">#{i + 1}</span>
                <label className="sr-only" htmlFor={`p-tool-${p.id}`}>Tool for prompt {i + 1}</label>
                <select id={`p-tool-${p.id}`} className={`${input} w-auto`} value={p.tool} onChange={(e) => setPrompt(p.id, 'tool', e.target.value)}>
                  {AI_TOOLS.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => removePrompt(p.id)}
                  className="ml-auto rounded p-1 text-slate-400 hover:text-red-300"
                  aria-label={`Remove prompt ${i + 1}`}
                >
                  <X size={16} aria-hidden="true" />
                </button>
              </div>
              <label className="sr-only" htmlFor={`p-prompt-${p.id}`}>Prompt {i + 1}</label>
              <textarea
                id={`p-prompt-${p.id}`}
                rows={2}
                className={`${input} font-mono`}
                placeholder="Prompt"
                value={p.prompt}
                onChange={(e) => setPrompt(p.id, 'prompt', e.target.value)}
              />
              <label className="sr-only" htmlFor={`p-result-${p.id}`}>Result {i + 1}</label>
              <textarea
                id={`p-result-${p.id}`}
                rows={2}
                className={`${input} font-mono`}
                placeholder="Result / code snippet"
                value={p.result}
                onChange={(e) => setPrompt(p.id, 'result', e.target.value)}
              />
            </div>
          ))}
          <button type="button" className={btnGhost} onClick={addPrompt}>
            <Plus size={16} aria-hidden="true" /> Log a prompt
          </button>
        </fieldset>

        <div className="flex items-center justify-between border-t border-slate-700 pt-4">
          {isNew ? (
            <span />
          ) : (
            <button type="button" className={btnDanger} onClick={remove}>
              <Trash2 size={16} aria-hidden="true" /> Delete
            </button>
          )}
          <div className="flex gap-2">
            <button type="button" className={btnGhost} onClick={onClose}>Cancel</button>
            <button type="submit" className={btnPrimary}>{isNew ? 'Create task' : 'Save'}</button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
