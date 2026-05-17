# Lean Healthcare Subscription Platform - Context & Guidelines

## 🚀 Project Overview
A comprehensive healthcare subscription system facilitating clinically proven weight loss protocols. It integrates medical eligibility assessment, insurance coordination, and production-ready payment processing.

### Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Runtime**: Node.js (API routes specify `export const runtime = 'nodejs'`)
- **Language**: TypeScript
- **Database**: PostgreSQL (Supabase) + Prisma ORM
- **Hosting**: Vercel
- **Source Control**: GitHub
- **Auth**: Firebase Phone Auth (Identity) + JWT (jose) Session Management
- **UI**: Tailwind CSS + shadcn/ui + Framer Motion
- **Payments**: Razorpay
- **CMS**: Sanity (Blog/Content)

---

## 🏗️ Architecture & Core Logic

### 1. Identity & Session Bridge
The system uses Firebase for Phone OTP verification but maintains its own user database and session logic.
- **Identity Source**: Firebase Phone Auth provides the verified mobile number.
- **Session Bridge**: `app/api/auth/verify-firebase/route.ts` verifies the Firebase ID token, creates/updates the local `User` record, and issues a local JWT.
- **Cookies**: 
  - `auth-token`: Main user session JWT.
  - `temp-auth-token`: Temporary session for unverified/partially completed flows.
  - `admin_token`: Admin session JWT.
  - `quiz-session`: Anonymous session ID for tracking quiz progress before login.

### 2. Clinical Assessment (Quiz) Flow
The system enforces eligibility through a multi-step quiz (`app/quiz/page.tsx`).
- **Anonymous Progress**: Quiz can be started without login; progress is tracked via `quiz-session` cookie.
- **Conversion**: Upon completion/login, the bridge logic (`app/api/quiz/submit/route.ts`) merges anonymous submissions with the verified user record.
- **Review**: Submissions enter `PENDING_REVIEW` status for administrative approval.

### 3. Subscription & Payments
- **Plans**: Managed via `SubscriptionPlan` model with flags for `isActive`, `isRefundable`, `allowAutoRenew`.
- **Razorpay Integration**:
  - `create-order`: Generates Razorpay Order ID and pre-creates local `Subscription` and `Payment` records.
  - `verify`: Client-side signature verification to confirm payment success.
  - `webhooks`: `app/api/webhooks/razorpay/route.ts` handles asynchronous notifications (`payment.captured`, `payment.failed`).
- **Status Workflow**: `PENDING_APPROVAL` (Payment successful, waiting for admin activation) -> `ACTIVE`.

### 4. Admin Ecosystem
Admistration is centralized in `app/admin/` with modules for:
- **Users**: Search and management.
- **Quiz Submissions**: Reviewing medical eligibility.
- **Plans & Subscriptions**: Managing pricing and active memberships.
- **Refunds**: Processing refund requests via Razorpay API.
- **Insurance**: Managing coverage percentages for providers.

---

## 📂 Project Organization

- `app/api/`: All REST endpoints, organized by feature (auth, admin, user, payment, quiz).
- `lib/auth/`: JWT, cookie, password, and authentication middleware logic.
- `lib/validations/`: Centralized Zod schemas (the "source of truth" for data structures).
- `services/`: Abstracted business logic for external APIs (Razorpay, Firebase Admin).
- `components/ui/`: shadcn/ui base components.
- `prisma/schema.prisma`: The definitive database structure.

---

## 🛠️ Development Standards

### API & Data
- **Validation**: Every POST/PUT/PATCH must use a Zod schema from `lib/validations/`.
- **Responses**: Standard format: `{ success: boolean, message?: string, ...data }` or `{ success: false, error: string }`.
- **Prisma**: Use the shared client from `lib/prisma.ts`.

### Styling & UI
- **Themes**: Follow the established warm earthy/emerald palette.
- **Icons**: Use `lucide-react`.
- **Animations**: Prefer `framer-motion` for step transitions and interactive elements.

---

## 🔒 Security Mandates
- **Token Security**: Always use `httpOnly`, `secure` (in prod), and `sameSite: 'lax'` for cookies.
- **Admin Protection**: Admin routes are protected via `middleware.ts` and `requireAuth(request, ['admin'])`.
- **Secrets**: Validate all env vars via `lib/env.ts`. Never expose `RAZORPAY_KEY_SECRET` or `FIREBASE_PRIVATE_KEY` to the client.

---

## 📡 External Integrations
- **Razorpay**: Webhook URL must be configured for `payment.captured` and `payment.failed`.
- **Firebase**: Requires `FIREBASE_PRIVATE_KEY` for server-side token verification.
- **Sanity**: Content studio available at `/studio`.
