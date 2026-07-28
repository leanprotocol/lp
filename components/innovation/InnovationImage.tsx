"use client";

import Image from "next/image";
import { useState } from "react";
import type { InnovationAsset } from "@/content/innovation-assets";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  placeholderLabel: string;
  priority?: boolean;
  className?: string;
  /** Tailwind classes applied to the <img> itself */
  imgClassName?: string;
  sizes?: string;
};

/**
 * Renders a local image from /public.
 *
 * If the file is missing, the browser image request fails and we swap in a
 * placeholder card of the same aspect ratio, so the page layout is preserved
 * and the asset can be dropped in later without any redesign.
 *
 * This component never fetches remote images and never generates one.
 */
export function InnovationImage({
  src,
  alt,
  width,
  height,
  caption,
  placeholderLabel,
  priority = false,
  className = "",
  imgClassName = "",
  sizes = "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 600px",
}: Props) {
  const [failed, setFailed] = useState(false);
  const ratio = `${width} / ${height}`;

  return (
    <figure className={className}>
      <div
        className="relative w-full overflow-hidden rounded-[14px]"
        style={{ aspectRatio: ratio }}
      >
        {failed ? (
          <div className="inv-placeholder absolute inset-0">
            <span className="inv-placeholder__title">Visual asset pending</span>
            <span className="inv-placeholder__file">Expected file: {src}</span>
            <span className="inv-small">{placeholderLabel}</span>
          </div>
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            loading={priority ? undefined : "lazy"}
            onError={() => setFailed(true)}
            className={`object-contain ${imgClassName}`}
          />
        )}
      </div>
      {caption ? (
        <figcaption className="inv-small mt-3 text-center md:text-left">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

/** Convenience wrapper so callers can pass a manifest entry directly. */
export function InnovationAssetImage({
  asset,
  ...rest
}: { asset: InnovationAsset } & Partial<Props>) {
  return <InnovationImage {...asset} {...rest} />;
}
