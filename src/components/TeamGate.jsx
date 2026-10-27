import { useState } from 'react';
import { LogIn } from 'lucide-react';
import { TEAM_COLORS, DEMO_LOGIN } from '../model.js';
import { btnPrimary, btnGhost, input, label } from '../ui.js';
import Wordmark from './Wordmark.jsx';

/**
 * Entry screen (FR 1.1, FR 1.4): sign in to a team, create a team, or join one with a code.
 * Prototype: teams live in this browser's localStorage and passwords are not stored or checked.
 */
export default function TeamGate({ teams, onLogin, onCreateTeam, onJoinTeam }) {
  const [mode, setMode] = useState(teams.length ? 'signin' : 'create');

  const modes = [
    { id: 'signin', label: 'Sign in', hidden: !teams.length },
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
                mode === m.id ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-slate-50'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {mode === 'signin' && <SignInForm teams={teams} onLogin={onLogin} />}
        {mode === 'create' && <CreateForm onCreateTeam={onCreateTeam} />}
        {mode === 'join' && <JoinForm onJoinTeam={onJoinTeam} />}

        <p className="mt-6 text-xs text-slate-400">Prototype: passwords are not stored or checked.</p>
      </main>
    </div>
  );
}

function PasswordField({ id, autoComplete, value, onChange }) {
  return (
    <div>
      <label htmlFor={id} className={label}>Password</label>
      <input id={id} type="password" autoComplete={autoComplete} className={input} required value={value} onChange={onChange} />
    </div>
  );
}

function SignInForm({ teams, onLogin }) {
  const [teamId, setTeamId] = useState(teams[0].id);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const demoTeam = teams.find((t) => t.id === DEMO_LOGIN.teamId);

  function signIn(e) {
    e.preventDefault();
    const team = teams.find((t) => t.id === teamId);
    const member = team.members.find((m) => m.toLowerCase() === name.trim().toLowerCase());
    if (!member) {
      setError(`"${name.trim()}" isn't a member of ${team.name}. Check the spelling, or join with a code.`);
      return;
    }
    onLogin(team.id, member);
  }

  function fillDemo() {
    setTeamId(DEMO_LOGIN.teamId);
    setName(DEMO_LOGIN.name);
    setPassword(DEMO_LOGIN.password);
    setError('');
  }

  return (
    <form className="space-y-4" onSubmit={signIn}>
      {demoTeam && (
        <div className="rounded-md border border-dashed border-slate-700 p-3 text-sm text-slate-300">
          <p>
            Just looking? Use the demo account: team <span className="font-medium text-slate-100">{demoTeam.name}</span>, name{' '}
            <span className="font-medium text-slate-100">{DEMO_LOGIN.name}</span>, password{' '}
            <span className="font-mono text-slate-100">{DEMO_LOGIN.password}</span>.
          </p>
          <button type="button" className={`${btnGhost} mt-2`} onClick={fillDemo}>
            Use demo account
          </button>
        </div>
      )}
      <div>
        <label htmlFor="signin-team" className={label}>Team</label>
        <select id="signin-team" className={input} value={teamId} onChange={(e) => setTeamId(e.target.value)}>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="signin-name" className={label}>Your name</label>
        <input id="signin-name" autoComplete="username" className={input} required value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <PasswordField id="signin-password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && (
        <p role="alert" className="text-sm text-red-300">
          {error}
        </p>
      )}
      <button type="submit" className={`${btnPrimary} w-full justify-center`}>
        <LogIn size={16} aria-hidden="true" /> Sign in
      </button>
    </form>
  );
}

function CreateForm({ onCreateTeam }) {
  const [name, setName] = useState('');
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
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
        <input id="create-user" autoComplete="username" className={input} required value={user} onChange={(e) => setUser(e.target.value)} />
      </div>
      <PasswordField id="create-password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
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
              className="block h-8 w-8 rounded-full ring-offset-2 ring-offset-surface-card peer-checked:ring-2 peer-checked:ring-slate-50 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-primary"
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
  const [password, setPassword] = useState('');
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
        <input id="join-user" autoComplete="username" className={input} required value={user} onChange={(e) => setUser(e.target.value)} />
      </div>
      <PasswordField id="join-password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && (
        <p role="alert" className="text-sm text-red-300">
          {error}
        </p>
      )}
      <button type="submit" className={`${btnGhost} w-full justify-center`}>Join team</button>
    </form>
  );
}
