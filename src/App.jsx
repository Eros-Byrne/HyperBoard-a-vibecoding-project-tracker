import {
  STORAGE_KEYS,
  SEED_TEAMS,
  SEED_PROJECTS,
  SEED_MILESTONES,
  SEED_TASKS,
  SEED_SESSION,
  newTeam,
  newProject,
} from './model.js';
import { useLocalStorage } from './useLocalStorage.js';
import TeamGate from './components/TeamGate.jsx';
import Header from './components/Header.jsx';
import Board from './components/Board.jsx';

export default function App() {
  const [teams, setTeams] = useLocalStorage(STORAGE_KEYS.teams, SEED_TEAMS);
  const [projects, setProjects] = useLocalStorage(STORAGE_KEYS.projects, SEED_PROJECTS);
  const [milestones, setMilestones] = useLocalStorage(STORAGE_KEYS.milestones, SEED_MILESTONES);
  const [tasks, setTasks] = useLocalStorage(STORAGE_KEYS.tasks, SEED_TASKS);
  const [session, setSession] = useLocalStorage(STORAGE_KEYS.session, SEED_SESSION);

  const team = teams.find((t) => t.id === session?.teamId);

  function openTeam(teamId, user) {
    const first = projects.find((p) => p.teamId === teamId);
    setSession({ teamId, projectId: first?.id ?? null, user });
  }

  function createTeam({ name, color, user }) {
    const t = newTeam({ name, color, founder: user });
    const p = newProject({ teamId: t.id, name: 'First project' });
    setTeams([...teams, t]);
    setProjects([...projects, p]);
    setSession({ teamId: t.id, projectId: p.id, user });
  }

  function joinTeam(code, user) {
    const t = teams.find((x) => x.code === code);
    if (!t) return 'No team with that code in this browser.';
    if (!t.members.includes(user)) {
      setTeams(teams.map((x) => (x.id === t.id ? { ...x, members: [...x.members, user] } : x)));
    }
    openTeam(t.id, user);
    return null;
  }

  if (!team) {
    return <TeamGate teams={teams} onLogin={openTeam} onCreateTeam={createTeam} onJoinTeam={joinTeam} />;
  }

  // Only this team's projects and only this project's tasks are ever shown (NFR 4.1).
  const teamProjects = projects.filter((p) => p.teamId === team.id);
  const project = teamProjects.find((p) => p.id === session.projectId) ?? teamProjects[0];
  const projectTasks = tasks.filter((t) => t.projectId === project.id);

  function addProject() {
    const name = window.prompt('Project name')?.trim();
    if (!name) return;
    const p = newProject({ teamId: team.id, name });
    setProjects([...projects, p]);
    setSession({ ...session, projectId: p.id });
  }

  return (
    <div className="min-h-full">
      <Header
        team={team}
        projects={teamProjects}
        project={project}
        user={session.user}
        onSelectProject={(id) => setSession({ ...session, projectId: id })}
        onNewProject={addProject}
        onChangeColor={(color) => setTeams(teams.map((t) => (t.id === team.id ? { ...t, color } : t)))}
        onLogout={() => setSession(null)}
      />
      <main className="space-y-6 p-6">
        <Board tasks={projectTasks} />
      </main>
    </div>
  );
}
