# Lean Healthcare Subscription Platform - Complete Documentation

## 📋 Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Features](#features)
4. [Technology Stack](#technology-stack)
5. [Installation & Setup](#installation--setup)
6. [Environment Variables](#environment-variables)
7. [Database Schema](#database-schema)
8. [API Documentation](#api-documentation)
9. [User Flows](#user-flows)
10. [Admin Workflows](#admin-workflows)
11. [Security Features](#security-features)
12. [Payment Integration](#payment-integration)
13. [OTP System](#otp-system)
14. [Deployment Guide](#deployment-guide)
15. [Troubleshooting](#troubleshooting)

---

## Overview

The Lean Healthcare Subscription Platform is a comprehensive, production-ready subscription management system built with Next.js, featuring:

- **Secure Authentication**: Mobile-based OTP verification with JWT
- **Subscription Management**: Multi-tier plans with admin approval
- **Payment Processing**: Integrated Razorpay payment gateway
- **Quiz System**: Eligibility assessment before subscription
- **Admin Dashboard**: Complete management interface
- **Refund System**: Automated refund processing for eligible plans
- **Auto-Renewal**: Optional subscription auto-renewal

---

## System Architecture

### Architecture Layers

```
┌─────────────────────────────────────────┐
│         Next.js App Router (UI)         │
├─────────────────────────────────────────┤
│         API Routes (REST APIs)          │
├─────────────────────────────────────────┤
│    Business Logic & Services Layer      │
│  (OTP, Payment, Auth, Validation)       │
├─────────────────────────────────────────┤
│         Prisma ORM (Database)           │
├─────────────────────────────────────────┤
│         PostgreSQL Database             │
└─────────────────────────────────────────┘

External Services:
├── MSG91 (OTP/SMS)
├── Razorpay (Payments)
```

### Key Components

- **Authentication Layer**: JWT-based auth with httpOnly cookies
- **Validation Layer**: Zod schemas for all API inputs
- **Service Layer**: Abstracted business logic
- **Database Layer**: Prisma ORM with PostgreSQL

---

## Features

### 👤 User Features

1. **Registration & Authentication**
   - Mobile number-based registration
   - OTP verification (MSG91)
   - Secure password with validation
   - JWT-based session management

2. **Contact/Query Form**
   - Submit inquiries
   - Optional email field
   - Tracked in admin panel

3. **Quiz System**
   - Eligibility assessment
   - One-time submission
   - Admin review required

4. **Subscription Management**
   - View available plans
   - Purchase single subscription
   - Payment via Razorpay
   - View active subscription details
   - Toggle auto-renewal
   - Request refunds (for eligible plans)

5. **User Dashboard**
   - Profile information
   - Quiz status
   - Active subscription details
   - Payment history

### 🧑‍💼 Admin Features

1. **Authentication**
   - Secure email/password login
   - Role-based access control

2. **User Management**
   - View all users
   - Search by mobile number
   - View user subscriptions

3. **Plan Management**
   - Create/Edit/Disable plans
   - Configure pricing & features
   - Set refundability
   - Enable/disable auto-renewal

4. **Quiz Management**
   - Review submissions
   - Approve/Reject with notes
   - Export data

5. **Subscription Management**
   - View all subscriptions
   - Approve/Reject subscriptions
   - Set activation dates
   - Manual overrides

6. **Payment Monitoring**
   - View all transactions
   - Payment status tracking
   - Revenue analytics

7. **Refund Management**
   - Review refund requests
   - Approve/Reject refunds
   - Automatic Razorpay processing

8. **Contact Query Management**
   - View all queries
   - Export to CSV

9. **Dashboard Analytics**
   - Total users
   - Active subscriptions
   - Pending approvals
   - Revenue metrics

---

## Technology Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend
- **Next.js API Routes** - RESTful APIs
- **Prisma ORM** - Database ORM
- **PostgreSQL** - Database
- **JWT (jose)** - Authentication
- **bcryptjs** - Password hashing

### External Services
- **MSG91** - OTP/SMS service (India DLT compliant)
- **Razorpay** - Payment gateway

---

## Installation & Setup

### Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or pnpm
- MSG91 account
- Razorpay account

### Step 1: Clone & Install

```bash
cd lean_healthcare
npm install --legacy-peer-deps
```

### Step 2: Setup Environment Variables

Create a `.env` file in the root directory (see ENV_TEMPLATE.md for details):

```bash
cp ENV_TEMPLATE.md .env
```

Fill in all required environment variables.

### Step 3: Setup Database

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Or run migrations
npm run db:migrate
```

### Step 4: Create Admin User

You'll need to manually create an admin user in the database:

```sql
INSERT INTO "Admin" (id, email, password, name, role, "isActive")
VALUES (
  gen_random_uuid(),
  'admin@example.com',
  '$2a$12$HASHED_PASSWORD_HERE', -- Use bcrypt to hash your password
  'Admin User',
  'admin',
  true
);
```

Or use Prisma Studio:
```bash
npm run db:studio
```

### Step 5: Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3002`

---

## Environment Variables

### Required Variables

#### Database
```
DATABASE_URL="postgresql://username:password@localhost:5432/lean_healthcare"
```

#### JWT & Security
```
JWT_SECRET="your-32-character-minimum-secret-key"
JWT_EXPIRES_IN="7d"
```

#### MSG91 (OTP Service)
```
MSG91_AUTH_KEY="your-msg91-auth-key"
MSG91_SENDER_ID="your-sender-id"
MSG91_TEMPLATE_ID="your-template-id"
MSG91_DLT_TE_ID="your-dlt-te-id" # Optional
```

#### Razorpay (Payment Gateway)
```
RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-razorpay-key-secret"
RAZORPAY_WEBHOOK_SECRET="your-webhook-secret"
```

#### Application
```
NEXT_PUBLIC_APP_URL="http://localhost:3002"
NODE_ENV="development"
```

#### OTP Configuration
```
OTP_EXPIRY_MINUTES="5"
OTP_MAX_ATTEMPTS="3"
OTP_BLOCK_DURATION_MINUTES="30"
```

---

## Database Schema

### Core Models

#### User
- Stores user authentication data
- Mobile number as unique identifier
- Verification status

#### OTP
- Temporary OTP storage
- Hashed OTP values
- Attempt tracking and blocking

#### Admin
- Admin user accounts
- Email-based authentication
- Role management

#### QuizSubmission
- User quiz responses
- Review status tracking
- Admin review notes

#### SubscriptionPlan
- Plan configurations
- Pricing and duration
- Feature lists
- Refundability settings

#### Subscription
- User subscriptions
- Status workflow
- Start/end dates
- Auto-renewal flag

#### Payment
- Razorpay transaction records
- Payment status tracking
- Order and payment IDs

#### RefundRequest
- Refund requests
- Admin review workflow
- Razorpay refund IDs

#### ContactQuery
- User inquiries
- Contact information

---

## API Documentation

### Authentication APIs

#### POST `/api/auth/register`
Register a new user with mobile number and password.

**Request:**
```json
{
  "mobileNumber": "9876543210",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful. Please verify OTP to continue.",
  "userId": "uuid"
}
```

#### POST `/api/auth/verify-otp`
Verify OTP sent to mobile number.

**Request:**
```json
{
  "mobileNumber": "9876543210",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "user": {
    "id": "uuid",
    "mobileNumber": "9876543210",
    "isVerified": true
  }
}
```

#### POST `/api/auth/login`
Login with mobile number and password.

**Request:**
```json
{
  "mobileNumber": "9876543210",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "mobileNumber": "9876543210",
    "isVerified": true
  }
}
```

#### POST `/api/auth/logout`
Logout current user (clears auth cookie).

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### POST `/api/auth/resend-otp`
Resend OTP to mobile number.

**Request:**
```json
{
  "mobileNumber": "9876543210"
}
```

### Admin Authentication

#### POST `/api/admin/auth/login`
Admin login with email and password.

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "AdminPass123"
}
```

### Contact API

#### POST `/api/contact`
Submit a contact/query form (public or authenticated).

**Request:**
```json
{
  "name": "John Doe",
  "mobileNumber": "9876543210",
  "email": "john@example.com",
  "message": "I have a question about subscriptions..."
}
```

### Quiz APIs

#### POST `/api/quiz/submit`
Submit quiz answers (requires authentication).

**Request:**
```json
{
  "answers": {
    "question1": "answer1",
    "question2": "answer2"
  }
}
```

### Subscription Plan APIs

#### GET `/api/plans`
Get all active subscription plans (public).

**Response:**
```json
{
  "success": true,
  "plans": [
    {
      "id": "uuid",
      "name": "6-Month Plan",
      "description": "Best value plan",
      "price": 5999,
      "durationDays": 180,
      "features": ["Feature 1", "Feature 2"],
      "isRefundable": true,
      "allowAutoRenew": true
    }
  ]
}
```

### User APIs

#### GET `/api/user/me`
Get current user profile (requires authentication).

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "mobileNumber": "9876543210",
    "isVerified": true,
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "quizStatus": "APPROVED",
  "activeSubscription": {
    "id": "uuid",
    "planName": "6-Month Plan",
    "startDate": "2024-01-01",
    "endDate": "2024-07-01",
    "autoRenew": true
  }
}
```

#### GET `/api/user/subscription`
Get active subscription details.

### Payment APIs

#### POST `/api/payment/create-order`
Create Razorpay order for subscription purchase.

**Request:**
```json
{
  "planId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "orderId": "order_xxx",
  "amount": 5999,
  "currency": "INR",
  "keyId": "rzp_xxx",
  "subscriptionId": "uuid",
  "paymentId": "uuid"
}
```

#### POST `/api/payment/verify`
Verify payment after Razorpay checkout.

**Request:**
```json
{
  "razorpayOrderId": "order_xxx",
  "razorpayPaymentId": "pay_xxx",
  "razorpaySignature": "signature_xxx"
}
```

#### POST `/api/webhooks/razorpay`
Razorpay webhook handler (called by Razorpay).

### Refund APIs

#### POST `/api/refund/request`
Request refund for subscription.

**Request:**
```json
{
  "subscriptionId": "uuid",
  "reason": "Detailed reason for refund request..."
}
```

### Admin APIs

All admin APIs require admin authentication.

#### GET `/api/admin/dashboard`
Get dashboard statistics.

#### GET `/api/admin/users`
Get all users with subscription counts.

#### GET `/api/admin/plans`
Get all subscription plans.

#### POST `/api/admin/plans`
Create new subscription plan.

#### PATCH `/api/admin/plans/[id]`
Update subscription plan.

#### GET `/api/admin/quiz`
Get all quiz submissions (filter by status).

#### PATCH `/api/admin/quiz/[id]`
Review quiz submission (approve/reject).

#### GET `/api/admin/subscriptions`
Get all subscriptions (filter by status).

#### PATCH `/api/admin/subscriptions/[id]`
Review subscription (approve/reject).

#### GET `/api/admin/refunds`
Get all refund requests.

#### PATCH `/api/admin/refunds/[id]`
Process refund request (approve/reject).

#### GET `/api/admin/contact`
Get all contact queries.

---

## User Flows

### 1. User Registration & Verification

```
1. User visits /register
2. Enters mobile number & password
3. API sends OTP via MSG91
4. User receives OTP on mobile
5. User enters OTP on /verify-otp page
6. OTP verified, account activated
7. User redirected to /dashboard
```

### 2. Subscription Purchase

```
1. User completes quiz (/quiz)
2. Admin approves quiz
3. User views plans (/plans)
4. Selects plan and clicks purchase
5. Razorpay order created
6. Razorpay checkout modal opens
7. User completes payment
8. Payment verified
9. Subscription status: PENDING_APPROVAL
10. Admin approves subscription
11. Subscription activated with start/end dates
```

### 3. Refund Request

```
1. User views subscription (/dashboard)
2. Clicks "Request Refund"
3. Enters refund reason
4. Admin reviews request
5. Admin approves/rejects
6. If approved: Razorpay refund processed
7. Payment status: REFUNDED
8. Subscription status: EXPIRED
```

---

## Admin Workflows

### 1. Quiz Review Workflow

```
Admin Panel → Quiz Submissions → Select Submission
→ Review Answers → Approve/Reject with Notes
→ Status Updated → User Notified
```

### 2. Subscription Approval Workflow

```
Admin Panel → Subscriptions → Filter "PENDING_APPROVAL"
→ Review Payment Status → Verify Quiz Approval
→ Approve Subscription → Set Start/End Dates
→ Status: ACTIVE → User Can Access
```

### 3. Refund Processing Workflow

```
Admin Panel → Refund Requests → Review Request & Reason
→ Check Payment Details → Approve Refund
→ Razorpay API Processes Refund
→ Update Payment Status: REFUNDED
→ Update Subscription Status: EXPIRED
```

---

## Security Features

### Authentication Security

- **Password Hashing**: bcrypt with 12 rounds
- **JWT Tokens**: Signed with HS256 algorithm
- **HttpOnly Cookies**: Prevents XSS attacks
- **Secure Cookies**: HTTPS only in production
- **Token Expiration**: 7-day default expiry

### OTP Security

- **Hashed Storage**: OTPs stored hashed (bcrypt)
- **Time-Limited**: 5-minute expiry
- **Rate Limiting**: Max 3 attempts
- **Account Blocking**: 30-minute block after failures
- **Single-Use**: OTP deleted after successful verification

### API Security

- **Input Validation**: Zod schemas on all endpoints
- **Authentication Middleware**: JWT verification
- **Role-Based Access**: Admin vs User separation
- **CSRF Protection**: SameSite cookies
- **SQL Injection Prevention**: Prisma ORM parameterization

### Payment Security

- **Signature Verification**: Razorpay signatures
- **Webhook Authentication**: Secret-based verification
- **Idempotent Operations**: Prevent double-processing
- **Secure Key Storage**: Environment variables only

---

## Payment Integration

### Razorpay Setup

1. **Create Razorpay Account**
   - Sign up at https://razorpay.com
   - Complete KYC verification

2. **Get API Keys**
   - Dashboard → API Keys
   - Copy Key ID and Key Secret

3. **Setup Webhook**
   - Dashboard → Webhooks
   - Add webhook URL: `https://yourdomain.com/api/webhooks/razorpay`
   - Subscribe to events:
     - `payment.captured`
     - `payment.failed`
   - Copy webhook secret

4. **Test Mode**
   - Use test keys for development
   - Test card: 4111 1111 1111 1111
   - Any future expiry, any CVV

### Payment Flow

```
Frontend                Backend                 Razorpay
   |                       |                       |
   |-- Create Order ------>|                       |
   |                       |---- Create Order ---->|
   |<----- Order ID -------|<----- Order ID -------|
   |                       |                       |
   |-- Open Checkout ------|                       |
   |<----- Razorpay UI ------------------------------|
   |                       |                       |
   |-- Complete Payment ------------------------->|
   |<----- Payment ID ----------------------------|
   |                       |                       |
   |-- Verify Payment ---->|                       |
   |                       |-- Verify Signature -->|
   |<----- Success --------|                       |
```

---

## OTP System

### MSG91 Setup

1. **Create MSG91 Account**
   - Sign up at https://msg91.com
   - Complete KYC

2. **Get Auth Key**
   - Dashboard → Settings → Auth Key

3. **Create OTP Template**
   - SMS → Templates → Create New
   - Example: "Your OTP for Lean Healthcare is ##OTP##. Valid for 5 minutes."
   - Get Template ID

4. **DLT Registration (India)**
   - Register with DLT
   - Get sender ID approved
   - Get DLT TE ID

### OTP Configuration

- **Expiry**: 5 minutes (configurable)
- **Length**: 6 digits
- **Max Attempts**: 3 (configurable)
- **Block Duration**: 30 minutes (configurable)
- **Storage**: Hashed with bcrypt

---

## Deployment Guide

### Prerequisites

- PostgreSQL database (managed service recommended)
- Node.js hosting (Vercel, Railway, Render, etc.)
- Domain with SSL certificate

### Environment Setup

1. **Database**
   - Set up PostgreSQL database
   - Note connection string

2. **Environment Variables**
   - Set all production environment variables
   - Use strong JWT_SECRET (32+ characters)
   - Set NODE_ENV=production
   - Update NEXT_PUBLIC_APP_URL to production domain

3. **Database Migration**
```bash
npm run db:migrate
```

4. **Build Application**
```bash
npm run build
```

### Deployment Options

#### Option 1: Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

#### Option 2: Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3002
CMD ["npm", "start"]
```

#### Option 3: Traditional Server

```bash
# Clone repository
# Install dependencies
npm install --legacy-peer-deps

# Setup environment
cp .env.example .env
# Edit .env with production values

# Run migrations
npm run db:migrate

# Build
npm run build

# Start with PM2
pm2 start npm --name "lean-health" -- start
```

### Post-Deployment

1. **Create Admin User**
   - Use Prisma Studio or direct SQL
   - Hash password before insertion

2. **Test Payment Flow**
   - Use Razorpay test mode first
   - Verify webhook delivery

3. **Configure Razorpay Webhook**
   - Update webhook URL to production
   - Test with Razorpay test events

4. **Monitor Logs**
   - Check application logs
   - Monitor error rates

---

## Troubleshooting

### Common Issues

#### 1. Prisma Client Not Lean Protocol

**Error**: `Module '"@prisma/client"' has no exported member 'PrismaClient'`

**Solution**:
```bash
npm run db:generate
```

#### 2. Database Connection Failed

**Error**: `Can't reach database server`

**Solution**:
- Check DATABASE_URL in .env
- Verify PostgreSQL is running
- Check firewall rules
- Verify connection string format

#### 3. OTP Not Sending

**Error**: OTP service fails silently

**Solution**:
- Verify MSG91_AUTH_KEY
- Check MSG91 account balance
- Verify DLT registration (India)
- Check template ID is correct

#### 4. Payment Signature Mismatch

**Error**: `Invalid payment signature`

**Solution**:
- Verify RAZORPAY_KEY_SECRET
- Check order_id matches
- Ensure signature verification logic is correct
- Check for encoding issues

#### 5. JWT Token Invalid

**Error**: `Invalid or expired token`

**Solution**:
- Verify JWT_SECRET matches
- Check cookie settings
- Verify token hasn't expired
- Check httpOnly and secure flags

### Debug Mode

Enable detailed logging:

```typescript
// In lib/prisma.ts
log: ['query', 'error', 'warn', 'info']
```

### Health Check Endpoints

Create health check for monitoring:

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
}
```

---

## Support & Maintenance

### Monitoring

- Set up error tracking (Sentry, LogRocket)
- Monitor API response times
- Track payment success rates
- Monitor OTP delivery rates

### Database Maintenance

```bash
# Backup database
pg_dump lean_healthcare > backup.sql

# Vacuum database
VACUUM ANALYZE;
```

### Security Updates

- Regularly update dependencies
- Monitor security advisories
- Rotate JWT secrets periodically
- Review admin access logs

---

## License & Credits

Built with:
- Next.js
- Prisma
- PostgreSQL
- Razorpay
- MSG91
- shadcn/ui

---

## Contact

For support or questions, please contact your development team or refer to the project repository.

---

**Version**: 1.0.0  
**Last Updated**: January 2026
