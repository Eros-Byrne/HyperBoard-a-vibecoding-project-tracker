# Vibecoding Project Tracker — PRD

**Status:** Hackathon starter PRD · review and fill in the **`<TODO>`** sections before you tag `prd-done`.

---

## 1. Problem

Vibecoding teams have two recurring pains with large projects:

1. **They lose track of tasks.** Three teammates, a hundred small things, no shared view. Nothing tells them what state each task is actually in.
2. **They lose track of prompts.** The AI gave them working code two days ago but no one remembers the prompt that produced it. When they need to iterate, they start from scratch.

A spreadsheet doesn't solve this. A real project tool (Linear, Jira, Notion) is overkill, doesn't know about prompts, and takes hours to set up.

## 2. Target users

- **Primary:** the team members, for the remaining weeks of the summer semester.
- **Secondary:** future cohorts of vibecoders taking the same class.

We are designing the tool we ourselves will use. The pitch demo is also our first real user test.

## 3. Product overview

A single-page web app with two persistent surfaces:

- A **Kanban board** where vibecoding tasks move through four states.
- An **Anchor Board** above it that pins the four final-project deliverables (Presentation, Demo, Report, Documentation).

Each task carries the prompt context that produced it, so any teammate can click a button and copy the task + prompt history back into an AI chat to continue work.

## 4. Primary user flow

1. Open the Webapp. The board loads from local storage.
2. Click "+" to add a task. Fill in title, type, assignee, due date, prompt context.
3. Move the task across columns as you work.
4. When stuck, click "Copy as Prompt Context" on a task and paste it into Claude/ChatGPT/Cursor to continue.
5. Hand off a task to a teammate with one dropdown.
6. Drop final deliverable links into the Anchor Board as you produce them.

## 5. Data model

Locked. Do not change without team agreement.

```js
// A single vibecoding task.
Task = {
  id: string,                    // uuid or timestamp string
  title: string,
  description: string,
  type: 'feature' | 'bug',       // visual color coding
  status: 'todo' | 'in-progress' | 'review' | 'done',
  assignee: string,              // one of the three teammate names from §8
  dueDate: string | null,        // ISO date 'YYYY-MM-DD'
  createdDate: string,           // ISO date 'YYYY-MM-DD'

  // Added in later milestones:
  context: string,               // M9 context — curated briefing for the next AI / teammate
  contextTool: string | null,    // M9 context — 'Claude' | 'ChatGPT' | 'Cursor' | 'Lovable' | 'Replit' | 'Other'
  contextUpdatedAt: string|null, // M9 context — ISO timestamp set automatically on save
}

// One of four pinned deliverable slots.
Anchor = {
  id: 'presentation' | 'demo' | 'report' | 'documentation',
  label: string,                 // human-readable
  url: string | null,            // the link the team pastes in
}
```

### Extended model (HyperBoard)

Structure borrowed from [Taskcafe](https://github.com/JordanKnott/taskcafe): **Team → Project → Milestones / Tasks**. Every collection is stored flat in localStorage (`hyperboard.teams`, `.projects`, `.milestones`, `.tasks`, `.session`) and linked by ids. All `Task` fields above are kept unchanged; the fields below are only added. Source of truth: `src/model.js`.

```js
Team = {
  id: string,
  name: string,
  code: string,                  // 6-char join code teammates type in
  color: string,                 // id from TEAM_COLORS (pre-set, AA-checked)
  members: string[],             // the only allowed values for Task.assignee in this team
  createdDate: string,
}

Project = {
  id: string,
  teamId: string,
  name: string,
  notes: string,                 // FR 2.3 pinned info, architecture notes, goals
  anchors: Anchor[],             // the four deliverable slots, per project
  createdDate: string,
}

Milestone = {                    // FR 2.2
  id: string,
  projectId: string,
  title: string,
  dueDate: string | null,
  done: boolean,
}

Task = {
  ...the PRD fields above,
  projectId: string,
  milestoneId: string | null,
  prompts: PromptLog[],          // FR 3.1 prompt + result log
}

PromptLog = {
  id: string,
  tool: string,                  // same list as contextTool
  prompt: string,
  result: string,                // generated output / code snippet
  createdAt: string,             // ISO timestamp
}

Session = { teamId, projectId, user }   // who is "signed in" to which workspace
```

Teams are local to the browser: there are no passwords, and "join with code" only finds teams created in the same browser. A real backend is still out of scope (§12).

## 6. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | React (via Vite) | What the scaffold ships with. Don't migrate. |
| Styling | Tailwind | Already configured. Use utility classes; no separate CSS files. |
| State | React `useState` + a `useLocalStorage` hook | Simple, no library needed. |
| Persistence | **localStorage** | Zero infra. Pick this. Do not switch to a backend mid-hackathon. |
| Deploy | Vercel | One-click deploy from GitHub. |

> **Decision:** localStorage, not a shared backend. If you want a shared backend later, that's M14 — out of scope for the hackathon.

## 7. Stage names

Four columns, in this order, with these exact labels in the UI:

1. **To Do**
2. **In Progress**
3. **Review**
4. **Done**

## 8. Team

Fill these in before tagging `prd-done`:

| Slot | Name | GitHub handle |
|---|---|---|
| Teammate A | `Eros Byrne` | `Shmaybe` |

These three names become the **only** allowed values for `Task.assignee`. No auth — just a dropdown.

## 9. Milestone ownership

Fill in the owner column. Recommended default in **bold**; change if your team has different strengths.

| # | Tag | Title | Suggested owner | Final owner |
|---|---|---|---|---|
| 3 | `design-done` | Design system + voice (DESIGN.md) | **B** | `Eros` |
| 4 | `data-model` | Task model + board view | **A** | `Eros` |
| 5 | `crud-modal` | Add / edit / delete modal | **A** |`Eros`  |
| 6 | `tag-style` | Feature / bug colors | **B** |`Eros` |
| 7 | `task-owner` | Owner indicator + handoff | **A** |`Eros` |
| 8 | `due-tint` | Due-date color tinting | **B** | `Eros` |
| 9 | `context` | Context field on the task modal | **A**  | `Eros` |
| 10 | `copy-prompt` | "Copy as Prompt Context" button | **C** |`Eros` |
| 11 | `anchors` | Deliverable Anchor Board | **B** | `Eros` |
| 12 | `secret-sauce` | The one thing that makes it you |  **B** |`Eros`|
| 13 | `pitch-ready` | Demo + pitch rehearsal | **B** | `Eros` |


Track A owns the state model and task ownership. Track B owns the visuals (and design — M3 runs parallel to M2 so the team starts Phase 3 with the palette already chosen). Track C owns the differentiator features (M9 + M10 — the context field and the Copy-as-Prompt button) and usually leads on M12 secret-sauce. Put your strongest prompter on Track C.

**Dependency note.** M3 (`design-done`) runs **in parallel with M2** — Person B drafts DESIGN.md and pastes the colors into `tailwind.config.js` while the rest of the team reviews the PRD. M6 / M7 / M8 / M11 all depend on M4 + M5 being done first. While Person A builds M4+M5 (first ~60 min of Phase 3), Person C should draft the Markdown template for the "Copy as Prompt Context" output (M10). M12 `secret-sauce` is open-ended — pick whatever makes the tracker uniquely yours; constraint is "must be visible in the demo and must not break anything else."

## 10. AI / vibe coding angle

Where AI will be heavily used:
- M4, M5: scaffold the board and the modal from a single prompt each.
- M9, M10: write the Markdown serialization helper for the Context field.
- M7: animation polish for the handoff toast.

Where AI will **not** save you time:
- M2 (this PRD review) — read it yourself.
- M3 (DESIGN.md) — design taste is yours, not the model's.
- M12 (secret-sauce) — the whole point is that AI can't predict it.
- M13 (pitch) — write the script in your own voice.

Keep the Context field of each real task up to date as you work. By the end of the hackathon you should have a handful of curated context blocks — those become part of your Module 5 "Vibe Coding History" deliverable.

## 11. Team identity

Fill in:

- **Team name:** `<24056128>`
- **Tagline (one sentence):** `<prd-done>`
- **Tracker URL after deploy:** `<https://hyper-board-a-vibecoding-project-tr.vercel.app/>` (Vercel will give it to you)

## 12. Out of scope (do not build)

- Authentication / accounts.
- Real GitHub integration.
- A real backend / shared database.
- Mobile responsive — desktop only is fine.
- Multi-team support.
- Real-time collaboration.

## 13. Definition of done

The hackathon is "done" when all 13 milestone tags are pushed to your repo and visible on the dashboard. The pitch is "done" when:

- The board loads on Vercel without errors.
- The "Copy as Prompt Context" demo works on stage.
- 5 min pitch is rehearsed.

---

## 14. Functional Requirements 
1. Team & Workspace Management

    FR 1.1 Team Creation & Joining: Users must be able to create new teams, invite members, and join existing teams.

    FR 1.2 Dedicated Team Workspaces: A user must be able to log into a specific team's workspace to collaborate on projects dedicated solely to that group.

    FR 1.3 Team Customization (Phase 1): Users must be able to color-code their team workspace using a pre-set list of colors.

    FR 1.4 Customization Extensibility (Future-proofing): The system must be designed to support future custom configuration options, such as HEX code color selection and team photo/avatar uploads.

2. Task Management (Kanban Board)

    FR 2.1 Kanban Interface: The application must feature a Kanban board where users can create, edit, move, and delete tasks across customizable columns (e.g., To Do, In Progress, Done).

    FR 2.2 Milestone Tracking: Users must be able to define, track, and attach tasks to key project milestones over time.

    FR 2.3 General Project Information: Each project must have a dedicated space to log and pin important high-level information, architecture notes, and goals.

3. "Vibe-Coding" Specific Features

    FR 3.1 Prompt & Result Logging: Within tasks or project notes, users must have dedicated fields or sections to log successful AI prompts and their corresponding generated results/code snippets for easy team reference.

4. Support & Feedback

    FR 4.1 Contact Us Module: The application must include a built-in "Contact Us" or support page allowing users to report bugs, submit issues, or request help directly from the workspace.

## 15. Non-Functional Requirements (NFRs) 
These requirements define how the system performs, its usability, and its structural qualities.

1. Accessibility (Crucial)

    NFR 1.1 Standards Compliance: The application must meet WCAG (Web Content Accessibility Guidelines) AA standards to ensure it is usable by developers with disabilities.

    NFR 1.2 Navigation: The application must be fully navigable via keyboard, with clear focus states for all interactive elements on the Kanban board.

    NFR 1.3 Screen Reader Compatibility: UI elements, especially drag-and-drop features on the Kanban board, must have appropriate ARIA labels for screen reader support.

2. Usability & User Experience (UX)

    NFR 2.1 Target Audience Flexibility: The interface must be highly intuitive, minimizing the learning curve for junior developers while providing the efficiency and depth required by expert developers.

    NFR 2.2 Design Justification: Since no formal design sheet exists, all UI/UX decisions (e.g., color contrast, button placement, typography) must be documented with justifications proving they enhance workflow and accessibility.

3. Performance & Collaboration

    NFR 3.1 Real-Time Syncing: Because the app is designed for team collaboration, updates to the Kanban board (moving a card, adding a prompt) should reflect in real-time or near-real-time for all other team members currently viewing the board.

    NFR 3.2 Responsiveness: The UI must respond quickly to interactions (like dragging tasks) to keep up with the fast-paced nature of "vibe-coding."

4. Security & Privacy

    NFR 4.1 Data Isolation: Data, tasks, and logged prompts must be strictly isolated between teams. A user logged into Team A must not be able to access Team B's data unless explicitly invited.


## 16 Design Justification
The application design prioritizes an intuitive interface that minimizes the learning curve for junior developers while providing the efficiency and depth required by expert developers. Because no formal design sheet exists, all UI/UX decisions (e.g., color contrast, button placement, typography) must be documented with justifications proving they enhance workflow and accessibility.

Design Justification Log (Examples to build upon):

    Color Palette & Contrast: "We chose a high-contrast dark mode option to reduce eye strain for developers working long hours, which also fulfills WCAG contrast accessibility requirements."

    Kanban Interaction: "We implemented a click-to-move feature alongside drag-and-drop on the Kanban board to ensure it remains highly accessible for users who cannot use a mouse."

    Workspace Customization: We restricted initial team color customizations to a curated, pre-set list of colors. (Justification: This allows us to ensure all selectable colors meet WCAG AA text-to-background contrast standards before rolling out custom HEX codes later).

## 17 Minimum Viable Product (MVP)

(The MVP defines the core features required to launch the initial, functional version of the app to your developers.)

1. Basic Team & User Workspaces

    Users must be able to create new teams, invite members, and join existing teams.

    A user must be able to log into a specific team's workspace to collaborate on projects dedicated solely to that group.

    Users must be able to color-code their team workspace using a pre-set list of colors.

2. Core Kanban Board & Project Tracking

    The application must feature a Kanban board where users can create, edit, move, and delete tasks across customizable columns.

    Users must be able to define, track, and attach tasks to key project milestones over time.

    The application must be fully navigable via keyboard, with clear focus states for all interactive elements on the Kanban board.

    UI elements, especially drag-and-drop features on the Kanban board, must have appropriate ARIA labels for screen reader support.

3. Vibe-Coding Data Logging

    Within tasks or project notes, users must have dedicated fields or sections to log successful AI prompts and their corresponding generated results/code snippets for easy team reference.

    Each project must have a dedicated space to log and pin important high-level information, architecture notes, and goals.

4. Support & Feedback Mechanism

    The application must include a built-in "Contact Us" or support page allowing users to report bugs, submit issues, or request help directly from the workspace.

Out of Scope for MVP (Future Phases):

    Custom configuration options, such as HEX code color selection and team photo/avatar uploads.



*PRD version: hackathon-starter v1 · maintained by Prof. Dr. Ignacio Alvarez*
