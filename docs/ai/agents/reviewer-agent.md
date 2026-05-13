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
