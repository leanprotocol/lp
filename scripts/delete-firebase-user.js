#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");
const dotenv = require("dotenv");

const projectRoot = path.resolve(__dirname, "..");
const envFiles = [".env.local", ".env"];
let envLoaded = false;

for (const fileName of envFiles) {
  const fullPath = path.join(projectRoot, fileName);
  if (fs.existsSync(fullPath)) {
    dotenv.config({ path: fullPath });
    envLoaded = true;
  }
}

if (!envLoaded) {
  dotenv.config();
}

const REQUIRED_ENV_VARS = ["FIREBASE_PROJECT_ID", "FIREBASE_CLIENT_EMAIL", "FIREBASE_PRIVATE_KEY"];
//test
function assertEnv() {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
  if (missing.length) {
    console.error(`Missing env vars: ${missing.join(", ")}`);
    process.exit(1);
  }
}

function initFirebaseAdmin() {
  if (admin.apps.length > 0) {
    return;
  }
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    });
  } catch (error) {
    console.error("Failed to initialize Firebase Admin SDK");
    process.exit(1);
  }
}

function normalizePhoneNumber(input) {
  const trimmed = input.trim();
  if (trimmed.startsWith("+")) {
    return trimmed;
  }
  const numeric = trimmed.replace(/[^\d]/g, "");
  if (numeric.length === 10) {
    return `+91${numeric}`;
  }
  if (numeric.length === 0) {
    console.error("Provide digits.");
    process.exit(1);
  }
  return `+${numeric}`;
}

async function deleteFirebaseUser(phoneNumber) {
  const auth = admin.auth();
  const normalized = normalizePhoneNumber(phoneNumber);
  console.log(`Attempting to delete Firebase user: ${normalized}`);
  try {
    const userRecord = await auth.getUserByPhoneNumber(normalized);
    await auth.deleteUser(userRecord.uid);
    console.log("✅ Successfully deleted Firebase user from Auth");
    return { deleted: true };
  } catch (error) {
    if (error?.code === "auth/user-not-found") {
      console.warn("⚠️ No Firebase user found with that phone number. Nothing to delete.");
      return { deleted: false, reason: "not_found" };
    }
    console.error("❌ Failed to delete Firebase user", error);
    process.exit(1);
  }
}

async function main() {
  const phoneArg = process.argv[2];
  if (!phoneArg) {
    console.error("Usage: node scripts/delete-firebase-user.js <phone-number>");
    console.error("Example: node scripts/delete-firebase-user.js +911234567890");
    process.exit(1);
  }

  assertEnv();
  initFirebaseAdmin();
  const result = await deleteFirebaseUser(phoneArg);
  if (result.deleted) {
    console.log("Done");
  }
  process.exit(0);
}

main().catch((err) => {
  console.error("Unexpected error while deleting Firebase user:", err);
  process.exit(1);
});
