# Weekly knowledge review: 2026-11-09

Reviewed the [official index](https://learn.chatgpt.com/use-cases), all 119 detail pages, and 103 linked official references on 9 November 2026 (Bangkok). The inventory remains 119 use cases / 123 slides, with no additions, removals, or reorderings.

## Source findings

- [Daybreak Blue](https://learn.chatgpt.com/use-cases/getting-started-with-daybreak-blue) now distinguishes approved ChatGPT Business workspaces' member selections from Enterprise custom roles. Updated both workflows and the complete bilingual editorial starter; retained workspace approval, saved-setting checks, the Enterprise propagation delay, member testing, and separate API setup. The source still has no official starter prompt.
- [Mac app shell](https://learn.chatgpt.com/use-cases/macos-sidebar-detail-inspector) and [Mac telemetry](https://learn.chatgpt.com/use-cases/macos-telemetry-logs) expanded their code examples. Saved the actual new code without web UI line numbers. Existing slide workflows and official prompts remain compatible.
- For `set-up-security-context`, the dedicated [Codex Security Cloud threat-model guide](https://learn.chatgpt.com/docs/security/threat-model) now describes Repositories > Monitoring settings > Threat model > Save, applying to future scans. This current, surface-specific guide supersedes the broad use-case article's older file-path setup instruction in the editorial workflow. The raw source snapshot remains faithful to its article.
- For `run-security-reviews-from-the-cli`, the dedicated [CLI artifact reference](https://learn.chatgpt.com/docs/security/cli/reference#scan-artifacts) and [bulk-scan guide](https://learn.chatgpt.com/docs/security/cli/bulk-scans) identify `report.md`, `findings.json`, and `scan-manifest.json`. Updated only the standalone CLI editorial fallback to inspect `scan.status`, `scan.scope`, and `scan.review.excludedPaths`, and warn that completion does not prove every in-scope file was reviewed. The [plugin guide](https://learn.chatgpt.com/docs/security/plugin#what-the-scan-creates) still documents `coverage.json`; plugin workflows remain unchanged.
- The scraper now removes only explicitly hidden syntax-highlighter line-number spans. This also corrects previously captured UI prefixes in `incident-to-tested-fix`, `migrate-a-validation-module`, and `issue-to-tested-pr`; those three official articles did not change.

Of 103 supporting references, 98 returned readable public content. The same five limitations as the previous run remain: two optional pages returned 404 (Academy everyday-work overview and Sites showcase), two links redirected to external event/intake pages, and one private Platform settings page was not accessed. All 119 canonical detail pages were read. Other linked changes do not contradict the deck's current claims.

## Bilingual review

Reviewed all 119 Thai records, fixed slides, UI labels, and accessibility text. No independent Thai wording corrections were needed; all Thai edits correspond to verified knowledge updates. Compared all 110 official starter prompts and nine reviewed English fallbacks side by side. All 110 official prompts remain unchanged.

Source, TH, EN, generated data, indices, canonical URLs, and 119 WebP assets align. Literal checks preserved 364 core token occurrences and 35 filename/flag/environment/manifest-field occurrences. Both languages have 310 paragraph separators (429 paragraphs) and 571 list entries. Human checkpoints stay outside starter prompts.

Inventory SHA-256 (sorted keys, compact UTF-8 `useCases`): `25148bb2a6a56993bf2ca38d33c0ba34b580b3f529bbe79cc09f6a687cc19971`.

## Validation

- `npm run data:build`: 119 use cases.
- `npm test`: production build and 3/3 Node tests passed.
- `npx --no-install tsc --noEmit`, `node --check script.js`, and `git diff --check`: passed.
- `PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests -p 'test_*.py'`: 3/3 scraper regressions passed, covering hidden UI metadata, literal numbers, whitespace/newlines, legacy markup, and unchanged input DOM.
- Installed Playwright and Chrome: 16 TH/EN slide/viewport states at 1440x900 and 390x844, 12 exact full-prompt checks, six mobile slide scroll ends, and all drawer ends passed. Language toggles, hotkeys, direct hashes, contents search, image loading, and navigation passed. Zero clipping, overlap, horizontal overflow, browser errors, or console warnings. Browser launch initially hit sandbox restrictions; approved execution used the existing installation, with no package installation.

Representative screenshots accompany this report. Full local evidence is ignored under `output/knowledge-review/2026-11-09` and `output/playwright/2026-11-09`.

| Evidence | Thai | English |
| --- | --- | --- |
| Daybreak desktop | [TH](th-desktop-daybreak.png) | [EN](en-desktop-daybreak.png) |
| Daybreak mobile end | [TH](th-mobile-daybreak-end.png) | [EN](en-mobile-daybreak-end.png) |
| Cloud context desktop | [TH](th-desktop-security-context.png) | [EN](en-desktop-security-context.png) |
| CLI mobile prompt | [TH](th-mobile-cli-prompt.png) | [EN](en-mobile-cli-prompt.png) |

The language toggle, Suphakorn P. credit, visual system, licenses, and ignored Sites manifest are preserved.
