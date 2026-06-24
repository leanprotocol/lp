export function ChallengeFooter() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div style={{ maxWidth: "300px" }}>
            <div className="logo" style={{ marginBottom: "14px" }}>
              <div className="mark">LP</div>
              <div className="name">
                LEAN <b>PROTOCOL</b>
                <span>DOCTOR-LED · SCIENCE-BACKED</span>
              </div>
            </div>
            <p style={{ fontSize: "13px", color: "var(--sage)" }}>
              Modern, doctor-led weight-loss care — prescribed online and delivered to your door.
            </p>
          </div>

          <div className="foot-col">
            <h5>Medications</h5>
            <a href="https://www.leanprotocol.in/medications/ozempic">Ozempic</a>
            <a href="https://www.leanprotocol.in/medications/wegovy">Wegovy</a>
            <a href="https://www.leanprotocol.in/medications/mounjaro">Mounjaro</a>
            <a href="https://www.leanprotocol.in/medications/rybelsus">Rybelsus</a>
          </div>

          <div className="foot-col">
            <h5>Tools</h5>
            <a href="https://www.leanprotocol.in/bmi-calculator">BMI Calculator</a>
            <a href="https://www.leanprotocol.in/bmr-calculator">BMR Calculator</a>
            <a href="https://www.leanprotocol.in/blog">Knowledge Hub</a>
          </div>

          <div className="foot-col">
            <h5>Contact</h5>
            <a href="mailto:support@leanprotocol.in">support@leanprotocol.in</a>
            <a href="https://wa.link/3s1upf">WhatsApp our experts</a>
            <a href="https://www.instagram.com/leanprotocol.og">Instagram</a>
          </div>
        </div>

        <p className="legal">
          Lean Protocol is not affiliated with or endorsed by Novo Nordisk A/S (Wegovy®, Ozempic®, Saxenda®,
          Rybelsus®, Victoza®) or Eli Lilly &amp; Co. (Trulicity®, Zepbound®, Mounjaro®). GLP-1 medications are
          prescription-only and dispensed solely when a licensed physician determines they are clinically
          appropriate; they are not suitable for everyone and may carry side effects. Information here is for
          general awareness and is not medical advice. Weight-loss results vary and are not guaranteed.
          Testimonials reflect individual experiences shared with consent. Always consult a qualified healthcare
          provider before starting any treatment. © {new Date().getFullYear()} Lean Protocol Pvt Ltd.
        </p>
      </div>
    </footer>
  );
}
