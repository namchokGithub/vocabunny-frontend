# VocabBunny Frontend — Progress Log

> Last updated: 2026-05-11 (session 2)

---

## Decisions Made

### Architecture
- **Sections module is the canonical reference** for all future content CRUD modules. Any new content resource must follow its patterns for form, dialog, column, and page structure.
- **Feature-specific components live in `features/content/{module}/components/`**. Shared UI belongs in `components/ui/` or `components/form/`. Column factories for content modules moved out of `components/content/*/` stubs.
- **Service layer always unwraps `ApiResponse`**. Pages and UI components only see plain typed data (e.g. `PaginatedResult<T>`), never raw `ApiResponse`.
- **No global state, no Redux**. All query state (search, filter, sort, page, limit) lives in the page container component, never inside `DataTable` or `ContentListPage`.

### CRUD / UX Patterns
- **Dialog-based CRUD** (not separate pages) for all content modules. The `/content/question-sets/create` page is a legacy stub; new creates use `CreateQuestionSetDialog`.
- **`refreshSignal` not `key={refreshKey}`** — prevents table remounts during refresh. `void refreshSignal` inside the `paginatedLoader` useCallback forces refetch when the counter increments.
- **`isInitialLoad` vs `isRefetching`** — `data === null && isLoading` shows `<LoadingTable/>`. `data !== null && isLoading` shows existing table at `opacity-50` with `pointer-events-none`. No table flicker.
- **URL query sync** for all pages: search, published/active filter, page, limit, sort key, sort direction. Initialized from URL on mount, written back via `router.replace(..., { scroll: false })`. Wrapped in `<Suspense>` to satisfy Next.js App Router rules for `useSearchParams()`.
- **Page resets to 1** on search apply, filter change, limit change, and sort change.

### Tooltip / Truncation
- **`TruncatedText` uses `createPortal`** to render tooltips at `document.body` with `position: fixed`. This escapes the table's `overflow: hidden` wrapper. Absolute positioning alone clips inside the DataTable.

### Filter Labels
- **`filterLabels` prop on `ContentListPage`** (`{ trueLabel, falseLabel }`) allows the filter dropdown to say "Active / Inactive" for Questions instead of "Published / Draft". Default is `"Published" / "Draft"`.

### Form Design
- **Title → slug auto-generation** in all create dialogs. Slug tracks title until the user manually edits it, then stops auto-updating.
- **`order_no` pre-filled** from `GET /bo/content/order-nos/last` on dialog open, for Sections, Lessons, Units, Question Sets, Questions.
- **`SelectField`** added to `components/form/form-field.tsx` for dropdown inputs (question type, difficulty).
- **Dynamic choices list** in the Question form — add/remove rows, each row has `choice_text` input and `is_correct` checkbox. `choice_order` is derived from array index + 1.
- **Parent ID dropdowns** — form components accept a `{ id: string; title: string }[]` prop for parent entities (e.g. `sections`, `lessons`). The form renders a `SelectField`; form state still stores only the ID string; API payload is unchanged. Dialogs own the fetching — forms stay pure/presentational.
- **Create dialogs fetch parents via `Promise.all`** alongside `loadLastOrder`. A single `isLoadingLastOrder` flag covers both fetches, keeping the existing disabled/loading UX intact.
- **Edit dialogs fetch parents in a separate `useEffect([open, showToast])`**. A dedicated `isLoadingParents` flag gates the form and the Save / Cancel buttons while the list loads.

### Tags module differences
- No `order_no` (order-nos API has no `tags` field).
- No `is_published` or `is_active` filter.
- `syncURL` omits the `published` param entirely.

---

## Files Changed

### Shared infrastructure
| File | Change |
|---|---|
| `components/ui/published-badge.tsx` | **New** — generic Published/Draft badge shared across all content modules |
| `components/ui/truncated-text.tsx` | **New** — truncation with portal tooltip; supports `lines` 1–5 |
| `components/form/form-field.tsx` | Added `SelectField` component |
| `components/content/content-list-page.tsx` | Added `filterLabels`, `limit`/`onLimitChange`, `refreshSignal`, controlled `page`, `sortKey`/`sortDirection`/`onSortChange`, `onSearchApply`; `isInitialLoad` vs `isRefetching` opacity fade; page size selector |
| `components/table/data-table.tsx` | Added `width`, `align`, `sortable`, `sortKey` to `Column<T>`; added `getRowKey`, `sortKey`, `sortDirection`, `onSortChange`; `SortIndicator` component; exported `SortDirection` |
| `components/ui/button.tsx` | Added `isLoading` prop + inline `Spinner` |
| `components/ui/empty-state.tsx` | Added `icon` and `action` props; fixed Tailwind v4 syntax |
| `components/ui/toast.tsx` | Added `"warning"` variant with amber styling |
| `lib/hooks/use-debounce.ts` | **New** — generic debounce hook |
| `lib/constants/navigation.ts` | Added Tags (`/content/tags`) to Content sidebar children |

### API & Service layers (all pre-existing, no changes needed)
`lib/api/content/{sections,lessons,units,question-sets,questions,tags,order-nos}.ts`
`lib/services/content/{sections,lessons,units,question-sets,questions,tags,order-nos}.service.ts`

### Sections module (reference implementation — complete)
| File | Change |
|---|---|
| `features/content/sections/components/section-form.tsx` | Full concrete form |
| `features/content/sections/components/section-row-actions.tsx` | Edit + Delete buttons with per-button loading |
| `features/content/sections/components/create-section-dialog.tsx` | Modal; pre-fills order from order-nos API |
| `features/content/sections/components/edit-section-dialog.tsx` | Modal; pre-populates from existing record |
| `features/content/sections/components/section-columns.tsx` | `createSectionColumns({onEdit, onDelete})` factory |
| `features/content/sections/components/section-status-badge.tsx` | Published/Draft badge (predates shared `PublishedBadge`) |
| `app/(dashboard)/content/sections/page.tsx` | Full CRUD + URL sync + sort + filter + pagination |

### Lessons module (complete)
`features/content/lessons/components/{lesson-form, lesson-row-actions, create-lesson-dialog, edit-lesson-dialog, lesson-columns}.tsx`
`app/(dashboard)/content/lessons/page.tsx`

*Session 2:* `lesson-form` — Section ID text input → `SelectField` with `sections` prop. `create-lesson-dialog` — fetches sections via `Promise.all`. `edit-lesson-dialog` — fetches sections on open via `useEffect`.

### Units module (complete)
`features/content/units/components/{unit-form, unit-row-actions, create-unit-dialog, edit-unit-dialog, unit-columns}.tsx`
`app/(dashboard)/content/units/page.tsx`

*Session 2:* `unit-form` — Lesson ID text input → `SelectField` with `lessons` prop. `create-unit-dialog` / `edit-unit-dialog` — fetch lessons on open.

### Question Sets module (complete)
`features/content/question-sets/components/{question-set-form, question-set-row-actions, create-question-set-dialog, edit-question-set-dialog, question-set-columns}.tsx`
`app/(dashboard)/content/question-sets/page.tsx`

*Session 2:* `question-set-form` — Unit ID text input → `SelectField` with `units` prop. `create-question-set-dialog` / `edit-question-set-dialog` — fetch units on open.

### Questions module (complete)
`features/content/questions/components/{question-form, question-row-actions, create-question-dialog, edit-question-dialog, question-columns}.tsx`
`app/(dashboard)/content/questions/page.tsx`

*Session 2:* `question-form` — Question Set ID text input → `SelectField` with `questionSets` prop. `create-question-dialog` / `edit-question-dialog` — fetch question sets on open.

### Tags module (complete)
`features/content/tags/components/{tag-form, tag-row-actions, create-tag-dialog, edit-tag-dialog, tag-columns}.tsx`
`app/(dashboard)/content/tags/page.tsx` *(new route)*

---

## What's Next

### High priority
- ~~**Parent ID dropdowns**~~ — **Done (session 2).** All parent ID text inputs replaced with `SelectField` dropdowns across Lessons, Units, Question Sets, and Questions forms and dialogs.
- **Question tag picker** — `tag_ids` is omitted from the Question create/edit form. Needs a multi-select or tag picker component backed by `tagsService.getTags`.
- **Real API integration testing** — All service calls are wired to the Go API but untested end-to-end. Verify auth token is attached, error shapes match `ApiResponse`, and paginated responses parse correctly.

### Medium priority
- **Section ID column display** — The Lessons table currently shows raw UUIDs in a "Section ID" column. Ideally this resolves to the section title (requires a join or a secondary fetch). Same applies to Lesson ID in Units, Unit ID in Question Sets, etc.
- **`blank_position` field in Question form** — Currently omitted. Needed for `FILL_IN_THE_BLANK` type questions. Could be conditionally rendered when `type === "FILL_IN_THE_BLANK"`.
- **`image_url` preview** — Question form has an `imageUrl` text field. Adding a small image preview on valid URLs would improve editorial UX.
- **Bulk actions** — Delete multiple records at once. Requires checkbox column in `DataTable`.

### Low priority / future
- **Media Assets module** — API layer exists (`/bo/content/media-assets`). Needs full CRUD following the same pattern. Upload flow may require separate treatment (multipart form / S3 pre-signed URL).
- **Question Choices module** — API layer exists (`/bo/content/question-choices`). Independent choice management separate from the question form.
- **`/content/question-sets/create` page cleanup** — The legacy stub at that route uses old mock API patterns (`questionSetApi` directly, not service layer). Should be removed or replaced once the dialog flow is the established entry point.
- **Title normalizer permissiveness** — Current `normalizeTitle` strips `&`, `—`, `:` etc. from content titles. Content titles like "Colors & Shapes" need `&`. Update the regex or remove normalization for content modules where the API accepts these characters.
- **Tags nav visibility** — Tags are accessible via sidebar but the `allowedRoles` on the Content nav item restricts to `["admin", "content_manager"]`. Confirm this is the intended access level.
