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
