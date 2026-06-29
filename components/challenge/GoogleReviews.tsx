const REVIEW_IMAGES = [
  "/challenge/reviews/review-1-saurav-jha.png",
  "/challenge/reviews/review-2-saniya-tiwari.png",
  "/challenge/reviews/review-3-paddhati-jha.png",
  "/challenge/reviews/review-4-atharva.png",
  "/challenge/reviews/review-5-shrestha-gupta.png",
  "/challenge/reviews/review-6-shashi-bala.png",
  "/challenge/reviews/review-7-reema-tikadar.png",
];

export function GoogleReviews() {
  return (
    <section className="reveal" id="reviews">
      <div className="wrap">
        <div className="sec-head">
          <div className="divider"></div>
          <h2>Loved on Google</h2>
          <p>Real ratings from people on their Lean Protocol journey.</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginBottom: "34px", flexWrap: "wrap" }}>
          <svg width="44" height="44" viewBox="0 0 24 24" aria-label="Google">
            <path d="M22.5 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2.1-2 3.2-4.9 3.2-7.9z" fill="#4285F4" />
            <path d="M12 23c2.9 0 5.4-1 7.2-2.6l-3.6-2.7c-1 .7-2.3 1-3.6 1-2.8 0-5.1-1.9-6-4.4H2.3v2.8A11 11 0 0 0 12 23z" fill="#34A853" />
            <path d="M6 14.3a6.6 6.6 0 0 1 0-4.2V7.3H2.3a11 11 0 0 0 0 9.8L6 14.3z" fill="#FBBC05" />
            <path d="M12 5.4c1.6 0 3 .5 4.1 1.6l3.1-3.1A11 11 0 0 0 12 1 11 11 0 0 0 2.3 7.3L6 10.1c.9-2.5 3.2-4.4 6-4.4z" fill="#EA4335" />
          </svg>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontFamily: "var(--display)", fontSize: "40px", color: "var(--gold)", lineHeight: 1 }}>
              4.8 <span style={{ color: "#FBBC05", fontSize: "24px" }}>★★★★★</span>
            </div>
          </div>
        </div>

        <div className="reviews-grid">
          {REVIEW_IMAGES.map((src, i) => (
            <div className="greview-ss" key={i}>
              <img src={src} alt={`Google review ${i + 1}`} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
