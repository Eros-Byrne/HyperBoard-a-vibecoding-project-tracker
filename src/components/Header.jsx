import { Contrast, LifeBuoy, LogOut, Moon, Plus, UserPlus } from 'lucide-react';
import { TEAM_COLORS, teamColor } from '../model.js';
import { btnGhost, btnPrimary } from '../ui.js';
import Wordmark from './Wordmark.jsx';

const select = 'rounded-md border border-slate-500 bg-surface-page px-2 py-1.5 text-sm text-slate-100';

export default function Header({ team, projects, project, user, onSelectProject, onNewProject, onChangeColor, onLogout, onSwitchUser, onNewTask, onAddMember, onContact, highContrast, onToggleContrast, darkMode, onToggleDark }) {
  return (
    <header className="border-b border-slate-800 bg-surface-page">
      {/* Team colour stripe (FR 1.3) */}
      <div className="h-1" style={{ background: teamColor(team) }} aria-hidden="true" />
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-6 py-4">
        <h1>
          {/* Logo top left goes "home" (back to the top of the board) */}
          <a href="#" aria-label="HyperBoard home" className="rounded-md">
            <Wordmark />
          </a>
        </h1>

        <div className="flex items-center gap-2 text-sm">
          <span className="h-3 w-3 rounded-full" style={{ background: teamColor(team) }} aria-hidden="true" />
          <span className="font-semibold" style={{ color: teamColor(team, !darkMode) }}>{team.name}</span>
          <span className="rounded bg-surface-card px-1.5 py-0.5 font-mono text-xs text-slate-400" title="Share this code so teammates can join">
            code {team.code}
          </span>
          <label className="sr-only" htmlFor="team-color">Team colour</label>
          <select id="team-color" className={select} value={team.color} onChange={(e) => onChangeColor(e.target.value)}>
            {TEAM_COLORS.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
          <button type="button" className={btnGhost} onClick={onAddMember} title={`${team.members.length} member(s): ${team.members.join(', ')}`}>
            <UserPlus size={16} aria-hidden="true" /> Invite
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs uppercase tracking-wide text-slate-400" htmlFor="project">Project</label>
          <select id="project" className={select} value={project.id} onChange={(e) => onSelectProject(e.target.value)}>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <button type="button" className={btnGhost} onClick={onNewProject} aria-label="New project">
            <Plus size={16} aria-hidden="true" /> Project
          </button>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button type="button" className={btnGhost} onClick={onToggleDark} aria-pressed={darkMode}>
            <Moon size={16} aria-hidden="true" /> Dark mode{darkMode && <span aria-hidden="true"> · On</span>}
          </button>
          <button type="button" className={btnGhost} onClick={onToggleContrast} aria-pressed={highContrast}>
            <Contrast size={16} aria-hidden="true" /> High contrast{highContrast && <span aria-hidden="true"> · On</span>}
          </button>
          <button type="button" className={btnPrimary} onClick={onNewTask}>
            <Plus size={16} aria-hidden="true" /> New Task
          </button>
          {/* Prototype: switch between team members without signing out, to show each member's view */}
          <span className="flex items-center gap-2 text-sm text-slate-400">
            <label htmlFor="signed-in-as">Signed in as</label>
            <select id="signed-in-as" className={select} value={user} onChange={(e) => onSwitchUser(e.target.value)}>
              {team.members.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </span>
          <button type="button" className={btnGhost} onClick={onContact}>
            <LifeBuoy size={16} aria-hidden="true" /> Contact us
          </button>
          <button type="button" className={btnGhost} onClick={onLogout}>
            <LogOut size={16} aria-hidden="true" /> Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
