import { useState } from 'react';
import {
  STORAGE_KEYS,
  SEED_TEAMS,
  SEED_PROJECTS,
  SEED_MILESTONES,
  SEED_TASKS,
  SEED_SESSION,
  newTeam,
  newProject,
  newTask,
  taskToPrompt,
} from './model.js';
import { useLocalStorage } from './useLocalStorage.js';
import TeamGate from './components/TeamGate.jsx';
import Header from './components/Header.jsx';
import Board from './components/Board.jsx';
import TaskModal from './components/TaskModal.jsx';
import Toast from './components/Toast.jsx';
import AnchorBoard from './components/AnchorBoard.jsx';
import ProjectPanel from './components/ProjectPanel.jsx';
import ContactModal from './components/ContactModal.jsx';

export default function App() {
  const [teams, setTeams] = useLocalStorage(STORAGE_KEYS.teams, SEED_TEAMS);
  const [projects, setProjects] = useLocalStorage(STORAGE_KEYS.projects, SEED_PROJECTS);
  const [milestones, setMilestones] = useLocalStorage(STORAGE_KEYS.milestones, SEED_MILESTONES);
  const [tasks, setTasks] = useLocalStorage(STORAGE_KEYS.tasks, SEED_TASKS);
  const [session, setSession] = useLocalStorage(STORAGE_KEYS.session, SEED_SESSION);
  const [editing, setEditing] = useState(null); // { task, isNew } while the modal is open
  const [toast, setToast] = useState(null); // { id, message }
  const [contactOpen, setContactOpen] = useState(false);

  const notify = (message) => setToast({ id: Date.now(), message });

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
  const projectMilestones = milestones.filter((m) => m.projectId === project.id);

  function updateProject(changes) {
    setProjects(projects.map((p) => (p.id === project.id ? { ...p, ...changes } : p)));
  }

  function setProjectMilestones(next) {
    // Detach tasks from any milestone that was deleted.
    const kept = new Set(next.map((m) => m.id));
    const removed = projectMilestones.filter((m) => !kept.has(m.id)).map((m) => m.id);
    if (removed.length) {
      setTasks(tasks.map((t) => (removed.includes(t.milestoneId) ? { ...t, milestoneId: null } : t)));
    }
    setMilestones([...milestones.filter((m) => m.projectId !== project.id), ...next]);
  }

  function addProject() {
    const name = window.prompt('Project name')?.trim();
    if (!name) return;
    const p = newProject({ teamId: team.id, name });
    setProjects([...projects, p]);
    setSession({ ...session, projectId: p.id });
  }

  function saveTask(task) {
    const exists = tasks.some((t) => t.id === task.id);
    setTasks(exists ? tasks.map((t) => (t.id === task.id ? task : t)) : [...tasks, task]);
    setEditing(null);
  }

  function deleteTask(id) {
    setTasks(tasks.filter((t) => t.id !== id));
    setEditing(null);
  }

  function updateTask(id, changes) {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, ...changes } : t)));
  }

  function handOff(task, name) {
    updateTask(task.id, { assignee: name });
    notify(`Task assigned to ${name}.`);
  }

  async function copyPrompt(task) {
    try {
      const milestoneTitle = projectMilestones.find((m) => m.id === task.milestoneId)?.title;
      await navigator.clipboard.writeText(taskToPrompt(task, { projectName: project.name, milestoneTitle }));
      notify('Prompt copied. Ready to paste.');
    } catch {
      notify("Couldn't copy. Check your browser's clipboard permission.");
    }
  }

  function addMember() {
    const name = window.prompt(`Add a teammate to ${team.name}.\nThey can also join with code ${team.code}.\n\nName:`)?.trim();
    if (!name || team.members.includes(name)) return;
    setTeams(teams.map((t) => (t.id === team.id ? { ...t, members: [...t.members, name] } : t)));
    notify(`${name} joined ${team.name}.`);
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
        onNewTask={() => setEditing({ task: newTask({ projectId: project.id, assignee: session.user }), isNew: true })}
        onAddMember={addMember}
        onContact={() => setContactOpen(true)}
      />
      <main className="space-y-6 p-6">
        <AnchorBoard anchors={project.anchors} onChange={(anchors) => updateProject({ anchors })} />
        <ProjectPanel
          project={project}
          milestones={projectMilestones}
          tasks={projectTasks}
          onNotesChange={(notes) => updateProject({ notes })}
          onMilestonesChange={setProjectMilestones}
        />
        <Board
          tasks={projectTasks}
          members={team.members}
          onOpen={(task) => setEditing({ task, isNew: false })}
          onHandOff={handOff}
          onCopy={copyPrompt}
          onMove={(id, status) => updateTask(id, { status })}
        />
      </main>

      {toast && <Toast key={toast.id} message={toast.message} onDone={() => setToast(null)} />}

      {editing && (
        <TaskModal
          task={editing.task}
          isNew={editing.isNew}
          members={team.members}
          milestones={projectMilestones}
          onSave={saveTask}
          onDelete={deleteTask}
          onClose={() => setEditing(null)}
        />
      )}

      {contactOpen && (
        <ContactModal
          teamName={team.name}
          onSent={() => {
            setContactOpen(false);
            notify('Thanks. Finish sending it on GitHub.');
          }}
          onClose={() => setContactOpen(false)}
        />
      )}
    </div>
  );
}
