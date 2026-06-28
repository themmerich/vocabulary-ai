# Implementation Roadmap

This document breaks the agreed v1 design of **vocabulary-ai** into vertically
sliced phases. Each phase ends with something runnable and demoable, and each
builds only on the phases before it, so the work can be done phase by phase.

For the underlying product decisions, see the design notes summarized at the
bottom of this file.

## Table of contents

- [Guiding principle](#guiding-principle)
- [Phase 1 — Foundation & authentication](#phase-1--foundation--authentication)
- [Phase 2 — Admin catalog](#phase-2--admin-catalog)
- [Phase 3 — Language, books & learning boundary](#phase-3--language-books--learning-boundary)
- [Phase 4 — Quiz core & spaced repetition (no AI)](#phase-4--quiz-core--spaced-repetition-no-ai)
- [Phase 5 — AI checking (hybrid with Claude)](#phase-5--ai-checking-hybrid-with-claude)
- [Phase 6 — Dashboard v1](#phase-6--dashboard-v1)
- [Phase 7 — Practice mode & exam mode](#phase-7--practice-mode--exam-mode)
- [Phase 8 — Sentence generation](#phase-8--sentence-generation)
- [Phase 9 — Audio / TTS](#phase-9--audio--tts)
- [Backlog (after v1)](#backlog-after-v1)
- [Key design decisions](#key-design-decisions)

## Guiding principle

Red thread: **auth → fill the catalog → select → learn (deterministic) → add AI
→ see progress (dashboard) → practice/exam → sentences → audio.** Every phase is
a vertical slice (backend + frontend) that is demoable on its own.

## Phase 1 — Foundation & authentication

Goal: a user can register, log in, and lands in a (still empty) protected app.

- **Backend:** verify PostgreSQL/Flyway setup; first migration for `account` +
  role (`USER` / `ADMIN`); Spring Security with self-service registration +
  login (JWT or session); password hashing.
- **Frontend:** login/registration pages, auth interceptor, route guards, app
  shell with navigation.
- **Why first:** everything else depends on "which user".

## Phase 2 — Admin catalog

Goal: the admin can fill books with vocabulary.

- **Backend:** migrations + entities `Lehrwerk → Lektion → Vokabel` (with order
  index) + `Grammatikregel`; CRUD API (`ADMIN` only); bulk-import endpoint
  (`foreign ; meaning | meaning`).
- **Frontend:** admin area to manage the hierarchy + paste/CSV import + single
  entry editing.
- **Why here:** without a filled catalog there is nothing to learn.

## Phase 3 — Language, books & learning boundary

Goal: a user picks a language, adds books, and sets a learning boundary.

- **Backend:** link user↔language, user↔Lehrwerk (enrollment), word-precise
  learning boundary per (user, book); computation of the "unlocked set".
- **Frontend:** add language/book, set learning boundary (+ "whole Lektion"
  shortcut).

## Phase 4 — Quiz core & spaced repetition (no AI)

Goal: real learning via the deterministic fast path — the SR engine runs
end to end.

- **Backend:** learning state per `(user, Vokabel, direction)`; Leitner
  scheduler (0 → 1 → 3 → 7 → 14 → 30 days → mastered); daily-pool computation;
  deterministic checking (normalization, case-insensitive, accents strict,
  `to`/articles optional); three-attempt logic; hard reset on failure. Start
  writing an **answer log** now (for the later dashboard).
- **Frontend:** quiz view with direction choice (DE→EN / EN→DE / random),
  per-attempt feedback.
- **Why before AI:** prove the SR mechanics in isolation before adding AI
  fuzziness.

## Phase 5 — AI checking (hybrid with Claude)

Goal: smart evaluation for the ambiguous cases.

- **Backend:** Claude **Haiku 4.5** for the three-way verdict (correct /
  sensible-but-not-asked / wrong), synonym follow-up, lenient German typo
  handling; structured JSON; fallback to exact match.
- **Frontend:** hint texts for follow-up / typo cases.

## Phase 6 — Dashboard v1

Goal: progress made visible.

- **Backend:** aggregation endpoints (unlocked/total, mastered, today due/done,
  level distribution) per book + language rollup.
- **Frontend:** progress bars, today due/done, level distribution.

## Phase 7 — Practice mode & exam mode

Goal: targeted drilling and writing tests — both without SR impact, same
checker.

- **Practice mode:** quiz a chosen range/Lektion, no learning-state update.
- **Exam mode:** fixed vocabulary set, **one attempt**, no follow-up, ending in
  **percentage + German grade 1–6**.

## Phase 8 — Sentence generation

Goal: translate sentences built from the unlocked vocabulary.

- **Backend:** Claude **Sonnet 4.6** generates sentences (all unlocked
  vocabulary, only unlocked grammar, per book); translation evaluation; no SR
  impact.
- **Frontend:** sentence practice view (DE→EN / EN→DE).

## Phase 9 — Audio / TTS

Goal: pronunciation on demand.

- **Frontend:** browser `SpeechSynthesis` for foreign words and generated
  sentences. Small and frontend-only — could also be slid in earlier as a nice
  extra.

## Backlog (after v1)

- PWA / offline
- daily reminders
- cloud TTS
- dictation mode
- hit rate / difficult words / streak (uses the answer log from Phase 4)
- dashboard time series
- direction-separated synonym depth
- user-owned vocabulary lists
- detailed AI backend architecture (JSON schema, key handling, fallback)

## Key design decisions

- **Catalog model:** `Sprache` → user learns one language, adds multiple
  `Lehrwerke`; progress tracked separately per book. Hierarchy
  `Lehrwerk → Lektion → Vokabel` (stable order index); `Grammatikregel` on the
  Lektion. A Vokabel belongs to exactly one Lektion of one Lehrwerk — no sharing
  across books. Global admin-curated catalog; users only select, no own lists.
- **Accounts:** single account entity with role `USER` / `ADMIN`; self-service
  registration (email + password).
- **Spaced repetition:** learning state per `(user, Vokabel, direction)` —
  DE→EN and EN→DE mature independently. Leitner ladder
  0 → 1 → 3 → 7 → 14 → 30 days → mastered (rests ~90 days). Wrong = hard reset to
  level 0, re-asked the same session. No daily new-word limit.
- **Learning boundary:** word-precise per (user, book) + "whole Lektion"
  shortcut; movable both ways without losing progress. Separate practice mode
  does not touch SR.
- **AI checking:** three-way verdict (correct / sensible-but-not-asked /
  wrong); max three attempts per query; one stored translation suffices.
  Strictness follows the expected-answer language — native lenient (typos only
  flagged), foreign strict; case-insensitive always, accents strict,
  `to`/articles optional. Hybrid: deterministic fast path first, Claude
  Haiku 4.5 only when ambiguous.
- **Sentence generation:** all unlocked vocabulary (even not-yet-known), per
  book, only unlocked grammar; no SR effect; Claude Sonnet 4.6.
- **Dashboard v1:** snapshots only — progress bars, today due/done, level
  distribution, per book with language rollup.
- **Admin catalog:** CRUD + bulk paste/CSV import per Lektion
  (`foreign ; meaning | meaning`, line order = index); no AI import helper.
- **v1 extensions:** audio/TTS via browser `SpeechSynthesis` on demand
  (dictation later); exam mode with grade (one attempt, no follow-up,
  percentage + German grade 1–6, no SR effect).
