# Weekly knowledge review: 2026-11-16

Reviewed the [official landing page](https://learn.chatgpt.com/use-cases), its new [complete inventory](https://learn.chatgpt.com/use-cases/all), all 121 detail pages, and 105 linked official references on 16 November 2026 (Bangkok). The deck now contains 121 use cases / 125 slides. All 119 previous cases remain; their relative order and all 110 previous official starter prompts are unchanged.

## Official knowledge changes

- Added [Fill out an expense report](https://learn.chatgpt.com/use-cases/fill-out-an-expense-report) with complete bilingual prompts, receipt matching, missing-information questions, and the explicit leave-open/do-not-submit boundary.
- Added [Make a custom flyer](https://learn.chatgpt.com/use-cases/make-a-custom-flyer) with complete bilingual prompts, reference-image guidance, readable text, and print/online format constraints. Both additions use their official WebP illustrations.
- Updated `create-custom-review-workflows-with-github-actions` from the [article](https://learn.chatgpt.com/use-cases/create-custom-review-workflows-with-github-actions) and [dedicated CI guide](https://learn.chatgpt.com/docs/security/cli/ci/github): the Action prepares the sandbox on GitHub-hosted Ubuntu 24.04; self-hosted prerequisites remain explicit. The bilingual fallback covers current base/head checks, target-branch checks, explicit advisory mode, estimated cost thresholds, and completed-scan gate limitations.
- Updated `set-up-security-context` from the [threat-model guide](https://learn.chatgpt.com/docs/security/threat-model): Daybreak Defense Factory uses Repositories > repository > Threat model; Validation context > Manage allows proposed Additional context. Team approval and future-scan scope are retained. The broad article snapshot remains faithful to its unchanged prose.
- Updated `automate-security-reviews-in-github-cloud` from the [Security Review guide](https://learn.chatgpt.com/docs/security/security-review) to include Daybreak's Set up PR reviews route. Existing Codex controls, permissions, thresholds, and approval requirements remain.
- Refreshed source-only changes: `github-code-reviews` removes the automatic `@codex fix it` follow-up explanation; the deck already describes developer-led fixes. `incident-to-tested-fix` and `issue-to-tested-pr` now use TypeScript examples and matching commands; their slide workflows and official prompts remain compatible. The Actions article also changes its pinned example to action-v0.9.1.

The redesigned list exposes category and task-type filter labels instead of old image cards. The scraper follows the actual Browse all link, preserves the previous first-two-label convention, and fails on unknown mappings. Existing image URLs retain their evidenced source identity where the new list omits images; new images come from explicit landing-page links. An independent offline run over 123 cached pages reproduced every field of the committed 121-record inventory.

Of 105 supporting references, 100 supplied readable public content. The computer/browser training page needed web extraction after the local extractor selected a small nested article. Five previous limits remain: two optional 404 pages (Academy everyday-work overview and Sites showcase), two redirects to external event/intake pages, and one skipped private Platform settings page. These do not leave the changed slide claims without official evidence. No video-viewing claim is made.

## Thai editorial review

Reviewed all 119 previous Thai records, fixed slides, UI labels, and accessibility text. One independent language correction in `strategic-account-plan.summaryTh` clarifies that the workflow updates stakeholder information, not stakeholders themselves. Its English copy and official knowledge are unchanged. All other editorial changes follow verified source updates or the two new cases.

Compared all 121 bilingual starters: 112 official prompts and nine clearly labeled editorial fallbacks. Verified 371 core literal occurrences, 39 filename/flag/environment occurrences, 316 paragraph separators (437 paragraphs), and 571 list entries in each language. The five new/changed prompt pairs also received an independent semantic review. Human checkpoints remain outside starter prompts.

Inventory SHA-256 (sorted keys, compact UTF-8 `useCases`): `b1735a596539d51aa79893792ab533fe73e811eee38c9b03e5067f41778a246a`.

## Validation

- `npm run data:build`: 121 cases; source, TH/EN, generated data, indices, URLs, and 121 WebP assets align.
- `npm test`: production build and 3/3 Node tests passed. An initial test-list edit incorrectly classified the additions as editorial fallbacks; corrected before the final passing run.
- `npx --no-install tsc --noEmit`, `node --check script.js`, and `git diff --check`: passed.
- `PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests -p 'test_*.py'`: 7/7 scraper tests passed, including legacy/redesigned inventory, safe link discovery, source metadata, malformed rows, and preserved code blocks.
- Existing Playwright/Chrome: 28 TH/EN slide/viewport states at 1440x900 and 390x844; 24 exact full-prompt checks; 12 mobile slide scroll ends; all drawer ends, keyboard navigation, language toggles, direct hashes, contents search, and image checks passed. Zero clipping, overlap, horizontal overflow, or console/page errors. Sandbox Chrome launch failed; approved execution used the already installed browser without package installation.

Twelve representative screenshots accompany this report. Full ignored evidence is under `output/knowledge-review/2026-11-16` and `output/playwright/2026-11-16`.

| Evidence | Thai | English |
| --- | --- | --- |
| Flyer desktop | [TH](th-desktop-make-a-custom-flyer.png) | [EN](en-desktop-make-a-custom-flyer.png) |
| Expense desktop | [TH](th-desktop-fill-out-an-expense-report.png) | [EN](en-desktop-fill-out-an-expense-report.png) |
| Expense mobile end | [TH](th-mobile-fill-out-an-expense-report-end.png) | [EN](en-mobile-fill-out-an-expense-report-end.png) |
| Threat context desktop | [TH](th-desktop-set-up-security-context.png) | [EN](en-desktop-set-up-security-context.png) |
| PR review desktop | [TH](th-desktop-automate-security-reviews-in-github-cloud.png) | [EN](en-desktop-automate-security-reviews-in-github-cloud.png) |
| Actions mobile prompt | [TH](th-mobile-create-custom-review-workflows-with-github-actions-prompt.png) | [EN](en-mobile-create-custom-review-workflows-with-github-actions-prompt.png) |

The TH/EN toggle, Suphakorn P. credit, visual system, licenses, and ignored Sites configuration are preserved.
