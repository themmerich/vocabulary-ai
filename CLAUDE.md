# vocabulary-ai

Monorepo for a vocabulary learning application, split into two independently
buildable modules:

- **`backend/`** — Spring Boot REST API (Java 25, Gradle). Persists data in
  PostgreSQL via JPA, schema managed by Flyway. See [backend/CLAUDE.md](backend/CLAUDE.md).
- **`frontend/`** — Angular 22 single-page app (Tailwind CSS, Vitest).
  See [frontend/CLAUDE.md](frontend/CLAUDE.md).

The two modules talk over HTTP; there is no shared build. Work on each module
from its own directory using the commands documented in its `CLAUDE.md`.

## Workflow

- **Only make changes that have been explicitly discussed.** Do not add
  unrequested edits, refactors, or "while I'm here" improvements.
- **Do not create a pull request on your own.** Wait until the user explicitly
  says the changes are good and asks for a PR.
- **The user merges the PR by hand in GitHub.** Do not merge.

## Conventions

- Keep frontend and backend concerns in their own module — do not reach across
  the boundary except through the HTTP API.
- Commit messages and code comments in English.
- Each module owns its own toolchain and lockfiles; run module commands from the
  module directory, not the repo root.
