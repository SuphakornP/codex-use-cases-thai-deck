# Weekly knowledge review: 2026-11-23

Reviewed the [official landing page](https://learn.chatgpt.com/use-cases), [complete inventory](https://learn.chatgpt.com/use-cases/all), all 121 detail pages, and 105 linked official references on 23 November 2026 (Bangkok). The deck retains 121 use cases / 125 slides.

## Official knowledge changes

- The official recommended order moves 23 existing cases. Both languages, generated slide numbers, and contents navigation follow the new order; stable slug links remain intact. No additions, removals, renames, or starter-prompt changes.
- [Investigate an incident and test a fix](https://learn.chatgpt.com/use-cases/incident-to-tested-fix) adds Ruby 3.3 setup and a Ruby transaction-handler example alongside TypeScript.
- [Turn an issue into a tested pull request](https://learn.chatgpt.com/use-cases/issue-to-tested-pr) adds Ruby setup and four Ruby code examples alongside TypeScript. The source snapshot preserves these additions; both existing language-neutral slide workflows remain accurate.
- Reviewed 35 changed supporting-reference URLs: new model guidance, additional language examples, Daybreak access and CLI documentation changes remain compatible with the scoped deck claims. No extra workflow edits were needed.

Of 105 supporting references, 100 supplied public content (the computer/browser training page was recovered through web extraction). The same five access limits remain: two optional 404 pages, two redirects to external event/intake pages, and one private Platform settings page deliberately skipped. No video-viewing claim is made. The changed source records and slide order have complete official evidence.

## Thai editorial review

Reviewed all 121 Thai records and the fixed slides, UI labels, and accessibility text. No concrete Thai-only corrections found. All TH/EN editorial text is unchanged; only 23 indices change in each language.

All 112 official starter prompts and nine reviewed English fallbacks were checked against full Thai translations. Preserved 371 core literal occurrences, 39 additional filename/flag/environment occurrences, 316 paragraph separators (437 paragraphs), and 571 list entries in each language. Every case retains four practical workflow steps and separate Human checkpoints.

Inventory SHA-256 (sorted keys, compact UTF-8 useCases): `0aabeb50d6db44cbce23a08d94e17c3229fca049d370a19b5e012a948047e655`.

## Validation

- `npm run data:build`: 121 cases; source, TH/EN, generated data, indices, URLs, and illustrations align.
- `npm test`: production build and 3/3 Node tests passed.
- `npx --no-install tsc --noEmit`, `node --check script.js`, and `git diff --check`: passed.
- `PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests -p 'test_*.py'`: 7/7 passed.
- Independently re-parsed all 121 cached article pages and the official catalog: exact source equality. All old TypeScript blocks and starter prompts retained.

- Existing Playwright/Chrome passed 104 slide/viewport states in TH/EN at 1440x900 and 390x844: cover, all 23 reordered cases, and both source-updated cases. All 100 full prompts matched exactly; all 50 mobile scroll ends and drawer ends were reachable. Navigation, direct hashes, language toggle, contents search, images, and console checks passed with zero clipping/overlap/errors. No packages installed. Representative screenshots were also visually inspected. A mobile screenshot appeared transiently clipped; a focused header measurement and a complete 52-state mobile rerun with explicit header-bound checks both passed, with clean final screenshots. No CSS changes were needed.

| Evidence | Thai | English |
| --- | --- | --- |
| Cover review date | [TH](th-desktop-cover.png) | [EN](en-desktop-cover.png) |
| Reordered desktop slide | [TH](th-desktop-cfo-board-reporting-pack.png) | [EN](en-desktop-cfo-board-reporting-pack.png) |
| Mobile Human checkpoint | [TH](th-mobile-cfo-board-reporting-pack-end.png) | [EN](en-mobile-cfo-board-reporting-pack-end.png) |
| Full prompt drawer | [TH](th-mobile-issue-to-tested-pr-prompt.png) | [EN](en-mobile-issue-to-tested-pr-prompt.png) |

## Changed order

One-based use-case numbers (slide numbers include the three introductory slides):

| Use case | Previous | Current |
| --- | --- | --- |
| `cfo-board-reporting-pack` | 47 | 46 |
| `monthly-business-review-narrative` | 46 | 47 |
| `scenario-tradeoff-model` | 81 | 69 |
| `revise-lesson-package` | 89 | 70 |
| `run-security-reviews-from-the-cli` | 69 | 71 |
| `automate-security-scans-in-ci` | 70 | 72 |
| `audit-course-section-consistency` | 71 | 73 |
| `build-unit-plan-from-sources` | 72 | 74 |
| `variance-driver-bridge` | 73 | 75 |
| `build-interactive-lesson-resource` | 74 | 76 |
| `calibrate-assessments` | 75 | 77 |
| `finance-model-cleanup` | 76 | 78 |
| `create-classroom-materials-pack` | 77 | 79 |
| `create-lesson-deck` | 78 | 80 |
| `stalled-deal-diagnosis` | 79 | 81 |
| `business-impact-readout` | 80 | 82 |
| `organize-lesson-unit-folder` | 82 | 83 |
| `organize-semester-workspace` | 83 | 84 |
| `plan-budget-and-schedule` | 84 | 85 |
| `prepare-committee-packet` | 85 | 86 |
| `refresh-forecast-and-plan` | 86 | 87 |
| `strategic-account-plan` | 87 | 88 |
| `refresh-course-materials` | 88 | 89 |

The TH/EN toggle, Suphakorn P. credit, visual system, licenses, and Sites configuration are preserved. Full ignored evidence is under `output/knowledge-review/2026-11-23` and `output/playwright/2026-11-23`.
