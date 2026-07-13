import { cp, mkdir, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const publicDirectory = resolve(root, "public");

await rm(publicDirectory, { recursive: true, force: true });
await mkdir(resolve(publicDirectory, "data"), { recursive: true });

await Promise.all([
  cp(resolve(root, "assets"), resolve(publicDirectory, "assets"), {
    recursive: true,
  }),
  cp(resolve(root, "data/usecases-data.js"), resolve(publicDirectory, "data/usecases-data.js")),
  cp(resolve(root, "script.js"), resolve(publicDirectory, "script.js")),
  cp(resolve(root, "favicon.svg"), resolve(publicDirectory, "favicon.svg")),
]);

console.log("Prepared presentation assets for Sites");
