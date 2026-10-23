/* Where the checkout leaves the buyer details for the success page.
   sessionStorage, not the URL: a name and phone number in a query string
   ends up in server logs, analytics and referrer headers. */
export const PAID_KEY = "lp_course_paid";

export type Paid = { name: string; phone: string; reference: string; amount: number };