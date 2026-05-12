# VocabBunny Frontend — Progress Log

> Last updated: 2026-05-12 (session 4)

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
- No `slug` field — Tags API only exposes `name` and `color`. The old `slug`/`usage_count`/`deleted_at` fields were never part of the canonical API contract and have been removed.

### Tags color input
- **Plain text HEX input, no color picker library** — validated with `/^#[0-9A-Fa-f]{6}$/`. Color is optional; an empty string is accepted and omitted from the API payload.
- **Live swatch preview** — a small rounded square next to the HEX input renders `style={{ backgroundColor }}` only when the current value passes the HEX regex. Transparent background when invalid or empty.
- `normalizeTagSlug` / `normalizeTagName` helpers removed entirely; `updateField` in both dialogs is now a simple key-value setter with no slug branch.

### Parent dropdown sorting
- **All parent entity dropdowns sort alphabetically by title** — sorting is applied at the option-mapping layer inside each dialog, after `.map()` and before `setState`. Uses `localeCompare` for locale-aware ascending order. The form components and `SelectField` JSX are untouched; API payloads are unchanged.
- Applied to: `create-lesson-dialog`, `edit-lesson-dialog`, `create-unit-dialog`, `edit-unit-dialog`, `create-question-set-dialog`, `edit-question-set-dialog`, `create-question-dialog`, `edit-question-dialog`.

### Parent relation display in tables
- **Content list tables show parent relation titles instead of raw UUIDs** — resolved via the backend `?include=` query parameter (comma-separated, case-insensitive). The API returns flat summary DTOs (`section`, `lesson`, `unit`, `question_set`) alongside the existing `*_id` fields.
- **Optional fields on entity types** — `Lesson.section?`, `Unit.lesson?`, `QuestionSet.unit?` / `.lesson?`, `Question.question_set?`. Presence is not guaranteed; column renderers fall back to `"-"` when absent.
- **`include` param added to `GetXxxParams`** — replaces the old `include_choices` / `include_tags` boolean fields on `GetQuestionsParams` (those never matched the actual API contract, which always used a single `include` string).
- **Page loaders always request the parent relation** — each content list page passes a fixed `include` value so the relation is always preloaded on every list fetch. No extra state or conditional logic in pages or columns.
- Summary types added to API layer: `SectionSummary`, `LessonSummary` (units + question-sets), `UnitSummary`, `QuestionSetSummary`.

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

### API & Service layers
`lib/services/content/{sections,lessons,units,question-sets,questions,tags,order-nos}.service.ts` — no changes needed (service passes through params transparently).

*Session 3:* API type files updated — see table below.

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

*Session 3:* `create-lesson-dialog` / `edit-lesson-dialog` — sections list sorted alphabetically by title. `lesson-columns` — "Section ID" UUID column → "Section" title column (`lesson.section?.title ?? "-"`). `lessons/page.tsx` — loader passes `include: "section"`. `lib/api/content/lessons.ts` — added `SectionSummary` type, `section?` field on `Lesson`, `include?` on `GetLessonsParams`.

### Units module (complete)
`features/content/units/components/{unit-form, unit-row-actions, create-unit-dialog, edit-unit-dialog, unit-columns}.tsx`
`app/(dashboard)/content/units/page.tsx`

*Session 2:* `unit-form` — Lesson ID text input → `SelectField` with `lessons` prop. `create-unit-dialog` / `edit-unit-dialog` — fetch lessons on open.

*Session 3:* `create-unit-dialog` / `edit-unit-dialog` — lessons list sorted alphabetically by title. `unit-columns` — "Lesson ID" UUID column → "Lesson" title column (`unit.lesson?.title ?? "-"`). `units/page.tsx` — loader passes `include: "lesson"`. `lib/api/content/units.ts` — added `LessonSummary` type, `lesson?` field on `Unit`, `include?` on `GetUnitsParams`.

### Question Sets module (complete)
`features/content/question-sets/components/{question-set-form, question-set-row-actions, create-question-set-dialog, edit-question-set-dialog, question-set-columns}.tsx`
`app/(dashboard)/content/question-sets/page.tsx`

*Session 2:* `question-set-form` — Unit ID text input → `SelectField` with `units` prop. `create-question-set-dialog` / `edit-question-set-dialog` — fetch units on open.

*Session 3:* `create-question-set-dialog` / `edit-question-set-dialog` — units list sorted alphabetically by title. `question-set-columns` — "Unit ID" UUID column → "Unit" title column (`qs.unit?.title ?? "-"`). `question-sets/page.tsx` — loader passes `include: "unit"`. `lib/api/content/question-sets.ts` — added `UnitSummary` + `LessonSummary` types, `unit?` / `lesson?` fields on `QuestionSet`, `include?` on `GetQuestionSetsParams`.

### Questions module (complete)
`features/content/questions/components/{question-form, question-row-actions, create-question-dialog, edit-question-dialog, question-columns}.tsx`
`app/(dashboard)/content/questions/page.tsx`

*Session 2:* `question-form` — Question Set ID text input → `SelectField` with `questionSets` prop. `create-question-dialog` / `edit-question-dialog` — fetch question sets on open.

*Session 3:* `create-question-dialog` / `edit-question-dialog` — question sets list sorted alphabetically by title. `question-columns` — "Question Set ID" UUID column → "Question Set" title column (`question.question_set?.title ?? "-"`). `questions/page.tsx` — loader passes `include: "question_set"`. `lib/api/content/questions.ts` — added `QuestionSetSummary` type, `question_set?` field on `Question`, `include?` on `GetQuestionsParams`; removed stale `include_choices` / `include_tags` booleans.

### Tags module (complete)
`features/content/tags/components/{tag-form, tag-row-actions, create-tag-dialog, edit-tag-dialog, tag-columns}.tsx`
`app/(dashboard)/content/tags/page.tsx` *(new route)*

*Session 4:* Tags API updated to `{ name, color }` only — all `slug`, `usage_count`, `deleted_at` references removed across the entire module.

| File | Change |
|---|---|
| `lib/api/content/tags.ts` | Removed `slug?`, `usage_count?`, `deleted_at?` from `Tag`; removed `slug?` from `CreateTagPayload` / `UpdateTagPayload` |
| `features/content/tags/components/tag-form.tsx` | Removed `slug` field, `normalizeTagSlug`, `normalizeTagName`; form now has `name` + `color` only; HEX regex validation; live color swatch |
| `features/content/tags/components/create-tag-dialog.tsx` | Removed slug import and slug branch in `updateField`; `createTag` payload is `{ name, color? }` |
| `features/content/tags/components/edit-tag-dialog.tsx` | Removed slug from `toTagFormValues` and `updateTag` payload; simplified `updateField`; fixed dialog description text |
| `features/content/tags/components/tag-columns.tsx` | Removed `slug` + `usage_count` columns; added `created_at` column; color column shows rounded swatch + monospace HEX |
| `components/content/tags/tag-columns.tsx` | Aligned with new `Tag` type — removed `slug` + `usage_count` columns; updated color column |

---

## What's Next

### High priority
- ~~**Parent ID dropdowns**~~ — **Done (session 2).** All parent ID text inputs replaced with `SelectField` dropdowns across Lessons, Units, Question Sets, and Questions forms and dialogs.
- ~~**Parent relation column display**~~ — **Done (session 3).** All raw UUID parent columns replaced with relation title display via `?include=` API param across Lessons, Units, Question Sets, and Questions tables.
- ~~**Parent dropdown alphabetical sorting**~~ — **Done (session 3).** All parent entity dropdowns in create/edit dialogs now sort options alphabetically by title using `localeCompare`.
- ~~**Tags module API update**~~ — **Done (session 4).** Tags type updated to `{ name, color }`. Slug/usage_count removed everywhere. Color HEX input with live swatch added to form. Table updated with color badge + created_at column.
- **Question tag picker** — `tag_ids` is omitted from the Question create/edit form. Needs a multi-select or tag picker component backed by `tagsService.getTags`.
- **Real API integration testing** — All service calls are wired to the Go API but untested end-to-end. Verify auth token is attached, error shapes match `ApiResponse`, and paginated responses parse correctly.

### Medium priority
- **`blank_position` field in Question form** — Currently omitted. Needed for `FILL_IN_THE_BLANK` type questions. Could be conditionally rendered when `type === "FILL_IN_THE_BLANK"`.
- **`image_url` preview** — Question form has an `imageUrl` text field. Adding a small image preview on valid URLs would improve editorial UX.
- **Bulk actions** — Delete multiple records at once. Requires checkbox column in `DataTable`.

### Low priority / future
- **Media Assets module** — API layer exists (`/bo/content/media-assets`). Needs full CRUD following the same pattern. Upload flow may require separate treatment (multipart form / S3 pre-signed URL).
- **Question Choices module** — API layer exists (`/bo/content/question-choices`). Independent choice management separate from the question form.
- **`/content/question-sets/create` page cleanup** — The legacy stub at that route uses old mock API patterns (`questionSetApi` directly, not service layer). Should be removed or replaced once the dialog flow is the established entry point.
- **Title normalizer permissiveness** — Current `normalizeTitle` strips `&`, `—`, `:` etc. from content titles. Content titles like "Colors & Shapes" need `&`. Update the regex or remove normalization for content modules where the API accepts these characters.
- **Tags nav visibility** — Tags are accessible via sidebar but the `allowedRoles` on the Content nav item restricts to `["admin", "content_manager"]`. Confirm this is the intended access level.
