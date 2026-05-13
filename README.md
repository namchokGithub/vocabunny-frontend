# vocabunny-frontend

![VocaBunny](https://img.shields.io/badge/VocabBunny-Back%20Office-ff69b4)
![Version](https://img.shields.io/badge/version-1.0.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Architecture](https://img.shields.io/badge/architecture-microservices-lightgrey)

VocabBunny Back Office is the internal admin and operations web application for the VocabBunny platform. It is used by internal staff such as administrators, operators, and content managers to manage platform data, configure operational workflows, and monitor core product activity.

This repository is not the learner-facing application. Its purpose is to support back-office workflows across content management, gameplay configuration, quests, achievements, economy operations, shop administration, actor management, and analytics.

## Overview

The application is designed as a scalable admin panel with a clear layout, modular component structure, and a frontend architecture that is ready for future backend integration.

Current MVP capabilities include:

- Dashboard overview with summary cards and recent activity
- Content management pages for sections, lessons, units, question sets, and questions
- Quest management
- Achievement management
- Shop item and order monitoring
- Wallet and coin transaction monitoring
- Actor management for guest and user records
- Analytics placeholders
- System settings placeholders
- Reusable table, form, layout, and status components

## Technology Stack

- Next.js with App Router
- React
- TypeScript
- Tailwind CSS
- ESLint
- Prettier
- pnpm

## Project Structure

- `app/` — route definitions, layouts, and page entry points
- `components/` — reusable UI, layout, table, and form components
- `features/` — domain feature modules (forms, dialogs, column factories)
- `lib/api/` — raw HTTP layer and API types
- `lib/services/` — service layer (unwraps API responses, typed returns)
- `lib/hooks/` — shared React hooks
- `lib/utils/` — utility helpers
- `lib/constants/` — navigation, access, and environment constants
- `types/` — shared TypeScript domain types
- `docs/` — architecture docs, AI agent context, API reference, and progress log

See [docs/ai/context/architecture-summary.md](docs/ai/context/architecture-summary.md) for the full layer map.

## Getting Started

### Prerequisites

- Node.js 20 or newer recommended
- pnpm 10 or newer

### Install Dependencies

```bash
pnpm install
```

### Start Development Server

```bash
pnpm dev
```

Default local URL:

```text
http://localhost:3000
```

### Run Quality Checks

```bash
pnpm lint
pnpm typecheck
```

### Create a Production Build

```bash
pnpm exec next build --webpack
```

## Development Notes

- API integration is live via `vocabunny-core-api`. Authentication uses JWT access + refresh tokens with `bo` scope.
- Service layer (`lib/services/`) unwraps API responses before passing data to UI — components never see raw `ApiResponse`.
- The UI is optimized for internal staff operations rather than learner experience.
- See [CONTRIBUTING.md](CONTRIBUTING.md) for the full development guide.
- See [docs/ai/agents/frontend-agent.md](docs/ai/agents/frontend-agent.md) for architecture rules and conventions.

---

_Namchok Singhachai_
_© 2026 VocabBunny. Released under the MIT License._
