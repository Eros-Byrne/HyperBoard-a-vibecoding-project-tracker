# Vibecoding Project Tracker — Design

**Status:** Hackathon starter design doc · fill in the **`<TODO>`** sections before you tag `design-done`.

**Why this file exists.** This tracker is your tool. It should look like *your* tool — not a generic Kanban with default Tailwind blue. Twenty minutes of design decisions here will be visible on every screen for the next six weeks of Module 5.

**Who owns this.** Person B, during the same window the rest of the team is reviewing the PRD. By the time the team converges to start M4 (`data-model`), this file should be filled in and the colors should already be in `tailwind.config.js`.

---

## 1. Mood / vibe

One sentence that captures the feeling the tracker should leave you with.

`<A sleek, distraction-free environment that feels like a natural extension of a developer's IDE, balancing raw utility with a fluid, modern aesthetic.>`

Two or three references that capture the vibe (links to dribbble shots, screenshots of apps you admire, Pinterest boards — anything visual):

- `<Linear>`
- `<Vercel Dashboard>`
- `<Raycast>`
-  `<Monospace>`

Anti-references — what we are explicitly **not** trying to look like:

- `<Cluttered enterprise software Jira>`

## 2. Color palette

These are the colors the build milestones will reference. Once chosen, paste the hex values into `tailwind.config.js` so the rest of the team can use Tailwind utility classes (e.g. `bg-brand-primary`, `border-due-warning`).

### Brand

| Token | Hex | Where it shows up |
|---|---|---|
| `brand-primary` | `<#636651>` | Header, "+" button, focus rings |
| `brand-accent` | `<#8B5CF6>` | Highlights, hover states, links |
| `surface-page` | `<#0F172A>` | Page background |
| `surface-card` | `<#1E293B>` | Card background |
| `text-primary` | `<#F8FAFC>` | Body text |
| `text-muted` | `<#94A3B8>` | Captions, dates, counts |

### Task type (M6 `tag-style`)

| Token | Hex | When used |
|---|---|---|
| `type-feature` | `<#10B981>` | Cards tagged `feature` (accent stripe + icon) |
| `type-bug` | `<#EF4444>` | Cards tagged `bug` (accent stripe + icon) |

### Due-date states (M8 `due-tint`)

| Token | Hex | When used |
|---|---|---|
| `due-safe` | `<#10B981>` | More than 2 days out |
| `due-warning` | `<#F59E0B>` | Less than 24 hours |
| `due-overdue` | `<#EF4444>` | Past due |
| `due-neutral` | `<#64748B>` | Done (overrides date) |

## 3. Typography

| Role | Font | Why |
|---|---|---|
| Heading | `<Inter, SF Pro Display>` | `<Geometric sans-serif with crisp rendering on dense screens.>` |
| Body | `<Inter, SF Pro Text>` | `<High legibility at small sizes with balanced spacing.>` |
| Monospace (tags, badges, code) | `<JetBrains Mono, Fira Code, monospace>` | `<Clearly separates code snippets, tags, and prompts from standard UI labels.>` |

Suggested sizes (override only if the design demands it):

- Page title: 24 px / semibold
- Section header: 16 px / semibold uppercase
- Card title: 14 px / medium
- Body: 14 px / regular
- Caption: 12 px / regular muted

## 4. Component principles

One short sentence per element. These set the tone for the build phase — Person A's modal and Person B's anchor board should both feel like they came from this doc.

- **Cards:** `<#1E293B>` (with a 1px slate border (border-slate-700), no heavy drop shadows, slight brightness boost on hover.)
- **Buttons:** `<brand-primary>` (rounded-md, generous touch/click padding, instant focus ring on tab key focus.)
- **Modal:** `<max-width-md>` (dark frosted glass backdrop (backdrop-blur-sm over 70% opacity Slate 900.)
- **Empty states:** `<border-dashed border-slate-700>` (Clean dashed borders muted typography, helpful prompt text.)
- **Drag affordance (if used):** `<6-dot>` (Subtle 6-dot handle icon on hover, supplemented by a status change dropdown menu for accessible movement.)

## 5. Voice / microcopy

Three lines of microcopy that capture the tone of the product. Keep it short — these are the words a stressed user reads at 11pm.

| Where | Text |
|---|---|
| "+" button label | `<New Task>` (e.g. "+ Task" or "Add task" or "New") |
| Empty column placeholder | `<All clear. Ready for next steps.>` (e.g. "Nothing here yet — keep going.") |
| Toast after "Copy as Prompt Context" | `<Prompt copied. Ready to paste.>` (e.g. "Copied. Now paste it into the AI.") |
| Confirm-delete message | `<Delete task? This action is permanent.>` (e.g. "Delete this task? You can't undo.") |
| Handoff toast (M7 `task-owner`) | `<Task assigned to {name}.>` (e.g. "Handed off to {name}. They've got it.") |

## 6. Logo / wordmark

The tracker probably doesn't need a logo, but it does need a name and a wordmark style.

- **Product name:** `<HyperBoard>` (match PRD §11 team identity)
- **Wordmark style:** `<Heavy Weight Vibe rendered in text-primary (#F8FAFC) and "Board" in brand-primary (#6366F1). No standalone icon mark needed.>` (e.g. "Just the name in the heading font, brand-primary color, no icon.")

## 7. Out of scope (this hackathon)

To keep design tight, the following are explicitly not part of `design-done`:

- A dark mode toggle. Pick one mode and ship it.
- Multiple themes. One brand, applied consistently.
- Animations beyond a 200 ms fade on toast notifications.
- A custom icon set. Use [Lucide icons](https://lucide.dev) via Tailwind classes if you need any.

---

*DESIGN.md version: hackathon-starter v1*
