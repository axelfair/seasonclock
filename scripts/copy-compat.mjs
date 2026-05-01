import { copyFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const source = resolve("dist/season-clock-card.js");
const targets = [
  resolve("dist/seasonclock.js"),
  resolve("season-clock-card.js"),
  resolve("seasonclock.js")
];

for (const target of targets) {
  await mkdir(dirname(target), { recursive: true });
  await copyFile(source, target);
}
