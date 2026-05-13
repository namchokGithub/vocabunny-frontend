# AI-Native Workspace Design — vocabunny-frontend

**Date:** 2026-05-14
**Status:** Approved
**Scope:** `vocabunny-frontend` repo only

---

## Goal

Transform `vocabunny-frontend` into an AI-assisted development workspace optimized for Claude Code, Codex, and Cursor. All existing docs migrated into a structured `docs/` hierarchy. No backend-agent (frontend repo only). No qa-agent (no test suite yet).

---

## Final Directory Structure

```
vocabunny-frontend/
├── AGENTS.md                         → thin stub pointing to docs/ai/agents/
├── CONTRIBUTING.md                   → NEW
├── README.md                         → updated links
├── TODO.md                           → REMOVED (migrated)
├── API.md                            → REMOVED (migrated)
└── docs/
    ├── ai/
    │   ├── agents/
    │   │   ├── frontend-agent.md     ← AGENTS.md content + expanded
    │   │   ├── reviewer-agent.md     ← NEW
    │   │   └── architect-agent.md    ← NEW
    │   ├── context/
    │   │   ├── project-summary.md    ← LLM-optimized 1-page overview
    │   │   ├── architecture-summary.md ← component tree + layer map
    │   │   ├── coding-rules.md       ← extracted from AGENTS.md
    │   │   └── domain-knowledge.md   ← content hierarchy, API shapes, roles
    │   ├── progress/
    │   │   └── frontend.md           ← migrated from docs/progress.md
    │   ├── prompts/
    │   │   ├── frontend/             ← placeholder dir
    │   │   └── debugging/            ← placeholder dir
    │   └── scratch/
    │       └── .gitkeep
    ├── engineering/
    │   └── api/
    │       └── api-reference.md      ← migrated from API.md
    ├── product/
    │   └── backlog.md                ← migrated from TODO.md
    └── superpowers/
        └── specs/                    ← this file lives here
```

---

## File Migration Map

| Source | Destination | Action |
|---|---|---|
| `AGENTS.md` | `docs/ai/agents/frontend-agent.md` | Move + expand |
| `API.md` | `docs/engineering/api/api-reference.md` | Move |
| `TODO.md` | `docs/product/backlog.md` | Move |
| `docs/progress.md` | `docs/ai/progress/frontend.md` | Move |
| `AGENTS.md` (root) | `AGENTS.md` (root) | Replace with stub |
| `README.md` | `README.md` | Update links |

---

## Agent File Specs

### `docs/ai/agents/frontend-agent.md`

Sections:
- **Role**: Frontend dev for VocabBunny BO admin (Next.js 15 + TS + Tailwind)
- **Responsibilities**: feature modules, shared components, API service layer, UX patterns
- **Architecture rules**: full AGENTS.md content restructured (feature-based, no Redux, service unwraps ApiResponse, dialog CRUD, URL sync, soft-loading)
- **Coding conventions**: TailwindCSS, no fetch in components, no ApiResponse in UI, DataTable/ContentListPage contract
- **Anti-patterns**: Redux, global state, fetch in components, giant components, key={refreshKey} for refetch, ApiResponse leaking into UI
- **Preferred workflow**: ContentListPage pattern → feature form → dialog → columns factory → page with URL sync

### `docs/ai/agents/reviewer-agent.md`

Sections:
- **Role**: PR reviewer for frontend changes
- **Review checklist**: TypeScript strictness, service layer unwraps, no ApiResponse in UI, URL query sync on all list pages, loading/error/empty states, soft-loading (isInitialLoad vs isRefetching), toast on mutation, confirm dialog on delete
- **Boundaries**: frontend only, does not comment on API/Go code
- **Anti-patterns to flag**: fetch in components, global state additions, skipping loading states, layout shifts during sort/filter/paginate

### `docs/ai/agents/architect-agent.md`

Sections:
- **Role**: Architectural decisions for frontend
- **Responsibilities**: pattern decisions, cross-cutting concerns, module boundary enforcement
- **Content hierarchy**: Section → Lesson → Unit → QuestionSet → Question
- **Auth architecture**: access + refresh token, `bo` scope, apiClient attaches Authorization header, AuthGuard on all dashboard routes
- **Key patterns**: Sections module is canonical reference for all future content CRUD; ContentListPage<T> + DataTable<T> generic contracts must remain stable
- **Cross-repo boundaries**: frontend consumes `vocabunny-core-api` via REST; no direct DB access; no shared code between repos

---

## Context File Specs

### `project-summary.md`

Dense 1-page LLM context:
- Project: VocabBunny Back Office admin CMS
- Stack: Next.js 15, TypeScript, Tailwind CSS, pnpm, App Router
- Active branch: `feat/game-play`
- API base: `vocabunny-core-api` at `/api/v1`, scope `bo`
- Modules: content (sections/lessons/units/question-sets/questions/tags), quests, achievements, shop, economy, actors, analytics
- Auth: JWT access + refresh, `bo` scope, stored in memory via `useSession`

### `architecture-summary.md`

Component tree:
- `app/` — routing, layouts, page entry points (thin, no business logic)
- `features/content/{module}/components/` — domain-specific UI (forms, dialogs, columns, row-actions)
- `components/` — shared UI (DataTable, ContentListPage, form fields, toast, badges, layout)
- `lib/api/` — raw HTTP layer (fetch + types only)
- `lib/services/` — service layer (unwraps ApiResponse, typed return values)
- `lib/hooks/` — shared hooks (useAsyncData, useDebounce, useSession)
- `types/` — shared TS domain types
- Data flow: page → service → api → fetch → server; page owns query state

### `coding-rules.md`

Extracted, actionable rules:
- No Redux, no Zustand, no global state
- Service layer always unwraps `ApiResponse<T>` — UI sees plain `T`
- All list pages: URL query sync (search, filter, sort, page, limit) via `router.replace`
- Refetch: use `refreshSignal` counter increment, never `key={refreshKey}`
- Loading states: `isInitialLoad` (null data) → `<LoadingTable/>`, `isRefetching` (data exists) → opacity-50 table
- Dialog CRUD: no separate create/edit routes; use `CreateXxxDialog` + `EditXxxDialog`
- `order_no` pre-fill: fetch from `GET /bo/content/order-nos/last` on dialog open
- Slug auto-generation: tracks title until user manually edits slug
- Parent dropdowns: sort alphabetically by title via `localeCompare`
- Tooltip truncation: `TruncatedText` uses `createPortal` to escape table overflow

### `domain-knowledge.md`

Business domain facts consumed by frontend:
- Content hierarchy: Section → Lesson → Unit → QuestionSet → Question (5 levels)
- `?include=` param: selective relation preloading (e.g. `?include=section`, `?include=unit,lesson`)
- Question types: `MULTIPLE_CHOICE`, `FILL_IN_THE_BLANK` (blank_position field needed for latter)
- Tag shape: `{ id, name, color }` — color is optional HEX `#RRGGBB`
- Response envelope: `{ success, data, meta: { code } }` for success; `{ success, error: { code, message } }` for error
- Paginated response: `{ items, paging: { page, limit, total, total_pages }, query }`
- Delete response: `{ id, status: "deleted" }`
- Roles: `ADMIN`, `CONTENT_ADMIN`, `MODERATOR`, `USER`
- Permissions: `CONTENT_READ`, `CONTENT_WRITE`, `CONTENT_PUBLISH`, `USER_READ`, `USER_BAN`, `ANALYTICS_READ`, `SYSTEM_CONFIG`
- Response codes: `vocab-{env}-{code}` format (e.g. `vocab-qa-2001`)

---

## `.gitignore` Additions

```gitignore
# AI artifacts
docs/ai/scratch/
docs/ai/**/*.local.md
```

---

## `CONTRIBUTING.md` Content

Sections:
- Dev setup (pnpm install, pnpm dev)
- Code conventions (link to docs/ai/context/coding-rules.md)
- Adding a new content module (link to frontend-agent.md workflow)
- PR checklist (link to reviewer-agent.md)
- Docs conventions (small focused files, no giant markdown)

---

## `AGENTS.md` Stub Content

```markdown
# Agents

Architecture rules and AI agent context live in `docs/ai/`:

- Frontend agent: [docs/ai/agents/frontend-agent.md](docs/ai/agents/frontend-agent.md)
- Reviewer agent: [docs/ai/agents/reviewer-agent.md](docs/ai/agents/reviewer-agent.md)
- Architect agent: [docs/ai/agents/architect-agent.md](docs/ai/agents/architect-agent.md)

Coding rules: [docs/ai/context/coding-rules.md](docs/ai/context/coding-rules.md)
```

---

## Risks & Constraints

- `AGENTS.md` at root is read natively by Claude Code — stub must exist and point to new files; tools load it on session start
- `docs/progress.md` path may be referenced in CLAUDE.md (workspace root) — verify after migration
- Prompt dirs (`prompts/frontend/`, `prompts/backend/`, `prompts/debugging/`) start empty — add `.gitkeep` to track dirs without dummy content
- `docs/superpowers/` is a tool-generated directory — add to `.gitignore` if preferred, or keep tracked

---

## Out of Scope

- Backend agent (frontend repo only)
- QA agent (no test suite)
- Architecture/infrastructure/database dirs (no content exists yet)
- Monorepo root docs changes
