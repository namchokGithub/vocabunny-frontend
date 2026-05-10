# Architecture Rules

## General

- feature-based structure
- lightweight architecture
- scalable and maintainable
- avoid overengineering
- preserve existing folder structure

## State Management

- no Redux
- no global state unless necessary
- prefer local state and lightweight patterns

## API Architecture

- service layer wraps api layer
- api layer handles raw HTTP/fetch only
- service layer unwraps ApiResponse
- UI must not use ApiResponse directly
- apiClient is the single HTTP entry point

## Components

- shared reusable components belong in:
  src/components/

- feature/domain-specific components belong in:
  src/features/

- avoid putting feature-specific UI into shared components

## Tables & CRUD

- use generic reusable DataTable system
- preserve generic ContentListPage<T>
- keep pages thin
- separate business logic from UI

## Forms

- prefer concrete forms before abstraction
- avoid dynamic form builders unless truly needed
- reusable form inputs are allowed
- feature forms should stay inside feature folders

## Styling

- use TailwindCSS
- preserve current design language
- clean admin-panel style UI
- minimal but polished
- avoid unnecessary animations

## Auth

- preserve existing auth architecture
- use access token + refresh token flow
- apiClient attaches Authorization header automatically
- protected routes must redirect unauthenticated users

## Code Style

- production-oriented
- readable
- modular
- incremental improvements only
- avoid giant components/files
- avoid unnecessary abstractions

## Query State

- query state belongs to page/container components
- shared components must remain presentation-focused
- search/filter/pagination state should not live inside DataTable

## Async UX

- mutations should provide loading feedback
- destructive actions should use confirmation dialogs
- success/error flows should use toast notifications

## Data Fetching

- avoid duplicate fetch logic
- prefer reusable hooks for async loading patterns
- avoid direct fetch calls inside UI components
