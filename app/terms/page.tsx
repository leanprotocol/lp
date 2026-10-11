// app/terms/page.tsx
// /terms was falling through to the dynamic /[ref] referral route and landing
// on the homepage. The terms live at /terms-conditions; this static route
// claims /terms and sends it there with a permanent (308) redirect, so old
// links and anyone typing /terms reach the real page.

import { permanentRedirect } from "next/navigation";

export default function TermsRedirect() {
  permanentRedirect("/terms-conditions");
}