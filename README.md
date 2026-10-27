# HyperBoard

A Kanban project tracker for teams who vibe-code: track tasks through To Do → In Progress → Review → Done, and keep the AI prompts, results and context behind each task so anyone on the team can pick it up.

**Live prototype:** https://hyper-board-a-vibecoding-project-tr.vercel.app/

## Trying it (no sign-up needed)

- Opening the link shows the **Sign in** screen. Click **Use demo account**, then **Sign in**. The demo details are also shown on the screen: team **HyperBoard**, name **Eros Byrne**, password **demo**.
- The demo team has two members (Eros Byrne and Sam Taylor), one project, two milestones and four example tasks.
- Use the **Signed in as** dropdown in the header to switch to Sam Taylor's view, and **Sign out** to get back to the sign-in screen. From there you can also create a team, or join one with the code **HYPER1**.
- Everything is saved in your own browser. To start again from the demo data, clear this site's data in your browser settings.

## What it does

- **Teams and sign-in:** sign in to your team, create or join a team, invite members, pick a team colour, and keep several projects per team.
- **Kanban board:** add, edit and delete tasks; move them by drag-and-drop or the dropdown on each card.
- **Task details:** feature / bug type, assignee with one-click hand-off, and due dates that warn as deadlines approach.
- **Vibe-coding tools:** an AI agent dropdown, a context briefing with a template, a prompt and result log, and a **Copy as Prompt** button that copies everything ready to paste into an AI tool.
- **Project space:** deliverable links, project notes and milestones with task progress.
- **Support:** a Contact us form that opens a pre-filled issue on this GitHub repo.
- **Accessibility:** dark / light mode, high contrast mode, full keyboard use, a "Skip to board" link and screen-reader announcements (WCAG 2.2 AA).

Requirements are in [PRD.md](PRD.md) (§14–§18) and design decisions with their UX principles are in [DESIGN.md](DESIGN.md) (§8).

## Prototype limits

This is a clickable prototype of the full product, built front-end only:

- Data is stored in the browser (localStorage), so it is not shared between devices and there is no real-time sync.
- The sign-in screen shows how members will access their team, but passwords are not stored or checked, and the "Signed in as" dropdown lets anyone switch member for demo purposes.
- Contact us hands off to GitHub rather than a support inbox.

## Running it locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

## AI use

AI was used to build this prototype, as permitted for the CM6312 prototype. I used **Claude Code (Claude Opus 5.5)** in VS Code to generate most of the code from my prompts; I chose the features, design and requirements, and reviewed and tested the results.

---

## Hackathon starter notes

You're forking this repo as the starting point for the **UXD Vibecoding Hackathon 2026**. The goal of the hackathon is to ship a Vibecoding Project Tracker in ~3 hours: a Kanban-style tool that tracks your vibecoding tasks and stores the prompts that produced them.

This starter gives you:

- A pre-written **PRD** (`PRD.md`)  —  read it. You don't write the PRD this year; your Milestone 2 is to review, fill in the team-specific TODOs, and commit.
- A pre-written **DESIGN.md** with the design-system slots Person B fills in during M3 (in parallel with M2).
- A **Vite + React + Tailwind** scaffold with the boilerplate already configured.
- The locked `Task` data model and `STAGES` constant in `src/App.jsx`.
- A `useLocalStorage` hook so persistence is one line.
- Empty TODO markers for every milestone, so AI tools can find them.

What you build, starting at M4:

- The four-column Kanban board.
- The add / edit / delete modal.
- The Prompt Context field (the differentiator).
- The "Copy as Prompt Context" button (the demo's hero moment).
- And everything else through M13.

## Quick start

```bash
# 1. Fork this repo on GitHub. Then clone YOUR fork:
git clone https://github.com/<your-team>/<your-fork>.git
cd <your-fork>

# 2. Install dependencies
npm install

# 3. Run the dev server
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`). You should see a placeholder page with the team starter header and "Build the four-column board here · M3" in the middle. That's expected — M3 is your first build milestone.

## Milestone workflow

Every milestone ends with a git tag push. Hackathon Portal dashboard watches your tags and updates the scoreboard in near real time.

```bash
git add .
git commit -m "<tag-name>"
git tag <tag-name>
git push --tags
```

Replace `<tag-name>` with the tag for the milestone you just finished. Tag names are lowercase, hyphenated, exact.

| # | Tag | What it means |
|---|---|---|
| 1 | `git-linked` | Repo registered on the portal, webhook delivers test ping |
| 2 | `prd-done` | PRD reviewed, team-specific TODOs filled in |
| 3 | `design-done` | DESIGN.md filled in, color tokens pasted into `tailwind.config.js` (parallel to M2) |
| 4 | `data-model` | Four-column board renders with 3-4 mock tasks |
| 5 | `crud-modal` | Add / edit / delete tasks via a modal, persisted to localStorage |
| 6 | `tag-style` | Feature vs. bug visual distinction |
| 7 | `task-owner` | Assignee badge on each card + "Hand off to..." dropdown |
| 8 | `due-tint` | Cards change color as deadlines approach |
| 9 | `context` | Curated Context field on the task modal (paste-ready briefing) |
| 10 | `copy-prompt` | One-click copy formatted prompt to clipboard |
| 11 | `project-deliverables` | Deliverable Anchor Board pinned above the Kanban |
| 12 | `secret-sauce` | The one thing that makes your tracker uniquely yours (open-ended) |
| 13 | `pitch-ready` | Demo dataset loaded, pitch rehearsed |

## Repo map

```
.
├── PRD.md              ← READ THIS FIRST · review + fill in TODOs for M2
├── DESIGN.md           ← Person B fills this in for M3 (parallel to M2)
├── README.md           ← you are here
├── package.json
├── vite.config.js
├── tailwind.config.js  ← M3 design tokens land here too
├── postcss.config.js
├── index.html
├── .gitignore
└── src/
    ├── main.jsx        ← React entry point — don't change
    ├── index.css       ← Tailwind directives — don't change
    └── App.jsx         ← all your code goes here (or split into more files)
```

## Deploy (any time after M3)

Vercel's free tier deploys a Vite + React app in one click:

1. Go to [vercel.com](https://vercel.com), sign in with GitHub.
2. Import your fork.
3. Accept the defaults (Vite is auto-detected). Click Deploy.
4. Drop the resulting URL into PRD §11 and into your team chat.

Re-deploys happen automatically on every push to `main`.

## A word about prompts

Once M9 (`context`) is done, keep the Context field of each real task up to date as you work. By the end of the hackathon you should have a handful of curated context blocks on real tasks — those become part of your Module 5 "Vibe Coding History" deliverable. Free credit, just by using your own tool.

---

*UXD Vibecoding Hackathon 2026 · Prof. Dr. Ignacio Alvarez*
