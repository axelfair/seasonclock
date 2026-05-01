import { copyFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const source = resolve("dist/seasonclock.js");
const target = resolve("dist/season-clock-card.js");

await mkdir(dirname(target), { recursive: true });
await copyFile(source, target);
