# Lean Healthcare Subscription Platform

A production-ready subscription management system with OTP authentication, payment processing, and comprehensive admin controls.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Set up environment variables
# Copy ENV_TEMPLATE.md and create .env file with your credentials

# 3. Generate Prisma Client
npm run db:generate

# 4. Push database schema
npm run db:push

# 5. Start development server
npm run dev
```

Visit `http://localhost:3002`

## 📚 Documentation

- **[Complete Documentation](./DOCUMENTATION.md)** - Full system documentation
- **[Setup Guide](./SETUP.md)** - Detailed setup instructions
- **[Environment Variables](./ENV_TEMPLATE.md)** - All required env vars

## ✨ Features

### User Features
- 📱 Mobile-based registration with OTP verification
- 🔐 Secure JWT authentication
- 📋 Eligibility quiz system
- 💳 Razorpay payment integration
- 📊 Subscription management dashboard
- 🔄 Auto-renewal options
- 💰 Refund requests for eligible plans

### Admin Features
- 👥 User management
- 📝 Quiz review and approval
- 💼 Subscription plan management
- ✅ Subscription approval workflow
- 💸 Payment monitoring
- 🔄 Refund processing
- 📞 Contact query management
- 📈 Analytics dashboard

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with httpOnly cookies
- **Payments**: Razorpay
- **OTP/SMS**: MSG91
- **UI**: Tailwind CSS + shadcn/ui
- **Validation**: Zod

## 📦 Project Structure

```
lean_healthcare/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # User authentication
│   │   ├── admin/             # Admin APIs
│   │   ├── contact/           # Contact form
│   │   ├── quiz/              # Quiz submission
│   │   ├── plans/             # Subscription plans
│   │   ├── payment/           # Payment processing
│   │   ├── refund/            # Refund requests
│   │   ├── user/              # User data
│   │   └── webhooks/          # Payment webhooks
│   └── ...                     # UI pages (to be created)
├── lib/
│   ├── auth/                  # Authentication utilities
│   ├── validations/           # Zod schemas
│   ├── env.ts                 # Environment validation
│   ├── prisma.ts              # Prisma client
│   └── utils.ts               # Helper functions
├── services/
│   ├── otp/                   # OTP/MSG91 service
│   └── payment/               # Razorpay service
├── prisma/
│   └── schema.prisma          # Database schema
├── components/                 # UI components
├── DOCUMENTATION.md           # Complete documentation
├── SETUP.md                   # Setup guide
└── ENV_TEMPLATE.md            # Environment variables template
```

## 🔑 Environment Setup

Required environment variables:

```bash
# Database
DATABASE_URL="postgresql://..."

# JWT
JWT_SECRET="your-32-character-secret"
JWT_EXPIRES_IN="7d"

# MSG91 (OTP)
MSG91_AUTH_KEY="..."
MSG91_SENDER_ID="..."
MSG91_TEMPLATE_ID="..."

# Razorpay
RAZORPAY_KEY_ID="..."
RAZORPAY_KEY_SECRET="..."
RAZORPAY_WEBHOOK_SECRET="..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3002"
NODE_ENV="development"
```

See [ENV_TEMPLATE.md](./ENV_TEMPLATE.md) for complete list.

## 🗄️ Database Commands

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Run migrations
npm run db:migrate

# Open Prisma Studio
npm run db:studio

# Reset database
npm run db:reset
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with 12 rounds
- **JWT Tokens**: Signed with HS256, httpOnly cookies
- **OTP Security**: Hashed storage, rate limiting, time-limited
- **Input Validation**: Zod schemas on all endpoints
- **Payment Security**: Razorpay signature verification
- **SQL Injection Prevention**: Prisma ORM parameterization

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/resend-otp` - Resend OTP

### Admin Auth
- `POST /api/admin/auth/login` - Admin login

### User
- `GET /api/user/me` - Get user profile
- `GET /api/user/subscription` - Get active subscription

### Plans
- `GET /api/plans` - Get active plans (public)

### Payment
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment
- `POST /api/webhooks/razorpay` - Payment webhook

### Quiz
- `POST /api/quiz/submit` - Submit quiz

### Contact
- `POST /api/contact` - Submit contact form

### Refund
- `POST /api/refund/request` - Request refund

### Admin APIs
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/users` - List users
- `GET /api/admin/plans` - Manage plans
- `GET /api/admin/subscriptions` - Manage subscriptions
- `GET /api/admin/quiz` - Review quiz submissions
- `GET /api/admin/refunds` - Process refunds
- `GET /api/admin/contact` - View contact queries

See [DOCUMENTATION.md](./DOCUMENTATION.md) for complete API documentation.

## 🚢 Deployment

### Prerequisites
- PostgreSQL database (managed service recommended)
- Node.js hosting (Vercel, Railway, Render, etc.)
- Domain with SSL certificate

### Steps
1. Set up production database
2. Configure environment variables
3. Run database migrations
4. Build application
5. Deploy to hosting platform
6. Configure Razorpay webhook URL
7. Create admin user via Prisma Studio

See [DOCUMENTATION.md](./DOCUMENTATION.md#deployment-guide) for detailed deployment guide.

## 🐛 Troubleshooting

### Prisma Client Not Lean Protocol
```bash
npm run db:generate
```

### Database Connection Failed
- Check `DATABASE_URL` in `.env`
- Verify PostgreSQL is running
- Check connection string format

### OTP Not Sending
- Verify MSG91 credentials
- Check account balance
- Verify DLT registration (India)

See [DOCUMENTATION.md](./DOCUMENTATION.md#troubleshooting) for more solutions.

## 📞 Support

For detailed documentation, see [DOCUMENTATION.md](./DOCUMENTATION.md)

## 📄 License

Proprietary - All rights reserved

---

**Version**: 1.0.0  
**Last Updated**: January 2026
# lp
