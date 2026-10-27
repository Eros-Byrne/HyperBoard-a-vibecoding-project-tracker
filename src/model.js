/**
 * HyperBoard data model.
 *
 * Structure borrowed from Taskcafe: Team → Project → (Milestones, Tasks).
 * Each collection is stored flat in localStorage and linked by ids.
 * The Task fields from PRD §5 are kept exactly; new fields are only added.
 */

/**
 * @typedef {Object} Team
 * @property {string} id
 * @property {string} name
 * @property {string} code          6-char join code
 * @property {string} color         id from TEAM_COLORS
 * @property {string[]} members     the only valid values for Task.assignee
 * @property {string} createdDate   ISO 'YYYY-MM-DD'
 */

/**
 * @typedef {Object} Anchor
 * @property {'presentation'|'demo'|'report'|'documentation'} id
 * @property {string} label
 * @property {string|null} url
 */

/**
 * @typedef {Object} Project
 * @property {string} id
 * @property {string} teamId
 * @property {string} name
 * @property {string} notes         pinned info, architecture notes, goals
 * @property {Anchor[]} anchors     the four deliverable slots
 * @property {string} createdDate
 */

/**
 * @typedef {Object} Milestone
 * @property {string} id
 * @property {string} projectId
 * @property {string} title
 * @property {string|null} dueDate
 * @property {boolean} done
 */

/**
 * @typedef {Object} PromptLog
 * @property {string} id
 * @property {string} tool          one of AI_TOOLS
 * @property {string} prompt
 * @property {string} result
 * @property {string} createdAt     ISO timestamp
 */

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {'feature'|'bug'} type
 * @property {'todo'|'in-progress'|'review'|'done'} status
 * @property {string} assignee
 * @property {string|null} dueDate          ISO 'YYYY-MM-DD'
 * @property {string} createdDate           ISO 'YYYY-MM-DD'
 * @property {string} context               curated briefing for the next AI / teammate
 * @property {string|null} contextTool      one of AI_TOOLS
 * @property {string|null} contextUpdatedAt ISO timestamp
 * @property {string} projectId
 * @property {string|null} milestoneId
 * @property {PromptLog[]} prompts
 */

/**
 * @typedef {Object} Session
 * @property {string} teamId
 * @property {string} projectId
 * @property {string} user          one of the team's members
 */

// The four columns of the board, in render order (PRD §7).
export const STAGES = [
  { id: 'todo',        label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review',      label: 'Review' },
  { id: 'done',        label: 'Done' },
];

export const TASK_TYPES = [
  { id: 'feature', label: 'Feature' },
  { id: 'bug',     label: 'Bug' },
];

export const AI_TOOLS = ['Claude', 'ChatGPT', 'Cursor', 'Lovable', 'Replit', 'Other'];

// M9: starter headings for a paste-ready Context briefing.
export const CONTEXT_TEMPLATE = ['**Goal:** ', '**Done so far:** ', '**Next step:** ', '**Gotchas:** '].join('\n');

// Preset team colours. `hex` (400 shade) is 5.9:1+ on the dark page; `lightHex` (700 shade)
// is 4.8:1+ on the light page, used for team-name text in light mode (WCAG AA).
export const TEAM_COLORS = [
  { id: 'indigo',  label: 'Indigo',  hex: '#818CF8', lightHex: '#4338CA' },
  { id: 'emerald', label: 'Emerald', hex: '#34D399', lightHex: '#047857' },
  { id: 'amber',   label: 'Amber',   hex: '#FBBF24', lightHex: '#B45309' },
  { id: 'rose',    label: 'Rose',    hex: '#FB7185', lightHex: '#BE123C' },
  { id: 'sky',     label: 'Sky',     hex: '#38BDF8', lightHex: '#0369A1' },
  { id: 'violet',  label: 'Violet',  hex: '#A78BFA', lightHex: '#6D28D9' },
];

export const ANCHOR_SLOTS = [
  { id: 'presentation',  label: 'Presentation' },
  { id: 'demo',          label: 'Demo' },
  { id: 'report',        label: 'Report' },
  { id: 'documentation', label: 'Documentation' },
];

export const STORAGE_KEYS = {
  teams:      'hyperboard.teams',
  projects:   'hyperboard.projects',
  milestones: 'hyperboard.milestones',
  tasks:      'hyperboard.tasks',
  session:    'hyperboard.session',
  highContrast: 'hyperboard.highContrast',
  theme:        'hyperboard.theme',
};

export const uid = () => crypto.randomUUID();

/** Local date as 'YYYY-MM-DD'. */
export const today = () => new Date().toLocaleDateString('en-CA');

export function addDays(isoDate, days) {
  const d = new Date(`${isoDate}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString('en-CA');
}

/**
 * M8 due-tint state (DESIGN.md §2).
 * 'neutral' when done, 'overdue' when past, 'warning' within 2 days, 'safe' after that, null with no date.
 */
export function dueState(task) {
  if (task.status === 'done') return 'neutral';
  if (!task.dueDate) return null;
  const days = Math.round((new Date(`${task.dueDate}T00:00:00`) - new Date(`${today()}T00:00:00`)) / 86400000);
  if (days < 0) return 'overdue';
  if (days <= 2) return 'warning';
  return 'safe';
}

/** M10: serialize a task as a Markdown briefing to paste into an AI chat. */
export function taskToPrompt(task, { projectName, milestoneTitle } = {}) {
  const stage = STAGES.find((s) => s.id === task.status)?.label ?? task.status;
  const lines = [
    `# Task: ${task.title}`,
    '',
    [
      `**Type:** ${task.type}`,
      `**Status:** ${stage}`,
      `**Assignee:** ${task.assignee}`,
      `**Due:** ${task.dueDate ?? 'none'}`,
    ].join(' · '),
  ];
  if (projectName) lines.push(`**Project:** ${projectName}${milestoneTitle ? ` · **Milestone:** ${milestoneTitle}` : ''}`);
  lines.push('', '## Description', task.description || '_No description._');

  if (task.context) {
    const meta = [task.contextTool && `via ${task.contextTool}`, task.contextUpdatedAt && `updated ${new Date(task.contextUpdatedAt).toLocaleString()}`]
      .filter(Boolean)
      .join(', ');
    lines.push('', `## Context${meta ? ` (${meta})` : ''}`, task.context);
  }

  if (task.prompts.length) {
    lines.push('', '## Prompt log');
    task.prompts.forEach((p, i) => {
      lines.push('', `### ${i + 1}. ${p.tool}`, '**Prompt:**', p.prompt || '_empty_', '', '**Result:**', '```', p.result, '```');
    });
  }

  lines.push('', '---', 'Continue this task from the context above.');
  return lines.join('\n');
}

export function teamColor(team, light = false) {
  const c = TEAM_COLORS.find((x) => x.id === team?.color) ?? TEAM_COLORS[0];
  return light ? c.lightHex : c.hex;
}

function joinCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export function newTeam({ name, color, founder }) {
  return { id: uid(), name, code: joinCode(), color, members: [founder], createdDate: today() };
}

export function newProject({ teamId, name }) {
  return {
    id: uid(),
    teamId,
    name,
    notes: '',
    anchors: ANCHOR_SLOTS.map((a) => ({ ...a, url: null })),
    createdDate: today(),
  };
}

export function newMilestone({ projectId, title, dueDate = null }) {
  return { id: uid(), projectId, title, dueDate, done: false };
}

export function newTask({ projectId, assignee, status = 'todo' }) {
  return {
    id: uid(),
    title: '',
    description: '',
    type: 'feature',
    status,
    assignee,
    dueDate: null,
    createdDate: today(),
    context: '',
    contextTool: null,
    contextUpdatedAt: null,
    projectId,
    milestoneId: null,
    prompts: [],
  };
}

// ---- Seed data: a demo workspace so the board isn't empty on first load ----

const SEED_TEAM_ID = 'team-demo';
const SEED_PROJECT_ID = 'project-demo';
const SEED_USER = 'Eros Byrne';

export const SEED_TEAMS = [
  { id: SEED_TEAM_ID, name: 'HyperBoard', code: 'HYPER1', color: 'indigo', members: [SEED_USER], createdDate: today() },
];

export const SEED_SESSION = { teamId: SEED_TEAM_ID, projectId: SEED_PROJECT_ID, user: SEED_USER };

export const SEED_PROJECTS = [
  {
    ...newProject({ teamId: SEED_TEAM_ID, name: 'HyperBoard tracker' }),
    id: SEED_PROJECT_ID,
    notes: 'Goal: ship a Kanban tracker for vibecoding teams.\nStack: React + Vite + Tailwind, localStorage, Vercel.',
  },
];

export const SEED_MILESTONES = [
  { id: 'ms-mvp',   projectId: SEED_PROJECT_ID, title: 'MVP board',  dueDate: addDays(today(), 3),  done: false },
  { id: 'ms-pitch', projectId: SEED_PROJECT_ID, title: 'Pitch demo', dueDate: addDays(today(), 10), done: false },
];

const seedTask = (fields) => ({
  ...newTask({ projectId: SEED_PROJECT_ID, assignee: SEED_USER }),
  ...fields,
});

export const SEED_TASKS = [
  seedTask({
    id: 'task-1',
    title: 'Render the four-column board',
    description: 'Columns from STAGES, cards filtered by status.',
    status: 'done',
    dueDate: addDays(today(), -1),
    milestoneId: 'ms-mvp',
  }),
  seedTask({
    id: 'task-2',
    title: 'Add / edit task modal',
    description: 'One modal for create and edit, with delete.',
    status: 'in-progress',
    dueDate: addDays(today(), 1),
    milestoneId: 'ms-mvp',
    context: 'Modal uses a shared dialog shell. Next: validate the title field.',
    contextTool: 'Claude',
    contextUpdatedAt: new Date().toISOString(),
  }),
  seedTask({
    id: 'task-3',
    title: 'Cards lose their order after reload',
    description: 'Repro: drag a card, refresh the page.',
    type: 'bug',
    status: 'review',
    dueDate: addDays(today(), -2),
  }),
  seedTask({
    id: 'task-4',
    title: 'Copy as Prompt Context button',
    description: 'Serialize the task + context to Markdown and copy it.',
    status: 'todo',
    dueDate: addDays(today(), 6),
    milestoneId: 'ms-pitch',
  }),
];
