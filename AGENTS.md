# Repository Guidelines

## Project Structure & Module Organization

The presentation source lives at the repository root: `index.html`, `styles.css`, and `script.js`. The Vinext/Sites wrapper is under `app/`, with the Cloudflare worker entry point in `worker/` and build integration in `build/`. Thai slide content is maintained in `data/usecases-th-*.json`; `data/usecases-data.js` is generated output. Source-refresh and packaging helpers live in `scripts/`. Tests are in `tests/`, fonts and official use-case artwork are in `assets/`, and generated `public/` and `dist/` directories must not be edited by hand.

## Build, Test, and Development Commands

- `npm ci` — install the exact dependency versions from `package-lock.json`.
- `npm run dev` — prepare public assets and start the Vinext development server.
- `npm run build` — create the production Sites bundle in `dist/`.
- `npm test` — run a production build followed by the Node worker test suite.
- `python3 scripts/build_deck_data.py` — validate and rebuild the 99-use-case JavaScript dataset after editing Thai JSON files.
- `python3 -m http.server 4173` — preview the static deck directly without the Sites wrapper.

## Coding Style & Naming Conventions

Use two-space indentation for HTML, CSS, JavaScript, TypeScript, and JSON; use four spaces for Python. Prefer double quotes in JavaScript/TypeScript, semicolons, `camelCase` functions and variables, `PascalCase` React components, and kebab-case use-case slugs such as `daily-work-brief`. Preserve Thai copy as Unicode, but keep identifiers and technical comments in English. Reuse existing helpers and avoid unsafe casts or silent error handling. No formatter or linter is currently configured, so follow nearby code and run `npx tsc --noEmit` before submitting TypeScript changes.

## Testing Guidelines

Tests use Node's built-in `node:test` framework and follow the `*.test.mjs` naming pattern. Add focused assertions for worker rendering or hosting behavior in `tests/site-worker.test.mjs`. There is no numeric coverage threshold. For visual changes, manually verify desktop and mobile layouts, keyboard navigation, prompt drawers, and direct hash links.

## Commit & Pull Request Guidelines

Prefer concise Conventional Commit messages such as `fix: preserve malformed hash navigation` or `docs: clarify asset licensing`. Keep each commit scoped to one logical change. Pull requests should explain the user-visible outcome, list validation commands, link relevant issues or official sources, and include desktop/mobile screenshots for presentation changes. Never commit credentials or account-specific `.openai/hosting.json`; review `THIRD_PARTY_NOTICES.md` before adding external content or assets.
