import { $ } from "bun";
import path from "node:path";
import fs from "node:fs/promises";

import { name } from "../package.json";

const root = path.join(__dirname, "..");
const distPath = path.join(root, "dist");

async function build() {
  console.log(`Building ${name}...`);
  await fs.rm(distPath, {
    recursive: true,
    force: true,
  });

  await $`tsc --project tsconfig.build.json --outdir ./dist && tsc-esm-fix --tsconfig tsconfig.build.json`;
}

await build();
