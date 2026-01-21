import { createClient } from "@sanity/client";

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const raw = fs.readFileSync(filePath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

const projectRoot = path.resolve(__dirname, "..");
loadEnvFile(path.join(projectRoot, ".env.local"));
loadEnvFile(path.join(projectRoot, ".env"));

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "cahjcz74";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-12-18";
const token = process.env.SANITY_API_TOKEN;

if (!projectId)
  throw new Error(
    "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID"
  );
if (!dataset)
  throw new Error("Missing environment variable: NEXT_PUBLIC_SANITY_DATASET");
if (!token) throw new Error("Missing environment variable: SANITY_API_TOKEN");

console.log("Seeding Sanity", { projectId, dataset, apiVersion });

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

function escapeXml(input) {
  return String(input)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function initials(name) {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0]?.[0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] || "" : "";
  return (first + last).toUpperCase();
}

function svgAvatar({ label, bg = "#0EA5E9" }) {
  const text = escapeXml(label);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${bg}" stop-opacity="1" />
      <stop offset="1" stop-color="#111827" stop-opacity="1" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="96" fill="url(#g)" />
  <text x="256" y="290" text-anchor="middle" font-family="ui-sans-serif, system-ui" font-size="176" font-weight="800" fill="#FFFFFF">${text}</text>
</svg>`;
}

function svgCover({ title, subtitle }) {
  const safeTitle = escapeXml(title);
  const safeSubtitle = escapeXml(subtitle);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#F6F1EE" />
      <stop offset="0.6" stop-color="#FFFFFF" />
      <stop offset="1" stop-color="#E0F2FE" />
    </linearGradient>
  </defs>
  <rect width="1600" height="900" rx="64" fill="url(#bg)" />
  <rect x="90" y="90" width="1420" height="720" rx="48" fill="#111827" fill-opacity="0.05" />
  <text x="140" y="360" font-family="ui-serif, Georgia" font-size="84" font-weight="700" fill="#111827">${safeTitle}</text>
  <text x="140" y="460" font-family="ui-sans-serif, system-ui" font-size="42" font-weight="600" fill="#334155">${safeSubtitle}</text>
  <text x="140" y="740" font-family="ui-sans-serif, system-ui" font-size="28" fill="#475569">JoinFound • Blog</text>
</svg>`;
}

async function getOrCreateImageAsset({ filename, svg }) {
  const existing = await client.fetch(
    '*[_type == "sanity.imageAsset" && originalFilename == $filename][0]{_id}',
    { filename }
  );
  if (existing?._id) return existing._id;

  const uploaded = await client.assets.upload(
    "image",
    Buffer.from(svg, "utf8"),
    {
      filename,
      contentType: "image/svg+xml",
    }
  );
  return uploaded._id;
}

const categories = [
  {
    title: "Weight Loss Basics",
    description:
      "Core concepts and habits that support sustainable weight loss.",
  },
  {
    title: "GLP-1 Microdose",
    description:
      "Guidance on starting and sustaining GLP-1 microdosing safely.",
  },
  {
    title: "Nutrition",
    description: "Simple nutrition strategies that fit your routine.",
  },
  {
    title: "Fitness",
    description: "Movement and training tips that complement your plan.",
  },
  {
    title: "Sleep & Recovery",
    description: "Improve recovery and consistency with better sleep.",
  },
  {
    title: "Mindset",
    description: "Behavior change, motivation, and staying on track.",
  },
  {
    title: "Insurance & Coverage",
    description: "Understanding benefits, prior auth, and coverage basics.",
  },
  {
    title: "Medication 101",
    description: "How weight loss medications work and what to expect.",
  },
  {
    title: "Success Stories",
    description: "Realistic progress narratives and takeaways.",
  },
  {
    title: "Recipes",
    description: "High-protein, easy recipes designed for busy weeks.",
  },
];

const authors = [
  {
    name: "Dr. Aisha Khan",
    bio: "Board-certified physician focused on evidence-based obesity care.",
  },
  {
    name: "Jordan Patel, RD",
    bio: "Registered Dietitian helping members build sustainable nutrition habits.",
  },
];

function slugify(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function block(text, style = "normal") {
  const key = Math.random().toString(36).slice(2);
  return {
    _type: "block",
    _key: key,
    style,
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: `${key}-span`,
        text,
        marks: [],
      },
    ],
  };
}

function randomInt(max) {
  return Math.floor(Math.random() * max);
}

function sampleOne(items) {
  return items[randomInt(items.length)];
}

function sampleUnique(items, count) {
  const picked = new Set();
  while (picked.size < Math.min(count, items.length)) {
    picked.add(sampleOne(items));
  }
  return Array.from(picked);
}

async function run() {
  const categoryDocs = categories.map((c) => {
    const slug = slugify(c.title);
    return {
      _id: `category.${slug}`,
      _type: "category",
      title: c.title,
      slug: { _type: "slug", current: slug },
      description: c.description,
    };
  });

  const authorDocs = [];
  for (const a of authors) {
    const slug = slugify(a.name);
    const avatarFilename = `author-${slug}.svg`;
    const assetId = await getOrCreateImageAsset({
      filename: avatarFilename,
      svg: svgAvatar({ label: initials(a.name) }),
    });

    authorDocs.push({
      _id: `author.${slug}`,
      _type: "author",
      name: a.name,
      slug: { _type: "slug", current: slug },
      image: { _type: "image", asset: { _type: "reference", _ref: assetId } },
      bio: [block(a.bio)],
    });
  }

  const postDocs = [];
  const postCount = 100;
  for (let i = 0; i < postCount; i++) {
    const primaryCategory = sampleOne(categoryDocs);
    const author = sampleOne(authorDocs);
    const categoryCount = Math.random() < 0.65 ? 1 : 2;
    const pickedCategories = sampleUnique(categoryDocs, categoryCount);

    const title = `${primaryCategory.title}: A practical guide (Part ${i + 1})`;
    const slug = slugify(title);
    const coverFilename = `post-${slug}.svg`;
    const coverAssetId = await getOrCreateImageAsset({
      filename: coverFilename,
      svg: svgCover({
        title: primaryCategory.title,
        subtitle: `A practical guide • Part ${i + 1}`,
      }),
    });

    postDocs.push({
      _id: `post.${slug}`,
      _type: "post",
      title,
      slug: { _type: "slug", current: slug },
      author: { _type: "reference", _ref: author._id },
      mainImage: {
        _type: "image",
        asset: { _type: "reference", _ref: coverAssetId },
        alt: `${primaryCategory.title} cover image`,
      },
      categories: pickedCategories.map((c, idx) => ({
        _type: "reference",
        _key: `cat-${i}-${idx}`,
        _ref: c._id,
      })),
      enabled: true,
      isFeatured: i > 0 && i < 9,
      isHero: i === 0,
      publishedAt: new Date(
        Date.now() - randomInt(365) * 24 * 60 * 60 * 1000
      ).toISOString(),
      body: [
        block(
          `In this post, we break down ${primaryCategory.title.toLowerCase()} into simple steps you can apply immediately.`
        ),
        block("What you will learn", "h2"),
        block("1) The core idea in plain language"),
        block("2) A simple checklist you can follow this week"),
        block("3) Common pitfalls and how to avoid them"),
      ],
    });
  }

  const tx = client.transaction();
  for (const doc of [...categoryDocs, ...authorDocs, ...postDocs]) {
    tx.createOrReplace(doc);
  }

  const res = await tx.commit();
  const counts = {
    categories: categoryDocs.length,
    authors: authorDocs.length,
    posts: postDocs.length,
  };
  console.log("Seed complete:", counts);
  console.log("Transaction ID:", res.transactionId);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
