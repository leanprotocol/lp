/**
 * The trusted-partners strip, homepage edition.
 *
 * Styled in the voice of the section directly above it (doctor-testimonial):
 * extrabold lp-dark heading with the serif-italic lp-green accent word, and
 * sub-labels in the same 12.5px semibold green the experts' specialty lines
 * use. components/challenge/Partners.tsx carries the same three partners but
 * is welded to the challenge stylesheet, so it cannot travel; the logos come
 * from the same /lp-assets files either way.
 */
const PARTNERS = [
  { src: "/lp-assets/logo-cult.png", alt: "Cult", sub: "For Cult Pass Home" },
  { src: "/lp-assets/logo-redcliffe.png", alt: "Redcliffe Labs", sub: "For Blood Tests" },
  { src: "/lp-assets/logo-mrmed.jpg", alt: "Mr.Med", sub: "For Medicine Delivery" },
];

export function TrustedPartners() {
  return (
    <section className="bg-lp-bg pb-[110px] pt-2">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="m-0 mb-12 text-center text-3xl font-extrabold text-lp-dark sm:text-4xl">
          Our trusted{" "}
          <span className="font-serif italic tracking-normal text-lp-green">partners</span>
        </h2>
        <div className="flex flex-wrap items-start justify-center gap-x-20 gap-y-10">
          {PARTNERS.map((p) => (
            <div key={p.alt} className="flex flex-col items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                alt={p.alt}
                className="h-12 w-auto object-contain"
                loading="lazy"
              />
              <span className="text-[12.5px] font-semibold text-lp-green">{p.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
