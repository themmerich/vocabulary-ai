# frontend

Angular 22 single-page app for vocabulary-ai. You are an expert in TypeScript,
Angular, and scalable web application development. Write functional,
maintainable, performant, and accessible code.

## Stack

- **Angular 22** (standalone, signals)
- **Tailwind CSS 4** (via `@tailwindcss/postcss`)
- **Vitest** for unit tests (`jsdom`)
- **ESLint** (`angular-eslint` + `typescript-eslint`, type-aware) for linting
- **Prettier** for formatting
- Package manager: **npm**

## Style Guide

This repo ships a written style guide under [`../style-guide/`](../style-guide/style-guide.md)
that targets Angular v22+. The rules below summarize the essentials; consult the
guide for the full detail. Load the specific file for the area you are working on:

- TypeScript / Angular components & services — [`style-guide.ts.md`](../style-guide/style-guide.ts.md)
- Templates, control flow, forms — [`style-guide.html.md`](../style-guide/style-guide.html.md)
- SCSS, design tokens, component styling — [`style-guide.scss.md`](../style-guide/style-guide.scss.md)
- Accessibility (a11y) — [`style-guide.a11y.md`](../style-guide/style-guide.a11y.md)
- Tests (Vitest & Playwright) — [`style-guide.spec.md`](../style-guide/style-guide.spec.md)
- NPM packages & dependencies — [`style-guide.npm.md`](../style-guide/style-guide.npm.md)

Repo-wide guides (Git commits, Markdown) live alongside them in the same folder.

## Commands

Run from the `frontend/` directory.

```bash
npm start            # ng serve — dev server
npm run build        # production build
npm test             # vitest
npm run lint         # eslint (ng lint)
npm run lint:fix     # eslint with --fix
npm run format       # prettier --write .
npm run format:check # prettier --check .
```

ESLint is configured in [`eslint.config.js`](eslint.config.js) and encodes the
style-guide rules; Prettier owns formatting via [`prettier.config.js`](prettier.config.js)
(`eslint-config-prettier` switches off conflicting ESLint rules).

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Do NOT set `changeDetection: ChangeDetectionStrategy.OnPush` explicitly. `OnPush` is the default in Angular v22+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Prefer inline templates for small components
- Prefer Signal Forms (`@angular/forms/signals`) for new forms. They are stable in Angular v22+ and provide signal-based state, type-safe field access, and schema-based validation
- When not using Signal Forms, prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Prefer the `@Service` decorator over `@Injectable({providedIn: 'root'})` for new singleton services (Angular v22+)
- Use the `inject()` function instead of constructor injection
