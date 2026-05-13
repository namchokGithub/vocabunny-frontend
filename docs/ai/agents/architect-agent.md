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
