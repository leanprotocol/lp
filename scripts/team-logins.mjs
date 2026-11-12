// Makes individual logins for the marketing team dashboard (/team-leads).
//
//   node scripts/team-logins.mjs priya rahul ankit
//
// For each name it prints a new random password and a TEAM_DASHBOARD_USERS
// entry. Only the entries go into Vercel. The passwords are not saved
// anywhere, so give each person theirs privately before closing the window.
//
//   Add someone:       run it with their name, then add the entry to the end of
//                      TEAM_DASHBOARD_USERS after a comma.
//   Reset a password:  run it with their name and replace their entry.
//   Remove someone:    delete their entry.
// Vercel applies a changed variable on the next deploy (Deployments > Redeploy).

import crypto from "node:crypto";

// Same rule as loginName() in lib/team-dashboard.ts.
const loginName = (s) => s.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").slice(0, 32);

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
  return { name, password, entry: `${name}:${salt}:${hash}` };
});

console.log("");
console.log("Logins - send each person only their own line, privately:");
console.log("");
for (const r of rows) console.log("  name: " + r.name.padEnd(16) + "  password: " + r.password);
console.log("");
console.log("TEAM_DASHBOARD_USERS - paste this into Vercel as one line:");
console.log("");
console.log(rows.map((r) => r.entry).join(","));
console.log("");
