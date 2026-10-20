import { useState } from 'react';
import { btnPrimary, btnGhost, input, label } from '../ui.js';
import Modal from './Modal.jsx';

const ISSUES_URL = 'https://github.com/Eros-Byrne/HyperBoard-a-vibecoding-project-tracker/issues/new';

const CATEGORIES = [
  { id: 'bug', label: 'Report a bug' },
  { id: 'issue', label: 'Problem using the app' },
  { id: 'help', label: 'Ask for help' },
];

/** FR 4.1: support form. There is no backend, so it opens a pre-filled GitHub issue. */
export default function ContactModal({ teamName, onSent, onClose }) {
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  function send(e) {
    e.preventDefault();
    const cat = CATEGORIES.find((c) => c.id === category).label;
    const body = `**Category:** ${cat}\n**Team:** ${teamName}\n\n${message}`;
    const url = `${ISSUES_URL}?title=${encodeURIComponent(`[${category}] ${subject}`)}&body=${encodeURIComponent(body)}`;
    window.open(url, '_blank', 'noopener');
    onSent();
  }

  return (
    <Modal title="Contact us" onClose={onClose}>
      <form className="space-y-4" onSubmit={send}>
        <div>
          <label htmlFor="contact-cat" className={label}>What do you need?</label>
          <select id="contact-cat" className={input} value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="contact-subject" className={label}>Subject</label>
          <input id="contact-subject" className={input} required value={subject} onChange={(e) => setSubject(e.target.value)} />
        </div>
        <div>
          <label htmlFor="contact-msg" className={label}>Message</label>
          <textarea
            id="contact-msg"
            rows={5}
            className={input}
            required
            placeholder="What happened, what you expected, and steps to repeat it."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <p className="text-xs text-slate-400">
          This opens a pre-filled issue on our GitHub repo in a new tab. You'll need a GitHub account to submit it.
        </p>
        <div className="flex justify-end gap-2 border-t border-slate-700 pt-4">
          <button type="button" className={btnGhost} onClick={onClose}>Cancel</button>
          <button type="submit" className={btnPrimary}>Continue to GitHub</button>
        </div>
      </form>
    </Modal>
  );
}
