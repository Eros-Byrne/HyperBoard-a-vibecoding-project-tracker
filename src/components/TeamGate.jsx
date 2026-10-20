import { useState } from 'react';
import { TEAM_COLORS, teamColor } from '../model.js';
import { btnPrimary, btnGhost, input, label } from '../ui.js';
import Wordmark from './Wordmark.jsx';

/**
 * Entry screen: open an existing team workspace, create a team, or join one with a code.
 * Teams live in this browser's localStorage, so "join" only finds teams created here.
 */
export default function TeamGate({ teams, onLogin, onCreateTeam, onJoinTeam }) {
  const [mode, setMode] = useState(teams.length ? 'open' : 'create');

  const modes = [
    { id: 'open', label: 'Open workspace', hidden: !teams.length },
    { id: 'create', label: 'Create team' },
    { id: 'join', label: 'Join with code' },
  ].filter((m) => !m.hidden);

  return (
    <div className="flex min-h-full items-center justify-center p-6">
      <main className="w-full max-w-md rounded-lg border border-slate-700 bg-surface-card p-6">
        <h1 className="mb-1">
          <Wordmark />
        </h1>
        <p className="mb-6 text-sm text-slate-400">Track vibecoding tasks and the prompts behind them.</p>

        <div className="mb-6 flex gap-1 rounded-md bg-surface-page p-1" role="group" aria-label="Choose an option">
          {modes.map((m) => (
            <button
              key={m.id}
              type="button"
              aria-pressed={mode === m.id}
              onClick={() => setMode(m.id)}
              className={`flex-1 rounded px-2 py-1.5 text-sm ${
                mode === m.id ? 'bg-brand-primary text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {mode === 'open' && <OpenForm teams={teams} onLogin={onLogin} />}
        {mode === 'create' && <CreateForm onCreateTeam={onCreateTeam} />}
        {mode === 'join' && <JoinForm onJoinTeam={onJoinTeam} />}
      </main>
    </div>
  );
}

function OpenForm({ teams, onLogin }) {
  const [teamId, setTeamId] = useState(teams[0].id);
  const team = teams.find((t) => t.id === teamId);
  const [user, setUser] = useState(team.members[0]);

  function pickTeam(id) {
    setTeamId(id);
    setUser(teams.find((t) => t.id === id).members[0]);
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onLogin(teamId, user);
      }}
    >
      <fieldset>
        <legend className={label}>Team</legend>
        <div className="space-y-2">
          {teams.map((t) => (
            <label
              key={t.id}
              className={`flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2 text-sm ${
                t.id === teamId ? 'border-brand-primary' : 'border-slate-700'
              }`}
            >
              <input type="radio" name="team" value={t.id} checked={t.id === teamId} onChange={() => pickTeam(t.id)} />
              <span className="h-3 w-3 rounded-full" style={{ background: teamColor(t) }} aria-hidden="true" />
              <span className="font-medium">{t.name}</span>
              <span className="ml-auto text-xs text-slate-400">{t.members.length} member(s)</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <label htmlFor="open-user" className={label}>Who are you?</label>
        <select id="open-user" className={input} value={user} onChange={(e) => setUser(e.target.value)}>
          {team.members.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </div>
      <button type="submit" className={`${btnPrimary} w-full justify-center`}>Open workspace</button>
    </form>
  );
}

function CreateForm({ onCreateTeam }) {
  const [name, setName] = useState('');
  const [user, setUser] = useState('');
  const [color, setColor] = useState(TEAM_COLORS[0].id);

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onCreateTeam({ name: name.trim(), color, user: user.trim() });
      }}
    >
      <div>
        <label htmlFor="create-name" className={label}>Team name</label>
        <input id="create-name" className={input} required value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label htmlFor="create-user" className={label}>Your name</label>
        <input id="create-user" className={input} required value={user} onChange={(e) => setUser(e.target.value)} />
      </div>
      <ColorPicker value={color} onChange={setColor} />
      <button type="submit" className={`${btnPrimary} w-full justify-center`}>Create team</button>
    </form>
  );
}

function ColorPicker({ value, onChange }) {
  return (
    <fieldset>
      <legend className={label}>Team colour</legend>
      <div className="flex flex-wrap gap-2">
        {TEAM_COLORS.map((c) => (
          <label key={c.id} className="cursor-pointer" title={c.label}>
            <input
              type="radio"
              name="team-color"
              value={c.id}
              checked={value === c.id}
              onChange={() => onChange(c.id)}
              className="peer sr-only"
            />
            <span
              className="block h-8 w-8 rounded-full ring-offset-2 ring-offset-surface-card peer-checked:ring-2 peer-checked:ring-white peer-focus-visible:ring-2 peer-focus-visible:ring-brand-primary"
              style={{ background: c.hex }}
            />
            <span className="sr-only">{c.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function JoinForm({ onJoinTeam }) {
  const [code, setCode] = useState('');
  const [user, setUser] = useState('');
  const [error, setError] = useState('');

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setError(onJoinTeam(code.trim().toUpperCase(), user.trim()) ?? '');
      }}
    >
      <div>
        <label htmlFor="join-code" className={label}>Team code</label>
        <input
          id="join-code"
          className={`${input} font-mono uppercase`}
          required
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          aria-describedby="join-help"
        />
        <p id="join-help" className="mt-1 text-xs text-slate-400">
          Ask a teammate for the 6-character code shown in their header.
        </p>
      </div>
      <div>
        <label htmlFor="join-user" className={label}>Your name</label>
        <input id="join-user" className={input} required value={user} onChange={(e) => setUser(e.target.value)} />
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-300">
          {error}
        </p>
      )}
      <button type="submit" className={`${btnGhost} w-full justify-center`}>Join team</button>
    </form>
  );
}
