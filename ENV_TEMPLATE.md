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
# FIREBASE - ADMIN (Server-Side)
# ========================================
FIREBASE_PROJECT_ID="your-firebase-project-id"
FIREBASE_CLIENT_EMAIL="your-firebase-client-email"
FIREBASE_PRIVATE_KEY="your-firebase-private-key-replace-newlines-with-\n"

# ========================================
# FIREBASE - CLIENT (Phone Auth)
# ========================================
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="your-measurement-id"

# ========================================
# SANITY CMS
# ========================================
NEXT_PUBLIC_SANITY_PROJECT_ID="your-sanity-project-id"
NEXT_PUBLIC_SANITY_DATASET="production"

# ========================================
# AWS SES (Optional Emails)
# ========================================
AWS_REGION="your-aws-region"
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
SES_FROM_EMAIL="noreply@yourdomain.com"

# ========================================
# RAZORPAY - PAYMENT GATEWAY
# ========================================
RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-razorpay-key-secret"
RAZORPAY_WEBHOOK_SECRET="your-razorpay-webhook-secret"
DEV_RAZORPAY_SKIP_QUIZ_GUARD="true" # Optional, used for local testing

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

### 2. Firebase Setup (Authentication)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable **Authentication** and add **Phone Auth** as a sign-in provider
4. Under **Project Settings > General**, add a web app and copy the `NEXT_PUBLIC_FIREBASE_*` configuration
5. Under **Project Settings > Service Accounts**, generate a new private key and copy the `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY`

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
