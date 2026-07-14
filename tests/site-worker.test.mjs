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

test("generated deck data contains 99 complete bilingual use cases", async () => {
  const source = await readFile(new URL("../data/usecases-data.js", import.meta.url), "utf8");
  const context = { window: {} };
  vm.runInNewContext(source, context);
  const items = context.window.USE_CASES;

  assert.equal(items.length, 99);
  assert.deepEqual(
    Array.from(items, (item) => item.index),
    Array.from({ length: 99 }, (_, index) => index),
  );

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
  }
});
