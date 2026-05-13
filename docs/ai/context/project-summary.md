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
- Full reference: [docs/engineering/api/api-reference.md](../../engineering/api/api-reference.md)

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
| [docs/ai/agents/frontend-agent.md](../agents/frontend-agent.md) | Architecture rules, coding conventions, anti-patterns |
| [docs/ai/agents/reviewer-agent.md](../agents/reviewer-agent.md) | PR review checklist |
| [docs/ai/agents/architect-agent.md](../agents/architect-agent.md) | System invariants, extension guidance |
| [docs/ai/context/coding-rules.md](coding-rules.md) | Quick-reference coding rules |
| [docs/ai/context/domain-knowledge.md](domain-knowledge.md) | API shapes, content hierarchy, roles |
| [docs/ai/context/architecture-summary.md](architecture-summary.md) | Component tree + layer map |
| [docs/ai/progress/frontend.md](../progress/frontend.md) | Session progress log |
| [docs/product/backlog.md](../../product/backlog.md) | Feature backlog |
