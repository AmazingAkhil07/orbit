# 🔌 Orbit - Complete API & Services Documentation

**Project:** Orbit Student Housing Platform  
**Document Version:** 1.0  
**Last Updated:** November 26, 2025  
**Status:** MVP Phase  
**Classification:** Technical Reference - For Developers

---

## 📋 Table of Contents

1. [Services Overview](#services-overview)
2. [Third-Party Services & APIs](#third-party-services--apis)
3. [Internal API Endpoints](#internal-api-endpoints)
4. [Database Configuration](#database-configuration)
5. [Authentication & Security](#authentication--security)
6. [Payment Gateway Integration](#payment-gateway-integration)
7. [Media & File Management](#media--file-management)
8. [Communication APIs](#communication-apis)
9. [AI & Chatbot Services](#ai--chatbot-services)
10. [Environment Variables Setup](#environment-variables-setup)
11. [Implementation Timeline](#implementation-timeline)
12. [Cost Analysis by Service](#cost-analysis-by-service)

---

## Services Overview

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                        │
│            React 19 + TypeScript + Tailwind CSS              │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────────┐
│                   API Layer (Next.js Routes)                │
│              /api/auth, /api/properties, etc.                │
└────────────────────┬────────────────────────────────────────┘
                     │
    ┌────────────────┼────────────────┐
    │                │                │
    ▼                ▼                ▼
┌─────────────┐ ┌──────────────┐ ┌────────────────┐
│  MongoDB    │ │ Cloudinary   │ │  Razorpay      │
│  Database   │ │  (Images)    │ │  (Payments)    │
└─────────────┘ └──────────────┘ └────────────────┘
    │                │                │
    └────────────────┼────────────────┘
                     │
    ┌────────────────┼────────────────┐
    │                │                │
    ▼                ▼                ▼
┌──────────────┐ ┌──────────────┐ ┌────────────────┐
│ NextAuth.js  │ │ Google APIs  │ │ Twilio/WATI    │
│ (Auth)       │ │ (Maps, OAuth)│ │ (WhatsApp)     │
└──────────────┘ └──────────────┘ └────────────────┘
                     │
                     ▼
            ┌──────────────────┐
            │  Gemini/OpenAI   │
            │  (AI Chatbot)    │
            └──────────────────┘
```

---

## Third-Party Services & APIs

### 1. MongoDB Atlas (Database)

#### Purpose
- Store all application data (users, properties, bookings, reviews)
- Real-time data queries and updates
- Backup and disaster recovery

#### Setup Steps

```bash
# Step 1: Create MongoDB Atlas Account
# Visit: https://www.mongodb.com/cloud/atlas
# Email: your-email@example.com
# Create Organization → Create Project → Create Cluster

# Step 2: Configure Cluster
# Select: "Shared" (free tier)
# Region: AWS Mumbai (ap-south-1) - nearest to Bangalore
# Cluster Name: orbit-cluster

# Step 3: Network Access
# Add IP: 0.0.0.0/0 (for development, restrict in production)

# Step 4: Create Database User
# Username: orbit_admin
# Password: Generate secure password (copy to .env)

# Step 5: Get Connection String
# mongodb+srv://orbit_admin:<PASSWORD>@orbit-cluster.xxxxx.mongodb.net/orbit?retryWrites=true&w=majority
```

#### Connection String Format
```env
MONGODB_URI=mongodb+srv://orbit_admin:YOUR_PASSWORD@orbit-cluster.xxxxx.mongodb.net/orbit?retryWrites=true&w=majority
```

#### Why MongoDB?
- **Document-based:** Flexible schema for properties with varying amenities
- **Scalability:** Easy to scale horizontally as user base grows
- **Speed:** No complex joins needed (student-property-review data naturally nested)
- **Cost:** Free tier supports up to 512MB (enough for MVP)
- **Atlas:** Managed service = no DevOps overhead

#### Collections Needed

```javascript
// Users Collection
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  role: "student" | "owner" | "admin",
  profile: {
    name: String,
    avatar: String (Cloudinary URL),
    phone: String (encrypted),
    college: String,
    verified: Boolean,
    verificationDate: Date
  },
  metadata: {
    createdAt: Date,
    lastLogin: Date,
    ipAddress: String
  }
}

// Properties Collection
{
  _id: ObjectId,
  ownerId: ObjectId,
  details: {
    title: String,
    description: String,
    address: String,
    location: {
      lat: Number,
      lng: Number
    },
    amenities: [String],
    pricePerMonth: Number,
    sharingType: "single" | "double" | "triple",
    roomsAvailable: Number,
    furnished: Boolean
  },
  media: {
    images: [String], // Cloudinary URLs
    virtualTour360: String,
    video: String
  },
  verification: {
    verified: Boolean,
    verifiedBy: ObjectId,
    verifiedDate: Date,
    physicalAuditDone: Boolean
  },
  metadata: {
    createdAt: Date,
    updatedAt: Date,
    viewCount: Number
  }
}

// Bookings Collection
{
  _id: ObjectId,
  studentId: ObjectId,
  propertyId: ObjectId,
  ownerId: ObjectId,
  booking: {
    tokenAmount: Number,
    moveInDate: Date,
    moveOutDate: Date,
    status: "pending" | "confirmed" | "completed" | "cancelled",
    notes: String
  },
  payment: {
    razorpayOrderId: String,
    razorpayPaymentId: String,
    transactionId: String,
    amount: Number,
    date: Date,
    status: "pending" | "success" | "failed"
  },
  metadata: {
    createdAt: Date,
    updatedAt: Date
  }
}

// Reviews Collection
{
  _id: ObjectId,
  propertyId: ObjectId,
  studentId: ObjectId,
  bookingId: ObjectId,
  review: {
    rating: Number (1-5),
    tags: [String], // "Good Wi-Fi", "Safe at Night", etc.
    title: String,
    description: String,
    photos: [String] // Cloudinary URLs
  },
  moderation: {
    flagged: Boolean,
    flagReason: String,
    approved: Boolean
  },
  metadata: {
    createdAt: Date,
    updatedAt: Date,
    helpfulCount: Number
  }
}
```

#### Costs
- **Free Tier:** 512MB storage, unlimited queries ✅ MVP
- **Paid:** $57/month (shared) → $111+/month (dedicated)
- **For 1000 students:** ~200MB data = Still free tier

---

### 2. Cloudinary (Image Hosting & CDN)

#### Purpose
- Store property photos, 360° tours, user avatars
- Auto-optimize images (reduce file size by 40-60%)
- Watermarking ("Verified by Orbit [DATE]")
- CDN delivery for fast loading worldwide

#### Setup Steps

```bash
# Step 1: Create Cloudinary Account
# Visit: https://cloudinary.com/users/register/free
# Email: your-email@example.com
# Signup → Verify email

# Step 2: Get API Credentials
# Dashboard → Account → API Keys
# Copy: Cloud Name, API Key, API Secret

# Step 3: Create Upload Preset (No-Auth Upload)
# Settings → Upload → Add upload preset
# Name: orbit_unsigned_upload
# Unsigned: Yes
# Folder: /orbit/properties

# Step 4: Store in Environment Variables
# NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxxxx
# CLOUDINARY_API_KEY=xxxxx
# CLOUDINARY_API_SECRET=xxxxx
```

#### Connection String Format
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### API Endpoints Used

```typescript
// 1. Upload Admin Avatar
POST https://api.cloudinary.com/v1_1/{CLOUD_NAME}/image/upload
Headers: Authorization (optional for unsigned uploads)
FormData: {
  file: File,
  upload_preset: "orbit_unsigned_upload",
  folder: "orbit/avatars",
  width: 500,
  height: 500,
  crop: "fill"
}
Response: {
  secure_url: "https://res.cloudinary.com/.../image.jpg",
  public_id: "orbit/avatars/xxx",
  width: 500,
  height: 500,
  size: 45000
}

// 2. Upload Property Photos
POST https://api.cloudinary.com/v1_1/{CLOUD_NAME}/image/upload
FormData: {
  file: File,
  upload_preset: "orbit_unsigned_upload",
  folder: "orbit/properties",
  tags: ["property", "propertyId"]
}

// 3. Generate Watermarked Image URL
// Append transformation to URL:
// https://res.cloudinary.com/.../image.jpg?l=text:Arial_70:Verified%20by%20Orbit
```

#### Why Cloudinary?
- **Free Tier:** 25GB storage + 25GB bandwidth/month (perfect for MVP)
- **Auto-Optimization:** Images compress automatically
- **URL-based transformations:** Resize/crop images without re-uploading
- **Watermarking:** Add "Verified by Orbit" text automatically
- **CDN:** Global edge servers = fast delivery everywhere

#### Costs
- **Free Tier:** 25GB storage, 25GB bandwidth ✅ MVP
- **Paid:** $99/month → $399+/month
- **For 100 properties × 5 photos:** ~500MB = Still free tier

#### Implementation Example

```typescript
// pages/api/admin/upload-avatar.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { file } = req.body; // Base64 encoded file
    const result = await cloudinary.uploader.upload(file, {
      folder: 'orbit/avatars',
      width: 500,
      height: 500,
      crop: 'fill',
      quality: 'auto',
      format: 'auto',
    });

    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

---

### 3. Razorpay (Payment Gateway)

#### Purpose
- Accept student payments (token advance ₹2,000)
- Automatic split between platform and owner
- Payment reconciliation and settlement
- Fraud detection

#### Setup Steps

```bash
# Step 1: Create Razorpay Account
# Visit: https://razorpay.com/
# Email: your-email@example.com
# Business: Student Housing Marketplace

# Step 2: Verify Business
# Upload: GST Certificate / PAN Card / Business Address Proof
# Verification: 2-3 business days

# Step 3: Get API Keys
# Dashboard → Settings → API Keys
# Copy: Key ID (public), Key Secret (private)

# Step 4: Enable Razorpay Route (Payment Split)
# Dashboard → Settings → Payment Routes
# Create Route for property owner
# Route: 50% to Orbit, 50% to Owner

# Step 5: Create Bank Account
# Dashboard → Settlements → Bank Account
# Add bank account for receiving payments
```

#### Connection String Format
```env
NEXT_RAZORPAY_KEY_ID=rzp_live_xxxxx
NEXT_RAZORPAY_KEY_SECRET=xxxxx_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxx (public only)
```

#### API Endpoints

```typescript
// 1. Create Razorpay Order
POST https://api.razorpay.com/v1/orders
Headers: {
  Authorization: "Basic " + base64(KEY_ID + ":" + KEY_SECRET),
  "Content-Type": "application/json"
}
Body: {
  amount: 200000, // ₹2000 in paise
  currency: "INR",
  receipt: "booking_12345",
  payment_capture: 1,
  customer_notify: 1,
  notes: {
    bookingId: "12345",
    studentId: "67890",
    propertyId: "11111"
  }
}
Response: {
  id: "order_1234567890abcde",
  entity: "order",
  amount: 200000,
  amount_paid: 0,
  amount_due: 200000,
  status: "created",
  payments_count: 0
}

// 2. Verify Payment (After Payment Complete)
POST https://api.razorpay.com/v1/payments/{payment_id}/capture
Headers: { Authorization: "Basic ..." }
Body: { amount: 200000 }

// 3. Get Payment Details
GET https://api.razorpay.com/v1/payments/{payment_id}
Response: {
  id: "pay_1234567890",
  entity: "payment",
  amount: 200000,
  status: "captured",
  method: "upi",
  description: "Token advance for booking"
}

// 4. Create Payment Route (Split)
POST https://api.razorpay.com/v1/payment_links
Body: {
  amount: 200000,
  currency: "INR",
  notify: { sms: 1, email: 1 },
  split: {
    route_ids: ["route_1", "route_2"],
    amounts: [100000, 100000] // 50% each
  }
}
```

#### Why Razorpay?
- **Payment Routes:** Automatic split between platform and owner (unique feature)
- **UPI Support:** 80% of Indian students use UPI
- **Settlement:** T+1 day settlement to bank account
- **Fraud Detection:** Built-in risk scoring
- **Cost:** 2% + ₹3/transaction (industry standard in India)
- **Compliance:** PCI DSS Level 1, RBI approved

#### Costs
- **Transaction Fee:** 2% + ₹3 per transaction
- **For 50 bookings × ₹2,000:** 50 × ₹43 = ₹2,150/month
- **Annual:** ~₹25,800

#### Implementation Example

```typescript
// pages/api/bookings/create-order.ts
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_RAZORPAY_KEY_ID,
  key_secret: process.env.NEXT_RAZORPAY_KEY_SECRET,
});

export default async function handler(req, res) {
  const { bookingId, amount } = req.body;

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: bookingId,
      payment_capture: 1,
      notes: { bookingId },
    });

    res.status(200).json({ orderId: order.id, amount: order.amount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

---

### 4. NextAuth.js (Authentication)

#### Purpose
- User login/signup with email + password
- OAuth2 integration (Google/GitHub for quick signup)
- Session management
- Role-based access control (student vs owner vs admin)

#### Setup Steps

```bash
# Step 1: Install NextAuth.js
npm install next-auth nextjs-prisma-adapter

# Step 2: Create Auth Configuration
# File: src/lib/auth.ts

# Step 3: Setup OAuth Providers
# Google: https://console.cloud.google.com/
#   - Create OAuth 2.0 Credentials (Web Application)
#   - Authorized redirect: http://localhost:3000/api/auth/callback/google
#   - Copy Client ID and Secret

# Step 4: Environment Variables
# NEXTAUTH_URL=http://localhost:3000
# NEXTAUTH_SECRET=generate_with: openssl rand -base64 32
# GOOGLE_CLIENT_ID=xxxxx
# GOOGLE_CLIENT_SECRET=xxxxx
```

#### Connection String Format
```env
NEXTAUTH_URL=https://orbit.yourdomain.com
NEXTAUTH_SECRET=your_super_secret_random_string_32_chars
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
AUTH0_CLIENT_ID=your_auth0_client_id
AUTH0_CLIENT_SECRET=your_auth0_client_secret
```

#### API Endpoints

```typescript
// Authentication Flows
POST /api/auth/signin → User login
POST /api/auth/callback/google → Google OAuth callback
GET /api/auth/session → Get current user session
POST /api/auth/signout → User logout
POST /api/auth/signup → User registration

// Usage in Components
import { useSession, signIn, signOut } from "next-auth/react";

export default function Page() {
  const { data: session } = useSession();
  
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn("google")}>Sign in with Google</button>
    </>
  );
}
```

#### Why NextAuth.js?
- **Next.js Native:** Works seamlessly with Next.js 16
- **No Passwords:** OAuth reduces complexity
- **Session Management:** Automatic JWT tokens
- **Free & Open Source:** No licensing costs
- **Security:** Built-in CSRF protection

#### Costs
- **Free**

---

### 5. Google Maps API (Location & Navigation)

#### Purpose
- Show property location on map
- Calculate distance from college
- Provide navigation directions
- Show nearby amenities (ATM, hospital, police station)

#### Setup Steps

```bash
# Step 1: Create Google Cloud Project
# Visit: https://console.cloud.google.com/
# New Project → "Orbit"

# Step 2: Enable APIs
# Maps JavaScript API
# Places API
# Distance Matrix API
# Geocoding API

# Step 3: Create API Key
# APIs & Services → Credentials → Create Credentials → API Key
# Restrict to: Maps JavaScript API, Places API, Distance Matrix API
# Restrict to domain: *.orbit.yourdomain.com

# Step 4: Add to Environment
# NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=xxxxx
```

#### Connection String Format
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

#### API Endpoints

```typescript
// 1. Show Property on Map
import { GoogleMap, Marker } from '@react-google-maps/api';

const MapComponent = ({ lat, lng }) => {
  return (
    <GoogleMap center={{ lat, lng }} zoom={15}>
      <Marker position={{ lat, lng }} />
    </GoogleMap>
  );
};

// 2. Calculate Distance from College
const { DistanceMatrixService } = window.google.maps;
const service = new DistanceMatrixService();

service.getDistanceMatrix(
  {
    origins: [propertyLocation],
    destinations: [collegeLocation],
    travelMode: google.maps.TravelMode.WALKING,
  },
  (response) => console.log(response.rows[0].elements[0].distance.text)
);

// 3. Get Nearby Places (ATM, Hospital)
const placesService = new google.maps.places.PlacesService(map);
placesService.nearbySearch(
  {
    location: { lat, lng },
    radius: 500,
    type: 'atm',
  },
  (results) => console.log(results)
);
```

#### Why Google Maps?
- **Accuracy:** Industry-standard mapping
- **Free Tier:** 200 USD/month free credit (covers 1000+ queries)
- **Multi-feature:** Maps, Directions, Distance, Places in one API
- **Reliability:** 99.95% uptime SLA

#### Costs
- **Free Tier:** $200/month credit ✅ MVP
- **Beyond:** $7/1000 requests (Places), $5/1000 requests (Distance)
- **For 1000 students:** ~100 requests/month = free

---

### 6. Twilio WhatsApp API (Student Notifications)

#### Purpose
- Send WhatsApp messages to students
- Booking confirmations
- Navigation videos with location pins
- Owner contact details after booking

#### Setup Steps

```bash
# Step 1: Create Twilio Account
# Visit: https://www.twilio.com/
# Email signup → Verify phone number

# Step 2: Enable WhatsApp Sandbox
# Console → Messaging → Try it out → WhatsApp
# Save: Account SID, Auth Token, Sandbox Phone

# Step 3: Connect WhatsApp Sandbox
# Add phone to Twilio Sandbox (follow prompts)

# Step 4: Environment Variables
# TWILIO_ACCOUNT_SID=ACxxxxx
# TWILIO_AUTH_TOKEN=xxxxx
# TWILIO_WHATSAPP_NUMBER=+14155238886
```

#### Connection String Format
```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=+14155238886
```

#### API Endpoints

```typescript
// Send WhatsApp Message
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export default async function sendBookingConfirmation(studentPhone, bookingDetails) {
  try {
    const message = await client.messages.create({
      body: `✅ Booking Confirmed!
📍 Property: ${bookingDetails.propertyName}
📅 Move-in: ${bookingDetails.moveInDate}
💰 Amount: ₹${bookingDetails.amount}
🔗 Navigation: ${bookingDetails.navigationLink}
📞 Owner: ${bookingDetails.ownerPhone}`,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:+91${studentPhone}`,
    });

    console.log('Message sent:', message.sid);
  } catch (error) {
    console.error('WhatsApp send failed:', error.message);
  }
}
```

#### Why Twilio?
- **WhatsApp Integration:** Native WhatsApp Business API partner
- **Cost:** ₹0.70/message (very cheap compared to SMS ₹1/message)
- **Reliability:** 98% delivery rate
- **Free Tier:** $15 credit (21 messages)

#### Costs
- **Per Message:** ₹0.70-1 per outbound message
- **For 50 bookings × 3 messages:** 150 × ₹0.70 = ₹105/month
- **Annual:** ~₹1,260

---

### 7. WATI WhatsApp Bot (Alternative to Twilio)

#### Purpose
- 24/7 WhatsApp bot for student inquiries
- Navigation guidance
- Property information delivery
- Low-cost alternative to Twilio

#### Setup Steps

```bash
# Step 1: Create WATI Account
# Visit: https://wati.io/
# Business email signup

# Step 2: Connect WhatsApp Number
# Phone Management → Add Phone Number
# Verify with code received on phone

# Step 3: Create Bot Flows
# Bot Building → Create Conversation Flows
# Flow 1: Property Search
# Flow 2: Navigation Guide
# Flow 3: Book Confirmation

# Step 4: API Integration
# Settings → API → Get API Token
# WATI_API_KEY=xxxxx
```

#### Why WATI?
- **Cheaper:** ₹5/month for unlimited messages (flat rate)
- **Bot Builder:** No coding needed
- **WhatsApp:** Native integration
- **Indian:** Based in India, understands local market

#### Costs
- **Starter:** ₹5/month ✅ MVP
- **Pro:** ₹50/month
- **Annual (Starter):** ~₹60

---

### 8. Gemini 2.0 / OpenAI ChatGPT (AI Chatbot)

#### Purpose
- 24/7 AI support for student questions
- FAQ automation
- Sentiment analysis of reviews
- Contextual property recommendations

#### Setup Steps (Gemini)

```bash
# Step 1: Create Google AI Studio Account
# Visit: https://ai.google.dev/
# Sign in with Google account

# Step 2: Create API Key
# Get API Key → Generate Key in Google Cloud Project
# Copy Key

# Step 3: Enable in Code
# npm install @google/generative-ai

# Step 4: Environment Variable
# GOOGLE_GENERATIVE_AI_API_KEY=xxxxx
```

#### Setup Steps (OpenAI)

```bash
# Step 1: Create OpenAI Account
# Visit: https://platform.openai.com/
# Email signup → Credit card

# Step 2: Get API Key
# Settings → API Keys → Create new secret key

# Step 3: Install SDK
# npm install openai

# Step 4: Environment Variable
# OPENAI_API_KEY=sk-xxxxx
```

#### Implementation Examples

```typescript
// Using Gemini
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY
);

export async function getPropertyRecommendation(studentPreferences) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Based on these student preferences: ${JSON.stringify(
    studentPreferences
  )}, recommend a property from our database.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

// Using OpenAI
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeSentiment(reviewText) {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "Analyze this PG review and extract sentiment tags.",
      },
      { role: "user", content: reviewText },
    ],
    temperature: 0.5,
  });

  return response.choices[0].message.content;
}
```

#### Why Gemini/OpenAI?
- **Gemini:** Free tier ($0 for limited usage), fast responses
- **OpenAI:** More powerful, better for complex tasks
- **Use Cases:** Chatbot, content moderation, recommendations

#### Costs
- **Gemini:** Free for 60 requests/minute ✅ MVP
- **OpenAI:** $0.005 per 1K tokens (GPT-3.5), $0.03 per 1K tokens (GPT-4)
- **For 1000 student messages:** ~₹200/month

---

## Internal API Endpoints

### Complete API Routes for Orbit

#### Authentication Routes

```typescript
// POST /api/auth/register
// Register new student/owner account
Request: {
  email: string,
  password: string,
  role: "student" | "owner",
  name: string
}
Response: {
  user: { id, email, role },
  token: JWT
}
Status: 201 Created

// POST /api/auth/login
// Login existing user
Request: { email, password }
Response: { user, token }
Status: 200 OK

// GET /api/auth/session
// Get current user session
Response: { user: { id, email, role, profile } }
Status: 200 OK

// POST /api/auth/logout
// Logout user
Response: { message: "Logged out successfully" }
Status: 200 OK
```

#### Property Routes

```typescript
// GET /api/properties
// List all verified properties with filters
Query: {
  filter: "price,location,amenities,sharing",
  sort: "price,rating,recent",
  page: number,
  limit: number
}
Response: {
  properties: [...],
  total: number,
  pages: number
}
Status: 200 OK

// GET /api/properties/:id
// Get property details with reviews
Response: {
  property: {...},
  reviews: [...],
  owner: { name, responseRate, joinDate }
}
Status: 200 OK

// POST /api/properties (Owner only)
// Create new property listing
Request: {
  title, description, address, price,
  amenities[], sharingType, roomsAvailable, furnished
}
Response: { property: {...}, id }
Status: 201 Created

// PUT /api/properties/:id (Owner only)
// Update property details
Status: 200 OK

// DELETE /api/properties/:id (Owner only)
// Delete property listing
Status: 200 OK
```

#### Booking Routes

```typescript
// POST /api/bookings
// Create new booking with payment
Request: {
  propertyId: string,
  studentId: string,
  moveInDate: Date,
  tokenAmount: 2000
}
Response: {
  bookingId: string,
  razorpayOrderId: string,
  paymentUrl: string
}
Status: 201 Created

// GET /api/bookings/:id
// Get booking details
Response: { booking: {...} }
Status: 200 OK

// PUT /api/bookings/:id/status
// Update booking status
Request: { status: "confirmed" | "completed" | "cancelled" }
Status: 200 OK

// GET /api/bookings/student/:studentId
// Get all bookings for student
Status: 200 OK

// GET /api/bookings/owner/:ownerId
// Get all bookings for owner
Status: 200 OK
```

#### Review Routes

```typescript
// POST /api/reviews
// Create review after booking
Request: {
  bookingId: string,
  propertyId: string,
  rating: 1-5,
  tags: [],
  title: string,
  description: string
}
Response: { review: {...} }
Status: 201 Created

// GET /api/reviews/property/:propertyId
// Get all reviews for property
Response: { reviews: [...], avgRating }
Status: 200 OK

// PUT /api/reviews/:id (Author only)
// Edit review
Status: 200 OK

// DELETE /api/reviews/:id (Author/Admin only)
// Delete review
Status: 200 OK
```

#### Admin Routes

```typescript
// GET /api/admin/stats
// Get dashboard statistics
Response: {
  totalUsers: number,
  totalProperties: number,
  totalBookings: number,
  revenue: number,
  pendingVerifications: number
}

// POST /api/admin/properties/:id/verify
// Verify property listing
Status: 200 OK

// POST /api/admin/users/:id/blacklist
// Blacklist user/property
Status: 200 OK

// GET /api/admin/audit-logs
// Get all audit logs
Status: 200 OK
```

#### Payment Routes

```typescript
// POST /api/payments/create-order
// Create Razorpay order
Request: { bookingId, amount }
Response: { orderId, amount }

// POST /api/payments/verify
// Verify payment after completion
Request: {
  razorpay_payment_id,
  razorpay_order_id,
  razorpay_signature
}
Response: { verified: boolean }

// GET /api/payments/settlement/:ownerId
// Get payment settlement history
Status: 200 OK
```

#### Chat Routes

```typescript
// POST /api/chat/send
// Send message between student and owner
Request: {
  senderId: string,
  recipientId: string,
  propertyId: string,
  message: string
}

// GET /api/chat/:senderId/:recipientId
// Get conversation history
Response: { messages: [...] }

// POST /api/chat/whatsapp
// Send WhatsApp notification
Request: {
  phone: string,
  message: string,
  type: "booking_confirmation" | "navigation" | "reminder"
}
```

---

## Database Configuration

### MongoDB Connection Setup

```typescript
// lib/db.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
```

### Database Indexes (Performance)

```typescript
// Create indexes for faster queries
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });

db.properties.createIndex({ ownerId: 1 });
db.properties.createIndex({ "details.location": "2dsphere" }); // Geospatial
db.properties.createIndex({ "details.pricePerMonth": 1 });
db.properties.createIndex({ createdAt: -1 });

db.bookings.createIndex({ studentId: 1 });
db.bookings.createIndex({ ownerId: 1 });
db.bookings.createIndex({ status: 1 });

db.reviews.createIndex({ propertyId: 1 });
db.reviews.createIndex({ studentId: 1 });
db.reviews.createIndex({ createdAt: -1 });
```

---

## Authentication & Security

### JWT Token Structure

```typescript
// Header
{
  "alg": "HS256",
  "typ": "JWT"
}

// Payload
{
  "sub": "user_id_12345",
  "email": "student@dsu.edu.in",
  "role": "student",
  "iat": 1674567890,
  "exp": 1674654290 // 24 hours
}

// Signature
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  YOUR_SECRET_KEY
)
```

### CORS Configuration

```typescript
// next.config.ts
export default {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: 'https://yourdomain.com' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
};
```

### Password Hashing

```typescript
// Use bcrypt
import bcrypt from 'bcrypt';

// Hash password before storing
const hashedPassword = await bcrypt.hash(password, 10);

// Compare during login
const isValid = await bcrypt.compare(inputPassword, hashedPassword);
```

### Encryption for Sensitive Data

```typescript
// Encrypt phone numbers, student IDs
import crypto from 'crypto';

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
const IV = crypto.randomBytes(16);

export function encrypt(text) {
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, IV);
  const encrypted = Buffer.concat([
    cipher.update(text, 'utf-8'),
    cipher.final(),
  ]);
  return IV.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(hash) {
  const parts = hash.split(':');
  const IV = Buffer.from(parts[0], 'hex');
  const encrypted = Buffer.from(parts[1], 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, IV);
  return decipher.update(encrypted) + decipher.final('utf8');
}
```

---

## Payment Gateway Integration

### Razorpay Flow Diagram

```
┌─────────────────┐
│  Student Pays   │
│   ₹2,000        │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│  1. Create Razorpay Order       │
│  Amount: 200000 paise           │
│  Receipt: booking_xxx           │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  2. Customer pays via Razorpay  │
│  (UPI/Card/NetBanking)          │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  3. Razorpay Webhook Notification
│  Payment Status: Captured       │
└────────────┬────────────────────┘
             │
        ┌────┴──────┐
        ▼           ▼
   ✅ Success   ❌ Failed
   Update DB    Retry
```

### Settlement Flow

```
Razorpay Splits Payment Automatically:
┌────────────────────┐
│  ₹2,000 Received   │
└────────┬───────────┘
         │
    ┌────┴────────┐
    │             │
    ▼             ▼
₹500 → Orbit   ₹1,500 → Owner
(Commission)  (Held in Trust)
    │             │
    └──────┬──────┘
           ▼
  T+1 Day Settlement
  to Bank Accounts
```

---

## Media & File Management

### File Upload Limits

```typescript
// Maximum file sizes
Avatar: 5MB
Property Photo: 10MB
Property 360° Tour: 100MB
Video: 500MB
Document (KYC): 5MB

// Allowed MIME types
Images: image/jpeg, image/png, image/webp
Videos: video/mp4
Documents: application/pdf
```

---

## Communication APIs

### Email Notifications (SendGrid)

```bash
# Setup SendGrid
SENDGRID_API_KEY=SG.xxxxx
```

### SMS Notifications (Alternative)

```bash
# Setup Exotel (Indian SMS provider)
EXOTEL_API_KEY=xxxxx
EXOTEL_API_TOKEN=xxxxx
```

---

## AI & Chatbot Services

### Chatbot Flow

```
Student Input
    ↓
Gemini AI Processing
    ↓
Generate Response
    ↓
Send via WhatsApp
    ↓
Log Conversation
```

---

## Environment Variables Setup

### Complete .env.local File

```env
# Database
MONGODB_URI=mongodb+srv://orbit_admin:password@orbit-cluster.xxxxx.mongodb.net/orbit?retryWrites=true&w=majority

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay
NEXT_RAZORPAY_KEY_ID=rzp_live_xxxxx
NEXT_RAZORPAY_KEY_SECRET=xxxxx_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxx

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key_32_chars
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key

# Twilio WhatsApp
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=+14155238886

# Gemini AI
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key

# OpenAI (Alternative)
OPENAI_API_KEY=sk-xxxxx

# Encryption
ENCRYPTION_KEY=your_32_byte_hex_key

# SendGrid Email
SENDGRID_API_KEY=SG.xxxxx
SENDGRID_FROM_EMAIL=noreply@orbit.yourdomain.com
```

---

## Implementation Timeline

### Phase 1: Core Setup (Weeks 1-2)
- [ ] MongoDB Atlas setup
- [ ] Cloudinary account
- [ ] NextAuth configuration
- [ ] Environment variables
- **Cost:** ₹0 (all free tiers)

### Phase 2: Payment Integration (Weeks 3-4)
- [ ] Razorpay setup & testing
- [ ] Payment webhook verification
- [ ] Settlement configuration
- **Cost:** ₹43/booking (2% + ₹3)

### Phase 3: Communications (Weeks 5-6)
- [ ] Twilio WhatsApp setup
- [ ] WATI bot configuration
- [ ] Notification templates
- **Cost:** ₹0.70/message (Twilio) OR ₹5/month (WATI)

### Phase 4: AI & Advanced (Weeks 7-8)
- [ ] Gemini AI integration
- [ ] Chatbot templates
- [ ] Sentiment analysis
- **Cost:** Free (Gemini free tier)

---

## Cost Analysis by Service

### Monthly Costs Breakdown (MVP Phase)

| Service | Cost | Justification |
|---------|------|---------------|
| **MongoDB Atlas** | $0 | Free tier (512MB) |
| **Cloudinary** | $0 | Free tier (25GB) |
| **NextAuth** | $0 | Open source |
| **Google Maps** | $0 | $200/month free credit |
| **Razorpay** | ₹2,150 | 50 bookings × ₹43 |
| **Twilio** | ₹1,050 | 150 messages × ₹0.70 |
| **Gemini AI** | $0 | Free tier |
| **Hosting (Vercel)** | $0 | Free tier |
| **Domain** | ₹500 | orbit.yourdomain.com |
| **SSL Certificate** | $0 | Free (Let's Encrypt) |
| **SendGrid** | $0 | Free tier (100 emails/day) |
| **Total Monthly** | **₹3,700** | **~$44 USD** |

### Annual Costs Projection

| Milestone | Monthly | Annual |
|-----------|---------|--------|
| **MVP (Month 1-3)** | ₹3,700 | ₹11,100 |
| **Growth (Month 4-6)** | ₹8,500 | ₹51,000 |
| **Scale (Month 7-12)** | ₹15,000 | ₹180,000 |

---

## Why Each Service?

### Detailed Reasoning Document

#### 1. MongoDB Atlas - Why Not Firebase/DynamoDB?

**MongoDB Chosen Because:**
- ✅ Document-based = Perfect for PG listings with variable amenities
- ✅ Free tier = 512MB storage (enough for 1000 properties)
- ✅ Geospatial queries = Find properties near student location
- ✅ Aggregation pipeline = Complex analytics without separate ETL
- ✅ Backup & restore = Disaster recovery included

**Firebase NOT chosen because:**
- ❌ Expensive for reads (₹0.06 per 100K reads)
- ❌ Limited querying capabilities
- ❌ Not ideal for complex relationships

**DynamoDB NOT chosen because:**
- ❌ AWS billing is complex (separate read/write costs)
- ❌ Geospatial queries are limited
- ❌ Learning curve steep for startup team

---

#### 2. Cloudinary - Why Not AWS S3?

**Cloudinary Chosen Because:**
- ✅ CDN built-in = Images load fast everywhere
- ✅ Auto-optimization = 40-60% smaller files
- ✅ URL transformations = No need to re-upload different sizes
- ✅ Watermarking = Add "Verified" text automatically
- ✅ Free tier = 25GB storage + bandwidth

**AWS S3 NOT chosen because:**
- ❌ Need separate CloudFront CDN (extra cost)
- ❌ No built-in image optimization
- ❌ More complex setup for startup team
- ❌ Billing more expensive at scale

---

#### 3. Razorpay - Why Not Stripe?

**Razorpay Chosen Because:**
- ✅ India-native = 80% of students use UPI
- ✅ Payment Routes = Automatic split without webhook coding
- ✅ Settlement = T+1 day (fastest in India)
- ✅ Cost = 2% + ₹3 (cheaper than Stripe 2.9% + $0.30)
- ✅ Compliance = RBI approved for India

**Stripe NOT chosen because:**
- ❌ Limited UPI support in India
- ❌ Manual settlement coding required
- ❌ Slower settlement (3-5 days)
- ❌ More expensive for INR transactions

---

#### 4. NextAuth.js - Why Not Auth0?

**NextAuth Chosen Because:**
- ✅ Open-source = Free forever
- ✅ Next.js native = Zero configuration
- ✅ Session management = Built-in JWT
- ✅ OAuth support = Google/GitHub integration
- ✅ Startup-friendly = No unnecessary features

**Auth0 NOT chosen because:**
- ❌ Paid tier starts at $13/month
- ❌ Overkill for student platform
- ❌ Extra vendor lock-in

---

#### 5. Google Maps - Why Not MapBox?

**Google Maps Chosen Because:**
- ✅ $200/month free credit = Covers MVP queries
- ✅ Accuracy = Industry standard
- ✅ Places API = Find ATM, hospital, police nearby
- ✅ Distance Matrix = Calculate walking distance to college
- ✅ Reliability = 99.95% uptime SLA

**MapBox NOT chosen because:**
- ❌ $5 per 1000 requests (more expensive)
- ❌ Smaller free tier
- ❌ Less comprehensive place data in India

---

#### 6. Twilio WhatsApp - Why Not Direct WhatsApp Business API?

**Twilio Chosen Because:**
- ✅ Easy integration = 5 lines of code
- ✅ Webhook support = Receive messages
- ✅ Template messages = Pre-approved messages for scale
- ✅ Free tier = $15 credit (21 messages)
- ✅ Compliance = Meta-approved

**Direct WhatsApp API NOT chosen because:**
- ❌ Complex approval process = 4-6 weeks
- ❌ Need business verification = GST certificate
- ❌ Dedicated infrastructure = More expensive
- ❌ Higher bar for startups

---

#### 7. Gemini AI - Why Not ChatGPT?

**Gemini Chosen Because:**
- ✅ Free tier = 60 requests/minute (free)
- ✅ Fast inference = <500ms response time
- ✅ Good for Indian context = Trained on Hindi text too
- ✅ Google integration = Better for Search features
- ✅ Cost = $0 for MVP

**ChatGPT NOT chosen initially because:**
- ❌ OpenAI API charges = $0.005 per 1K tokens
- ❌ Higher cost = $200/month at scale
- ✅ BUT: Better quality responses for complex queries (use for Phase 2)

**Recommendation:** Use Gemini for MVP (free), migrate to ChatGPT for Phase 2 (better quality).

---

### Summary: Cost Comparison with Competitors

| Platform | MongoDB | Cloudinary | Auth | Maps | Payments | WhatsApp | AI | Total |
|----------|---------|-----------|------|------|----------|----------|-----|-------|
| **Orbit (Our Stack)** | $0 | $0 | $0 | $0 | ₹2,150 | ₹1,050 | $0 | ₹3,700 |
| **MagicBricks Stack** | $50 | $100 | $50 | $50 | ₹5,000 | ₹3,000 | ₹5,000 | ₹18,700 |
| **NoBroker Stack** | $100 | $200 | $100 | $100 | ₹7,500 | ₹4,000 | ₹10,000 | ₹32,500 |

**Orbit Cost Advantage:** 5x cheaper than competitors at MVP stage

---

## Next Steps

1. **Week 1:** Set up MongoDB Atlas + Cloudinary
2. **Week 2:** Configure NextAuth + Google OAuth
3. **Week 3:** Integrate Razorpay payment
4. **Week 4:** Add Twilio WhatsApp
5. **Week 5:** Implement Gemini AI chatbot
6. **Week 6:** Go live with full stack

---

**Document Created:** November 26, 2025  
**For:** Circle13 Venture Partners  
**Status:** Ready for Implementation  

*This is a comprehensive technical reference for the development team. Keep this document updated as services are added or changed.*

---

END OF DOCUMENT
