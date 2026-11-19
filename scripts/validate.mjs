import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

const html = readFileSync("index.html", "utf8");
const ids = [...html.matchAll(/\\sid=["']([^"']+)["']/g)].map((match) => match[1]);
const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
const references = [...html.matchAll(/(?:src|href)=["']([^"'#]+)["']/g)].map((match) => match[1]);
const localReferences = references.filter((reference) => !/^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(reference));

if (duplicates.length) {
  throw new Error("Duplicate HTML IDs: " + [...new Set(duplicates)].join(", "));
}

const missing = localReferences.filter((reference) => !existsSync(reference));
if (missing.length) {
  throw new Error("Missing local assets: " + [...new Set(missing)].join(", "));
}

const syntaxCheck = spawnSync(process.execPath, ["--check", "assets/js/technology-stack.js"], { encoding: "utf8" });
if (syntaxCheck.status !== 0) {
  throw new Error(syntaxCheck.stderr || "JavaScript syntax validation failed.");
}

if (!html.includes('id="stackExplorer"')) {
  throw new Error("Technology explorer markup is missing.");
}

console.log("Portfolio validation passed.");
