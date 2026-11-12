// Makes logins for the marketing team dashboard (/team-leads).
//
//   node scripts/team-logins.mjs rahul            (one person)
//   node scripts/team-logins.mjs rahul priya      (several)
//
// For each name it prints a new random password and one Vercel variable,
// TEAM_DASHBOARD_USER_<NAME>. Only the variable goes into Vercel (type Secret,
// Production). The password is not saved anywhere, so give it to that person
// privately before closing the window.
//
//   Add someone:       add their variable.
//   Reset a password:  run it for them again and replace their variable's value.
//   Remove someone:    set their variable's value to  off
// Then redeploy: git commit --allow-empty --only -m "Load team logins"; git push

import crypto from "node:crypto";

// Same rule as loginName() in lib/team-dashboard.ts.
const loginName = (s) => s.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").slice(0, 32);
const varName = (name) => "TEAM_DASHBOARD_USER_" + name.toUpperCase().replace(/-/g, "_");

// No 0/o, 1/l/i, so passwords can be read out or typed from a phone.
const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";
function newPassword() {
  const groups = [];
  for (let g = 0; g < 3; g++) {
    let s = "";
    for (let i = 0; i < 4; i++) s += ALPHABET[crypto.randomInt(ALPHABET.length)];
    groups.push(s);
  }
  return groups.join("-");
}

const names = process.argv.slice(2).map(loginName).filter(Boolean);
if (!names.length) {
  console.log("Usage: node scripts/team-logins.mjs <name> [<name> ...]");
  process.exit(1);
}
const dupes = names.filter((n, i) => names.indexOf(n) !== i);
if (dupes.length) {
  console.log("Each name can only appear once: " + [...new Set(dupes)].join(", "));
  process.exit(1);
}

const rows = names.map((name) => {
  const password = newPassword();
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, Buffer.from(salt, "hex"), 32).toString("hex");
  return { name, password, key: varName(name), value: `${salt}:${hash}` };
});

console.log("");
console.log("Logins - send each person only their own line, privately:");
console.log("");
for (const r of rows) console.log("  name: " + r.name.padEnd(16) + "  password: " + r.password);
console.log("");
console.log("Vercel > Settings > Environment Variables > Add. Type: Secret. Environment: Production.");
for (const r of rows) {
  console.log("");
  console.log("  Key:   " + r.key);
  console.log("  Value: " + r.value);
}
console.log("");
