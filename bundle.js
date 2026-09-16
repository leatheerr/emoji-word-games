// Builds standalone.html: the app with words.js inlined, so it works as a single file
// (for embedding in Notion, emailing, or opening offline). Run: node bundle.js
const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
const words = fs.readFileSync(path.join(__dirname, "words.js"), "utf8");
const tag = '<script src="words.js"></script>';

if (!html.includes(tag)) {
  console.error("Could not find the words.js script tag in index.html - nothing written.");
  process.exit(1);
}

const out = html.replace(tag, "<script>\n" + words + "</script>");
if (out.includes('src="words.js"')) {
  console.error("words.js is still referenced externally - nothing written.");
  process.exit(1);
}

const target = path.join(__dirname, "standalone.html");
fs.writeFileSync(target, out);
console.log(`standalone.html written: ${(out.length / 1024).toFixed(0)} KB`);
