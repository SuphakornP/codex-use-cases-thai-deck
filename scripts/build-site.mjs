import { cp, mkdir, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const client = resolve(root, "dist/client");
const server = resolve(root, "dist/server");

await rm(resolve(root, "dist"), { recursive: true, force: true });
await mkdir(client, { recursive: true });
await mkdir(server, { recursive: true });

await Promise.all([
  cp(resolve(root, "index.html"), resolve(client, "index.html")),
  cp(resolve(root, "styles.css"), resolve(client, "styles.css")),
  cp(resolve(root, "script.js"), resolve(client, "script.js")),
  cp(resolve(root, "favicon.svg"), resolve(client, "favicon.svg")),
  cp(resolve(root, "assets"), resolve(client, "assets"), { recursive: true }),
  cp(resolve(root, "data/usecases-data.js"), resolve(client, "data/usecases-data.js"), {
    recursive: true,
  }),
  cp(resolve(root, "worker/index.js"), resolve(server, "index.js")),
]);

console.log("Sites build ready in dist/");
