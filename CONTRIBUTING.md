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
