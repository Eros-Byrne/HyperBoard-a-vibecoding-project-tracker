import { useState } from 'react';
import { ExternalLink, Link2, Pencil } from 'lucide-react';
import { input } from '../ui.js';

const isWebLink = (url) => /^https?:\/\//i.test(url ?? '');

/** M11: the four final deliverables, pinned above the board. */
export default function AnchorBoard({ anchors, onChange }) {
  const [editingId, setEditingId] = useState(null);

  function save(id, url) {
    onChange(anchors.map((a) => (a.id === id ? { ...a, url: url.trim() || null } : a)));
    setEditingId(null);
  }

  return (
    <section aria-labelledby="anchors-title">
      <h2 id="anchors-title" className="mb-3 text-base font-semibold uppercase tracking-wide text-slate-300">Deliverables</h2>
      <ul className="grid grid-cols-4 gap-4">
        {anchors.map((a) => (
          <li
            key={a.id}
            className={`rounded-lg border p-3 ${a.url ? 'border-slate-700 bg-surface-card' : 'border-dashed border-slate-700'}`}
          >
            <p className="mb-2 text-sm font-medium text-slate-100">{a.label}</p>
            {editingId === a.id ? (
              <AnchorForm anchor={a} onSave={(url) => save(a.id, url)} onCancel={() => setEditingId(null)} />
            ) : (
              <div className="flex items-center gap-2 text-sm">
                {isWebLink(a.url) ? (
                  <a href={a.url} target="_blank" rel="noreferrer" className="flex min-w-0 items-center gap-1 text-violet-300 hover:underline">
                    <ExternalLink size={14} aria-hidden="true" className="shrink-0" />
                    <span className="truncate">{a.url.replace(/^https?:\/\//i, '')}</span>
                  </a>
                ) : (
                  <span className="text-slate-400">No link yet</span>
                )}
                <button
                  type="button"
                  onClick={() => setEditingId(a.id)}
                  className="ml-auto rounded p-1 text-slate-400 hover:text-white"
                  aria-label={a.url ? `Edit ${a.label} link` : `Add ${a.label} link`}
                >
                  {a.url ? <Pencil size={14} aria-hidden="true" /> : <Link2 size={14} aria-hidden="true" />}
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function AnchorForm({ anchor, onSave, onCancel }) {
  const [url, setUrl] = useState(anchor.url ?? '');
  return (
    <form
      className="space-y-2"
      onSubmit={(e) => {
        e.preventDefault();
        onSave(url);
      }}
      onKeyDown={(e) => e.key === 'Escape' && onCancel()}
    >
      <label className="sr-only" htmlFor={`anchor-${anchor.id}`}>{anchor.label} link</label>
      <input
        id={`anchor-${anchor.id}`}
        type="url"
        pattern="https?://.*"
        placeholder="https://"
        autoFocus
        className={input}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <div className="flex justify-end gap-2 text-xs">
        <button type="button" onClick={onCancel} className="rounded px-2 py-1 text-slate-300 hover:text-white">Cancel</button>
        <button type="submit" className="rounded bg-brand-primary px-2 py-1 text-white hover:bg-brand-accent">Save</button>
      </div>
    </form>
  );
}
