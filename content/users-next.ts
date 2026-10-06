/* Copy and price for the screens after the /users lead form: the paid
   senior-health-coach call, then a confirmation. (The programme-journey
   screen was removed on 5 Oct 2026, before launch.)
   Rendered by app/users/thankyou/page.tsx.

   The price is read by the client AND by both payment routes, so the amount
   shown and the amount charged cannot drift apart. Change it here only.

   Pure ASCII: symbols are \u escapes (see ARCHITECTURE.md section 12). */

export const COACH_AMOUNT_INR = 49;

/* The session's MRP, shown struck through next to the selling price.
   Display only - the amount charged is COACH_AMOUNT_INR. Per the business
   (5 Oct 2026), 999 is the MRP of this session. Keep it accurate: a struck
   price that was never the real price is misleading under consumer law. */
export const COACH_MRP_INR = 999;

/* Written into the Razorpay order notes by coach-order and checked by
   coach-verify, so a payment for another product cannot pass as this one. */
export const COACH_ORDER_SOURCE = "users-coach-call";

export const COACH = {
  badge: "DETAILS RECEIVED",
  title: "Unlock your plan:",
  titleSerif: "talk to a senior health coach.",
  /* Empty hides the line under the heading. */
  sub: "",
  includes: [
    { title: "An exclusive 20-minute 1:1 call at a mutual time", body: "With a certified senior health coach." },
    { title: "Root cause analysis", body: "Understanding your medical history before suggesting anything." },
    { title: "Suggesting the best possible solutions for your weight loss", body: "The best possible options in the world, based on your future goals." },
    { title: "A clear next step", body: "Your clear roadmap for the next 90 days." },
  ],
  priceLabel: "Session fee",
  mrpLabel: "MRP",
  /* CONFIRM with the accountant before launch. Delete the text to hide the line. */
  priceNote: "Inclusive of taxes",
  cta: "Book my call now!",
  paying: "Opening secure payment...",
  secure: "Secure payment by Razorpay. UPI, cards and netbanking.",
  skip: "Not now, I will wait for your WhatsApp message",
  fine:
    "A health coach is not a doctor and does not prescribe. Any medication is decided by a doctor, only if you are eligible. Individual results vary.",
};

export const AFTER = {
  paidTitle: "Congratulations,",
  paidTitleSerif: "you are booked.",
  paidBody: "A senior health coach will call you shortly. Please keep your phone with you.",
  laterTitle: "You are in,",
  laterBody: "We will message you on WhatsApp within 24 hours.",
  paymentRef: "Payment reference",
  /* Shown if Razorpay took the money but our confirmation call failed. The
     buyer must not be pushed into paying twice. */
  verifyFailed:
    "Your payment went through, but we could not confirm it on our side. Do not pay again. Our team will contact you, or call +91 96504 01267 with the reference below.",
  noPhone:
    "We could not find your number on this device. Please call +91 96504 01267 and we will book your call.",
};