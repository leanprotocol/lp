// scripts/cutout-logos.mjs
// Turns the PSP company logos into clean cutouts for the /psp/<company> pages:
//   - a white or near-white background becomes transparent (soft edge, no halo)
//   - empty margins are trimmed, so every logo fills its slot evenly
// Originals are copied to Downloads\psp-logo-originals first (outside the repo).
//
// Run from the lp folder:  node scripts/cutout-logos.mjs
// Uses sharp, which Next.js installs. Pure ASCII file.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";

let sharp;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.log("sharp is not installed. Run:  pnpm add -D sharp   then run this again.");
  process.exit(1);
}

const dir = path.join(process.cwd(), "public", "psp", "logos");
const backup = path.join(os.homedir(), "Downloads", "psp-logo-originals");
fs.mkdirSync(backup, { recursive: true });

const files = fs.readdirSync(dir).filter((f) => /\.png$/i.test(f));
if (!files.length) {
  console.log("No PNG logos in public/psp/logos");
  process.exit(0);
}

for (const name of files) {
  const file = path.join(dir, name);
  const keep = path.join(backup, name);
  if (!fs.existsSync(keep)) fs.copyFileSync(file, keep); // never overwrite the first original
  const input = fs.readFileSync(keep);

  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const px = (x, y) => (y * width + x) * 4;

  // Look at the four corners to decide what the background is.
  const corners = [px(0, 0), px(width - 1, 0), px(0, height - 1), px(width - 1, height - 1)];
  const transparent = corners.every((i) => data[i + 3] < 20);
  const whiteish = corners.every((i) => data[i + 3] > 200 && data[i] > 225 && data[i + 1] > 225 && data[i + 2] > 225);

  let note;
  if (transparent) {
    note = "already transparent, trimmed";
  } else if (whiteish) {
    // Near-white to transparent, with a soft ramp between 215 and 245 so
    // anti-aliased edges fade instead of leaving a white halo.
    for (let i = 0; i < data.length; i += 4) {
      const m = Math.min(data[i], data[i + 1], data[i + 2]);
      if (m >= 245) data[i + 3] = 0;
      else if (m > 215) data[i + 3] = Math.round(data[i + 3] * ((245 - m) / 30));
    }
    note = "white background removed, trimmed";
  } else {
    const c = corners[0];
    note = `coloured background rgb(${data[c]},${data[c + 1]},${data[c + 2]}) kept as is - send this one to Claude`;
  }

  // Trim only once the background is transparent; a coloured box is kept whole.
  let img = sharp(data, { raw: { width, height, channels: 4 } });
  if (transparent || whiteish) img = img.trim({ threshold: 1 });
  const out = await img.png({ compressionLevel: 9 }).toBuffer({ resolveWithObject: true });
  fs.writeFileSync(file, out.data);
  console.log(`${name.padEnd(16)} ${String(out.info.width).padStart(5)} x ${String(out.info.height).padEnd(5)} ${note}`);
}
console.log(`\nOriginals kept in ${backup}`);