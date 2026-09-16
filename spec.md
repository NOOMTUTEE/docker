# Todolist Web App — Spec (v1)

## 1. Overview
- **Name:** Todolist (working title)
- **Purpose:** Personal-use todo manager for daily tasks.
- **Users:** Single local user, no accounts, no sharing.
- **Platform:** Web app, responsive (mobile + desktop), fully offline.
- **Repo context:** Single-package Vite + React (plain JS, no TypeScript) + Tailwind CSS v4 + DaisyUI v5. See `AGENTS.md`. No tests, no CI, lint via `oxlint`.

## 2. Goals / Success
- User can manage personal tasks in < 5s per action (add / complete / edit / delete).
- Data survives reload via `localStorage`.
- Works offline after first load, no backend.
- Clean responsive UI with dark mode.
- Zero-config first run: seeded with sample data + empty states.

Non-goals (v1): collaboration, sync, auth, reminders/notifications, subtasks/attachments.

## 3. Scope

### 3.1 In scope (v1)
1. **Lists:** Multiple named lists (e.g. Work, Home, default “My Tasks”). CRUD for lists.
2. **Todos CRUD:**
   - Add + complete
   - Edit (title, priority, due date, list)
   - Delete (with confirm)
   - Reopen / undo completed → active
3. **Attributes per todo:** title + priority + due date/time + status + list membership.
4. **Priority:** 3 levels — Low / Medium / High — color-coded.
5. **Due dates:** date + optional time; overdue highlight; sort by due date.
6. **List behavior:** archive completed (hide by default, view in “Completed” filter/tab); bulk actions (select multiple → complete / delete / move list).
7. **Filter/sort:**
   - Filter by status: All / Active / Completed (required)
   - Sort: by created, by priority, by due date (nearest first, overdue top)
8. **UX extras:** dark mode toggle, counts & stats, delete confirm, friendly empty state.
9. **Persistence:** `localStorage`, sample data on first run.

### 3.2 Out of scope (v1 — explicitly excluded)
- No auth / accounts / cloud sync
- No collaboration / sharing
- No subtasks / checklists / attachments
- No push/email reminders / notifications
- No tags/categories beyond lists (defer), no search (defer unless trivial), no recurring tasks.

## 4. Functional Requirements

### 4.1 Lists
- `FR-L1:` User can create, rename, delete lists.
- `FR-L2:` Deleting a list requires confirm; user chooses to delete its todos or move them to default list.
- `FR-L3:` One default list (“My Tasks”) always exists, cannot be deleted (can be renamed).
- `FR-L4:` Sidebar / tabs to switch lists + “All lists” view.
- `FR-L5:` Per-list counts: active + overdue badge.

### 4.2 Todos
- `FR-T1:` Add todo: title (required, 1–200 chars, trim), priority (default Medium), due date (optional), list (defaults to current list).
- `FR-T2:` Title-only notes: no description field in v1 (keep minimal per interview).
- `FR-T3:` Complete via checkbox; completed gets strikethrough + moves to archive view; toast with “Undo” for 5s.
- `FR-T4:` Reopen completed todo back to active.
- `FR-T5:` Edit inline or via modal: title, priority, due date/time, list.
- `FR-T6:` Delete requires confirm modal (`DaisyUI modal`); single + bulk delete.
- `FR-T7:` Validation: empty title blocked with inline error; due date cannot be unparseable; past date allowed but flagged “overdue” if still active.

### 4.3 Priority
- Levels: `low | medium | high`.
- Visual: `low = info/neutral badge`, `medium = warning`, `high = error` (DaisyUI `badge`).
- Default: `medium`.
- Sort by priority: High → Medium → Low → none.

### 4.4 Due dates
- Store ISO string `dueAt: string | null`; input via `datetime-local` (date required, time optional — default 23:59 if date-only picked).
- Display: relative (“Today 18:00”, “Tomorrow”, “Overdue 2d”) + absolute on hover/title.
- Overdue rule: `status === 'active' && dueAt < now` → red highlight + “Overdue” badge, counted in stats.
- Sort by due: nulls last; overdue + today first.

### 4.5 Archive / Bulk
- Completed todos hidden from “Active” view; visible under Status filter = Completed / All.
- Bulk: checkbox multi-select per list; toolbar appears with Complete / Move to list / Delete; “Select all” + clear.
- Optional “Clear completed” button per list (with confirm).

### 4.6 Filter / Sort / Stats
- Status filter segmented control: All / Active / Completed.
- Sort dropdown: Created (newest/oldest), Due date, Priority.
- Stats header per list: `X active · Y overdue · Z completed`; global progress bar (`progress` DaisyUI).

## 5. Data Model

```js
// List
{
  id: "uuid",
  name: "Work",
  createdAt: "ISO",
  sortOrder: 0
}

// Todo
{
  id: "uuid",
  listId: "list-id",
  title: "Buy milk",
  priority: "low" | "medium" | "high",
  dueAt: "ISO | null",
  status: "active" | "completed",
  createdAt: "ISO",
  updatedAt: "ISO",
  completedAt: "ISO | null"
}
```

Storage:
- Key: `todolist:v1` → `{ lists: [], todos: [], theme: "light|dark", selectedListId, version: 1 }`
- Write-through on every mutation (debounced ~100ms); load on boot; migrate by `version`.
- First run (no key): seed 1 default list + 1 extra list + 3 sample todos (1 overdue high, 1 today medium, 1 completed low) to demo priority/due/archive.

## 6. UX / UI

- **Style:** Clean responsive, DaisyUI default components, no custom design system.
  - Layout: header (app title + theme toggle + stats) / sidebar (lists on desktop, drawer/dropdown on mobile) / main (add bar + filter/sort + todo list).
  - Components: `btn`, `input`, `select`, `checkbox`, `badge`, `modal`, `toast`, `drawer`, `progress`.
- **Responsive:** single column <768px; sidebar → drawer; add bar sticky; touch targets ≥40px.
- **Dark mode:** `data-theme` toggle (e.g. `light`/`dark` or `cupcake`/`dark`), persisted in storage, respect `prefers-color-scheme` on first run.
- **Empty state:** illustration (DaisyUI/emoji-free CSS or inline SVG) + “No tasks — add your first” + CTA button.
- **Delete confirm:** DaisyUI modal: “Delete ‘X’? This cannot be undone.” [Cancel / Delete].
- **Feedback:** toast on add/complete/delete/undo; optimistic UI (no loading spinners needed — local only).
- **Accessibility:** labels for all inputs, keyboard: Enter to add, Esc closes modal, focus trap-ish, checkbox reachable, color + text for priority (not color-only), `aria-live` for toasts.

## 7. Non-functional
- **Performance:** <100ms interaction, handle 500+ todos per list without jank (simple map render, no virtualization in v1).
- **Offline:** works after first load; no network calls.
- **Persistence durability:** guard `JSON.parse` errors → fallback to seed + console warn; quota errors → toast error.
- **Lint:** must pass `npm run lint` (`oxlint`, hooks rules error).
- **Build:** `npm run build` + `npm run preview` clean.

## 8. Tech / Structure (fits current repo)
- Stack: Vite + React (JS), Tailwind v4 (`@import "tailwindcss"` in `src/index.css`), DaisyUI v5 via `@plugin`.
- No router, no backend, no state lib — `useState` + `useReducer` + custom `useLocalStorage` hook.
- Proposed files (create as needed):
  - `src/lib/storage.js` — load/save/seed/migrate
  - `src/lib/dates.js` — overdue/format/sort helpers
  - `src/hooks/useTodos.js` — lists+t emplo actions
  - `src/components/{AddTodo, TodoItem, TodoList, ListSidebar, FilterBar, StatsBar, ConfirmModal, Toaster}.jsx`
  - `src/App.jsx` — composition + theme handling

## 9. Acceptance Criteria (v1 done when)
1. Reload persists lists/todos/theme.
2. User can add/complete/edit/delete/reopen with confirm + undo toast.
3. Priority 3-levels visible + sortable.
4. Due date+time settable, overdue highlighted + counted, sort-by-due works.
5. Multiple lists work, archive (completed hidden by default), bulk complete/move/delete work.
6. Status filter All/Active/Completed works.
7. Dark mode, counts/stats, empty state all present.
8. Mobile (360px) + desktop (1280px) usable, no horizontal scroll.
9. `npm run lint` and `npm run build` pass.
10. First run seeds sample data; corrupt storage recovers gracefully.

## 10. Future (v2, not building now)
- Search, tags, recurring tasks, drag-reorder, reminders, backend sync/auth, collaboration, subtasks, attachments, import/export JSON.

---
*Generated from interview 2026-09-16: personal use; LocalStorage only; title+priority+due; 3-level priority; date+time+overdue+sort; multiple lists + archive + bulk; filter by status; dark/counts/confirm/empty; persist+seed+offline; out: auth/sync/subtasks/collab/reminders.*
