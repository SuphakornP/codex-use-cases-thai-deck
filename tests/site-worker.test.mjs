import assert from "node:assert/strict";
import test from "node:test";

import worker from "../worker/index.js";

function environment() {
  return {
    ASSETS: {
      async fetch(request) {
        const path = new URL(request.url).pathname;
        if (path === "/index.html") {
          return new Response("<!doctype html><title>Codex Use Cases</title>", {
            headers: { "content-type": "text/html; charset=utf-8" },
          });
        }
        if (path === "/styles.css") {
          return new Response("body{}", {
            headers: { "content-type": "text/css" },
          });
        }
        return new Response("Not found", { status: 404 });
      },
    },
  };
}

test("serves static assets", async () => {
  const response = await worker.fetch(
    new Request("https://example.com/styles.css"),
    environment(),
  );
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /^text\/css/);
});

test("falls back to the deck for page routes", async () => {
  const response = await worker.fetch(
    new Request("https://example.com/automation-bug-triage", {
      headers: { accept: "text/html" },
    }),
    environment(),
  );
  assert.equal(response.status, 200);
  assert.match(await response.text(), /Codex Use Cases/);
});

test("preserves missing asset responses", async () => {
  const response = await worker.fetch(
    new Request("https://example.com/missing.webp"),
    environment(),
  );
  assert.equal(response.status, 404);
});
