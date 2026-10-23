// app/delete-account/page.tsx
// Public account-deletion page, linked from the Google Play Data safety form.
//
// A real static route on purpose: without it, /delete-account was caught by
// the dynamic /[ref] referral route and redirected to the homepage. In the App
// Router a static segment always wins over a dynamic one.
//
// No login, no gating: someone who has uninstalled the app must still be able
// to read this. The retention paragraphs describe what the app actually does -
// do not reword them without checking the app first.
//
// Pure ASCII file: symbols are \u escapes.

import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Delete your account | Lean Protocol",
  description:
    "How to close your Lean Protocol account and ask us to erase your personal data, in the app or by email.",
  alternates: { canonical: "https://www.leanprotocol.in/delete-account" },
  robots: { index: true, follow: true },
};

const MAIL = "privacy@leanprotocol.in";
const MAIL_DELETE = `mailto:${MAIL}?subject=${encodeURIComponent("Delete my account")}`;

export default function DeleteAccountPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 text-[17px] leading-relaxed text-neutral-800">
      <h1 className="text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
        Delete your Lean Protocol account
      </h1>
      <p className="mt-4">
        You can close your account and ask us to erase your personal data at any time.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-neutral-900">In the app</h2>
      <p className="mt-3">
        Open Lean Protocol {"\u2192"} Account {"\u2192"} Your data and your rights {"\u2192"} Close my
        account, and confirm. Your request is recorded straight away.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-neutral-900">Without the app</h2>
      <p className="mt-3">
        Email{" "}
        <a href={MAIL_DELETE} className="font-medium underline underline-offset-2">
          {MAIL}
        </a>{" "}
        from any address, with the subject {'"'}Delete my account{'"'} and the mobile
        number you signed in with. We will confirm by SMS to that number before acting, so nobody
        can close your account but you.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-neutral-900">What we erase</h2>
      <p className="mt-3">
        Your name, phone number and email address. We stop using your record for anything.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-neutral-900">What we keep, and why</h2>
      <p className="mt-3">
        Your clinical history {"\u2014"} consultations, prescriptions, lab results {"\u2014"} is
        kept without your name attached, because Indian law requires medical records to be retained
        for a set period. We cannot delete it early, and we will not use it to identify you.
        Payment records are kept for as long as tax law requires.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-neutral-900">How long it takes</h2>
      <p className="mt-3">We complete every request within 30 days, and usually much sooner.</p>

      <h2 className="mt-10 text-xl font-semibold text-neutral-900">Who to contact</h2>
      <p className="mt-3">
        Our Privacy and Grievance Officer under the Digital Personal Data Protection Act, 2023
        is{" "}<strong className="font-semibold text-neutral-900">Muskan Nagar</strong>. She handles
        questions about your data, requests to access or correct it, and any complaint about how we
        have used it.
      </p>
      <p className="mt-3">
        Email{" "}
        <a href={`mailto:${MAIL}`} className="font-medium underline underline-offset-2">
          {MAIL}
        </a>{" "}
        and we will acknowledge your request within 48 hours and aim to resolve it within 30 days.
        If you are not satisfied with our response, you may complain to the Data Protection Board of
        India.
      </p>
    </main>
  );
}