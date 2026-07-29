import type { Metadata } from "next";
import { company, seo } from "@/content/innovation";
import { innovationAssets } from "@/content/innovation-assets";
import "./innovation.css";

/** The social image ships with the repo, so reference it directly.
 *  Never probe the filesystem here: Next cannot trace a process.cwd()
 *  path, so it bundles the whole project into this route's function. */
const SOCIAL_IMAGE_AVAILABLE = true;

const images = SOCIAL_IMAGE_AVAILABLE
  ? [
      {
        url: innovationAssets.socialPreview.src,
        width: innovationAssets.socialPreview.width,
        height: innovationAssets.socialPreview.height,
        alt: seo.title,
      },
    ]
  : undefined;

export const metadata: Metadata = {
  metadataBase: new URL(company.mainSite),
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
