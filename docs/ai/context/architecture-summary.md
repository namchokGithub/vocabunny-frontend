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
