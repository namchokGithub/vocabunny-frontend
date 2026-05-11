# Architecture Rules

## General

- use feature-based structure
- preserve existing folder structure
- keep architecture lightweight and maintainable
- prefer incremental improvements
- avoid overengineering and unnecessary abstractions

## State Management

- no Redux
- avoid global state unless necessary
- prefer local state and lightweight patterns

## API Architecture

- apiClient is the single HTTP entry point
- api layer handles raw fetch/http only
- service layer wraps api layer
- service layer unwraps ApiResponse
- UI/components must not use ApiResponse directly

## Components

### Shared Components

Shared reusable components belong in:

src/components/

Examples:

- buttons
- dialogs
- tables
- form inputs
- toast
- loading states

### Feature Components

Feature/domain-specific components belong in:

src/features/

Avoid:

- feature-specific business UI inside shared components

## Tables & CRUD

- preserve generic DataTable<T>
- preserve generic ContentListPage<T>
- keep pages thin
- separate query/business logic from presentation UI
- reuse Sections patterns for future CRUD modules

### Query State

Query state belongs to:

- page.tsx
- container/feature components

Avoid placing inside generic components:

- search state
- filter state
- pagination state
- sorting state

### Table UX

- preserve stable layout during loading
- avoid full table flicker during refetch
- preserve existing data during soft loading
- use truncate + tooltip for overflowing content
- avoid layout shifts during:
  - sorting
  - pagination
  - searching
  - filtering

## Forms

- prefer concrete forms before abstractions
- avoid dynamic form builders unless necessary
- reusable form inputs are allowed
- feature forms remain inside feature folders

## Async UX

- mutations should provide loading feedback
- destructive actions require confirmation dialogs
- success/error flows should use toast notifications
- preserve soft-loading UX when possible

## Data Fetching

- avoid duplicate fetch logic
- prefer reusable async/loading hooks
- avoid direct fetch calls inside UI components
- avoid unnecessary remounts during refetch

## Styling

- use TailwindCSS
- preserve current design language
- clean admin-panel style UI
- minimal but polished
- avoid flashy animations

## Auth

- preserve existing auth architecture
- use access token + refresh token flow
- apiClient attaches Authorization header automatically
- protected routes must redirect unauthenticated users

## Accessibility

- preserve keyboard accessibility
- interactive elements should remain accessible
- avoid hover-only critical UX

## Code Style

- production-oriented
- readable
- modular
- avoid giant components/files
