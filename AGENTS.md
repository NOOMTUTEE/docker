# AGENTS.md

Single-package Vite + React app (plain JS, no TypeScript). No monorepo, no tests, no CI.

## Commands

- `npm install` — install (repo uses npm; `package-lock.json` is committed)
- `npm run dev` — Vite dev server with HMR
- `npm run build` — production build to `dist/` (pure `vite build`, no `tsc`)
- `npm run preview` — serve `dist/` locally to verify a build
- `npm run lint` — `oxlint` (no `--fix` flag configured; no ESLint/Prettier)

No test, typecheck, or format script exists — do not invent one.

## Structure / entrypoints

- `index.html` → `/src/main.jsx` → `src/App.jsx` (root component, `StrictMode` in `main.jsx`)
- `vite.config.js` — plugins are `react()` + `tailwindcss()` from `@tailwindcss/vite`
- Styling is Tailwind v4 + DaisyUI v5, wired only via `src/index.css`:
  `@import "tailwindcss";` + `@plugin "daisyui";` — no `tailwind.config.js`, no `@tailwind` directives, no `daisyui` entry in `vite.config.js`
- `src/App.css`, `src/assets/` are default template leftovers; `dist/`, `node_modules/` are gitignored build artifacts

## Lint config

- `.oxlintrc.json`: plugins `react`, `oxc`; `react/rules-of-hooks: error`; `react/only-export-components: warn` with `allowConstantExport: true`
- Constant component exports are allowed by that exception; hook violations fail lint.
