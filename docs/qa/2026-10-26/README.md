# Weekly review: 26 October 2026 (Bangkok)

Reviewed the official index and all 113 detail pages (114 pages). Added eight use cases, removed none, and preserved official ordering and source identities. The only existing use case with changed official content is `build-and-deploy-internal-apps`: current availability, residency guidance, and payment-provider restrictions replace the older blanket statements.

## Official additions

- [Getting Started with Daybreak Blue](https://learn.chatgpt.com/use-cases/getting-started-with-daybreak-blue)
- [Investigate an incident and test a fix](https://learn.chatgpt.com/use-cases/incident-to-tested-fix)
- [Migrate a validation module](https://learn.chatgpt.com/use-cases/migrate-a-validation-module)
- [Build a hackathon site](https://learn.chatgpt.com/use-cases/build-workshop-practice-site)
- [Build an onboarding portal](https://learn.chatgpt.com/use-cases/build-personal-onboarding-plan)
- [Manage creative requests from brief to delivery](https://learn.chatgpt.com/use-cases/collect-and-schedule-team-requests)
- [See which campaigns bring in leads](https://learn.chatgpt.com/use-cases/compare-campaign-performance)
- [Turn an issue into a tested pull request](https://learn.chatgpt.com/use-cases/issue-to-tested-pr)

Supporting official guidance reviewed: [Cloud environments](https://learn.chatgpt.com/docs/environments/cloud-environments), [AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md), [Daybreak team setup](https://help.openai.com/en/articles/20001531-openai-daybreak-set-up-access-for-your-team), [Sites limits](https://learn.chatgpt.com/docs/sites#understand-limits-and-unsupported-uses), [Sites data](https://learn.chatgpt.com/docs/sites/data-and-connections), [Sites sharing](https://learn.chatgpt.com/docs/sites/publishing-and-sharing), and [Sites terms](https://openai.com/policies/chatgpt-sites-terms/).

## Separate editorial and layout corrections

- `datasets-and-reports`: clarify data modeling and the missing-value/duplicate checks.
- `new-hire-onboarding`: replace an unexplained cohort label with the action of reviewing new-hire names.
- Official knowledge and existing prompts for these two cases are unchanged. All 105 existing Thai prompts remain unchanged.
- Fit new workflow summaries to the existing slide layout without shortening starter prompts. Correct the incident translation of drained workers to mean finishing in-flight work, not processing the retained backlog.
- Fix the closing slide's clipped Thai paragraph and mobile source-footer overlap. Keep its visual system while placing the source footer in document flow.

## Validation

- `npm run data:build`: 113 use cases, 117 total slides.
- `npm test`: production build and 2/2 tests passed.
- `npx --no-install tsc --noEmit`, `node --check script.js`, and `git diff --check`: passed.
- Source, TH/EN editorial, generated data, and image mappings align one-to-one. Four workflow steps per language per case.
- Reviewed 109 official prompts and four clearly identified editorial fallbacks. Daybreak has no official starter prompt; its English example is grounded in the official setup workflow and translated fully into Thai.
- Full semantic review plus literal-token checks: 352 core occurrences, 14 bare filenames/extensions, and four additional command/date/status literals preserved. Both languages retain 413 prompt paragraphs and 571 list items.
- In-app Browser QA: 56 TH/EN slide/viewport combinations at 1440 x 900 and 390 x 844, plus mobile scroll ends. All 44 changed-case prompt/viewport combinations exactly match the source/editorial text, wrap without horizontal overflow, and scroll to the final controls.
- Language toggle, direct hashes, keyboard previous/next navigation, contents search, image loading, and console checks passed. No browser warnings or errors.
- Initial count/fallback test expectations and observed layout failures were corrected and the relevant checks rerun successfully before commit.

## Representative screenshots

| View | Thai desktop | English desktop | Thai mobile | English mobile |
| --- | --- | --- | --- | --- |
| Daybreak | [TH](getting-started-with-daybreak-blue-th-desktop.png) | [EN](getting-started-with-daybreak-blue-en-desktop.png) | [TH](getting-started-with-daybreak-blue-th-mobile.png) | [EN](getting-started-with-daybreak-blue-en-mobile.png) |
| Creative requests | [TH](collect-and-schedule-team-requests-th-desktop.png) | [EN](collect-and-schedule-team-requests-en-desktop.png) | [TH end](collect-and-schedule-team-requests-th-mobile-end.png) | [EN end](collect-and-schedule-team-requests-en-mobile-end.png) |
| Closing slide | [TH](start-small-th-desktop.png) | [EN](start-small-en-desktop.png) | [TH end](start-small-th-mobile-end.png) | [EN end](start-small-en-mobile-end.png) |

The remaining screenshots and structured audits are retained locally in the ignored `output/playwright/2026-10-26` and `output/knowledge-review/2026-10-26` directories.
