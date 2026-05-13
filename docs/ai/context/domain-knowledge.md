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
