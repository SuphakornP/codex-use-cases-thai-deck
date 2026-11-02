import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the complete bilingual presentation shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="th"/i);
  assert.match(html, /id="deck-shell"/i);
  assert.match(html, /Codex Field Guide/i);
  assert.match(html, /เลือก use case ที่ใช่/);
  assert.match(html, /id="language-switch"/i);
  assert.match(html, /data-language="th"[^>]+aria-pressed="true"/i);
  assert.match(html, /data-language="en"[^>]+aria-pressed="false"/i);
  assert.doesNotMatch(html, /codex-preview/i);
});

test("generated deck data contains 119 complete bilingual use cases", async () => {
  const source = await readFile(new URL("../data/usecases-data.js", import.meta.url), "utf8");
  const context = { window: {} };
  vm.runInNewContext(source, context);
  const items = context.window.USE_CASES;

  assert.equal(items.length, 119);
  assert.deepEqual(
    Array.from(items, (item) => item.index),
    Array.from({ length: 119 }, (_, index) => index),
  );
  const slugs = new Set(items.map((item) => item.slug));
  for (const slug of [
    "find-vulnerabilities-in-your-code",
    "fix-a-finding-from-your-security-scan",
    "scan-multiple-repositories",
    "automate-security-scans-in-ci",
    "getting-started-with-daybreak-blue",
    "incident-to-tested-fix",
    "migrate-a-validation-module",
    "build-workshop-practice-site",
    "build-personal-onboarding-plan",
    "collect-and-schedule-team-requests",
    "compare-campaign-performance",
    "issue-to-tested-pr",
    "automate-security-reviews-in-github-cloud",
    "manage-supply-chain-risk-in-cicd",
    "review-code-changes-in-codex-desktop",
    "set-up-security-context",
    "create-custom-review-workflows-with-github-actions",
    "run-security-reviews-from-the-cli",
  ]) {
    assert.ok(slugs.has(slug), `${slug}: new official use case must be present`);
  }
  assert.equal(slugs.has("make-granular-ui-changes"), false);

  for (const item of items) {
    for (const key of [
      "slug",
      "titleTh",
      "titleEn",
      "summaryTh",
      "summaryEn",
      "categoryId",
      "categoryTh",
      "categoryEn",
      "promptTh",
      "promptEn",
      "checkTh",
      "checkEn",
    ]) {
      assert.equal(typeof item[key], "string", `${item.slug}: ${key} must be a string`);
      assert.ok(item[key].trim(), `${item.slug}: ${key} must not be empty`);
    }
    for (const workflowKey of ["workflowTh", "workflowEn"]) {
      assert.equal(item[workflowKey].length, 4, `${item.slug}: ${workflowKey} must have four steps`);
      for (const step of item[workflowKey]) {
        assert.ok(step.label.trim(), `${item.slug}: ${workflowKey} label must not be empty`);
        assert.ok(step.detail.trim(), `${item.slug}: ${workflowKey} detail must not be empty`);
      }
    }
    const promptTokens = item.promptEn.match(/(?<!\w)[$@][A-Za-z][\w:-]*|\[[^\]\n]+\]/g) ?? [];
    for (const token of new Set(promptTokens)) {
      assert.ok(
        item.promptTh.includes(token),
        `${item.slug}: Thai starter prompt must retain reference token ${token}`,
      );
    }
    assert.ok(["official", "editorial"].includes(item.promptSource), `${item.slug}: prompt source must be identified`);
  }
  assert.deepEqual(
    Array.from(items.filter((item) => item.promptSource === "editorial"), (item) => item.slug),
    [
      "getting-started-with-daybreak-blue",
      "automate-security-reviews-in-github-cloud",
      "manage-supply-chain-risk-in-cicd",
      "set-up-security-context",
      "fix-a-finding-from-your-security-scan",
      "scan-multiple-repositories",
      "create-custom-review-workflows-with-github-actions",
      "run-security-reviews-from-the-cli",
      "automate-security-scans-in-ci",
    ],
  );
});

test("source inventory preserves official prose and code examples with or without section headings", async () => {
  const raw = await readFile(new URL("../data/source-usecases.json", import.meta.url), "utf8");
  const records = new Map(JSON.parse(raw).useCases.map((item) => [item.slug, item]));
  const desktop = records.get("review-code-changes-in-codex-desktop");
  assert.ok(desktop.workflow.some((part) => part.paragraphs.length > 0));
  for (const [slug, example] of [
    ["create-custom-review-workflows-with-github-actions", "workflow_dispatch:"],
    ["run-security-reviews-from-the-cli", "--working-tree"],
  ]) {
    const blocks = records.get(slug).workflow.flatMap((part) => part.codeBlocks ?? []);
    assert.ok(blocks.some((block) => block.includes(example)), `${slug}: missing official code example`);
  }
});
