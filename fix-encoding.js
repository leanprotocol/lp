/**
 * Repairs UTF-8 text that was saved as CP1252 ("mojibake").
 *
 * This does not use a lookup table of known sequences. It reverses the
 * corruption properly: every character is mapped back to the CP1252 byte
 * it came from, and those bytes are then decoded as UTF-8.
 *
 * Safety: the result is only kept if it decodes cleanly (no U+FFFD) and
 * actually reduces the number of suspect characters. Otherwise the file
 * is left untouched. A .bak copy is written before any change.
 *
 * Run from the project root:   node fix-encoding.js
 */
const fs = require("fs");
const path = require("path");

const FILES = [
  "components/affiliate-lp/hero-section.tsx",
  "app/challenge/page.tsx",
  "app/consult49/page.tsx",
  "app/users/page.tsx",
];

// CP1252 codepoints for bytes 0x80-0x9F, which differ from Latin-1.
const CP1252_HIGH = {
  0x20ac: 0x80, 0x201a: 0x82, 0x0192: 0x83, 0x201e: 0x84, 0x2026: 0x85,
  0x2020: 0x86, 0x2021: 0x87, 0x02c6: 0x88, 0x2030: 0x89, 0x0160: 0x8a,
  0x2039: 0x8b, 0x0152: 0x8c, 0x017d: 0x8e, 0x2018: 0x91, 0x2019: 0x92,
  0x201c: 0x93, 0x201d: 0x94, 0x2022: 0x95, 0x2013: 0x96, 0x2014: 0x97,
  0x02dc: 0x98, 0x2122: 0x99, 0x0161: 0x9a, 0x203a: 0x9b, 0x0153: 0x9c,
  0x017e: 0x9e, 0x0178: 0x9f,
};

const suspect = (s) => (s.match(/[\u00c2-\u00c3\u00e2\u00ef\u00f0]/g) || []).length;

/** Turn mojibake text back into the bytes it was originally. */
function toBytes(text) {
  const out = Buffer.alloc(text.length);
  for (let i = 0; i < text.length; i++) {
    const cp = text.codePointAt(i);
    if (cp <= 0xff) out[i] = cp;
    else if (CP1252_HIGH[cp] !== undefined) out[i] = CP1252_HIGH[cp];
    else return null; // not mojibake - a genuine character, so bail out
  }
  return out;
}

function repair(text) {
  // Work line by line so one genuine unicode line cannot block the whole file.
  return text
    .split("\n")
    .map((line) => {
      if (suspect(line) === 0) return line;
      const bytes = toBytes(line);
      if (!bytes) return line;
      const decoded = bytes.toString("utf8");
      if (decoded.includes("\uFFFD")) return line;      // failed decode
      if (suspect(decoded) >= suspect(line)) return line; // no improvement
      return decoded;
    })
    .join("\n");
}

let any = false;
for (const rel of FILES) {
  const file = path.join(process.cwd(), rel);
  if (!fs.existsSync(file)) { console.log(`skip (not found): ${rel}`); continue; }

  const original = fs.readFileSync(file, "utf8");
  const fixed = repair(original);

  if (fixed === original) { console.log(`no change needed: ${rel}`); continue; }

  fs.writeFileSync(file + ".bak2", original, "utf8");
  fs.writeFileSync(file, fixed, "utf8");
  console.log(`repaired: ${rel}  (suspect ${suspect(original)} -> ${suspect(fixed)})`);
  any = true;
}
console.log(any ? "\nDone. Restart the dev server." : "\nNothing changed.");
