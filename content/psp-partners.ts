/* Company video landing pages, served at /psp/<slug>.
   Three sections: headline, company video, then a heading closed with the
   founder's name and role, and a call button. Shared wording lives in PSP_DEFAULTS; a company entry
   only needs to override what differs.
   Template: app/psp/[company]/page.tsx.

   A value still in [SQUARE BRACKETS] is treated as unfinished and hidden,
   so a page can go live before every line is written. The call button stays
   hidden until the founder's number is filled in.

   Logos:   public/psp/logos/<slug>.svg or .png (transparent background, from
            the company's official press kit). Shown as "<logo> x Lean Protocol".
            Without one, the company's name is shown in text instead.
   Videos:  public/psp/videos/<slug>.mp4 (H.264, 720p, faststart, under 40 MB)
   Posters: optional, public/psp/posters/<slug>.webp. Without one the page
            shows the video's opening frame.

   Shared by QR code with one company each: noindex, not in the sitemap.

   Pure ASCII file. */

export type PspPartner = {
  slug: string; // lowercase, hyphens, no dots: "dr-reddys"
  company: string; // as shown: "Dr. Reddy's"
  logo?: string; // "/psp/logos/abbott.svg"
  addressee?: string; // overrides PSP_DEFAULTS.addressee for this company
  headline?: string; // falls back to PSP_DEFAULTS.headline
  video: { src: string; poster?: string };
  content?: {
    heading?: string; // falls back to PSP_DEFAULTS.contentHeading
    /* Optional paragraphs, one string each, shown above the call card. */
    paragraphs?: string[];
  };
};

export const PSP_DEFAULTS = {
  headline: "Patient support that keeps people on therapy",
  contentHeading: "We are the most ROI-driven PSP at the most effective cost",
  /* The founder's personal note, shown in quotes in italic serif between the
     heading and the sign-off. {company} becomes the company's name and
     {addressee} the people it is written to (see addressee below). */
  message:
    "I hope {addressee} found this video helpful and insightful. I would greatly value a 30-minute introductory call with you, or with the colleague who leads patient support programmes at {company}. I look forward to building a fruitful partnership between {company} and Lean Protocol.",
  /* Who the note speaks to. A company entry can name specific people instead,
     e.g. "Dr. Mehta, Ms. Rao and the leadership team at {company}". */
  addressee: "you and the leadership team at {company}",
  signOff: "Warm regards,",
  founder: {
    name: "Abhinav Dobrial",
    role: "Founder, Lean Protocol",
    /* Format: +91XXXXXXXXXX. Shown as a tap-to-call button under the name. */
    phone: "+919871786853",
  },
};

export const PSP_PARTNERS: PspPartner[] = [
  {
    slug: "alkem",
    company: "Alkem",
    logo: "/psp/logos/alkem.png",
    video: { src: "/psp/videos/alkem.mp4" },
  },
  {
    slug: "corona",
    company: "Corona Remedies",
    logo: "/psp/logos/corona.png",
    video: { src: "/psp/videos/corona.mp4" },
  },
  {
    slug: "dr-reddys",
    company: "Dr. Reddy's",
    logo: "/psp/logos/dr-reddys.png",
    video: { src: "/psp/videos/dr-reddys.mp4" },
  },
  {
    slug: "eris",
    company: "Eris Lifesciences",
    logo: "/psp/logos/eris.png",
    video: { src: "/psp/videos/eris.mp4" },
  },
  {
    slug: "hetero",
    company: "Hetero",
    logo: "/psp/logos/hetero.png",
    video: { src: "/psp/videos/hetero.mp4" },
  },
  {
    slug: "natco",
    company: "Natco Pharma",
    logo: "/psp/logos/natco.png",
    video: { src: "/psp/videos/natco.mp4" },
  },
  {
    slug: "sun-pharma",
    company: "Sun Pharma",
    logo: "/psp/logos/sun-pharma.png",
    video: { src: "/psp/videos/sun-pharma.mp4" },
  },
  /* Zydus has two pages, one per video, for two different recipients.
     Set addressee on either to name the person the note speaks to. */
  {
    slug: "zydus-1",
    company: "Zydus",
    logo: "/psp/logos/zydus.png",
    video: { src: "/psp/videos/zydus-1.mp4" },
  },
  {
    slug: "zydus-2",
    company: "Zydus",
    logo: "/psp/logos/zydus.png",
    video: { src: "/psp/videos/zydus-2.mp4" },
  },
];

/* True when a value is written and no longer a [bracketed] placeholder. */
export const isReady = (s?: string): s is string => Boolean(s && s.trim() && !/\[[^\]]*\]/.test(s));

export const findPartner = (slug: string) => PSP_PARTNERS.find((p) => p.slug === slug);