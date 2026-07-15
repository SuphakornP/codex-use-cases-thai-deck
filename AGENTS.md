# Repository Guidelines

## Project Structure & Module Organization

Core presentation files live at the repository root: `index.html`, `styles.css`, and `script.js`. The Vinext/Sites wrapper is in `app/`, with worker and build integration in `worker/` and `build/`. Thai copy is maintained in `data/usecases-th-*.json`; reviewed English workflow copy is in `data/usecases-en-*.json`; `data/usecases-data.js` is generated. Helpers live in `scripts/`, tests in `tests/`, and fonts and artwork in `assets/`. Never edit generated `public/` or `dist/` files by hand.

## Build, Test, and Development Commands

- `npm ci` — install the exact dependency versions from `package-lock.json`.
- `npm run dev` — prepare public assets and start the Vinext development server.
- `npm run build` — create the production Sites bundle in `dist/`.
- `npm test` — run a production build followed by the Node worker test suite.
- `python3 scripts/build_deck_data.py` — validate and rebuild the 99-use-case JavaScript dataset after editing Thai or English JSON files.
- `python3 -m http.server 4173` — preview the static deck directly without the Sites wrapper.

## Coding Style & Naming Conventions

Use two-space indentation for HTML, CSS, JavaScript, TypeScript, and JSON; use four spaces for Python. Prefer double quotes, semicolons, `camelCase` functions and variables, `PascalCase` React components, and kebab-case slugs such as `daily-work-brief`. Preserve Thai copy as Unicode, but keep identifiers and technical comments in English. Reuse helpers and avoid unsafe casts or silent error handling. Follow nearby code and run `npx tsc --noEmit` for TypeScript changes.

## Testing Guidelines

Tests use Node's built-in `node:test` framework and follow the `*.test.mjs` naming pattern. Add focused assertions for worker rendering or hosting behavior in `tests/site-worker.test.mjs`. There is no numeric coverage threshold. For visual changes, verify desktop and mobile layouts, keyboard navigation, prompt drawers, and direct hash links. If standalone Playwright is unavailable or fails, switch directly to the in-app Browser plugin for visual QA; do not let Playwright setup block testing.

## Change Documentation

Update `CHANGELOG.md` in the same change whenever source, content, configuration, or documentation changes. Add one concise bullet under `Unreleased`; group related edits and omit rebuild-only changes to generated files.

## Commit & Pull Request Guidelines

Prefer concise Conventional Commit messages such as `fix: preserve malformed hash navigation` or `docs: clarify asset licensing`. Keep each commit scoped to one logical change. Pull requests should explain the user-visible outcome, list validation commands, link relevant issues or official sources, and include desktop/mobile screenshots for presentation changes. Never commit credentials or account-specific `.openai/hosting.json`; review `THIRD_PARTY_NOTICES.md` before adding external content or assets.
