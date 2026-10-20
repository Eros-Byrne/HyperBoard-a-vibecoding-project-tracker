import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { STAGES, TASK_TYPES } from '../model.js';
import { btnPrimary, btnGhost, btnDanger, input, label } from '../ui.js';
import Modal from './Modal.jsx';

/** One modal for both "New Task" and editing an existing task. */
export default function TaskModal({ task, isNew, members, onSave, onDelete, onClose }) {
  const [draft, setDraft] = useState(task);
  const set = (field) => (e) => setDraft({ ...draft, [field]: e.target.value });

  function remove() {
    if (window.confirm('Delete task? This action is permanent.')) onDelete(task.id);
  }

  return (
    <Modal title={isNew ? 'New Task' : 'Edit task'} onClose={onClose} wide>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSave({ ...draft, title: draft.title.trim(), dueDate: draft.dueDate || null });
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
        </div>

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
