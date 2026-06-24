export function Partners() {
  return (
    <section className="reveal" style={{ background: "var(--green-800)", padding: "60px 0" }}>
      <div className="wrap">
        <div
          style={{
            textAlign: "center",
            fontSize: "11px",
            letterSpacing: ".2em",
            textTransform: "uppercase",
            color: "var(--sage)",
            fontWeight: 700,
            marginBottom: "26px",
          }}
        >
          Our trusted partners
        </div>
        <div className="partner-logos">
          <div className="plogo2">
            <img src="/lp-assets/logo-cult.png" alt="Cult" style={{ height: "28px", width: "auto", objectFit: "contain" }} />
            <div>
              <span className="sub">For Cult Pass Home</span>
            </div>
          </div>

          <div className="plogo2">
            <img src="/lp-assets/logo-redcliffe.png" alt="Redcliffe Labs" style={{ height: "28px", width: "auto", objectFit: "contain" }} />
            <div>
              <span className="sub">For Blood Tests</span>
            </div>
          </div>

          <div className="plogo2">
            <img src="/lp-assets/logo-mrmed.jpg" alt="Mr.Med" style={{ height: "28px", width: "auto", objectFit: "contain" }} />
            <div>
              <span className="sub">For Medicine Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
