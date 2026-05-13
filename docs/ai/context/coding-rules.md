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
