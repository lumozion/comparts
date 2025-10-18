# 🚀 Deployment Guide

## Prerequisites

1. **Firebase Account**: Create a project at [Firebase Console](https://console.firebase.google.com)
2. **Vercel Account**: Sign up at [Vercel](https://vercel.com)
3. **Payment Gateway Accounts**:
   - Razorpay: [Dashboard](https://dashboard.razorpay.com)
   - Stripe: [Dashboard](https://dashboard.stripe.com)
4. **Shiprocket Account**: [Shiprocket](https://www.shiprocket.in)

## Step 1: Firebase Setup

### 1.1 Create Firebase Project
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize project
firebase init
```

### 1.2 Enable Services
- **Authentication**: Enable Email/Password provider
- **Firestore**: Create database in production mode
- **Storage**: Enable Firebase Storage
- **Functions**: Enable Cloud Functions

### 1.3 Create Admin User
```javascript
// Run this in Firebase Console > Firestore
// Create collection 'admins' with document ID as your user UID
{
  email: "admin@comparts.com",
  role: "admin",
  createdAt: new Date()
}
```

## Step 2: Environment Configuration

### 2.1 Firebase Functions
```bash
cd functions

# Set environment variables
firebase functions:config:set \
  razorpay.key_id="your_razorpay_key_id" \
  razorpay.key_secret="your_razorpay_key_secret" \
  stripe.secret_key="your_stripe_secret_key" \
  shiprocket.email="your_shiprocket_email" \
  shiprocket.password="your_shiprocket_password"
```

### 2.2 Mobile App Environment
```bash
cd mobile
cp .env.example .env
# Fill in your Firebase config values
```

### 2.3 Admin Panel Environment
```bash
cd admin
cp .env.example .env.local
# Fill in your Firebase config values
```

## Step 3: Deploy Firebase Functions

```bash
cd functions
npm install
firebase deploy --only functions
```

## Step 4: Deploy Admin Panel to Vercel

### 4.1 Build and Deploy
```bash
cd admin
npm install
npm run build

# Deploy to Vercel
npx vercel --prod
```

### 4.2 Configure Environment Variables in Vercel
- Go to Vercel Dashboard > Project Settings > Environment Variables
- Add all variables from `.env.example`

## Step 5: Mobile App Deployment

### 5.1 Expo Development Build
```bash
cd mobile
npm install

# Start development server
npx expo start

# For production build
npx expo build:android
npx expo build:ios
```

### 5.2 EAS Build (Recommended)
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Configure EAS
eas build:configure

# Build for production
eas build --platform all
```

## Step 6: Payment Gateway Configuration

### 6.1 Razorpay Setup
1. Create account at [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Generate API keys from Settings > API Keys
3. Configure webhook URL: `https://your-functions-url/api/razorpay-webhook`

### 6.2 Stripe Setup
1. Create account at [Stripe Dashboard](https://dashboard.stripe.com)
2. Get API keys from Developers > API keys
3. Configure webhook endpoint for payment events

## Step 7: Shiprocket Integration

1. Create account at [Shiprocket](https://www.shiprocket.in)
2. Get API credentials from Settings
3. Configure webhook URL: `https://your-functions-url/api/shiprocket-webhook`

## Step 8: Security Configuration

### 8.1 Firebase Security Rules
Deploy the security rules:
```bash
firebase deploy --only firestore:rules,storage
```

### 8.2 CORS Configuration
Ensure your functions handle CORS properly for web requests.

## Step 9: Testing

### 9.1 Test Payment Flow
- Use Razorpay test cards: 4111 1111 1111 1111
- Use Stripe test cards: 4242 4242 4242 4242

### 9.2 Test Shipping
- Use Shiprocket sandbox environment for testing

## Step 10: Production Checklist

- [ ] Firebase project in production mode
- [ ] All environment variables configured
- [ ] Security rules deployed
- [ ] Payment gateways in live mode
- [ ] SSL certificates configured
- [ ] Error monitoring setup
- [ ] Analytics configured
- [ ] Backup strategy implemented

## Monitoring & Maintenance

### Error Tracking
- Firebase Crashlytics for mobile app
- Vercel Analytics for admin panel
- Firebase Functions logs for backend

### Performance Monitoring
- Firebase Performance Monitoring
- Vercel Speed Insights

### Cost Optimization
- Monitor Firebase usage
- Optimize Firestore queries
- Use Firebase Functions efficiently

## Support

For issues and questions:
1. Check Firebase Console logs
2. Review Vercel deployment logs
3. Monitor payment gateway webhooks
4. Check Shiprocket API responses