# Weekly review · 2 November 2026 (Bangkok)

The official index grew from 113 to 119 use cases. All 113 previous cases retain their titles, canonical URLs, starter prompts and relative order. Their article text, code examples and article links matched the previous review. The deck now has 123 slides. [OpenAI Learn inventory](https://learn.chatgpt.com/use-cases)

## Official additions

- [Automate security reviews in GitHub Cloud](https://learn.chatgpt.com/use-cases/automate-security-reviews-in-github-cloud)
- [Manage supply chain risk in the CI/CD](https://learn.chatgpt.com/use-cases/manage-supply-chain-risk-in-cicd)
- [Review code changes in Codex Desktop](https://learn.chatgpt.com/use-cases/review-code-changes-in-codex-desktop)
- [Set up security context](https://learn.chatgpt.com/use-cases/set-up-security-context)
- [Create custom review workflows with GitHub Actions](https://learn.chatgpt.com/use-cases/create-custom-review-workflows-with-github-actions)
- [Run security reviews from the CLI](https://learn.chatgpt.com/use-cases/run-security-reviews-from-the-cli)

Desktop supplies an official starter prompt. The other five additions have labeled examples derived from their workflows. The inventory now retains 49 code blocks from 17 pages, including 13 existing cases whose examples were present at the previous review. Two new pages place their instructions in a section without a heading. The scraper now captures those instructions as well.

The Finances workflow now identifies U.S. eligibility on Free, Go, Plus and Pro in both languages. The linked Help Center article supports that clarification. The case's official starter prompt and its Thai translation are unchanged. [Finances in ChatGPT](https://help.openai.com/en/articles/20001222-finances-in-chatgpt)

For the linked-reference review, 96 public documentation URLs returned content, two optional links returned 404, two more led to event or intake forms, and one led to private Platform settings. None of those five is a canonical source link in the deck.

## Thai-only corrections

| Existing case | Meaning restored |
| --- | --- |
| `getting-started-with-daybreak-blue` | Check both group membership and grants from other roles after saving. |
| `datasets-and-reports` | The input consists of individual property-sale transactions and highway distances. |
| `build-unit-plan-from-sources` | Identify likely student misconceptions when planning the unit. |
| `variance-driver-bridge` | Reconcile differences between data sources and check sign conventions. |
| `build-personal-onboarding-plan` | Keep invented tasks, people and policies out of the plan. Verify that private progress survives a return visit. |
| `collect-and-schedule-team-requests` | Verify that previously saved feedback persists after reload. |
| `track-course-engagement` | Keep outreach to learners under instructor control. |
| `incident-to-tested-fix` | The owner must approve rollout and rollback criteria. |
| `project-teammate` | Include the next action in the project brief. |

## Validation

- The source snapshot, TH/EN records, generated deck and 119 WebP illustrations align. All cases have four steps and a Human checkpoint in each language.
- Compared all 110 official starter prompts and nine reviewed English fallbacks with Thai. Checked 363 literal occurrences for references, placeholders and backticked text, plus 33 occurrences of filenames, flags and environment variables. Both languages retain 428 paragraphs and 571 list entries.
- `npm run data:build`, `npm test` (production build and 3/3 tests), `npx --no-install tsc --noEmit`, `node --check script.js` and `git diff --check` passed.
- Playwright and Chrome checked the cover and all 16 changed use cases in TH and EN at 1440 × 900 and 390 × 844. All 68 slide states, 64 exact prompt drawers and 32 mobile scroll ends passed after correcting desktop checkpoint clipping. Direct hashes, keyboard navigation, language switching, contents search, images and console checks also passed.
- A second desktop check covered all 119 cases in both languages at 1440 × 900 and 21 representative cases at 1280 × 850, 1024 × 768 and 1440 × 1000. All 364 states passed the content, image and checkpoint bounds checks.

## Screenshot evidence

| View | Thai | English |
| --- | --- | --- |
| GitHub Actions on desktop | [TH](th-desktop-create-custom-review-workflows-with-github-actions.png) | [EN](en-desktop-create-custom-review-workflows-with-github-actions.png) |
| GitHub Actions at the mobile scroll end | [TH](th-mobile-create-custom-review-workflows-with-github-actions-end.png) | [EN](en-mobile-create-custom-review-workflows-with-github-actions-end.png) |
| Finances eligibility on desktop | [TH](th-desktop-track-bills-subscriptions-and-spending.png) | [EN](en-desktop-track-bills-subscriptions-and-spending.png) |
| Desktop security review prompt on mobile | [TH](th-mobile-review-code-changes-in-codex-desktop-prompt.png) | [EN](en-mobile-review-code-changes-in-codex-desktop-prompt.png) |
