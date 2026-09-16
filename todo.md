# Todo — Build Tracker (v1, from `spec.md`)

> How to use: work top-to-bottom, check `[x]` when done, paste verification output in `Result` line. Each task is <30 min and independently verifiable. Source of truth: `spec.md` §3-9. Stack: Vite + React (JS) + Tailwind v4 + DaisyUI v5. Commands: `npm run dev|lint|build|preview` only.

## Workflow Rules (strict — applies to every task T01…T72)
1. **Confirm before start:** announce the next step ID + goal + files to touch, and wait for user go-ahead. Do NOT edit code until confirmed.
2. **Complete the code for that step only:** implement just the step's scope; keep diff minimal; run its `Verify` check.
3. **Stop and ask for review:** after code + verify, stop. Show: files changed, how to test (`npm run dev` route/state), verify output. Ask user to review. Do NOT proceed to next step.
4. **On "review ok":** only then (a) flip completed step `- [ ]` → `- [x]` and fill its `Result:` line, (b) mark next step as in-progress by changing its box to `- [~]` + `**Status: in-progress**`, (c) `git add` only step files + `git commit -m "<StepID>: <descriptive message>"` (e.g. `git commit -m "T10: add localStorage load/save/seed"`), (d) announce commit hash. If user says fix, stay on same step (keep `[~]`), no commit.
- Markers: `- [ ]` pending · `- [~]` in-progress (exactly one at a time) · `- [x]` done (committed).
- Never batch steps into one commit. Never mark `[x]` before "review ok" + commit.

## Progress Snapshot
- [ ] Phase 0 — Setup & cleanup
- [ ] Phase 1 — Data layer (storage/dates/state)
- [ ] Phase 2 — Lists (multi-list + sidebar)
- [ ] Phase 3 — Todos CRUD + undo
- [ ] Phase 4 — Priority + due dates + overdue
- [ ] Phase 5 — Filter/sort/stats/archive/bulk
- [ ] Phase 6 — UX (theme/empty/confirm/toast/responsive/a11y)
- [ ] Phase 7 — Final verify (lint/build/preview)

| Phase | Tasks | Done |
|-------|-------|------|
| 0 | T01–T03 | 0/3 |
| 1 | T10–T12 | 0/3 |
| 2 | T20–T22 | 0/3 |
| 3 | T30–T34 | 0/5 |
| 4 | T40–T42 | 0/3 |
| 5 | T50–T53 | 0/4 |
| 6 | T60–T64 | 0/5 |
| 7 | T70–T72 | 0/3 |

---

## Phase 0 — Setup & cleanup
- [ ] **T01 — Clean template leftovers**
  Files: `src/App.css` (delete if unused), `src/assets/` (delete if unused), `src/App.jsx`, `src/index.css`.
  Do: remove `App.css` import, verify `@import "tailwindcss";` + `@plugin "daisyui";` remain in `index.css`.
  Verify: `npm run dev` loads with no missing-import errors.
  Result: _
- [ ] **T02 — Define file skeleton (no logic yet)**
  Files: `src/lib/storage.js`, `src/lib/dates.js`, `src/hooks/useTodos.js`, `src/components/{AddTodo,TodoItem,TodoList,ListSidebar,FilterBar,StatsBar,ConfirmModal,Toaster}.jsx` (stubs returning `null`).
  Do: create stubs, import in `App.jsx` without breaking render.
  Verify: `npm run lint` passes.
  Result: _
- [ ] **T03 — Theme + layout shell**
  Files: `src/App.jsx`.
  Do: header (title + theme toggle placeholder) / sidebar placeholder / main placeholder, responsive `flex-col md:flex-row`, touch targets ≥40px.
  Verify: manual `npm run dev` at 360px + 1280px, no horizontal scroll.
  Result: _ (screenshot/notes)

## Phase 1 — Data layer
- [ ] **T10 — Storage: load/save/seed/migrate (`spec §5`)**
  Files: `src/lib/storage.js`.
  Do: key `todolist:v1`, shape `{lists,todos,theme,selectedListId,version:1}`, `load()` with try/catch fallback to seed, `save()` debounced ~100ms, seed = default “My Tasks” + “Work” + 3 todos (overdue-high / today-medium / completed-low).
  Done when: corrupt JSON recovers to seed; reload persists.
  Verify: manual — edit storage in DevTools → reload.
  Result: _
- [ ] **T11 — Date helpers (`spec §4.4`)**
  Files: `src/lib/dates.js`.
  Do: `isOverdue(todo, now)`, `formatDue(dueAt)` (“Today 18:00”, “Tomorrow”, “Overdue 2d”), `sortByDue(a,b)` (nulls last), `defaultTimeIfDateOnly` (→23:59).
  Done when: overdue = `active && dueAt < now`; pure functions, no React.
  Verify: `npm run lint` + console spot-check in dev.
  Result: _
- [ ] **T12 — `useTodos` hook (single source of truth)**
  Files: `src/hooks/useTodos.js`.
  Do: `useReducer` for lists+todos+theme+selection+toasts; actions: list CRUD, todo add/toggle/reopen/edit/delete, bulk, clear-completed; write-through to storage.
  Done when: all mutations update state + persist; no direct `localStorage` calls in components.
  Verify: `npm run lint` (hooks rules must pass).
  Result: _

## Phase 2 — Lists (`spec §4.1`)
- [ ] **T20 — ListSidebar: switch + counts**
  Files: `src/components/ListSidebar.jsx`.
  Do: list all + “All lists”, per-list active/overdue badge, select; mobile = DaisyUI `drawer`/dropdown, desktop = sidebar.
  Verify: click switches filter; badge numbers correct.
  Result: _
- [ ] **T21 — Create/rename lists**
  Files: `ListSidebar.jsx`, `useTodos.js`.
  Do: add (prompt/inline input, 1–50 chars, trim, unique-ish), rename (double-click or edit btn, default list renamable).
  Verify: reload persists new names.
  Result: _
- [ ] **T22 — Delete list (confirm + move-or-delete todos, `FR-L2/L3`)**
  Files: `ListSidebar.jsx`, `ConfirmModal.jsx`, `useTodos.js`.
  Do: default “My Tasks” cannot be deleted; others → modal with [Move to My Tasks | Delete todos] + [Cancel/Delete].
  Verify: deleting list with todos both paths work; undo not required.
  Result: _

## Phase 3 — Todos CRUD (`spec §4.2`)
- [ ] **T30 — AddTodo bar (`FR-T1/T7`)**
  Files: `src/components/AddTodo.jsx`.
  Do: title input (required 1–200, trim, Enter to add) + priority select (default medium) + `datetime-local` (optional) + Add btn; inline error on empty.
  Verify: empty blocked; valid adds to current list + toast.
  Result: _
- [ ] **T31 — TodoItem: display + toggle + reopen (`FR-T3/T4`)**
  Files: `src/components/TodoItem.jsx`.
  Do: checkbox, title (strikethrough if completed), priority `badge`, due label, edit/delete buttons; toggle → toast with Undo (5s).
  Verify: toggle moves between Active/Completed filters.
  Result: _
- [ ] **T32 — Edit todo (`FR-T5`)**
  Files: `TodoItem.jsx` (inline or modal), `useTodos.js`.
  Do: edit title/priority/dueAt/list; Esc cancels, Enter saves; validation same as add.
  Verify: edits persist after reload.
  Result: _
- [ ] **T33 — Delete single (confirm, `FR-T6`)**
  Files: `ConfirmModal.jsx`, `TodoItem.jsx`.
  Do: DaisyUI `modal` “Delete ‘X’? …” [Cancel/Delete] + toast.
  Verify: cancel keeps todo; delete removes + persists.
  Result: _
- [ ] **T34 — TodoList composition + “Clear completed”**
  Files: `src/components/TodoList.jsx`.
  Do: renders filtered list, `key=id`, “Clear completed” btn per list (with confirm).
  Verify: 0 todos → Empty state (see T61), 500-row smoke test no jank.
  Result: _

## Phase 4 — Priority + due (`spec §4.3/4.4`)
- [ ] **T40 — Priority badges + colors**
  Files: `TodoItem.jsx`, `AddTodo.jsx`.
  Do: `low=info/neutral`, `medium=warning`, `high=error`; text label always (not color-only).
  Verify: all 3 visible; lint passes.
  Result: _
- [ ] **T41 — Due display + overdue highlight**
  Files: `TodoItem.jsx`, `dates.js`.
  Do: relative label + absolute in `title` attr; overdue → red row/border + “Overdue” badge.
  Verify: past-due active todo flagged; completed past-due NOT flagged.
  Result: _
- [ ] **T42 — Sort by due/priority wiring (data part; UI in T51)**
  Files: `dates.js`, `useTodos.js` (selectors).
  Do: `selectVisibleTodos(todos, {status, sort})`: due (nulls last), priority High→Low, created newest/oldest.
  Verify: manual check with seeded 3 todos.
  Result: _

## Phase 5 — Filter / sort / stats / archive / bulk (`spec §4.5/4.6`)
- [ ] **T50 — Status filter (All/Active/Completed)**
  Files: `src/components/FilterBar.jsx`.
  Do: segmented `join` buttons; Completed = archive view; persists per session (optional in storage).
  Verify: toggle hides/shows correctly; completed hidden from Active.
  Result: _
- [ ] **T51 — Sort dropdown**
  Files: `FilterBar.jsx`.
  Do: Created new/old, Due date, Priority; nulls-last for due.
  Verify: each option reorders visibly.
  Result: _
- [ ] **T52 — StatsBar + progress (`spec §4.6`)**
  Files: `src/components/StatsBar.jsx`.
  Do: `X active · Y overdue · Z completed` + DaisyUI `progress` (completed/total); updates live.
  Verify: numbers match list after add/toggle/delete.
  Result: _
- [ ] **T53 — Bulk select toolbar**
  Files: `TodoList.jsx`, `useTodos.js`.
  Do: per-item select checkbox, “Select all”/clear, toolbar (Complete / Move to list `select` / Delete with confirm); appears only when selection >0.
  Verify: bulk complete/move/delete all persist + toast.
  Result: _

## Phase 6 — UX polish (`spec §6`)
- [ ] **T60 — Dark mode toggle (persisted)**
  Files: `App.jsx`, `storage.js`.
  Do: `data-theme` (`light`/`dark`), toggle in header, init from storage else `prefers-color-scheme`.
  Verify: reload keeps theme; toggle flips colors.
  Result: _
- [ ] **T61 — Empty states**
  Files: `TodoList.jsx`.
  Do: per filter: “No active tasks — add your first” + CTA (focuses AddTodo); “No completed yet”; “No todos in this list”.
  Verify: screenshot each state.
  Result: _
- [ ] **T62 — Toaster + Undo**
  Files: `src/components/Toaster.jsx`.
  Do: DaisyUI `toast` bottom, `aria-live="polite"`, auto-dismiss 5s, Undo action for complete/delete where feasible.
  Verify: keyboard reachable; rapid actions queue sanely.
  Result: _
- [ ] **T63 — Responsive + a11y pass**
  Files: all components.
  Do: labels on all inputs, Enter/Esc behavior, focus visible, ≥40px targets, `drawer` on mobile, no h-scroll at 360px.
  Verify: tab-through add→toggle→edit→delete with keyboard only.
  Result: _
- [ ] **T64 — Corrupt/quota handling**
  Files: `storage.js`, `Toaster.jsx`.
  Do: bad JSON → seed + console.warn; quota error → error toast (no crash).
  Verify: paste `###` into `todolist:v1` → reload recovers.
  Result: _

## Phase 7 — Final verify (`spec §7/9`)
- [ ] **T70 — Lint clean**
  Verify: `npm run lint` → 0 errors (warnings for `only-export-components` OK if constant exports).
  Result: _ (paste output)
- [ ] **T71 — Build + preview**
  Verify: `npm run build` then `npm run preview` → click through acceptance 1–8 in `spec.md §9`.
  Result: _ (paste output + checklist)
- [ ] **T72 — Acceptance sweep (tick against `spec.md §9`)**
  - [ ] 1 reload persists · 2 CRUD+undo · 3 priority · 4 due/overdue · 5 multi-list+archive+bulk · 6 filter · 7 dark/stats/empty · 8 360+1280px · 9 lint+build · 10 seed+recover
  Result: _ (pass/fail per item)

---
## Log (append per finished task — only after "review ok" + commit)
| Date | Task | What was done | Verify output | Commit |
|------|------|---------------|---------------|--------|
| _ | _ | _ | _ | _ |
