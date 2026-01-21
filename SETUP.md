# Setup Guide - Lean Healthcare Subscription Platform

Complete step-by-step guide to set up the Lean Healthcare subscription platform from scratch.

## Prerequisites

Before you begin, ensure you have:

- **Node.js** 18 or higher
- **PostgreSQL** 14 or higher
- **npm** or **pnpm** package manager
- **MSG91 Account** (for OTP)
- **Razorpay Account** (for payments)

---

## Step 1: Clone and Install Dependencies

```bash
# Navigate to project directory
cd lean_healthcare

# Install dependencies (use --legacy-peer-deps due to React 19)
npm install --legacy-peer-deps
```

---

## Step 2: Set Up PostgreSQL Database

### Option A: Local PostgreSQL

```bash
# Create database
createdb lean_healthcare

# Your connection string will be:
# postgresql://username:password@localhost:5432/lean_healthcare
```

### Option B: Managed PostgreSQL (Recommended for Production)

Services like:
- **Neon** (https://neon.tech)
- **Supabase** (https://supabase.com)
- **Railway** (https://railway.app)
- **AWS RDS**
- **DigitalOcean**

Get the connection string from your provider.

---

## Step 3: Configure Environment Variables

### 3.1 Create .env File

```bash
# Copy the template
cp ENV_TEMPLATE.md .env
```

### 3.2 Fill in Database Configuration

```env
DATABASE_URL="postgresql://username:password@host:5432/lean_healthcare?schema=public"
```

### 3.3 Generate JWT Secret

```bash
# Generate a secure random string (32+ characters)
openssl rand -base64 32
```

Add to `.env`:
```env
JWT_SECRET="your-generated-secret-key-here"
JWT_EXPIRES_IN="7d"
```

---

## Step 4: Set Up MSG91 (OTP Service)

### 4.1 Create MSG91 Account

1. Go to https://msg91.com
2. Sign up and complete KYC
3. Add credits to your account

### 4.2 Get Auth Key

1. Dashboard → Settings → Auth Key
2. Copy the auth key

### 4.3 Create OTP Template

1. Go to SMS → Templates
2. Create new template:
   ```
   Your OTP for Lean Healthcare is ##OTP##. Valid for 5 minutes. Do not share with anyone.
   ```
3. Submit for approval
4. Note the Template ID

### 4.4 DLT Registration (India Only)

If sending SMS in India:
1. Register with DLT (Distributed Ledger Technology)
2. Get sender ID approved
3. Get DLT TE ID

### 4.5 Add to .env

```env
MSG91_AUTH_KEY="your-msg91-auth-key"
MSG91_SENDER_ID="your-sender-id"
MSG91_TEMPLATE_ID="your-template-id"
MSG91_DLT_TE_ID="your-dlt-te-id"  # Optional
```

---

## Step 5: Set Up Razorpay (Payment Gateway)

### 5.1 Create Razorpay Account

1. Go to https://razorpay.com
2. Sign up and complete KYC
3. Verify business details

### 5.2 Get API Keys

1. Dashboard → API Keys
2. Generate Key ID and Key Secret
3. Start with **Test Mode** for development

### 5.3 Configure Webhook

1. Dashboard → Webhooks
2. Create new webhook
3. URL: `https://yourdomain.com/api/webhooks/razorpay`
   - For local dev: Use ngrok or similar
4. Subscribe to events:
   - `payment.captured`
   - `payment.failed`
5. Copy the **Webhook Secret**

### 5.4 Add to .env

```env
RAZORPAY_KEY_ID="rzp_test_xxxxxxxxxxxxx"
RAZORPAY_KEY_SECRET="your-razorpay-key-secret"
RAZORPAY_WEBHOOK_SECRET="your-webhook-secret"
```

---

## Step 6: Configure Application URLs

```env
NEXT_PUBLIC_APP_URL="http://localhost:3002"
NODE_ENV="development"

# OTP Configuration (optional, defaults provided)
OTP_EXPIRY_MINUTES="5"
OTP_MAX_ATTEMPTS="3"
OTP_BLOCK_DURATION_MINUTES="30"
```

---

## Step 7: Initialize Database

### 7.1 Generate Prisma Client

```bash
npm run db:generate
```

This generates the Prisma Client based on your schema.

### 7.2 Push Schema to Database

```bash
npm run db:push
```

This creates all tables in your PostgreSQL database.

**Alternative: Use Migrations (Recommended for Production)**

```bash
npm run db:migrate
```

---

## Step 8: Create Admin User

You need at least one admin user to access the admin panel.

### Option A: Using Prisma Studio (Recommended)

```bash
npm run db:studio
```

1. Opens in browser at `http://localhost:5555`
2. Click on **Admin** table
3. Click **Add record**
4. Fill in:
   - **email**: admin@example.com
   - **password**: (hash your password first - see below)
   - **name**: Admin User
   - **role**: admin
   - **isActive**: true
5. Click **Save**

### Option B: Using SQL

First, hash your password:

```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('YourPassword123', 12));"
```

Then run SQL:

```sql
INSERT INTO "Admin" (id, email, password, name, role, "isActive", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'admin@example.com',
  '$2a$12$HASHED_PASSWORD_FROM_ABOVE',
  'Admin User',
  'admin',
  true,
  NOW(),
  NOW()
);
```

---

## Step 9: Start Development Server

```bash
npm run dev
```

The application will start on `http://localhost:3002`

---

## Step 10: Test the Setup

### 10.1 Test User Registration

1. Go to `/register` (you'll need to create this UI)
2. Register with a mobile number
3. Check if OTP is sent via MSG91
4. Verify OTP

### 10.2 Test Admin Login

1. Go to `/admin/login` (you'll need to create this UI)
2. Login with admin credentials
3. Check admin dashboard

### 10.3 Test Payment (Test Mode)

1. Create a subscription plan via admin
2. As user, try to purchase
3. Use Razorpay test card: `4111 1111 1111 1111`
4. Any future expiry, any CVV
5. Check if payment is recorded

---

## Step 11: Production Deployment

### 11.1 Environment Configuration

1. Update `NODE_ENV="production"`
2. Update `NEXT_PUBLIC_APP_URL` to production URL
3. Use production database
4. Switch Razorpay to **Live Mode**
5. Use strong JWT_SECRET

### 11.2 Database Migration

```bash
# On production server
npm run db:migrate
```

### 11.3 Build Application

```bash
npm run build
```

### 11.4 Start Production Server

```bash
npm start
```

Or use PM2:
```bash
pm2 start npm --name "lean-health" -- start
```

### 11.5 Update Razorpay Webhook

1. Go to Razorpay Dashboard → Webhooks
2. Update webhook URL to production URL
3. Retest webhook with test events

---

## Common Issues & Solutions

### Issue: Prisma Client Not Lean Protocol

**Error**: `Module '"@prisma/client"' has no exported member 'PrismaClient'`

**Solution**:
```bash
npm run db:generate
```

### Issue: Database Connection Failed

**Error**: `Can't reach database server`

**Solutions**:
- Check `DATABASE_URL` format
- Ensure PostgreSQL is running
- Check firewall rules
- Verify credentials

### Issue: OTP Not Sending

**Solutions**:
- Verify MSG91 credentials
- Check account balance
- Ensure template is approved
- Check mobile number format (include country code)
- Verify DLT registration (India)

### Issue: Payment Webhook Not Working

**Solutions**:
- Check webhook URL is accessible
- Verify webhook secret
- Check webhook signature verification logic
- Use ngrok for local testing: `ngrok http 3002`

### Issue: TypeScript Errors

**Solutions**:
- Run `npm run db:generate`
- Restart TypeScript server in IDE
- Check all imports are correct

---

## Development Workflow

### 1. Making Database Changes

```bash
# Edit prisma/schema.prisma

# Push changes to dev database
npm run db:push

# OR create migration (for production)
npm run db:migrate

# Regenerate Prisma Client
npm run db:generate
```

### 2. Viewing Database

```bash
# Open Prisma Studio
npm run db:studio
```

### 3. Resetting Database (Development Only)

```bash
npm run db:reset
```

**Warning**: This deletes all data!

---

## Next Steps

1. **Create UI Pages** - Build user-facing pages:
   - `/register` - User registration
   - `/login` - User login
   - `/verify-otp` - OTP verification
   - `/dashboard` - User dashboard
   - `/plans` - View subscription plans
   - `/quiz` - Quiz submission
   - `/contact` - Contact form

2. **Create Admin UI** - Build admin interface:
   - `/admin/login` - Admin login
   - `/admin/dashboard` - Admin dashboard
   - `/admin/users` - User management
   - `/admin/plans` - Plan management
   - `/admin/subscriptions` - Subscription management
   - `/admin/quiz` - Quiz review
   - `/admin/refunds` - Refund management

3. **Add Analytics** - Integrate monitoring:
   - Error tracking (Sentry)
   - Performance monitoring
   - User analytics

4. **Security Hardening**:
   - Rate limiting on APIs
   - CORS configuration
   - Helmet.js for security headers
   - Regular dependency updates

5. **Testing**:
   - Unit tests
   - Integration tests
   - E2E tests with Playwright
   - Load testing

---

## Resources

- **Full Documentation**: [DOCUMENTATION.md](./DOCUMENTATION.md)
- **Environment Variables**: [ENV_TEMPLATE.md](./ENV_TEMPLATE.md)
- **Prisma Docs**: https://www.prisma.io/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Razorpay Docs**: https://razorpay.com/docs
- **MSG91 Docs**: https://docs.msg91.com

---

## Support

For issues or questions:
1. Check [DOCUMENTATION.md](./DOCUMENTATION.md#troubleshooting)
2. Review API logs
3. Check database with Prisma Studio
4. Contact development team

---

**Happy Coding! 🚀**
