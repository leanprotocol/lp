"use client";

import { useState } from "react";

interface Expert {
  src: string;
  alt: string;
  initials: string;
  name: string;
  title: string;
}

const EXPERTS: Expert[] = [
  { src: "https://www.leanprotocol.in/lp-assets/experts/nishant.jpeg", alt: "Dr. Nishant Jain", initials: "NJ", name: "Dr. Nishant Jain", title: "MD, DM (Endocrinology)" },
  { src: "https://www.leanprotocol.in/lp-assets/experts/akhil.jpeg", alt: "Dr. Akhil Konduru", initials: "AK", name: "Dr. Akhil Konduru", title: "MD, Internal Medicine" },
  { src: "https://www.leanprotocol.in/lp-assets/experts/siddharth.jpeg", alt: "Dr. Siddharth Garg", initials: "SG", name: "Dr. Siddharth Garg", title: "MD, Internal Medicine" },
  { src: "https://www.leanprotocol.in/lp-assets/experts/gautam.jpeg", alt: "Dr. Gautam Kumar", initials: "GK", name: "Dr. Gautam Kumar", title: "MD, DM (Endocrinology)" },
  { src: "https://www.leanprotocol.in/lp-assets/experts/alisha.jpeg", alt: "Alisha Gupta", initials: "AG", name: "Alisha Gupta", title: "GLP 1 Expert Dietitian" },
  { src: "https://www.leanprotocol.in/lp-assets/experts/simran.jpeg", alt: "Simran Kumawat", initials: "SK", name: "Simran Kumawat", title: "Weight Loss Dietitian" },
  { src: "https://www.leanprotocol.in/lp-assets/experts/richa-sharma.jpeg", alt: "Richa Sharma", initials: "RS", name: "Richa Sharma", title: "Senior Dietitian" },
  { src: "https://www.leanprotocol.in/lp-assets/experts/aparna.jpeg", alt: "Aparna Tandon", initials: "AT", name: "Aparna Tandon", title: "Weight Loss Expert Dietitian" },
  { src: "https://www.leanprotocol.in/lp-assets/experts/richa-singh.jpeg", alt: "Richa Singh", initials: "RS", name: "Richa Singh", title: "Yoga & Fat Loss Expert" },
  { src: "https://www.leanprotocol.in/lp-assets/experts/alka.jpeg", alt: "Alka Bharti", initials: "AB", name: "Alka Bharti", title: "GLP 1 Dietitian" },
];

function ExpertAvatar({ src, alt, initials }: { src: string; alt: string; initials: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <div className="ava">{initials}</div>;
  }

  return (
    <div className="ava">
      {/* Plain img, not next/image — source is on the live leanprotocol.in domain
          and this is a small isolated campaign page that intentionally avoids
          touching next.config.js image domain allowlists. */}
      <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />
    </div>
  );
}

export function ExpertsMini() {
  return (
    <section>
      <div className="wrap">
        <div className="sec-head">
          <div className="divider"></div>
          <h2>Care from real experts</h2>
          <p>Endocrinologists, physicians and GLP-1 specialist dietitians guide every protocol.</p>
        </div>
        <div className="exp-row">
          {EXPERTS.map((e) => (
            <div className="exp" key={e.name}>
              <ExpertAvatar src={e.src} alt={e.alt} initials={e.initials} />
              <h4>{e.name}</h4>
              <p>{e.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
