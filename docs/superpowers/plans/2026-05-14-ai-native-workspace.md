# AI-Native Workspace Setup — vocabunny-frontend

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform vocabunny-frontend into an AI-native workspace with structured `docs/` hierarchy, role-based agent files, LLM-optimized context files, and migrated existing docs.

**Architecture:** Create `docs/ai/` (agents, context, progress, prompts, scratch), `docs/engineering/api/`, `docs/product/`. Migrate AGENTS.md, API.md, TODO.md, and docs/progress.md into new locations. Generate 3 agent files and 4 context files. Replace root AGENTS.md with thin stub. Update README, .gitignore, and add CONTRIBUTING.md.

**Tech Stack:** Markdown, git mv (history-preserving migrations)

---

## File Map

| Action | Source | Destination |
|---|---|---|
| Create dirs | — | `docs/ai/{agents,context,progress,prompts/frontend,prompts/debugging,scratch}/` |
| git mv | `docs/progress.md` | `docs/ai/progress/frontend.md` |
| git mv | `API.md` | `docs/engineering/api/api-reference.md` |
| git mv | `TODO.md` | `docs/product/backlog.md` |
| Write | — | `docs/ai/agents/frontend-agent.md` |
| Write | — | `docs/ai/agents/reviewer-agent.md` |
| Write | — | `docs/ai/agents/architect-agent.md` |
| Write | — | `docs/ai/context/project-summary.md` |
| Write | — | `docs/ai/context/architecture-summary.md` |
| Write | — | `docs/ai/context/coding-rules.md` |
| Write | — | `docs/ai/context/domain-knowledge.md` |
| Overwrite | `AGENTS.md` | `AGENTS.md` (stub) |
| Edit | `.gitignore` | `.gitignore` |
| Write | — | `CONTRIBUTING.md` |
| Edit | `README.md` | `README.md` |

---

## Task 1: Create directory skeleton

**Files:**
- Create: `docs/ai/agents/`, `docs/ai/context/`, `docs/ai/progress/`, `docs/ai/prompts/frontend/`, `docs/ai/prompts/debugging/`, `docs/ai/scratch/`, `docs/engineering/api/`, `docs/product/`

- [ ] **Step 1: Create all directories and .gitkeep files**

```bash
mkdir -p docs/ai/agents docs/ai/context docs/ai/progress \
  docs/ai/prompts/frontend docs/ai/prompts/debugging \
  docs/ai/scratch docs/engineering/api docs/product

touch docs/ai/prompts/frontend/.gitkeep \
  docs/ai/prompts/debugging/.gitkeep \
  docs/ai/scratch/.gitkeep
```

- [ ] **Step 2: Verify structure**

```bash
find docs -type d | sort
```

Expected output includes:
```
docs/ai/agents
docs/ai/context
docs/ai/progress
docs/ai/prompts/debugging
docs/ai/prompts/frontend
docs/ai/scratch
docs/engineering/api
docs/product
docs/superpowers/plans
docs/superpowers/specs
```

- [ ] **Step 3: Commit**

```bash
git add docs/ai docs/engineering docs/product
git commit -m "chore: scaffold AI-native workspace directory structure"
```

---

## Task 2: Migrate docs/progress.md → docs/ai/progress/frontend.md

**Files:**
- Move: `docs/progress.md` → `docs/ai/progress/frontend.md`

- [ ] **Step 1: Move with git (preserves history)**

```bash
git mv docs/progress.md docs/ai/progress/frontend.md
```

- [ ] **Step 2: Verify**

```bash
ls docs/ai/progress/
```

Expected: `frontend.md`

- [ ] **Step 3: Commit**

```bash
git commit -m "docs: migrate progress log to docs/ai/progress/frontend.md"
```

---

## Task 3: Migrate API.md → docs/engineering/api/api-reference.md

**Files:**
- Move: `API.md` → `docs/engineering/api/api-reference.md`

- [ ] **Step 1: Move with git**

```bash
git mv API.md docs/engineering/api/api-reference.md
```

- [ ] **Step 2: Verify**

```bash
ls docs/engineering/api/
```

Expected: `api-reference.md`

- [ ] **Step 3: Commit**

```bash
git commit -m "docs: migrate API reference to docs/engineering/api/api-reference.md"
```

---

## Task 4: Migrate TODO.md → docs/product/backlog.md

**Files:**
- Move: `TODO.md` → `docs/product/backlog.md`

- [ ] **Step 1: Move with git**

```bash
git mv TODO.md docs/product/backlog.md
```

- [ ] **Step 2: Verify**

```bash
ls docs/product/
```

Expected: `backlog.md`

- [ ] **Step 3: Commit**

```bash
git commit -m "docs: migrate TODO to docs/product/backlog.md"
```

---

## Task 5: Write docs/ai/agents/frontend-agent.md

**Files:**
- Create: `docs/ai/agents/frontend-agent.md`

Source content: current `AGENTS.md` expanded with responsibilities, workflow, and boundaries.

- [ ] **Step 1: Write frontend-agent.md**

```markdown
# Frontend Agent

## Role

Frontend developer for VocabBunny Back Office — Next.js 15 admin CMS used by internal staff (admins, content managers, operators). Not the learner-facing app.

## Responsibilities

- Feature modules under `features/content/{module}/components/`
- Shared UI under `components/`
- API integration via `lib/services/` (never directly from components)
- UX patterns: dialog CRUD, soft-loading, URL query sync, toast notifications, confirm dialogs

## Architecture Rules

### General

- Feature-based folder structure — preserve it
- Lightweight and maintainable — prefer incremental improvements
- No overengineering, no unnecessary abstractions

### State Management

- No Redux, no Zustand, no global state store
- Local state and lightweight React patterns only
- Query state (search, filter, sort, page, limit) belongs in page container component — never inside `DataTable` or `ContentListPage`

### API Architecture

- `apiClient` (`lib/api/client.ts`) is the single HTTP entry point
- `lib/api/` handles raw fetch and HTTP types only
- `lib/services/` wraps api layer and always unwraps `ApiResponse<T>`
- UI and components receive plain typed data — never raw `ApiResponse<T>`

### Components

Shared reusable components belong in `components/`:
- buttons, dialogs, tables, form inputs, toast, loading states, badges

Feature/domain-specific components belong in `features/content/{module}/components/`:
- forms, row-actions, create/edit dialogs, column factories

Do not place feature-specific business UI inside shared components.

### Tables & CRUD

- Preserve generic `DataTable<T>` — stable contract, extend via props only
- Preserve generic `ContentListPage<T>` — stable contract, extend via props only
- Pages are thin — no business logic in `page.tsx`
- Separate query/business logic from presentation UI
- Canonical reference for all new content CRUD: `features/content/sections/`

### Dialog CRUD

- All content CRUD uses dialogs: `CreateXxxDialog` + `EditXxxDialog`
- No separate `/create` or `/edit/:id` routes for content modules
- Create dialog: fetch parent list + `loadLastOrder` via `Promise.all`; single `isLoadingLastOrder` flag
- Edit dialog: fetch parent list in `useEffect([open])` with dedicated `isLoadingParents` flag; gates form and Save/Cancel buttons while loading

### Loading States

```
data === null && isLoading  →  isInitialLoad  →  show <LoadingTable/>
data !== null && isLoading  →  isRefetching   →  show table at opacity-50 pointer-events-none
```

Refetch: increment `refreshSignal` counter — never use `key={refreshKey}` on the table (causes full remount).

### URL Query Sync

All list pages sync to URL: search, filter, sort key, sort direction, page, limit.
- Initialize from URL params on mount
- Write back via `router.replace(url, { scroll: false })`
- Wrap page in `<Suspense>` for `useSearchParams()` (Next.js App Router requirement)
- Reset page to 1 on: search apply, filter change, limit change, sort change

### Forms

- Concrete forms before abstractions
- Feature forms stay inside feature folders
- Title → slug auto-generation: tracks title until user manually edits slug field, then stops
- `order_no` pre-filled from `GET /bo/content/order-nos/last` on dialog open
- Parent ID dropdowns: fetch parent list on dialog open, sort alphabetically by title via `localeCompare`
- `SelectField` in `components/form/form-field.tsx` for dropdown inputs

### Async UX

- Mutations: `isLoading` prop on `Button` shows inline spinner during submit
- Destructive actions: `ConfirmDialog` required before executing delete
- Success/error: `useToast` with `"success"` / `"error"` / `"warning"` variant
- Soft-loading UX — no full table remounts during refetch

### Truncation

- Overflowing table cell content: use `TruncatedText` component
- `TruncatedText` uses `createPortal` at `document.body` with `position: fixed` — escapes table `overflow: hidden`

### Filter Labels

- `ContentListPage` accepts `filterLabels: { trueLabel: string; falseLabel: string }`
- Questions: `{ trueLabel: "Active", falseLabel: "Inactive" }`
- All other content modules: default `{ trueLabel: "Published", falseLabel: "Draft" }`

### Styling

- TailwindCSS only — preserve existing design language
- Clean admin-panel style, minimal but polished
- No flashy animations

### Auth

- Access token + refresh token flow
- `apiClient` attaches `Authorization: Bearer {accessToken}` automatically
- Protected routes must redirect unauthenticated users via `AuthGuard`

### Accessibility

- Keyboard accessibility on all interactive elements
- No hover-only critical UX paths

### Code Style

- Production-oriented, readable, modular
- No giant components or files
- No inline fetch — always go through service layer

## Anti-Patterns

- Redux, Zustand, or any global state store
- `fetch()` calls directly inside React components or hooks
- `ApiResponse<T>` in component props, hook return types, or UI code
- `key={refreshKey}` on `DataTable` — causes full remount, use `refreshSignal` instead
- Query state (search, filter, sort, page) inside `DataTable` or `ContentListPage`
- Separate `/create` or `/edit/:id` routes for content modules — use dialogs
- Feature-specific logic inside shared components
- Duplicate fetch logic for the same data

## Preferred Workflow — Adding a New Content Module

1. Add types + fetch functions: `lib/api/content/{module}.ts`
2. Add service: `lib/services/content/{module}.service.ts` (unwraps ApiResponse)
3. Build components in `features/content/{module}/components/`:
   - `{module}-form.tsx` — controlled form, no fetching
   - `{module}-row-actions.tsx` — edit + delete buttons with per-button loading
   - `create-{module}-dialog.tsx` — fetches parents + order_no on open
   - `edit-{module}-dialog.tsx` — fetches existing record + parents on open
   - `{module}-columns.tsx` — column factory `createXxxColumns({onEdit, onDelete})`
4. Create page: `app/(dashboard)/content/{module}/page.tsx` — thin, owns query state + URL sync
5. Add nav entry: `lib/constants/navigation.ts`
6. Reference implementation: `features/content/sections/` for all patterns
```

- [ ] **Step 2: Verify file created**

```bash
ls docs/ai/agents/
```

Expected: `frontend-agent.md`

- [ ] **Step 3: Commit**

```bash
git add docs/ai/agents/frontend-agent.md
git commit -m "docs: add frontend-agent.md with architecture rules and workflow"
```

---

## Task 6: Write docs/ai/agents/reviewer-agent.md

**Files:**
- Create: `docs/ai/agents/reviewer-agent.md`

- [ ] **Step 1: Write reviewer-agent.md**

```markdown
# Reviewer Agent

## Role

PR reviewer for vocabunny-frontend changes. Frontend only — does not comment on API or Go code.

## Focus

Correctness of patterns, UX consistency, and TypeScript safety. Not formatting (that's Prettier/ESLint).

## Review Checklist

### TypeScript Safety
- [ ] No untyped `any` without a comment explaining why
- [ ] All API response types explicitly typed (no `unknown` casts in service layer)
- [ ] `ApiResponse<T>` does not appear in component props or hook return types

### Service Layer
- [ ] Services in `lib/services/` unwrap `ApiResponse<T>` before returning
- [ ] No `apiClient` calls from components, hooks, or pages — only from `lib/api/`
- [ ] Service return types are plain typed values (`T`, `PaginatedResult<T>`, etc.)

### List Pages
- [ ] URL query sync present: search, filter, sort key, sort direction, page, limit
- [ ] Page wrapped in `<Suspense>` for `useSearchParams()`
- [ ] Page resets to 1 on search apply, filter change, limit change, sort change
- [ ] Query state (search, filter, sort, page, limit) owned by page — not DataTable or ContentListPage

### Loading & Error States
- [ ] `isInitialLoad` (data null + loading) shows `<LoadingTable/>`
- [ ] `isRefetching` (data exists + loading) shows opacity-50 table with `pointer-events-none`
- [ ] Refetch uses `refreshSignal` counter — no `key={refreshKey}` on table
- [ ] Empty state shown when `items.length === 0` and not loading
- [ ] Failed mutations show error toast

### Mutations
- [ ] Submit button shows inline spinner via `isLoading` prop during mutation
- [ ] Delete actions go through `ConfirmDialog` before executing
- [ ] Success shows toast with `"success"` variant
- [ ] Error shows toast with `"error"` variant

### Forms
- [ ] Slug auto-generates from title until manually edited, then stops
- [ ] `order_no` pre-fills from `GET /bo/content/order-nos/last`
- [ ] Parent dropdowns sorted alphabetically by title via `localeCompare`
- [ ] Create dialog fetches parents + order_no via `Promise.all`
- [ ] Edit dialog fetches parents in `useEffect([open])` with `isLoadingParents` gate

### Layout & UX
- [ ] No layout shifts during sort, filter, paginate, or search
- [ ] Overflowing table cell content uses `TruncatedText` with portal tooltip
- [ ] No hover-only critical interactions

### Structure
- [ ] No fetch directly in components — all data goes through service layer
- [ ] New content modules follow Sections module pattern
- [ ] Shared UI in `components/`, domain UI in `features/content/{module}/components/`

## Anti-Patterns to Flag

| Pattern | Flag as |
|---|---|
| `fetch()` in component body | Blocker — must go through apiClient + service |
| `ApiResponse` in component props | Blocker — service must unwrap |
| `key={refreshKey}` on DataTable | Bug — use `refreshSignal` |
| `useEffect` calling apiClient directly | Blocker — use service layer |
| Query state inside DataTable | Architecture violation |
| Separate `/create` route instead of dialog | Architecture violation |
| New global state (Redux, Zustand, Context for data) | Blocker |
```

- [ ] **Step 2: Verify**

```bash
ls docs/ai/agents/
```

Expected: `frontend-agent.md  reviewer-agent.md`

- [ ] **Step 3: Commit**

```bash
git add docs/ai/agents/reviewer-agent.md
git commit -m "docs: add reviewer-agent.md with PR review checklist"
```

---

## Task 7: Write docs/ai/agents/architect-agent.md

**Files:**
- Create: `docs/ai/agents/architect-agent.md`

- [ ] **Step 1: Write architect-agent.md**

```markdown
# Architect Agent

## Role

Architectural decision-maker for vocabunny-frontend. Enforces cross-cutting patterns, content hierarchy, and module boundaries.

## Boundaries

Frontend architecture only. Cross-repo: frontend consumes `vocabunny-core-api` via REST — no shared code between repos, no direct DB access.

## Content Hierarchy

```
Section
  └── Lesson        (lesson.section_id)
        └── Unit    (unit.lesson_id)
              └── QuestionSet  (qs.unit_id)
                    └── Question  (question.question_set_id)
```

Each entity: `id` (UUID) · `slug` · `title` · `order_no` · `is_published` · `created_at` · `updated_at` · `created_by` · `updated_by`

Tags are standalone — attached to Questions via `tag_ids[]`. Shape: `{ id, name, color }`.

## Auth Architecture

- JWT access token + refresh token, `bo` scope
- Tokens in memory via `useSession` hook (not localStorage, not cookies)
- `apiClient` attaches `Authorization: Bearer {accessToken}` on every request
- 401 → apiClient intercepts → calls refresh endpoint → stores new access token → retries original request
- Refresh fails → redirect to `/login`
- `AuthGuard` wraps `app/(dashboard)/layout.tsx` — redirects unauthenticated users

## Routing Architecture

- `app/(auth)/` — public routes (login)
- `app/(dashboard)/` — protected routes behind AuthGuard + shared sidebar layout
- Page files (`page.tsx`) are thin entry points — URL sync + query state only, no business logic
- Content CRUD: dialog-based (`CreateXxxDialog` / `EditXxxDialog`) — no `/create` or `/edit/:id` child routes

## Key Invariants

**Sections module is the canonical reference** for all future content CRUD modules. Every new content module must mirror its structure:
- `{module}-form.tsx` (controlled, no fetching)
- `{module}-row-actions.tsx` (per-button loading)
- `create-{module}-dialog.tsx` (Promise.all for parents + order_no)
- `edit-{module}-dialog.tsx` (useEffect on open for parents)
- `{module}-columns.tsx` (column factory pattern)
- `app/(dashboard)/content/{module}/page.tsx` (URL sync, owns query state)

**`DataTable<T>` and `ContentListPage<T>` contracts are stable.** Never add domain logic inside these components. Extend behavior via props: `filterLabels`, `refreshSignal`, `sortKey`, `sortDirection`, `onSortChange`, `onLimitChange`.

**Service layer is the sole `ApiResponse<T>` unwrapping boundary.** This boundary must never move closer to the UI.

**All list pages own their query state.** Search, filter, sort, page, and limit never belong inside DataTable or ContentListPage.

## Future Extension Points

| Feature | Guidance |
|---|---|
| New content module | Follow Sections pattern + add nav entry in `lib/constants/navigation.ts` |
| `FILL_IN_THE_BLANK` questions | Conditionally render `blank_position` field when `type === "FILL_IN_THE_BLANK"` in question form |
| Question tag picker | Multi-select backed by `tagsService.getTags()` — add to question form as `tag_ids[]` field |
| Media uploads | Requires separate treatment (multipart/presigned URL) — do not shoehorn into existing dialog pattern |
| Bulk actions | Opt-in checkbox column in `DataTable<T>` — design as prop, not default behavior |
| `image_url` preview | Small image preview in question form on valid URL — additive to existing `imageUrl` text field |
```

- [ ] **Step 2: Verify**

```bash
ls docs/ai/agents/
```

Expected: `architect-agent.md  frontend-agent.md  reviewer-agent.md`

- [ ] **Step 3: Commit**

```bash
git add docs/ai/agents/architect-agent.md
git commit -m "docs: add architect-agent.md with system invariants and extension guide"
```

---

## Task 8: Write docs/ai/context/project-summary.md

**Files:**
- Create: `docs/ai/context/project-summary.md`

- [ ] **Step 1: Write project-summary.md**

```markdown
# Project Summary — VocabBunny Frontend

**Project:** VocabBunny Back Office — internal admin CMS
**Repo:** `vocabunny-frontend`
**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · pnpm
**Active branch:** `feat/game-play`

## Purpose

Internal tool for administrators, content managers, and operators to manage VocabBunny platform data. Not learner-facing.

## Modules

| Module | Route | Status |
|---|---|---|
| Sections | `/content/sections` | Complete |
| Lessons | `/content/lessons` | Complete |
| Units | `/content/units` | Complete |
| Question Sets | `/content/question-sets` | Complete |
| Questions | `/content/questions` | Complete |
| Tags | `/content/tags` | Complete |
| Dashboard | `/dashboard` | Placeholder |
| Quests | `/quests` | Placeholder |
| Achievements | `/achievements` | Placeholder |
| Shop | `/shop` | Placeholder |
| Economy | `/economy` | Placeholder |
| Actors | `/actors` | Placeholder |
| Analytics | `/analytics` | Placeholder |
| Settings | `/settings` | Placeholder |

## API

- Base URL: `/api/v1`
- Scope: `bo` (back-office JWT)
- Auth header: `Authorization: Bearer {accessToken}`
- Source: `vocabunny-core-api` (Go 1.24 + Echo v4 + GORM + PostgreSQL)
- Full reference: [docs/engineering/api/api-reference.md](../engineering/api/api-reference.md)

## Key Commands

```bash
pnpm install                        # install deps
pnpm dev                            # dev server → http://localhost:3000
pnpm lint                           # ESLint
pnpm typecheck                      # tsc --noEmit
pnpm exec next build --webpack      # production build
```

## Open Tasks (High Priority)

1. **Question tag picker** — `tag_ids` missing from Question create/edit form; backed by `tagsService.getTags()`
2. **`blank_position` field** — needed for `FILL_IN_THE_BLANK` questions; conditional render when `type === "FILL_IN_THE_BLANK"`
3. **E2E integration testing** — verify auth token attached, error shapes match `ApiResponse`, paginated responses parse correctly

## Docs

| Document | Purpose |
|---|---|
| [docs/ai/agents/frontend-agent.md](../ai/agents/frontend-agent.md) | Architecture rules, coding conventions, anti-patterns |
| [docs/ai/agents/reviewer-agent.md](../ai/agents/reviewer-agent.md) | PR review checklist |
| [docs/ai/agents/architect-agent.md](../ai/agents/architect-agent.md) | System invariants, extension guidance |
| [docs/ai/context/coding-rules.md](coding-rules.md) | Quick-reference coding rules |
| [docs/ai/context/domain-knowledge.md](domain-knowledge.md) | API shapes, content hierarchy, roles |
| [docs/ai/context/architecture-summary.md](architecture-summary.md) | Component tree + layer map |
| [docs/ai/progress/frontend.md](../progress/frontend.md) | Session progress log |
| [docs/product/backlog.md](../../product/backlog.md) | Feature backlog |
```

- [ ] **Step 2: Commit**

```bash
git add docs/ai/context/project-summary.md
git commit -m "docs: add project-summary.md LLM context file"
```

---

## Task 9: Write docs/ai/context/architecture-summary.md

**Files:**
- Create: `docs/ai/context/architecture-summary.md`

- [ ] **Step 1: Write architecture-summary.md**

```markdown
# Architecture Summary — vocabunny-frontend

## Layer Map

```
URL params (search/filter/sort/page/limit)
    ↓ initialized on mount, written back via router.replace
app/(dashboard)/content/{module}/page.tsx
    owns query state, passes to ContentListPage + column factory
    ↓
components/content/content-list-page.tsx  (ContentListPage<T>)
    ↓
components/table/data-table.tsx  (DataTable<T>)
    column defs from ──► features/content/{module}/components/{module}-columns.tsx
    row actions from ──► features/content/{module}/components/{module}-row-actions.tsx
                                ↓ opens
    features/content/{module}/components/create-{module}-dialog.tsx
    features/content/{module}/components/edit-{module}-dialog.tsx
                                ↓ renders
    features/content/{module}/components/{module}-form.tsx
                                ↓
    lib/services/content/{module}.service.ts   ← unwraps ApiResponse<T>
                                ↓
    lib/api/content/{module}.ts               ← raw fetch + types
                                ↓
    lib/api/client.ts  (apiClient)            ← attaches auth header, handles 401 refresh
                                ↓
    vocabunny-core-api  GET|POST|PUT|DELETE /api/v1/bo/...
```

## Directory Map

```
app/
├── (auth)/login/page.tsx          — public login
└── (dashboard)/
    ├── layout.tsx                 — AuthGuard + sidebar + header
    └── content/{module}/page.tsx  — list page (thin, owns query state)

components/
├── content/
│   └── content-list-page.tsx     — generic list page shell (search, filter, pagination, toolbar)
├── table/
│   ├── data-table.tsx            — generic sortable/paginated table
│   └── loading-table.tsx         — skeleton loading state
├── form/
│   └── form-field.tsx            — TextField, SelectField
├── ui/
│   ├── button.tsx                — isLoading prop with inline spinner
│   ├── confirm-dialog.tsx        — destructive action confirmation
│   ├── empty-state.tsx           — empty table state
│   ├── published-badge.tsx       — Published/Draft badge
│   ├── search-input.tsx
│   ├── status-badge.tsx
│   ├── toast.tsx                 — success/error/warning variants
│   └── truncated-text.tsx        — portal tooltip for overflow
└── layout/
    ├── app-sidebar.tsx
    ├── app-header.tsx
    ├── auth-guard.tsx
    ├── breadcrumbs.tsx
    └── page-container.tsx

features/content/{module}/components/
├── {module}-form.tsx             — controlled form, no fetching
├── {module}-row-actions.tsx      — edit + delete, per-button loading
├── create-{module}-dialog.tsx    — Promise.all(parents, orderNos) on open
├── edit-{module}-dialog.tsx      — useEffect([open]) for parents
└── {module}-columns.tsx          — createXxxColumns({onEdit, onDelete}) factory

lib/
├── api/
│   ├── client.ts                 — apiClient: fetch wrapper, auth header, 401 retry
│   ├── content/
│   │   ├── sections.ts           — Section type + CRUD fetch fns
│   │   ├── lessons.ts            — Lesson, SectionSummary types
│   │   ├── units.ts              — Unit, LessonSummary types
│   │   ├── question-sets.ts      — QuestionSet, UnitSummary, LessonSummary
│   │   ├── questions.ts          — Question, QuestionSetSummary, Choice, Tag
│   │   ├── tags.ts               — Tag { id, name, color }
│   │   └── order-nos.ts          — OrderNosResponse
│   └── index.ts
├── services/content/
│   ├── sections.service.ts
│   ├── lessons.service.ts
│   ├── units.service.ts
│   ├── question-sets.service.ts
│   ├── questions.service.ts
│   ├── tags.service.ts
│   └── order-nos.service.ts
├── auth/
│   ├── auth.ts                   — login/logout
│   ├── token.ts                  — access/refresh token helpers
│   ├── auth-guard.ts             — route protection logic
│   └── logout.ts
├── hooks/
│   ├── use-async-data.ts         — generic data fetching hook
│   ├── use-debounce.ts           — debounce hook
│   └── use-session.ts            — in-memory token storage
├── constants/
│   ├── navigation.ts             — sidebar nav config (add new modules here)
│   ├── access.ts                 — role/permission constants
│   └── env.ts                    — environment variables
└── utils/
    ├── index.ts                  — cn(), normalizeTitle(), etc.
    └── routes.ts                 — route constants

types/
├── api.ts                        — ApiResponse<T>, PaginatedResult<T>
├── http.ts
├── pagination.ts
└── index.ts
```

## Data Flow — List Page

1. Page mounts → reads URL params → initializes local state
2. `useAsyncData(service.list, deps + refreshSignal)` fires
3. Service calls api layer → apiClient attaches auth header → server responds
4. `ApiResponse<PaginatedResult<T>>` unwrapped in service → `PaginatedResult<T>` returned to page
5. Page passes `data.items`, handlers, column factory to `ContentListPage<T>`
6. User action (sort/search/filter/paginate) → page updates state + URL → `refreshSignal` increments → refetch

## Auth Flow

```
POST /api/v1/bo/auth/login/password
    → { access_token, refresh_token }
    → useSession stores tokens in memory

Request → apiClient
    → Authorization: Bearer {accessToken}
    → 401 response?
        → POST /api/v1/bo/auth/refresh { refresh_token }
        → new access_token stored
        → original request retried
        → refresh fails? → redirect /login
```
```

- [ ] **Step 2: Commit**

```bash
git add docs/ai/context/architecture-summary.md
git commit -m "docs: add architecture-summary.md with layer map and directory guide"
```

---

## Task 10: Write docs/ai/context/coding-rules.md

**Files:**
- Create: `docs/ai/context/coding-rules.md`

- [ ] **Step 1: Write coding-rules.md**

```markdown
# Coding Rules — vocabunny-frontend

Quick-reference. Full rationale: [frontend-agent.md](../agents/frontend-agent.md).

## State

- No Redux, Zustand, or global state store
- Query state (search, filter, sort, page, limit) lives in the page container — never in `DataTable` or `ContentListPage`
- `useSession` for auth tokens (in-memory only)

## API / Service Layer

- Never call `fetch()` from components or hooks — use `apiClient` via service layer
- `lib/api/` — raw fetch + type definitions only
- `lib/services/` — always unwraps `ApiResponse<T>` before returning
- `ApiResponse<T>` must not appear in component props, hook return types, or UI code

## Loading States

```
data === null && isLoading  →  isInitialLoad  →  <LoadingTable/>
data !== null && isLoading  →  isRefetching   →  opacity-50 table, pointer-events-none
```

- Refetch: increment `refreshSignal` counter passed to `useAsyncData`
- Never: `key={refreshKey}` on `DataTable` (causes full remount)

## URL Query Sync (required on all list pages)

- Sync: `search`, published/active filter, `page`, `limit`, `sortKey`, `sortDirection`
- Init from URL on mount; write back via `router.replace(url, { scroll: false })`
- Wrap page component in `<Suspense>` for `useSearchParams()` (Next.js App Router)
- Reset `page` to `1` on: search apply, filter change, limit change, sort change

## Dialog CRUD

- All content CRUD uses `CreateXxxDialog` + `EditXxxDialog` — no separate route pages
- Create dialog: `Promise.all([fetchParents(), loadLastOrder()])` → single `isLoadingLastOrder` gate
- Edit dialog: `useEffect([open, showToast])` → `isLoadingParents` gate on form + buttons

## Forms

- `order_no` → pre-fill from `GET /bo/content/order-nos/last` on dialog open
- Slug → auto-generated from title (kebab-case) until user manually edits slug field
- Parent dropdowns → sort options by `.title` via `localeCompare` at mapping layer, before setState
- `SelectField` component in `components/form/form-field.tsx` for `<select>` inputs

## Truncation

- Overflowing table cell text → `<TruncatedText>` component
- `TruncatedText` renders tooltip via `createPortal` to `document.body` at `position: fixed`

## Mutations

- Submit button → `<Button isLoading={isSubmitting}>` (shows inline spinner)
- Delete → `<ConfirmDialog>` then execute
- Success → `showToast({ variant: "success", ... })`
- Error → `showToast({ variant: "error", ... })`

## Filter Labels

- `<ContentListPage filterLabels={{ trueLabel, falseLabel }}>`
- Questions: `trueLabel="Active"`, `falseLabel="Inactive"`
- Other modules: default `trueLabel="Published"`, `falseLabel="Draft"`

## Commits

- Conventional format: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`
- Commit after each meaningful unit of work
```

- [ ] **Step 2: Commit**

```bash
git add docs/ai/context/coding-rules.md
git commit -m "docs: add coding-rules.md quick-reference"
```

---

## Task 11: Write docs/ai/context/domain-knowledge.md

**Files:**
- Create: `docs/ai/context/domain-knowledge.md`

- [ ] **Step 1: Write domain-knowledge.md**

```markdown
# Domain Knowledge — VocabBunny

What `vocabunny-core-api` exposes to this frontend. Framed as "what we consume."

## Content Hierarchy

```
Section
  └── Lesson        (lesson.section_id → Section)
        └── Unit    (unit.lesson_id → Lesson)
              └── QuestionSet  (qs.unit_id → Unit)
                    └── Question  (question.question_set_id → QuestionSet)
```

Tags are standalone — attached to Questions via `tag_ids[]`.

## `?include=` Relation Preloading

Add to GET list or GET by ID requests. Comma-separated, case-insensitive.

| Entity | Supported values | Notes |
|---|---|---|
| Lesson | `section` | Embeds parent Section summary |
| Unit | `lesson` | Embeds parent Lesson summary |
| QuestionSet | `unit`, `lesson` | `lesson` resolves via Unit internally |
| Question | `question_set`, `choices`, `tags` | choices/tags excluded on list by default |

Example: `GET /api/v1/bo/content/questions?include=question_set,choices,tags`

On question **GET by ID**: choices and tags always returned regardless of `?include=`.

Included relations appear as flat summary objects (no recursion):
```json
{ "id": "...", "lesson_id": "...", "lesson": { "id": "...", "slug": "colors", "title": "Colors & Shapes" } }
```

## Question Types

| Type | Extra fields |
|---|---|
| `MULTIPLE_CHOICE` | `choices[]` with `{ choice_text, choice_order, is_correct }` |
| `FILL_IN_THE_BLANK` | `blank_position` (currently not rendered in form — pending) |

## Tag Shape

```typescript
{ id: string; name: string; color: string }
// color: optional HEX "#RRGGBB" — empty string accepted, omitted from payload
```

## API Response Envelope

```typescript
// Success
{ success: true; data: T; meta: { code: string } }

// Error
{ success: false; error: { code: string; message: string } }
```

HTTP status codes used normally (200, 201, 400, 401, 403, 404, 409, 500). `error.code` is additional metadata, does not replace HTTP status.

## Paginated Response (`data` field)

```typescript
{
  items: T[];
  paging: { page: number; limit: number; total: number; total_pages: number };
  query: Record<string, unknown>;
}
```

`total_pages` is 0 when `total` is 0.

## Delete Response (`data` field)

```typescript
{ id: string; status: "deleted" }
```

## Response Code Format

```
vocab-{env}-{code}    e.g. vocab-qa-2001  vocab-prod-4201
```

| Code range | Category |
|---|---|
| 2000–2005 | Success (generic, created, updated, deleted, published, login) |
| 4001–4004 | Validation errors |
| 4101–4104 | Auth (invalid token, expired, bad credentials, wrong scope) |
| 4201–4208 | Content errors (not found, duplicate slug, invalid include, bad publish state) |
| 4301 | Permission denied |
| 4901–4902 | Conflict (duplicate resource, concurrent update) |
| 5001–5004 | Internal errors |

## Token Scopes

| Scope | Route group | Used by |
|---|---|---|
| `bo` | `/api/v1/bo/...` | This frontend (back-office) |
| `app` | `/api/v1/app/...` | Learner app (not this frontend) |

## Roles

`ADMIN` · `CONTENT_ADMIN` · `MODERATOR` · `USER`

## Permission Codes

| Code | Grants |
|---|---|
| `CONTENT_READ` | Read all content resources |
| `CONTENT_WRITE` | Create and update content |
| `CONTENT_PUBLISH` | Publish / unpublish content |
| `USER_READ` | Read user profiles |
| `USER_BAN` | Ban or delete users |
| `ANALYTICS_READ` | Access analytics data |
| `SYSTEM_CONFIG` | Modify system configuration |

## Order Nos API

`GET /api/v1/bo/content/order-nos/last` returns:
```json
{ "sections": 12, "lessons": 34, "units": 20, "question_sets": 15, "questions": 87 }
```

Used by create dialogs to pre-fill `order_no` with the next available value.
```

- [ ] **Step 2: Commit**

```bash
git add docs/ai/context/domain-knowledge.md
git commit -m "docs: add domain-knowledge.md with API shapes and content hierarchy"
```

---

## Task 12: Replace AGENTS.md with stub

**Files:**
- Overwrite: `AGENTS.md`

AGENTS.md is read natively by Claude Code on session start. Keep it at root as a thin redirect.

- [ ] **Step 1: Overwrite AGENTS.md with stub**

```markdown
# Agents

Architecture rules and AI agent context live in `docs/ai/`:

- **Frontend agent** (architecture rules, conventions, anti-patterns, workflow):
  [docs/ai/agents/frontend-agent.md](docs/ai/agents/frontend-agent.md)

- **Reviewer agent** (PR review checklist):
  [docs/ai/agents/reviewer-agent.md](docs/ai/agents/reviewer-agent.md)

- **Architect agent** (system invariants, content hierarchy, extension guide):
  [docs/ai/agents/architect-agent.md](docs/ai/agents/architect-agent.md)

## Quick Reference

- Coding rules: [docs/ai/context/coding-rules.md](docs/ai/context/coding-rules.md)
- Architecture map: [docs/ai/context/architecture-summary.md](docs/ai/context/architecture-summary.md)
- Domain knowledge: [docs/ai/context/domain-knowledge.md](docs/ai/context/domain-knowledge.md)
```

- [ ] **Step 2: Verify AGENTS.md is updated**

```bash
head -5 AGENTS.md
```

Expected first line: `# Agents`

- [ ] **Step 3: Commit**

```bash
git add AGENTS.md
git commit -m "docs: replace AGENTS.md with thin stub pointing to docs/ai/agents/"
```

---

## Task 13: Update .gitignore

**Files:**
- Edit: `.gitignore`

- [ ] **Step 1: Append AI artifact entries to .gitignore**

Add to end of `.gitignore`:

```gitignore
# AI artifacts
docs/ai/scratch/
docs/ai/**/*.local.md
```

- [ ] **Step 2: Verify .gitignore updated**

```bash
tail -5 .gitignore
```

Expected output includes the two new entries.

- [ ] **Step 3: Commit**

```bash
git add .gitignore
git commit -m "chore: add AI artifact entries to .gitignore"
```

---

## Task 14: Write CONTRIBUTING.md

**Files:**
- Create: `CONTRIBUTING.md`

- [ ] **Step 1: Write CONTRIBUTING.md**

```markdown
# Contributing

## Dev Setup

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

## Quality Checks

```bash
pnpm lint
pnpm typecheck
pnpm exec next build --webpack
```

## Architecture

See [docs/ai/agents/frontend-agent.md](docs/ai/agents/frontend-agent.md) for full architecture rules, coding conventions, and anti-patterns.

See [docs/ai/context/coding-rules.md](docs/ai/context/coding-rules.md) for a quick-reference rule sheet.

## Adding a New Content Module

Follow `features/content/sections/` as the canonical reference.

1. `lib/api/content/{module}.ts` — types + raw fetch functions
2. `lib/services/content/{module}.service.ts` — unwraps ApiResponse, typed returns
3. `features/content/{module}/components/`:
   - `{module}-form.tsx` — controlled form, no fetching
   - `{module}-row-actions.tsx` — edit + delete with per-button loading
   - `create-{module}-dialog.tsx` — Promise.all(parents, orderNos) on open
   - `edit-{module}-dialog.tsx` — useEffect([open]) for parents, isLoadingParents gate
   - `{module}-columns.tsx` — createXxxColumns({onEdit, onDelete}) factory
4. `app/(dashboard)/content/{module}/page.tsx` — thin page, URL sync, owns query state
5. `lib/constants/navigation.ts` — add sidebar nav entry

## PR Checklist

See [docs/ai/agents/reviewer-agent.md](docs/ai/agents/reviewer-agent.md) for the full review checklist.

Quick summary:
- Service layer unwraps ApiResponse — never passes it to UI
- No fetch() in components — always through service layer
- URL query sync on all list pages (search, filter, sort, page, limit)
- isInitialLoad vs isRefetching for loading states (no full table remounts)
- Toast on mutation success/error
- ConfirmDialog before delete

## Docs Conventions

- Small focused files over large monolithic docs
- No placeholder TBDs — write actual content or don't create the file
- Session progress: [docs/ai/progress/frontend.md](docs/ai/progress/frontend.md)
- Feature backlog: [docs/product/backlog.md](docs/product/backlog.md)
- API reference: [docs/engineering/api/api-reference.md](docs/engineering/api/api-reference.md)
```

- [ ] **Step 2: Commit**

```bash
git add CONTRIBUTING.md
git commit -m "docs: add CONTRIBUTING.md with dev setup and module guide"
```

---

## Task 15: Update README.md

**Files:**
- Edit: `README.md`

- [ ] **Step 1: Update Project Structure section**

Find the `## Project Structure` section in `README.md` and replace its content:

Old:
```markdown
## Project Structure

The codebase is organized to keep UI, route logic, and integration boundaries clearly separated:

- `app/` route definitions, layouts, and page entry points
- `components/` reusable UI, layout, dashboard, table, and form components
- `lib/api/` mock API modules prepared for future real service integration
- `lib/hooks/` shared React hooks
- `lib/utils/` utility helpers
- `lib/constants/` shared application constants
- `types/` shared TypeScript domain models
```

New:
```markdown
## Project Structure

- `app/` — route definitions, layouts, and page entry points
- `components/` — reusable UI, layout, table, and form components
- `features/` — domain feature modules (forms, dialogs, column factories)
- `lib/api/` — raw HTTP layer and API types
- `lib/services/` — service layer (unwraps API responses, typed returns)
- `lib/hooks/` — shared React hooks
- `lib/utils/` — utility helpers
- `lib/constants/` — navigation, access, and environment constants
- `types/` — shared TypeScript domain types
- `docs/` — architecture docs, AI agent context, API reference, and progress log

See [docs/ai/context/architecture-summary.md](docs/ai/context/architecture-summary.md) for the full layer map.
```

- [ ] **Step 2: Update Development Notes section**

Find and update:

Old:
```markdown
## Development Notes

- The current implementation uses mock data for MVP workflows.
- API-related code is isolated under `lib/api/` to make future backend integration straightforward.
- The UI is optimized for internal staff operations rather than learner experience.
```

New:
```markdown
## Development Notes

- API integration is live via `vocabunny-core-api`. Authentication uses JWT access + refresh tokens with `bo` scope.
- Service layer (`lib/services/`) unwraps API responses before passing data to UI — components never see raw `ApiResponse`.
- The UI is optimized for internal staff operations rather than learner experience.
- See [CONTRIBUTING.md](CONTRIBUTING.md) for the full development guide.
- See [docs/ai/agents/frontend-agent.md](docs/ai/agents/frontend-agent.md) for architecture rules and conventions.
```

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: update README with accurate project structure and docs links"
```

---

## Self-Review

### Spec coverage

| Spec requirement | Task |
|---|---|
| Create directory structure | Task 1 |
| Migrate docs/progress.md | Task 2 |
| Migrate API.md | Task 3 |
| Migrate TODO.md | Task 4 |
| frontend-agent.md | Task 5 |
| reviewer-agent.md | Task 6 |
| architect-agent.md | Task 7 |
| project-summary.md | Task 8 |
| architecture-summary.md | Task 9 |
| coding-rules.md | Task 10 |
| domain-knowledge.md | Task 11 |
| AGENTS.md stub | Task 12 |
| .gitignore updates | Task 13 |
| CONTRIBUTING.md | Task 14 |
| README.md updates | Task 15 |
| prompts/backend/ removed | ✓ Not in Task 1 (per spec update) |
| docs/engineering/api/ kept | ✓ Task 3 migrates API.md there |

All spec requirements covered. No placeholders. No TBDs.
