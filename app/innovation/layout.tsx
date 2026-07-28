import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { company, seo } from "@/content/innovation";
import { innovationAssets } from "@/content/innovation-assets";
import "./innovation.css";

/** Only reference the social image if the file is actually present.
 *  Never fall back to a remote image. */
function localSocialImage() {
  try {
    const rel = innovationAssets.socialPreview.src.replace(/^\//, "");
    const abs = path.join(process.cwd(), "public", rel);
    if (fs.existsSync(abs)) {
      return [
        {
          url: innovationAssets.socialPreview.src,
          width: innovationAssets.socialPreview.width,
          height: innovationAssets.socialPreview.height,
          alt: seo.title,
        },
      ];
    }
  } catch {
    // Filesystem not available - fall through to no image.
  }
  return undefined;
}

const images = localSocialImage();

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  alternates: { canonical: company.canonical },
  openGraph: {
    type: "website",
    url: company.canonical,
    siteName: company.legalName,
    title: seo.title,
    description: seo.description,
    locale: "en_IN",
    ...(images ? { images } : {}),
  },
  twitter: {
    card: images ? "summary_large_image" : "summary",
    title: seo.title,
    description: seo.description,
    ...(images ? { images: images.map((i) => i.url) } : {}),
  },
  robots: { index: true, follow: true },
};

export default function InnovationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="innovation-page">{children}</div>;
}
