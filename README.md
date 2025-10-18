# ComParts - Computer Parts Selling App MVP

A complete cross-platform computer parts selling application built with Firebase, React Native (Expo), and Next.js.

## 🏗️ Architecture

- **Mobile App**: Expo React Native (iOS/Android)
- **Admin Panel**: Next.js (Web)
- **Backend**: Firebase Cloud Functions
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage
- **Payments**: Razorpay + Stripe
- **Shipping**: Shiprocket API

## 📁 Project Structure

```
comparts/
├── mobile/                 # Expo React Native app
├── admin/                  # Next.js admin panel
├── functions/              # Firebase Cloud Functions
├── firebase.json           # Firebase configuration
├── .firebaserc            # Firebase project settings
└── docs/                  # Documentation
```

## 🚀 Quick Start

1. **Setup Firebase Project**
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init
   ```

2. **Mobile App**
   ```bash
   cd mobile
   npm install
   npx expo start
   ```

3. **Admin Panel**
   ```bash
   cd admin
   npm install
   npm run dev
   ```

4. **Deploy Functions**
   ```bash
   cd functions
   npm install
   firebase deploy --only functions
   ```

## 🔐 Environment Variables

Copy `.env.example` files in each directory and fill with your credentials.

## 📱 Features

### Mobile App
- User Authentication (Sign up/Login)
- Product Browsing & Search
- Product Details & Reviews
- Shopping Cart & Checkout
- Payment Integration
- Order History & Tracking

### Admin Panel
- Secure Admin Authentication
- Product CRUD Operations
- Category & Stock Management
- Order Management
- Analytics Dashboard

## 🛡️ Security Features

- Firebase Security Rules
- Input validation & sanitization
- Rate limiting
- Secure payment processing
- Environment variable protection