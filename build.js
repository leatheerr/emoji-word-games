// Collects every data/*.js part into words.js and checks each category.
// Run: node build.js
const fs = require("fs");
const path = require("path");

const EXPECTED = {
  2: [6, 7, 8, 9], 3: [13, 14, 15],
  4: [23, 24, 29, 30, 31, 35, 37, 38, 39, 40, 44, 45],
  5: [25, 26, 27, 28, 36],
  1: [1, 2, 3, 4, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 95],
  6: [46, 47, 48, 49, 50, 51],
  7: [67, 68, 69, 70, 71, 72, 73, 74, 75],
  8: [77, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91], // 76 "All Movies" is built from these in the app
  9: [92, 93, 94],
};
const TARGET = 70;

const WORDS = {};
const problems = [];

function W(id, label, text) {
  if (WORDS[id]) problems.push(`category ${id} (${label}) is defined twice`);
  const items = [];
  const seen = new Set();
  text.split("\n").map((s) => s.trim()).filter(Boolean).forEach((line) => {
    const sp = line.indexOf(" ");
    if (sp < 1) return problems.push(`${id} ${label}: no emoji/text split in "${line}"`);
    const emoji = line.slice(0, sp);
    const words = line.slice(sp + 1).trim();
    if (/[A-Za-z]/.test(emoji)) problems.push(`${id} ${label}: emoji has letters in "${line}"`);
    if (/[\u{1F1E6}-\u{1F1FF}]/u.test(emoji)) problems.push(`${id} ${label}: flag emoji (shows as letters on Windows) in "${line}"`);
    const key = words.toLowerCase();
    if (seen.has(key)) problems.push(`${id} ${label}: duplicate "${words}"`);
    seen.add(key);
    items.push([emoji, words]);
  });
  WORDS[id] = items;
  const flag = items.length === TARGET ? "" : `   <-- ${items.length - TARGET > 0 ? "+" : ""}${items.length - TARGET}`;
  console.log(`${String(id).padStart(3)}  ${label.padEnd(44)} ${String(items.length).padStart(3)}${flag}`);
}

const dir = path.join(__dirname, "data");
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".js")).sort()) {
  new Function("W", fs.readFileSync(path.join(dir, f), "utf8"))(W);
}

const missing = Object.values(EXPECTED).flat().filter((id) => !WORDS[id]);
if (missing.length) problems.push(`missing categories: ${missing.join(", ")}`);
const offTarget = Object.entries(WORDS).filter(([, v]) => v.length !== TARGET).map(([k]) => k);
if (offTarget.length) problems.push(`categories not at ${TARGET}: ${offTarget.join(", ")}`);

fs.writeFileSync(path.join(__dirname, "words.js"), "window.WORDS=" + JSON.stringify(WORDS) + ";\n");
const total = Object.values(WORDS).reduce((n, v) => n + v.length, 0);
console.log(`\n${Object.keys(WORDS).length} categories, ${total} items written to words.js`);
console.log(problems.length ? "\nPROBLEMS:\n- " + problems.join("\n- ") : "\nNo problems.");
