# Environment Variables Template

Copy this template and create a `.env` file in the root of your project with these variables:

```bash
# ========================================
# DATABASE CONFIGURATION
# ========================================
DATABASE_URL="postgresql://username:password@localhost:5432/lean_healthcare?schema=public"

# ========================================
# JWT & SECURITY
# ========================================
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters-long"
JWT_EXPIRES_IN="7d"

# ========================================
# MSG91 - OTP SERVICE (India)
# ========================================
MSG91_AUTH_KEY="your-msg91-auth-key"
MSG91_SENDER_ID="your-sender-id"
MSG91_TEMPLATE_ID="your-template-id"
MSG91_DLT_TE_ID="your-dlt-te-id-optional"

# ========================================
# RAZORPAY - PAYMENT GATEWAY
# ========================================
RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-razorpay-key-secret"
RAZORPAY_WEBHOOK_SECRET="your-razorpay-webhook-secret"

# ========================================
# APPLICATION URLs
# ========================================
NEXT_PUBLIC_APP_URL="http://localhost:3002"

# ========================================
# OTP CONFIGURATION
# ========================================
OTP_EXPIRY_MINUTES="5"
OTP_MAX_ATTEMPTS="3"
OTP_BLOCK_DURATION_MINUTES="30"

# ========================================
# NODE ENVIRONMENT
# ========================================
NODE_ENV="development"
```

## Setup Instructions

### 1. Database Setup (PostgreSQL)

Install PostgreSQL and create a database:
```bash
createdb lean_healthcare
```

### 2. MSG91 Setup

1. Sign up at https://msg91.com/
2. Get your Auth Key from the dashboard
3. Create an OTP template
4. Set up DLT (if required for India)

### 3. Razorpay Setup

1. Sign up at https://razorpay.com/
2. Get your Key ID and Secret from the dashboard
3. Set up webhook endpoint: `https://yourdomain.com/api/webhooks/razorpay`
4. Get the webhook secret

### 4. JWT Secret

Generate a secure random string (minimum 32 characters):
```bash
openssl rand -base64 32
```

## Important Notes

- Never commit the `.env` file to version control
- Keep your secrets secure
- Use different credentials for development and production
- Rotate secrets periodically
