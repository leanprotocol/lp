// components/psp/psp-dashboard.tsx
// The partner dashboard showcase. Two device previews, overlapped and tilted,
// floating over a forest section.
//
// The phone overlaps the desktop's lower-left corner on wide screens and drops
// below it under 900px - at phone width an overlapping pair hides half of each.

export function PspDashboard() {
  return (
    <section className="sec sec-forest" id="dashboard">
      <div className="wrap">
        <p className="label">YOUR OWN CONSOLE</p>
        <h2>See your programme as it runs.</h2>

        <div className="dash">
          <div className="dash__glow" aria-hidden="true" />
          <div className="dash__desktop">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/psp/dashboard/desktop.png"
              alt="The partner dashboard on a desktop screen, showing patients on programme, retention rate and a patient continuity chart."
              loading="lazy"
            />
          </div>
          <div className="dash__mobile">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/psp/dashboard/mobile.png"
              alt="The same dashboard on a phone, showing the headline figures and the continuity chart."
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
