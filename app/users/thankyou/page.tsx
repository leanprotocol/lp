"use client";

// app/users/thankyou/page.tsx
//
// Served at forms.leanprotocol.in/thankyou through a host rewrite, and at
// /users/thankyou on the main domain.
//
// WHY THIS IS A SEPARATE URL. Meta classifies this domain as a health and
// wellness provider and blocks the Lead standard event. PageView is not
// restricted, so a custom conversion on "URL contains /thankyou" can count
// completed enquiries that the blocked event cannot. That only works if the
// visit is a real page load - see the navigation note in ../page.tsx.
//
// WHY THE NAME IS NOT IN THE URL. It is read from session storage rather than
// a query parameter. Every pixel on this page records the URL, and a name in
// the query string would hand patient data to ad platforms that have just
// classified us as a health advertiser.
//
// Metadata (title, noindex) comes from the /users layout.

import { useEffect, useState } from "react";

const TICK = "\u2713";
const KEY = "lp_thanks";

type Stored = { name?: string; fired?: boolean };

type PixelWindow = {
  oaiq?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
  gtag?: (...args: unknown[]) => void;
};

/** Where the form lives, relative to whichever host served this page. */
function formHome(): string {
  return window.location.pathname.startsWith("/users") ? "/users" : "/";
}

/**
 * Call `fire` once `ready` reports the SDK has loaded, or give up after 6s.
 *
 * The pixels load from the layout with strategy="afterInteractive", which
 * can run AFTER this component's effect. Calling straight away would find
 * the SDK undefined and skip it silently - the optional call hides the miss.
 */
function whenReady(ready: () => boolean, fire: () => void) {
  if (ready()) {
    try { fire(); } catch { /* a blocked pixel must not break the page */ }
    return;
  }
  let tries = 0;
  const id = window.setInterval(() => {
    tries += 1;
    if (ready()) {
      window.clearInterval(id);
      try { fire(); } catch { /* as above */ }
    } else if (tries >= 40) {
      window.clearInterval(id);
    }
  }, 150);
}

export default function ThankYouPage() {
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    let data: Stored | null = null;
    try {
      data = JSON.parse(sessionStorage.getItem(KEY) || "null");
    } catch {
      data = null;
    }

    // Nobody arrives here without submitting. A direct visit or a bookmark
    // goes back to the form, so it cannot pass for a completed enquiry.
    if (!data) {
      window.location.replace(formHome());
      return;
    }

    setName(data.name || "friend");

    // Once per submission. Marked before firing, so a refresh while the
    // pixels are still loading cannot count the same lead twice.
    if (data.fired) return;
    try {
      sessionStorage.setItem(KEY, JSON.stringify({ ...data, fired: true }));
    } catch {
      /* storage full or locked: fire anyway, a double count beats none */
    }

    const w = window as unknown as PixelWindow;

    // Each SDK on its own. In one shared block a throw from the first would
    // skip the rest, which is what happened on the form page.
    whenReady(() => typeof w.oaiq === "function", () => {
      w.oaiq?.("measure", "lead_created", { type: "customer_action" });
      w.oaiq?.("measure", "page_viewed", { type: "contents" });
    });
    // Suppressed by Meta while the domain is health-restricted. Kept so it
    // starts counting the moment a review lifts the restriction.
    whenReady(() => typeof w.fbq === "function", () => {
      w.fbq?.("track", "Lead");
    });
    whenReady(() => typeof w.gtag === "function", () => {
      w.gtag?.("event", "generate_lead", { currency: "INR" });
    });
  }, []);

  const startOver = () => {
    try {
      sessionStorage.removeItem(KEY);
    } catch {
      /* nothing to clear */
    }
    window.location.assign(formHome());
  };

  return (
    <div className="stage">
      <div className="orb orb-a" />
      <div className="orb orb-b" />

      <div className="card">
        <div className="card-wash" />
        <div className="blob blob-a" />
        <div className="blob blob-b" />

        <div className="topbar">
          <span
            className="back"
            aria-hidden="true"
            style={{ opacity: 0, pointerEvents: "none" }}
          >
            {"\u2190"}
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-cropped.png" alt="Lean Protocol" />
        </div>

        <div className="step">
          {name !== null && (
            <div className="pane" style={{ justifyContent: "center", textAlign: "center" }}>
              <div
                style={{
                  width: 84,
                  height: 84,
                  borderRadius: "50%",
                  background: "#193231",
                  color: "#C8D9A7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 38,
                  margin: "0 auto 26px",
                  boxShadow: "0 20px 46px rgba(25,50,49,.3)",
                  animation: "fnPop .5s both",
                }}
              >
                {TICK}
              </div>
              <h1
                style={{
                  fontWeight: 800,
                  fontSize: "clamp(30px,8.5vw,44px)",
                  letterSpacing: "-.035em",
                  lineHeight: 1.04,
                  margin: "0 0 14px",
                  color: "#193231",
                }}
              >
                You&apos;re in, <span className="serif">{name}.</span>
              </h1>
              <p
                style={{
                  fontSize: 18,
                  lineHeight: 1.5,
                  color: "rgba(28,43,34,.62)",
                  margin: "0 0 34px",
                }}
              >
                We&apos;ll message you on WhatsApp within 24 hours.
              </p>
              <button
                type="button"
                className="cta cta-primary"
                onClick={startOver}
                style={{
                  background: "transparent",
                  color: "rgba(28,43,34,.45)",
                  boxShadow: "none",
                  fontSize: 14.5,
                  padding: 0,
                  marginTop: 4,
                }}
              >
                Start over
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
