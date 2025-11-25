# 🏠 Orbit PG Database - Complete Documentation & Implementation Guide

**Project**: Student Housing Marketplace (DSU & Jain University)  
**Status**: 65% Complete (Up from 60%)  
**Date**: November 25, 2025  
**Latest Update**: Session 3 - Avatar Upload, Routing Fixes, Hydration Issues Resolved  
**Tech Stack**: Next.js 16.0.3 + MongoDB + TypeScript + Tailwind CSS

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current Architecture](#current-architecture)
3. [What's Implemented](#whats-implemented)
4. [Session 3 Updates](#session-3-updates)
5. [What's Missing](#whats-missing)
6. [Implementation Roadmap](#implementation-roadmap)
7. [Database Schema](#database-schema)
8. [API Endpoints](#api-endpoints)
9. [Tech Recommendations](#tech-recommendations)
10. [Environment Variables](#environment-variables)
11. [Implementation Checklist](#implementation-checklist)
12. [Cost Analysis](#cost-analysis)
13. [Success Metrics](#success-metrics)
14. [Limitations & Known Issues](#limitations--known-issues)

---

## Executive Summary

**Orbit** is a PG/hostel marketplace connecting students with property owners in Bangalore (DSU, Jain University areas).

### Current State
- ✅ **65% Complete**: Core features + Admin system + Avatar upload working
- ✅ Landing page, search, property details functional
- ✅ Authentication system live (Auth0 + NextAuth)
- ✅ AI Chatbot working (Gemini 2.0)
- ✅ Review system implemented
- ✅ **Admin Dashboard COMPLETE** - Stats, user management, property approval
- ✅ **User Verification System** - Email verification, blacklist management
- ✅ **Icon-based UI** - Enhanced visual indicators for status
- ✅ **Rupee pricing** - All prices displayed in ₹ format
- ✅ **Property Image Gallery** - Working 4-image gallery system
- ✅ **Authentication Routing** - Role-based dashboard navigation (admin vs student)
- ✅ **Logout Flow** - Proper redirect to home page
- ✅ **Admin Panel Minimize** - Collapsible navigation for admin interface
- ✅ **Dropdown Auto-close** - Menu closes on navigation
- ✅ **Hydration Fixes** - All hydration errors resolved (suppressHydrationWarning)
- ✅ **Avatar Upload** - Admin profile picture with Cloudinary
- ✅ **Sign-in Redirect** - After login, users go to home page
- ✅ **Browser Extension Support** - All buttons compatible with form fillers (suppressHydrationWarning)
- ✅ **Avatar Upload Feature** - Admin can change profile picture via Cloudinary
- ✅ **Sign-in Redirect Fixed** - After login, users go to home page (not dashboard)
- ✅ **Browser Extension Compatibility** - All buttons compatible with form fillers
- ❌ Payment system incomplete
- ❌ Owner dashboard missing
- ❌ Advanced file upload system missing

### Key Metrics
- **Database Models**: 4 (User, Property, Booking, Review)
- **Pages**: 8 main pages (+ 5 admin pages)
- **API Routes**: 20+ endpoints (+ 7 admin endpoints)
- **Users**: 2 verified admin accounts
- **Properties**: Seeded with sample data
- **Admin Features**: 10+ (stats, user verification, property approval, etc)

---

## Session 3 Updates

### Avatar Upload Feature (NEW)
- ✅ **Created `/api/admin/upload-avatar` endpoint**
  - POST endpoint with FormData multipart support
  - File validation: 5MB max, image MIME types only
  - Cloudinary integration for image hosting
  - Auto-optimization of images (quality: auto, format: auto)
  - Returns secure_url for image storage
  - Creates AuditLog entry for admin tracking

- ✅ **Enhanced `/api/admin/profile` endpoint**
  - Added GET method to fetch admin profile data
  - Returns: name, email, role, avatar (image URL)
  - Complements existing PUT method for updates

- ✅ **Admin Profile Page Updates** (`/src/app/admin/profile/page.tsx`)
  - Changed from useSession hook to API-based fetching
  - Prevents SessionProvider errors
  - Added "Change Avatar" button with file picker
  - Hidden input: `accept="image/*"`
  - onClick triggers file picker: `document.getElementById('avatar-upload')?.click()`
  - Displays new avatar immediately after upload

### Package Installations
- ✅ **cloudinary** (v1.x) - Image hosting and optimization
- ✅ **date-fns** (v3.x) - Date formatting for audit logs
- ✅ **react-csv** (v2.x) - CSV export for audit logs

### Navigation & Routing Fixes
- ✅ **Sign-in Callback URL** - Changed from `/dashboard` to `/`
  - Users now redirect to home page after login
  - Consistent with home page as landing area
  - Works for both admin and regular users

- ✅ **Updated `src/app/auth/signin/page.tsx`**
  - Modified signIn callback: `callbackUrl: '/'`
  - Users see home page first after authentication
  - Can access admin dashboard from navbar dropdown if admin

- ✅ **Updated `src/components/Navbar.tsx`**
  - Admin users see "Admin Dashboard" option in dropdown
  - Regular users see "Home" option in dropdown
  - Fixed routing logic with ternary condition
  - Sign In button works for logged-out users

### Hydration Warning Fixes
- ✅ **Root Cause Identified**: Browser extensions (form fillers, password managers like Dashlane/LastPass)
  - Add attributes like `fdprocessedid="xxx"` to form elements
  - Creates mismatch between server and client HTML
  - React 18 complains about hydration mismatch

- ✅ **Solution Applied**: `suppressHydrationWarning` prop
  - Added to all interactive elements prone to extension interference
  - Safe for third-party extension mismatches

- ✅ **Fixed Elements**:
  - Search input on `/search` page
  - "View All Properties" button on home page
  - "Search" button in HeroSection
  - "Trending" buttons in HeroSection
  - "Get Started Now" button on home page
  - "Sign In" button in Navbar
  - "Sign in / Sign up" button on auth page

### Code Changes Summary

**Files Modified in Session 3**:
```
src/app/admin/profile/page.tsx
├─ Removed useSession hook
├─ Added API-based profile fetching
├─ Added handleImageUpload function
├─ Added file input element
└─ Added "Change Avatar" button with onClick handler

src/app/api/admin/profile/route.ts
├─ Added GET endpoint for profile fetch
├─ Returns: name, email, role, avatar
└─ Requires admin authentication

src/app/api/admin/upload-avatar/route.ts (NEW)
├─ POST endpoint for avatar uploads
├─ File validation (5MB, image only)
├─ Cloudinary integration
├─ AuditLog creation
└─ Returns secure_url

src/app/auth/signin/page.tsx
├─ Changed callbackUrl to '/'
└─ Added suppressHydrationWarning

src/components/Navbar.tsx
├─ Added suppressHydrationWarning to Sign In button
├─ Fixed admin routing in dropdown
└─ Updated dropdown options

src/components/landing/HeroSection.tsx
├─ Added suppressHydrationWarning to Search button
├─ Added suppressHydrationWarning to trending buttons
└─ Updated button formatting

src/app/page.tsx
├─ Added suppressHydrationWarning to View All Properties button
└─ Added suppressHydrationWarning to Get Started Now button

src/app/search/page.tsx
├─ Added suppressHydrationWarning to search input
└─ Prevents browser extension conflicts
```

---

### Technology Stack

```
Frontend Layer:
├── Next.js 16.0.3 (React framework)
├── TypeScript (Type safety)
├── Tailwind CSS (Styling)
└── Lucide Icons (UI icons)

Backend Layer:
├── Next.js API Routes (Serverless)
├── NextAuth v4 (Authentication)
├── Auth0 (OAuth provider)
└── Gemini 2.0 API (AI features)

Database Layer:
├── MongoDB (Document database)
├── Mongoose (ODM)
└── MongoDB Atlas (Cloud hosting)

Infrastructure:
├── Vercel (Hosting)
├── GitHub (Version control)
└── Environment variables (.env.local)
```

### Database Models

#### User Model
```typescript
{
  _id: ObjectId
  name: string
  email: string (unique)
  image?: string (profile picture URL)
  role: 'student' | 'owner' | 'admin'
  isVerified: boolean (email verified)
  phone?: string
  university?: 'DSU' | 'Jain' | 'Other'
  blacklisted: boolean (blocked from platform)
  createdAt: Date
  updatedAt: Date
}
```

**Purpose**: Stores user accounts with role-based access control

#### Property Model
```typescript
{
  _id: ObjectId
  ownerId: ObjectId (reference to User)
  title: string (e.g., "Sai Balaji PG")
  slug: string (unique URL-friendly name)
  description: string (long-form description)
  
  location: {
    lat: number (latitude for map)
    lng: number (longitude for map)
    address: string (full address)
    directionsVideoUrl?: string (route video)
  }
  
  price: {
    amount: number (monthly rent in INR)
    period: 'monthly'
  }
  
  amenities: string[] (WiFi, Food, AC, etc)
  
  media: {
    images: string[] (URLs of property images)
    virtualTourUrl?: string (360° tour)
  }
  
  liveStats: {
    totalRooms: number (total available)
    occupiedRooms: number (booked)
  }
  
  verdict?: string (verification note)
  sentimentTags: string[] (tags: Premium, Budget, etc)
  createdAt: Date
  updatedAt: Date
}
```

**Purpose**: Stores PG/property listings with availability tracking

#### Booking Model
```typescript
{
  _id: ObjectId
  studentId: ObjectId (reference to User)
  propertyId: ObjectId (reference to Property)
  status: 'pending' | 'paid' | 'confirmed' | 'rejected'
  paymentId?: string (Razorpay payment ID)
  amountPaid: number (booking amount)
  createdAt: Date
  updatedAt: Date
}
```

**Purpose**: Tracks booking requests and payment status

#### Review Model
```typescript
{
  _id: ObjectId
  studentId: ObjectId (reference to User)
  propertyId: ObjectId (reference to Property)
  rating: number (1-5 stars)
  comment: string (review text)
  isAnonymous: boolean (hide reviewer name)
  createdAt: Date
  updatedAt: Date
}
```

**Purpose**: Stores student reviews and ratings

---

## What's Implemented ✅ (60%)

### Pages & Features

| Feature | Status | Details |
|---------|--------|---------|
| **Landing Page** | ✅ Complete | Hero, value props, featured properties |
| **Search Page** | ✅ Complete | Text search, property list view |
| **Property Details** | ✅ Complete | Full page with images, amenities, reviews |
| **Property Gallery** | ✅ Complete | 4-image grid with tabs (Photos, 360°, Video) |
| **Dashboard** | ✅ Complete | Student bookings view |
| **Auth System** | ✅ Complete | Login/signup with Auth0 |
| **AI Chatbot** | ✅ Complete | Gemini integration working |
| **Booking** | ⚠️ Partial | Creates bookings, no payment flow |
| **Reviews** | ✅ Complete | Rate and comment on properties |
| **Admin Dashboard** | ✅ Complete | Overview, stats, service cards |
| **Admin Users** | ✅ Complete | List, verify, blacklist users |
| **Admin Properties** | ✅ Complete | Approve/reject, view property details |
| **User Verification** | ✅ Complete | Email verification, verify/unverify UI |
| **Blacklist** | ✅ Complete | Flag to block users |
| **Icon-based UI** | ✅ Complete | Status indicators with Lucide icons |
| **Rupee Currency** | ✅ Complete | All prices in ₹ format with Indian locales |

### API Routes Implemented

```
GET  /api/properties          → List all properties (auto-seeds if empty)
POST /api/properties          → Create new property (owner only)
GET  /api/auth/session        → Get logged-in user session
POST /api/bookings/create     → Create booking (no payment yet)
GET  /api/chat               → AI chatbot endpoint
POST /api/chat               → Send chat message
GET  /api/seed               → Manually seed database
GET  /api/debug              → Debug database info
GET  /api/test               → Test endpoint

ADMIN ROUTES:
GET  /api/admin/stats        → Dashboard statistics
GET  /api/admin/properties   → List all properties
PATCH /api/admin/properties/[id] → Approve/reject property
GET  /api/admin/users        → List all users
GET  /api/admin/profile      → Get admin profile data (NEW)
PUT  /api/admin/profile      → Update admin profile (name, email)
POST /api/admin/upload-avatar → Upload admin avatar to Cloudinary (NEW)
POST /api/admin/users/[id]/verify → Verify/unverify user
POST /api/admin/users/[id]/blacklist → Blacklist/unblacklist user with reason
GET  /api/admin/bookings     → List all bookings
GET  /api/admin/audit-logs   → Get audit log entries (NEW)
POST /api/admin/setup        → Create admin user (multi-param support)
```

### Key Features Working

- ✅ User can browse properties with filtering
- ✅ Search by property name/address
- ✅ View detailed property info with image gallery
- ✅ Read reviews from students
- ✅ Chat with AI assistant
- ✅ Create booking request
- ✅ Google Maps integration (location display)
- ✅ Image gallery with 4-image grid system
- ✅ Real-time user sessions
- ✅ **Admin dashboard with live statistics**
- ✅ **User verification and blacklist management**
- ✅ **Property approval workflow**
- ✅ **Role-based access control (admin/owner/student)**
- ✅ **Icon-based status indicators**
- ✅ **Rupee (₹) pricing format**
- ✅ **Multiple admin accounts support**

---

## What's Missing ❌ (60%)

### Critical Features (Blocking Launch)

#### 1. Payment Gateway ❌
**Why Critical**: Can't complete transactions

**What's needed**:
- Razorpay integration
- Payment order creation
- Payment verification
- Webhook handling
- Receipt generation

**Effort**: 3-4 hours
**Cost**: $0 (Razorpay free for testing)

#### 2. Owner Dashboard ❌
**Why Critical**: Owners can't manage properties

**What's needed**:
- `/owner/dashboard` page
- `/owner/properties` list page
- `/owner/property/[id]/edit` edit page
- Property CRUD operations
- Availability management
- Pricing management

**Effort**: 5-6 hours
**Cost**: $0

#### 3. File Upload System ❌
**Why Critical**: Using placeholder images only

**What's needed**:
- Image upload endpoint
- Cloud storage integration (Cloudinary recommended)
- Image URL storage
- Upload UI component

**Effort**: 2-3 hours
**Cost**: Free tier available

---

### High Priority Features

#### 4. Real-time Availability Updates ⚠️
**Issue**: When owner updates availability, students don't see it instantly

**Solution**: 
- Option A: WebSocket/Socket.io (real-time)
- Option B: Polling every 30 seconds (simple)

**Effort**: 3-4 hours

#### 5. Room Type Variations ⚠️
**Issue**: All rooms priced same, can't show 1RK vs 2BHK

**Solution**: 
- Update Property schema
- Add array of room types
- Different pricing per type
- Different availability per type

**Effort**: 3-4 hours

#### 6. Advanced Search Filters ⚠️
**Issue**: Only text search, no price/amenity filters

**Solution**:
- Price range slider
- Amenities multi-select
- Location distance filter
- Room type filter
- Availability toggle

**Effort**: 3-4 hours

---

### Medium Priority Features

#### 7. Email Notifications ⚠️
**Purpose**: Confirmation emails for bookings, payments

**What's needed**:
- SendGrid integration
- Email templates
- Booking confirmation
- Payment receipt
- Review reminders

**Effort**: 2-3 hours
**Cost**: Free tier (100/day)

#### 8. Virtual Tours (360°) ⚠️
**Purpose**: Students see PG before visiting

**Options**:
- YouTube 360 videos (easiest)
- Three.js 360 viewer (more control)
- Matterport (most professional)

**Effort**: 2-5 hours (depends on option)
**Cost**: Free for YouTube

#### 9. Admin Dashboard ⚠️
**Purpose**: Approve properties, manage users

**What's needed**:
- `/admin/dashboard` page
- Property approval system
- User blacklist management
- Analytics/reporting
- Content moderation

**Effort**: 6-8 hours

#### 10. Enhanced Verification ⚠️
**Purpose**: Build trust on platform

**What's needed**:
- Phone verification (OTP via SMS)
- University email verification
- Student ID verification
- Verification badges

**Effort**: 4-5 hours
**Cost**: Twilio SMS (~$0.01 per SMS)

---

## Implementation Roadmap

### Phase 1: Core Monetization (Weeks 1-2)

**Goal**: Enable payments and owner management

**Week 1 Tasks**:
1. Setup Razorpay account
2. Create `/api/bookings/create` endpoint
3. Create `/api/bookings/[id]/verify` endpoint
4. Create webhook handler
5. Setup Cloudinary
6. Create `/api/upload` endpoint

**Week 2 Tasks**:
1. Build `/owner/dashboard` page
2. Build `/owner/properties` page
3. Build `/owner/property/[id]/edit` page
4. Create `PATCH /api/properties/[id]` endpoint
5. Add file upload UI to edit page
6. Test end-to-end booking flow

**Outcome**: 
- ✅ Students can pay for bookings
- ✅ Owners can manage properties
- ✅ Real property images uploaded

---

### Phase 2: User Experience (Weeks 3-4)

**Goal**: Improve search and filtering

**Week 3 Tasks**:
1. Add filter UI to `/search` page
2. Implement price range filter
3. Implement amenities filter
4. Implement location distance filter
5. Implement room type filter
6. Update Property schema with room types

**Week 4 Tasks**:
1. Setup SendGrid
2. Create email templates (HTML)
3. Create booking confirmation email
4. Create payment receipt email
5. Add email triggers to API
6. Test email delivery

**Outcome**:
- ✅ Users can filter by preferences
- ✅ Different room types with pricing
- ✅ Booking confirmations via email

---

### Phase 3: Trust & Features (Weeks 5-6)

**Goal**: Build trust, differentiate product

**Week 5 Tasks**:
1. Choose virtual tour method
2. Integrate YouTube 360 or Three.js
3. Setup Twilio for SMS
4. Add phone verification flow
5. Add university email verification

**Week 6 Tasks**:
1. Add verification badges to profiles
2. Create admin property approval system
3. Test verification flows
4. Document verification process

**Outcome**:
- ✅ Virtual tours for properties
- ✅ Verified student/owner badges
- ✅ Admin can approve listings

---

### Phase 4: Analytics & Scale (Week 7)

**Goal**: Track metrics, enable admin functions

**Tasks**:
1. Build `/admin/dashboard` page
2. Create `/admin/properties` page
3. Create `/admin/users` page
4. Setup analytics tracking
5. Create admin authentication
6. Test admin panel

**Outcome**:
- ✅ Admin dashboard working
- ✅ Business metrics tracked
- ✅ Ready to scale

---

## Database Schema Changes

### Update Property Model

**Add these fields**:
```typescript
roomTypes: Array<{
  type: string,           // "1RK", "Double Sharing", "Triple Sharing"
  totalRooms: number,     // How many available
  occupiedRooms: number,  // How many booked
  pricePerMonth: number,  // Price for this room type
  description?: string    // Details about room
}>

contactMethods: {
  phone: string,
  whatsapp: string,
  email: string,
  preferredContact?: string
}

approvalStatus: 'pending' | 'approved' | 'rejected'
approvedBy?: ObjectId
approvalDate?: Date

roomFeatures?: {
  wifi: boolean
  foodIncluded: number    // 0, 1, 2, or 3 times per day
  bedType: string         // Single, Double, etc
  bathroom: string        // Shared, Attached, etc
  ac: boolean
  parking: boolean
}
```

### New Models to Create

**PropertyImage Model**:
```typescript
{
  _id: ObjectId
  propertyId: ObjectId
  url: string
  order: number
  uploadedAt: Date
  uploadedBy: ObjectId
}
```

**Notification Model**:
```typescript
{
  _id: ObjectId
  userId: ObjectId
  type: 'booking' | 'payment' | 'review' | 'message'
  title: string
  message: string
  read: boolean
  link?: string
  createdAt: Date
}
```

**Payment Model**:
```typescript
{
  _id: ObjectId
  bookingId: ObjectId
  razorpayOrderId: string
  razorpayPaymentId: string
  razorpaySignature: string
  amount: number
  currency: string (INR)
  status: 'created' | 'authorized' | 'captured' | 'failed' | 'refunded'
  createdAt: Date
  verifiedAt?: Date
}
```

**AdminLog Model**:
```typescript
{
  _id: ObjectId
  adminId: ObjectId
  action: string
  targetId?: ObjectId
  details?: any
  createdAt: Date
}
```

---

## API Endpoints

### Payments (TO BUILD)

```
POST /api/bookings/create
├─ Input: { propertyId, studentId, bookingDate }
├─ Action: Create Razorpay order
└─ Returns: { orderId, amount, key }

POST /api/bookings/[id]/verify
├─ Input: { paymentId, signature }
├─ Action: Verify payment, update booking status
└─ Returns: { success, bookingDetails }

POST /api/webhooks/razorpay
├─ Input: Webhook from Razorpay
├─ Action: Listen for payment events
└─ Updates: Booking status in database
```

### Upload (TO BUILD)

```
POST /api/upload
├─ Input: multipart/form-data with image files
├─ Action: Upload to Cloudinary
└─ Returns: [{ url, filename, uploadDate }]
```

### Properties (TO UPDATE)

```
PATCH /api/properties/[id]
├─ Input: Updated property data
├─ Action: Update property (owner only)
└─ Returns: Updated property object

DELETE /api/properties/[id]
├─ Input: Property ID
├─ Action: Delete property (owner only)
└─ Returns: { success: true }

GET /api/properties?filters
├─ Query: price, amenities, distance, roomType
├─ Action: Filter properties
└─ Returns: Array of matching properties
```

### Owner (TO BUILD)

```
GET /api/owner/properties
├─ Action: List all properties owned by user
└─ Returns: Array of properties with stats

GET /api/owner/bookings
├─ Action: List bookings for owner's properties
└─ Returns: Array of bookings

PATCH /api/owner/profile
├─ Input: Updated owner details
├─ Action: Update owner profile
└─ Returns: Updated profile
```

### Notifications (TO BUILD)

```
POST /api/notifications/send
├─ Input: { userId, type, title, message }
├─ Action: Send email notification
└─ Returns: { sent: true }

GET /api/notifications
├─ Action: Get user's notifications
└─ Returns: Array of notifications

PATCH /api/notifications/[id]
├─ Input: { read: true }
├─ Action: Mark notification as read
└─ Returns: Updated notification
```

### Admin (TO BUILD)

```
GET /api/admin/stats
├─ Action: Get dashboard statistics
└─ Returns: { users, properties, bookings, revenue }

PATCH /api/admin/properties/[id]
├─ Input: { approvalStatus }
├─ Action: Approve/reject property
└─ Returns: Updated property

POST /api/admin/users/[id]/blacklist
├─ Input: { reason }
├─ Action: Add user to blacklist
└─ Returns: { success: true }

GET /api/admin/logs
├─ Action: Get admin action logs
└─ Returns: Array of admin actions
```

---

## Tech Recommendations

### Payment Gateway

| Option | Pros | Cons | Recommendation |
|--------|------|------|---|
| **Razorpay** | India-focused, low fees, easy API | Need business account | ✅ **BEST** |
| Stripe | Global, reliable | High fees for India, complex | For international |
| PayU | Local option | Higher fees | Alternative |

**Recommendation**: **Razorpay**
- Lowest fees in India
- Built for Indian payments
- Good documentation
- Works with UPI, Cards, Wallets

---

### File Upload

| Option | Pros | Cons | Cost | Recommendation |
|--------|------|------|------|---|
| **Cloudinary** | Easy to use, CDN included | Vendor lock-in | Free: 25GB | ✅ **BEST** |
| AWS S3 | Scalable, reliable | Complex setup | Pay as you go | For scale |
| Firebase | Easy to setup | Limited free tier | Free: 5GB | OK for MVP |
| Supabase | Good free tier | Smaller community | Free: 500MB | Alternative |

**Recommendation**: **Cloudinary**
- Easy integration
- CDN for fast image loading
- Free tier very generous
- Good documentation

---

### Email Notifications

| Option | Pros | Cons | Cost | Recommendation |
|--------|------|------|------|---|
| **SendGrid** | Reliable, good templates | Can be expensive at scale | Free: 100/day | ✅ **BEST** |
| Mailgun | Good documentation | Fewer templates | Free: 100/month | Limited |
| Resend | Modern, React-friendly | Newer service | Free: 100/month | Alternative |
| AWS SES | Cheap at scale | Complex setup | Pay as you go | For scale |

**Recommendation**: **SendGrid**
- Industry standard
- Good email delivery
- Free tier covers MVP
- Easy to setup

---

### Phone Verification

| Option | Pros | Cons | Cost |
|--------|------|------|------|
| **Twilio** | Industry standard | Higher cost | $0.01/SMS |
| AWS SNS | Cheaper at scale | Complex setup | $0.005/SMS |
| MSG91 | India-focused | Smaller community | ₹0.50/SMS |
| Exotel | India-focused | Limited features | ₹0.40/SMS |

**Recommendation**: **Twilio** (for MVP) or **MSG91** (for cost)

---

### Virtual Tours

| Option | Method | Pros | Cons | Cost | Effort |
|--------|--------|------|------|------|--------|
| **YouTube 360** | Embed video | Free, easy | Limited interactivity | Free | 1-2h |
| **Three.js** | 3D viewer | Full control | Requires 360 images | Free | 4-5h |
| **Matterport** | Professional scan | Best UX | Expensive scans | $25/scan | 0h (3rd party) |
| **Kuula** | 360 platform | Easy to use | Limited free tier | Free trial | 2-3h |

**Recommendation for MVP**: **YouTube 360** (fastest)
**Recommendation for production**: **Three.js** (more control)

---

### Analytics

| Option | Pros | Cons | Cost |
|--------|------|------|------|
| **Mixpanel** | Great for startups, event tracking | Can be expensive | Free: 100k events |
| **Amplitude** | Similar to Mixpanel | Complex setup | Free: 100k events |
| **Google Analytics 4** | Free, familiar | Less granular | Free |
| **Segment** | Multi-tool platform | Over-engineered for MVP | Free: 100k events |

**Recommendation**: **Google Analytics 4** (free and easy)

---

## Environment Variables

### Add to `.env.local`:

```env
# ===== EXISTING (Keep these) =====
MONGODB_URI=mongodb+srv://...
GOOGLE_GENERATIVE_AI_API_KEY=...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...
AUTH0_CLIENT_ID=...
AUTH0_CLIENT_SECRET=...
AUTH0_ISSUER=...

# ===== ADD THESE =====

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXX
RAZORPAY_WEBHOOK_SECRET=XXXXXXXXXXXXXXXX

# File Upload (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=XXXXXXXXXX
CLOUDINARY_API_SECRET=XXXXXXXXXXXXXXXX

# Email Notifications (SendGrid)
SENDGRID_API_KEY=SG.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
SENDER_EMAIL=noreply@orbitpg.com
SENDER_NAME=Orbit

# Phone Verification (Twilio)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+91...

# Analytics (Mixpanel)
MIXPANEL_TOKEN=XXXXXXXX

# Admin Email
ADMIN_EMAIL=admin@orbitpg.com

# Business Logic
RAZORPAY_BOOKING_COMMISSION=15  # 15% commission on bookings
```

---

## Implementation Checklist

### Week 1: Payments & Upload
- [ ] Create Razorpay account and get API keys
- [ ] Add Razorpay keys to .env.local
- [ ] Create `/api/bookings/create` endpoint
- [ ] Create `/api/bookings/[id]/verify` endpoint
- [ ] Create webhook handler at `/api/webhooks/razorpay`
- [ ] Test payment flow locally
- [ ] Create Cloudinary account
- [ ] Add Cloudinary keys to .env.local
- [ ] Create `/api/upload` endpoint
- [ ] Test image upload
- [ ] Update booking form to show payment button
- [ ] Test booking with payment locally

### Week 2: Owner Dashboard
- [ ] Create `/owner` directory structure
- [ ] Create `/owner/dashboard/page.tsx`
- [ ] Create `/owner/properties/page.tsx`
- [ ] Create `/owner/property/[id]/edit/page.tsx`
- [ ] Create `PATCH /api/properties/[id]` endpoint
- [ ] Add owner authentication checks
- [ ] Add file upload UI to edit page
- [ ] Test creating/editing properties as owner
- [ ] Test viewing owner dashboard
- [ ] Deploy to staging environment

### Week 3: Search Filters
- [ ] Update Property schema with roomTypes
- [ ] Create filter component UI
- [ ] Add price range slider
- [ ] Add amenities checkboxes
- [ ] Add location distance filter
- [ ] Add room type filter
- [ ] Update `/api/properties` backend
- [ ] Implement all filter logic
- [ ] Test each filter individually
- [ ] Test combined filters
- [ ] Performance test with many properties

### Week 4: Email & Notifications
- [ ] Create SendGrid account
- [ ] Add SendGrid keys to .env.local
- [ ] Create email template for booking confirmation
- [ ] Create email template for payment receipt
- [ ] Create email template for review reminder
- [ ] Create `/api/notifications/send` endpoint
- [ ] Add email trigger to booking creation
- [ ] Add email trigger to payment verification
- [ ] Create notification UI component
- [ ] Test email delivery
- [ ] Add to dashboard notifications page

### Week 5: Virtual Tours
- [ ] Decide on YouTube 360 vs Three.js
- [ ] If YouTube: Create integration code
- [ ] If Three.js: Setup Three.js project
- [ ] Add virtual tour upload to owner dashboard
- [ ] Create virtual tour display component
- [ ] Test on property detail page
- [ ] Add 360° tab to media gallery

### Week 6: Verification System
- [ ] Create Twilio account
- [ ] Add Twilio keys to .env.local
- [ ] Create phone verification flow
- [ ] Create SMS OTP endpoint
- [ ] Create university email verification
- [ ] Create verification badge component
- [ ] Update User model with verification fields
- [ ] Add verification checks to relevant pages
- [ ] Test phone OTP flow
- [ ] Test email verification flow

### Week 7: Admin Panel & Launch
- [ ] Create `/admin` directory structure
- [ ] Create `/admin/dashboard/page.tsx`
- [ ] Create `/admin/properties/page.tsx`
- [ ] Create `/admin/users/page.tsx`
- [ ] Create `/admin/analytics/page.tsx`
- [ ] Add admin role checks
- [ ] Create admin permission middleware
- [ ] Add property approval flow
- [ ] Add user blacklist management
- [ ] Setup analytics tracking
- [ ] Final testing and bug fixes
- [ ] Deploy to production

---

## Cost Analysis

### Monthly Cost Breakdown

#### Free Tier (MVP Phase)

| Service | Plan | Cost | Limit |
|---------|------|------|-------|
| MongoDB Atlas | Free | $0 | 512 MB storage |
| Cloudinary | Free | $0 | 25 GB storage |
| SendGrid | Free | $0 | 100 emails/day |
| Razorpay | Transaction-based | $0 setup | No monthly fee |
| Twilio | Free trial | $0 | Limited credits |
| Vercel | Hobby | $0 | 100 GB bandwidth |
| **TOTAL** | | **$0/month** | Suitable for MVP |

#### Early Stage (After launching)

| Service | Plan | Cost | Limit |
|---------|------|------|-------|
| MongoDB Atlas | M0 | $57/month | 512 MB → unlimited |
| Cloudinary | Free+ | $0-20 | 25GB - 1TB |
| SendGrid | Basic | $0-30 | 1k - 100k emails |
| Razorpay | Standard | Commission only | Per transaction |
| Twilio | Pay-as-you-go | $0-50 | $0.01 per SMS |
| Vercel | Pro | $20/month | 1 TB bandwidth |
| Mixpanel | Growth | $0-100 | 100k - 10M events |
| **TOTAL** | | **$77-257/month** | Depends on volume |

#### At Scale (10k+ bookings/month)

| Service | Plan | Cost | Limit |
|---------|------|------|-------|
| MongoDB Atlas | M2 | $150-300 | Highly scalable |
| Cloudinary | Business | $99+ | 1TB+ storage |
| SendGrid | Pro | $80-350 | 500k+ emails |
| Razorpay | Enterprise | Negotiable | High volume |
| Twilio | Standard rates | $100-500 | Unlimited |
| Vercel | Pro+ | $20-150 | As needed |
| Mixpanel | Enterprise | $1000+ | Unlimited |
| **TOTAL** | | **$1500-2500/month** | But revenue >> costs |

### Revenue Model

**Recommended**: Commission-based (DSU/Jain typically 15-20%)

```
Example:
- Average booking: ₹8,000
- Commission: 15%
- Orbit earnings per booking: ₹1,200

At scale:
- 100 bookings/month: ₹1,20,000 revenue
- 1,000 bookings/month: ₹12,00,000 revenue
```

**Break-even**: ~50 bookings/month covers all infrastructure costs

---

## Success Metrics

### User Metrics

```
Daily Active Users (DAU)
├─ Goal Week 4: 50 users
├─ Goal Week 8: 200 users
└─ Goal Month 3: 1,000 users

Weekly Active Users (WAU)
├─ Goal Week 4: 150 users
├─ Goal Week 8: 500 users
└─ Goal Month 3: 3,000 users

New Sign-ups
├─ Goal Week 1: 100 users (beta)
├─ Goal Week 4: 500 users
└─ Goal Month 3: 5,000 users

Retention Rate
├─ Day 7: 40% (good for marketplace)
├─ Day 30: 25% (acceptable)
└─ Day 90: 15% (OK for MVP)
```

### Business Metrics

```
Bookings
├─ Week 1-2: 5-10 bookings
├─ Week 3-4: 20-50 bookings
└─ Month 2: 200+ bookings

Conversion Rate
├─ Visitor to Booker: 2-3% (good)
├─ View to Booking: 1-2% (average)
└─ Target: Improve to 3-5%

Average Booking Value (ABV)
├─ Current target: ₹7,000-10,000
├─ Revenue at 100 bookings: ₹7-10 lakhs
└─ Revenue at 1000 bookings: ₹70-100 lakhs

Customer Acquisition Cost (CAC)
├─ Week 1-4: ₹500-1000/user
├─ Month 2-3: ₹200-500/user
└─ Goal: <₹200/user at scale
```

### Engagement Metrics

```
Reviews Written
├─ Goal: 50% of bookers leave review
├─ Average rating: 4.2-4.5 stars
└─ Reviews per property: 5+ by month 3

Repeat Bookings
├─ Week 1-4: 5-10%
├─ Month 2-3: 15-20%
└─ Target: 30% by 6 months

Wishlist Adds
├─ Goal: 15% of visitors add to wishlist
├─ Conversion of wishlist to booking: 10%
└─ Useful for remarketing

Search Activity
├─ Average searches/user: 3-5
├─ Most searched: Price range, location
└─ Use to optimize filters
```

### Quality Metrics

```
Average Rating: Target 4.2+ stars
Support Tickets: <5% of bookings
Refund Rate: <2% of bookings
Booking Cancellation: <10%
User Satisfaction (NPS): >50
```

---

## Key Decisions to Make

### Before Building

1. **Revenue Model**
   - [ ] Commission per booking (15-20%)? 
   - [ ] Monthly subscription for owners?
   - [ ] Combination of both?

2. **Target Market**
   - [ ] Start with DSU only?
   - [ ] Both DSU + Jain from day 1?
   - [ ] Expand to other colleges later?

3. **Launch Timeline**
   - [ ] Soft launch in 4 weeks?
   - [ ] Beta launch in 6 weeks?
   - [ ] Full launch in 10 weeks?

4. **First Users**
   - [ ] Who are your first 10 PG owners?
   - [ ] Who are your first 100 students?
   - [ ] Have you pre-committed them?

5. **Marketing Strategy**
   - [ ] Campus ambassadors?
   - [ ] Direct owner outreach?
   - [ ] Social media growth?
   - [ ] Referral program?

---

## Quick Start Guide

### Getting Started (This Week)

```bash
# 1. Setup Razorpay Account
Visit: razorpay.com
Sign up → Get API keys → Add to .env.local

# 2. Setup Cloudinary Account
Visit: cloudinary.com
Sign up → Get API keys → Add to .env.local

# 3. Install Dependencies
npm install razorpay next-cloudinary

# 4. Create First Endpoint
# Create: /api/bookings/create

# 5. Test Locally
npm run dev
# Visit: http://localhost:3000
```

### Week 1 Priorities

1. ✅ Payment system working
2. ✅ File uploads working
3. ✅ End-to-end booking flow
4. ✅ Deploy to staging

### Week 2 Priorities

1. ✅ Owner dashboard
2. ✅ Property editing
3. ✅ Pricing management
4. ✅ Availability updates

### Week 3 Priorities

1. ✅ Advanced search filters
2. ✅ Room type variations
3. ✅ Email notifications
4. ✅ User testing

---

## Support & Resources

### Documentation
- Next.js Docs: https://nextjs.org/docs
- MongoDB/Mongoose: https://docs.mongodb.com
- Razorpay API: https://razorpay.com/docs
- Cloudinary API: https://cloudinary.com/documentation

### Community
- Next.js Discord: https://discord.gg/nextjs
- MongoDB Community: https://community.mongodb.com
- Indie Hackers: https://www.indiehackers.com

### Tools
- GitHub for version control
- Vercel for deployment
- MongoDB Atlas for database
- Postman for API testing

---

## Limitations & Known Issues

### Current Limitations

#### 1. **Payment Gateway Not Implemented**
- ❌ No payment processing system yet
- ❌ Booking confirmation without payment verification
- ❌ No transaction history or receipts
- **Impact**: Cannot charge users for bookings
- **Timeline**: Planned for Phase 1
- **Workaround**: Manual verification needed

#### 2. **Owner Dashboard Missing**
- ❌ Property owners cannot manage their listings
- ❌ No property edit/update functionality
- ❌ No booking management for owners
- ❌ No income/analytics dashboard
- **Impact**: Owners cannot self-serve platform
- **Timeline**: Planned for Phase 1
- **Current**: Only admins can manage properties

#### 3. **Limited File Upload**
- ❌ Only admin avatar upload implemented
- ❌ No property image upload by owners
- ❌ No document upload (ID proof, etc.)
- ❌ No batch image upload
- **Impact**: Admin must manually add property images
- **Timeline**: Phase 2
- **Current**: Using placeholder images

#### 4. **Email Notifications Incomplete**
- ❌ No automated booking confirmation emails
- ❌ No payment receipt emails
- ❌ No admin alerts for new bookings
- ❌ No review reminder emails
- **Impact**: Users don't get updates via email
- **Timeline**: Phase 1
- **Current**: Manual notification needed

#### 5. **Search & Filtering Limited**
- ❌ No advanced filters (furnished/unfurnished, gender-specific, etc.)
- ❌ No price range slider
- ❌ No amenities filter
- ❌ No location-based radius search
- ❌ No sorting options (price, rating, newest)
- **Impact**: Users cannot refine searches effectively
- **Timeline**: Phase 2
- **Current**: Basic keyword search only

#### 6. **Booking System Incomplete**
- ❌ No booking calendar availability
- ❌ No booking status tracking (pending/confirmed/cancelled)
- ❌ No cancellation/refund policy
- ❌ No booking history for users
- ❌ No duplicate booking prevention
- **Impact**: Cannot manage bookings properly
- **Timeline**: Phase 1
- **Current**: Basic booking creation only

#### 7. **Review System Limitations**
- ❌ No review moderation
- ❌ No admin ability to hide/delete reviews
- ❌ No review upvoting/downvoting
- ❌ No verified buyer badge on reviews
- **Impact**: Low-quality reviews might appear
- **Timeline**: Phase 2
- **Current**: All reviews visible immediately

#### 8. **Database Constraints**
- ❌ No soft delete (deleted records not archived)
- ❌ No audit trail for all operations (only admin actions)
- ❌ No data backup/recovery strategy
- ❌ No database replication
- **Impact**: Data loss cannot be recovered
- **Timeline**: Post-launch
- **Current**: Manual backups needed

#### 9. **Authentication Limitations**
- ⚠️ Only Auth0 provider (no Google/GitHub)
- ❌ No two-factor authentication (2FA)
- ❌ No session management (logout all devices)
- ❌ No account deactivation
- **Impact**: Single point of failure for login
- **Timeline**: Phase 2
- **Current**: Email/password only

#### 10. **Admin Features Gaps**
- ❌ No role hierarchy (only admin/owner/student)
- ❌ No permission granularity
- ❌ No activity export (except basic audit logs)
- ❌ No bulk operations
- ❌ No scheduled tasks/automation
- **Impact**: Admin management is limited
- **Timeline**: Phase 2
- **Current**: All admins have full access

#### 11. **Chatbot Limitations**
- ⚠️ No custom knowledge base
- ❌ No conversation history storage
- ❌ No sentiment analysis
- ❌ No multi-language support
- **Impact**: Limited AI helpfulness
- **Timeline**: Phase 3
- **Current**: Generic responses only

#### 12. **Frontend/Performance Issues**
- ⚠️ No lazy loading for property images
- ❌ No pagination for property lists
- ❌ No infinite scroll
- ⚠️ No service worker (no offline support)
- ❌ No image optimization/compression
- **Impact**: Slow load times with many properties
- **Timeline**: Phase 2
- **Current**: All properties loaded at once

#### 13. **Mobile Optimization**
- ⚠️ Responsive design partially done
- ❌ No mobile-specific features (location detection)
- ❌ No push notifications
- ❌ No native app
- **Impact**: Suboptimal mobile experience
- **Timeline**: Phase 2
- **Current**: Desktop-first approach

#### 14. **Compliance & Security**
- ❌ No GDPR compliance
- ❌ No data privacy policy enforcement
- ❌ No encryption at rest
- ❌ No rate limiting on APIs
- ❌ No input validation everywhere
- **Impact**: Data security risks
- **Timeline**: Pre-launch
- **Current**: Basic validation only

#### 15. **Analytics & Monitoring**
- ❌ No user analytics dashboard
- ❌ No property performance metrics
- ❌ No error tracking (Sentry, etc.)
- ❌ No performance monitoring
- ❌ No A/B testing capability
- **Impact**: Cannot track platform performance
- **Timeline**: Phase 3
- **Current**: Manual tracking only

### Known Issues

#### 1. **Hydration Warnings (FIXED ✅)**
- **Status**: Resolved in current session
- **Cause**: Browser extensions adding attributes
- **Solution**: Added `suppressHydrationWarning` prop
- **Affected Components**: All buttons and inputs

#### 2. **Role-Based Navigation (FIXED ✅)**
- **Status**: Working correctly
- **Fix**: Non-admins now see "Home" instead of "Dashboard"
- **Redirect**: Sign-in now goes to `/` (home page)

#### 3. **Avatar Upload (WORKING ✅)**
- **Status**: Fully functional
- **Provider**: Cloudinary
- **Size Limit**: 5MB max
- **Supported**: JPG, PNG, WebP

### Workarounds for Current Limitations

| Limitation | Current Workaround | Timeline |
|-----------|-------------------|----------|
| No Payment Gateway | Manual verification + bank transfer | Phase 1 |
| No Owner Dashboard | Admin manages all properties | Phase 1 |
| No Email Notifications | Manual email from admin | Phase 1 |
| No Advanced Filters | Use keyword search | Phase 2 |
| No Booking Calendar | Check availability manually | Phase 1 |
| No 2FA | Use strong passwords | Phase 2 |
| No Image Upload | Admin uploads via dashboard | Phase 2 |
| No Analytics | Manual tracking via dashboard | Phase 3 |

### Performance Bottlenecks

1. **Database Queries**: No indexing on frequently searched fields
   - **Impact**: Slow search on large datasets
   - **Fix**: Add MongoDB indexes (Phase 2)

2. **Image Loading**: No CDN or optimization
   - **Impact**: Slow image downloads
   - **Fix**: Use Cloudinary transformations (Phase 2)

3. **API Response**: No caching or pagination
   - **Impact**: Large payloads for multiple properties
   - **Fix**: Implement Redis caching + pagination (Phase 2)

4. **Frontend Bundle**: No code splitting
   - **Impact**: Slower initial load
   - **Fix**: Dynamic imports for admin pages (Phase 2)

### Security Gaps

1. **API Authentication**: All endpoints require session, but no API key validation
2. **File Upload**: Only extension validation, no virus scanning
3. **User Input**: Basic validation, no comprehensive sanitization
4. **CORS**: Not properly configured for production
5. **Secrets**: Environment variables not encrypted

### Roadmap to Address Limitations

**Phase 1 (Next 2 weeks)**
- [ ] Payment Gateway (Razorpay)
- [ ] Owner Dashboard
- [ ] Email notifications
- [ ] Booking status tracking
- [ ] Basic analytics

**Phase 2 (Weeks 3-4)**
- [ ] Advanced search filters
- [ ] Image optimization & CDN
- [ ] Database indexing
- [ ] Mobile optimization
- [ ] 2FA implementation

**Phase 3 (Weeks 5-6)**
- [ ] Chatbot knowledge base
- [ ] User analytics dashboard
- [ ] Error tracking & monitoring
- [ ] A/B testing
- [ ] Performance optimization

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Nov 24, 2025 | Initial documentation |
| 1.1 | Nov 25, 2025 | Session 3 - Avatar upload feature, routing fixes, hydration warnings resolved |

---

**Document Last Updated**: November 25, 2025  
**Project Status**: 65% Complete - Avatar upload ready, routing optimized, all hydration issues fixed  
**Next Review**: After Week 1 of Phase 1 Implementation (Payment Gateway)

---

*This documentation is a living document. Update it as you implement features and learn from user feedback.*

---

END OF DOCUMENT
