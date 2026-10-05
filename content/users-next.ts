/* Copy and price for the screens after the /users lead form: the paid
   senior-health-coach call, then a confirmation. (The programme-journey
   screen was removed on 5 Oct 2026, before launch.)
   Rendered by app/users/thankyou/page.tsx.

   The price is read by the client AND by both payment routes, so the amount
   shown and the amount charged cannot drift apart. Change it here only.

   Pure ASCII: symbols are \u escapes (see ARCHITECTURE.md section 12). */

export const COACH_AMOUNT_INR = 49;

/* Written into the Razorpay order notes by coach-order and checked by
   coach-verify, so a payment for another product cannot pass as this one. */
export const COACH_ORDER_SOURCE = "users-coach-call";

export const COACH = {
  badge: "DETAILS RECEIVED",
  title: "Talk to a",
  titleSerif: "senior health coach.",
  sub: "Before any test or plan, a senior coach goes through your answers with you, one to one.",
  includes: [
    { title: "A 1:1 call at a time that suits you", body: "With a person, not a chatbot." },
    { title: "Your answers, read properly", body: "Your BMI, goal, history and anything you are unsure about." },
    { title: "Which tests make sense for you", body: "And what each one tells your doctor." },
    { title: "A clear next step", body: "Including whether a doctor consultation is right for you." },
  ],
  priceLabel: "One-time session fee",
  /* CONFIRM with the accountant before launch. Delete the text to hide the line. */
  priceNote: "Inclusive of taxes",
  cta: "Book my call",
  paying: "Opening secure payment...",
  secure: "Secure payment by Razorpay. UPI, cards and netbanking.",
  skip: "Not now, I will wait for your WhatsApp message",
  fine:
    "A health coach is not a doctor and does not prescribe. Any medication is decided by a doctor, only if you are eligible. Individual results vary.",
};

export const AFTER = {
  paidTitle: "You are booked,",
  paidBody: "A senior health coach will message you on WhatsApp within 24 hours to fix a time for your call.",
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