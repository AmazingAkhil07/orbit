# 🏠 Owner Dashboard - Complete Implementation Plan

**Created**: December 5, 2025  
**Project**: Orbit Student Housing Marketplace  
**Priority**: Phase 1 (Blocking Launch)  
**Effort**: 6-8 hours  
**Status**: ✅ IN PROGRESS (70% Complete)

---

## 📋 Executive Summary

The **Owner Dashboard** is a critical feature that enables property owners to:
- ✅ Self-manage their listings (add/edit/delete properties)
- ✅ Upload and manage property images (up to 5 per room)
- ✅ View real-time statistics (occupancy, inquiries, bookings)
- ✅ Manage room availability and pricing
- ✅ Handle booking requests (accept/decline)
- ✅ Track reviews and respond to feedback
- ✅ View income/settlement reports
- ✅ Manage owner profile and bank details

**Impact**: Removes dependency on admin for property management, improves user experience, enables scalability.

---

## 🎯 Phase 1: Core Features (MVP - 4-5 hours)

### 1.1 Owner Dashboard Landing Page
**Route**: `/owner/dashboard`  
**Purpose**: Overview of owner's properties and stats

**Features**:
- Quick stats cards (total properties, occupancy rate, pending bookings, revenue)
- Recent activity feed (new bookings, new reviews, messages)
- Quick action buttons (Add Property, View Reviews, Payment History)
- Properties list with status indicators
- Notification badge for pending actions

**Components to Create**:
```
src/app/owner/
├── dashboard/
│   ├── page.tsx              ← Main dashboard page
│   └── components/
│       ├── StatsCard.tsx     ← Reusable stats card
│       ├── RecentActivity.tsx ← Activity feed
│       ├── PropertyQuickList.tsx ← Mini property list
│       └── QuickActions.tsx   ← Action buttons

src/components/owner/
├── OwnerNav.tsx              ← Owner navbar (similar to admin)
└── OwnerSidebar.tsx          ← Collapsible sidebar
```

---

### 1.2 Properties Management Page
**Route**: `/owner/properties`  
**Purpose**: View all owner's properties with full controls

**Features**:
- List all properties with cards showing:
  - Property image (first image)
  - Title and location
  - Occupancy rate (e.g., 8/10 rooms)
  - Monthly revenue
  - Approval status badge
  - Last updated date
- Filter by status (Active, Draft, Inactive)
- Search by property name/address
- Quick actions per property (Edit, Delete, View, Analytics)
- Empty state with "Add Property" CTA

**Data Displayed**:
```typescript
interface PropertyCard {
  _id: string;
  title: string;
  address: string;
  occupancy: { occupied: number; total: number };
  monthlyRevenue: number;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  lastUpdated: Date;
  image: string;
  averageRating: number;
  totalReviews: number;
}
```

---

### 1.3 Add/Edit Property Page
**Routes**: 
- `/owner/properties/new` (Add new)
- `/owner/properties/[id]/edit` (Edit existing)

**Purpose**: Full property creation and editing

**Form Fields**:
```typescript
{
  // Basic Info
  title: string;
  slug: string;
  description: string;
  
  // Location
  address: string;
  lat: number;
  lng: number;
  directionsVideoUrl?: string;
  
  // Room Info
  totalRooms: number;
  roomTypes: {
    type: string;        // "Single", "Double", "Triple"
    count: number;
    pricePerMonth: number;
    amenities: string[];
  }[];
  
  // Pricing
  basePrice: number;
  foodCharges?: number;
  electricityCharges?: number;
  waterCharges?: number;
  
  // Amenities
  amenities: string[];  // Multi-select
  
  // Features
  wifi: boolean;
  ac: boolean;
  parking: boolean;
  foodIncluded: number; // 0, 1, 2, 3 meals
  guestPolicy: string;
  
  // Media
  images: string[];     // Up to 5 images
  virtualTourUrl?: string;
}
```

**Form Sections**:
1. **Basic Information** - Title, description, slug
2. **Location** - Address, GPS, directions video
3. **Room Management** - Number of rooms, room types, pricing per type
4. **Pricing** - Base rent, additional charges
5. **Amenities** - Checkboxes for common amenities
6. **Features** - WiFi, AC, parking, food, guest policy
7. **Media** - Image upload (drag-drop or file picker)
8. **Preview** - How it looks to students

**Image Upload**:
- Multi-file upload (up to 5 images)
- Drag-and-drop support
- Reorder images
- Delete images
- Preview thumbnails
- Upload to Cloudinary
- Progress indication

**Components**:
```
src/app/owner/properties/[id]/edit/
├── page.tsx                  ← Main edit page
└── components/
    ├── PropertyForm.tsx      ← Form container
    ├── BasicInfoSection.tsx  ← Section 1
    ├── LocationSection.tsx   ← Section 2
    ├── RoomManagementSection.tsx ← Section 3
    ├── PricingSection.tsx    ← Section 4
    ├── AmenitiesSection.tsx  ← Section 5
    ├── FeaturesSection.tsx   ← Section 6
    ├── MediaSection.tsx      ← Section 7 (Image upload)
    ├── PreviewSection.tsx    ← Section 8
    └── FormActions.tsx       ← Save/Cancel buttons
```

---

### 1.4 Room Availability Management
**Route**: `/owner/properties/[id]/availability`  
**Purpose**: Manage room availability and occupancy

**Features**:
- Calendar view showing occupancy
- Room-by-room status (Occupied, Vacant, Under-Maintenance)
- Batch availability updates
- Historical occupancy data
- Manual room status toggle
- Add/remove rooms

**Display**:
```
Room 101: Single Room
├─ Status: Occupied (mark as vacant)
├─ Occupied Since: Nov 1, 2025
├─ Rent: ₹5,000/month
└─ Student: [Student Name] (Rate: ⭐⭐⭐⭐)

Room 102: Double Sharing
├─ Status: Vacant (available)
├─ Available Since: Oct 15, 2025
└─ Rent: ₹7,000/month
```

---

### 1.5 Pricing Management
**Route**: `/owner/properties/[id]/pricing`  
**Purpose**: Manage dynamic pricing

**Features**:
- Base price for each room type
- Additional charges:
  - Food charges (0, 1, 2, 3 meals)
  - Electricity charges
  - Water charges
  - Guest charges
- Discount for long-term bookings
- Seasonal pricing (if applicable)
- Price history

---

## 🎯 Phase 2: Engagement & Analytics (3-4 hours)

### 2.1 Bookings Management Page
**Route**: `/owner/properties/[id]/bookings`  
**Purpose**: Handle booking requests and confirmations

**Features**:
- List all bookings (Active, Pending, Completed, Cancelled)
- Booking status: Pending Request → Confirmed → Check-in → Active → Check-out
- Accept/Decline booking requests within 24 hrs
- View booking details (student info, room, dates, rent, etc.)
- Send messages to students
- Mark as checked-in/checked-out
- Cancel booking (with reason)

**Booking Card Shows**:
```
┌─────────────────────────────────┐
│ Student: Akhil Kumar            │
│ Room: 201 (Double)              │
│ Rent: ₹7,000/month              │
│ Check-in: Dec 10, 2025          │
│ Duration: 6 months              │
│ Status: ⏳ Pending (Accept/Decline) │
│ Time Left: 18 hrs               │
└─────────────────────────────────┘
```

---

### 2.2 Reviews & Ratings Page
**Route**: `/owner/properties/[id]/reviews`  
**Purpose**: Manage reviews and reputation

**Features**:
- Display all reviews with ratings
- Sentiment tags (WiFi Quality, Cleanliness, Food, Response Time, etc.)
- Owner response to reviews (required for credibility)
- Filter by rating (5-star, 4-star, etc.)
- Sort by recent/helpful
- Sentiment analysis dashboard
- Response template suggestions

**Review Display**:
```
┌──────────────────────────────────┐
│ Student: Priya Sharma   ⭐⭐⭐⭐⭐ │
│ "Great PG, amazing food!"        │
│ Tags: Excellent Food, Clean      │
│ Posted: 3 days ago               │
│ Owner Response: (Add response)   │
└──────────────────────────────────┘
```

---

### 2.3 Analytics Dashboard
**Route**: `/owner/properties/[id]/analytics`  
**Purpose**: View property performance metrics

**Metrics to Display**:
1. **Occupancy Metrics**
   - Current occupancy rate
   - Occupancy trend (30-day chart)
   - Average occupancy

2. **Revenue Metrics**
   - Current month revenue
   - YTD revenue
   - Average revenue per room
   - Revenue trend

3. **Booking Metrics**
   - Total bookings (month)
   - Conversion rate (inquiries → bookings)
   - Average booking duration
   - Cancellation rate

4. **Engagement Metrics**
   - Views (how many students viewed)
   - Inquiries received
   - Response rate
   - Average response time

5. **Rating Metrics**
   - Current rating
   - Review count
   - Sentiment breakdown (positive/neutral/negative)

**Components**:
```
src/app/owner/properties/[id]/analytics/
└── page.tsx
    └── components/
        ├── OccupancyChart.tsx    ← Line chart
        ├── RevenueChart.tsx      ← Bar chart
        ├── KeyMetrics.tsx        ← Stats cards
        └── SentimentBreakdown.tsx ← Pie chart
```

---

### 2.4 Messages/Chat
**Route**: `/owner/messages`  
**Purpose**: Direct communication with students

**Features**:
- Chat history with each student
- Notification for new messages
- Quick reply templates
- Message threads per property

---

## 🎯 Phase 3: Financial Management (2-3 hours)

### 3.1 Payment & Settlement Page
**Route**: `/owner/payments`  
**Purpose**: View earnings and payment history

**Features**:
- Current month earnings breakdown
- Payment schedule (5th of every month)
- Settlement history (last 12 months)
- Bank account details (add/edit)
- Pending payments
- Tax documentation

**Display**:
```
Current Month Earnings: ₹45,000
├─ Room 101: ₹5,000 × 1 month
├─ Room 102: ₹7,000 × 1 month
├─ Room 201: ₹6,000 × 1 month
└─ Service Fee: -₹3,000 (15% commission)

Next Settlement: Dec 5, 2025
Amount Due: ₹45,000
```

---

### 3.2 Refund/Cancellation Policy
**Route**: `/owner/settings/policies`  
**Purpose**: Define owner's policies

**Policies to Set**:
- Cancellation policy
- Refund policy
- Guest policy
- Check-in/Check-out times
- House rules

---

## 🎯 Phase 4: Account Management (1-2 hours)

### 4.1 Owner Profile Page
**Route**: `/owner/profile`  
**Purpose**: Manage owner information

**Features**:
- Edit profile (name, phone, email)
- Upload profile picture
- Bio/About section
- Business registration info
- Aadhaar/ID verification status
- Bank account details
- Payment preferences

---

### 4.2 Settings & Preferences
**Route**: `/owner/settings`  
**Purpose**: Account preferences and security

**Features**:
- Email notifications preferences
- SMS notification preferences
- Password management
- Two-factor authentication
- Activity log
- Connected devices

---

## 📊 Database Schema Updates

### Update User Model (Owner-specific fields)

```typescript
export interface IUser extends Document {
    // Existing fields...
    
    // Owner-specific fields
    bankAccount?: {
        accountNumber: string;
        ifsc: string;
        accountHolder: string;
        bankName: string;
    };
    
    aadhaarVerified?: boolean;
    businessRegistration?: string;
    profilePicture?: string;
    bio?: string;
    businessName?: string;
    
    // Statistics (for quick display)
    ownerStats?: {
        totalProperties: number;
        totalBookings: number;
        averageRating: number;
        totalReviews: number;
        totalRevenue: number;
        responseRate: number;
    };
}
```

### Update Property Model (Additional fields)

```typescript
export interface IProperty extends Document {
    // Existing fields...
    
    // Additional fields for owner dashboard
    roomTypes?: Array<{
        type: string;
        count: number;
        pricePerMonth: number;
        amenities?: string[];
    }>;
    
    additionalCharges?: {
        food?: number;
        electricity?: number;
        water?: number;
        guest?: number;
    };
    
    ownerStats?: {
        totalBookings: number;
        activeBookings: number;
        pendingRequests: number;
        averageOccupancy: number;
        monthlyRevenue: number;
    };
    
    policies?: {
        cancellation: string;
        refund: string;
        guestPolicy: string;
        checkInTime: string;
        checkOutTime: string;
    };
    
    features?: {
        wifi: boolean;
        ac: boolean;
        parking: boolean;
        foodIncluded: number;
        guestPolicy: string;
    };
}
```

---

## 🔌 API Endpoints Required

### Owner Authentication & Profile

```
GET  /api/owner/profile              → Get owner's profile
PUT  /api/owner/profile              → Update owner profile
POST /api/owner/upload-picture       → Upload profile picture
POST /api/owner/verify-bank          → Verify bank account
```

### Properties Management

```
GET  /api/owner/properties           → List all owner's properties
POST /api/owner/properties           → Create new property
GET  /api/owner/properties/[id]      → Get property details
PUT  /api/owner/properties/[id]      → Update property
DELETE /api/owner/properties/[id]    → Delete property (if no active bookings)
POST /api/owner/properties/[id]/publish → Publish property (approval needed)
```

### Images & Media

```
POST /api/owner/properties/[id]/upload-images    → Upload property images
DELETE /api/owner/properties/[id]/images/[imgId] → Delete image
PUT /api/owner/properties/[id]/reorder-images    → Reorder images
```

### Room Management

```
GET  /api/owner/properties/[id]/rooms            → List rooms
PUT  /api/owner/properties/[id]/rooms/[roomId]   → Update room status
POST /api/owner/properties/[id]/rooms            → Add room
DELETE /api/owner/properties/[id]/rooms/[roomId] → Remove room
```

### Bookings

```
GET  /api/owner/bookings                     → List owner's bookings
GET  /api/owner/properties/[id]/bookings     → Bookings for property
POST /api/owner/bookings/[id]/accept         → Accept booking
POST /api/owner/bookings/[id]/decline        → Decline booking
PUT  /api/owner/bookings/[id]                → Update booking status
POST /api/owner/bookings/[id]/message        → Send message to student
```

### Reviews & Ratings

```
GET  /api/owner/properties/[id]/reviews      → Get reviews
POST /api/owner/reviews/[id]/respond         → Respond to review
```

### Analytics & Reports

```
GET  /api/owner/analytics                    → Owner dashboard stats
GET  /api/owner/properties/[id]/analytics    → Property-level analytics
GET  /api/owner/payments                     → Payment history
GET  /api/owner/revenue                      → Revenue report
```

---

## 🔐 Authorization & Permissions

### Role-Based Access Control (RBAC)

```typescript
// Middleware to check owner role
export async function isOwner(req) {
    const session = await getServerSession();
    if (!session?.user || (session.user as any).role !== 'owner') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return null; // Authorized
}

// Owner can only access their own properties
export async function ownerCanAccessProperty(propertyId, userId) {
    const property = await Property.findById(propertyId);
    if (property.ownerId.toString() !== userId.toString()) {
        return false;
    }
    return true;
}
```

---

## 🎨 UI/UX Considerations

### Design System Elements

1. **Color Scheme**
   - Primary: Green (success, earnings)
   - Secondary: Blue (information)
   - Alert: Red (warnings, declines)
   - Neutral: Gray (disabled, inactive)

2. **Icons** (Lucide React)
   - Home icon → Dashboard
   - Building2 icon → Properties
   - DollarSign icon → Revenue
   - BarChart3 icon → Analytics
   - MessageSquare icon → Reviews
   - Users icon → Bookings
   - Settings icon → Settings

3. **Notifications**
   - Toast notifications for actions (save, delete, etc.)
   - Badge for pending bookings
   - Email notifications for important events
   - SMS optional alerts

### Responsive Design
- Mobile-first approach
- Tablet-optimized layouts
- Desktop with sidebar navigation
- Touch-friendly buttons (min 44px)

---

## 📅 Implementation Timeline

### Week 1 (Days 1-3)
- [x] Database schema updates
- [x] API endpoints (basic CRUD)
- [ ] Owner dashboard layout
- [ ] Properties listing page

### Week 1 (Days 4-5)
- [ ] Add/Edit property form
- [ ] Image upload functionality

### Week 2 (Days 1-2)
- [ ] Room availability management
- [ ] Pricing management

### Week 2 (Days 3-4)
- [ ] Bookings management page
- [ ] Reviews & responses

### Week 2 (Days 5)
- [ ] Analytics dashboard
- [ ] Payment history page

### Week 3
- [ ] Owner profile
- [ ] Settings page
- [ ] Testing and bug fixes

---

## ✅ Feature Priority Matrix

| Feature | Priority | Effort | Impact | Dependencies |
|---------|----------|--------|--------|--------------|
| Dashboard | Critical | 2h | High | Auth ✅ |
| Properties List | Critical | 2h | High | DB ✅ |
| Add/Edit Property | Critical | 3h | Critical | Image Upload, Form |
| Image Upload | Critical | 2h | Critical | Cloudinary |
| Room Availability | High | 2h | High | Property ✅ |
| Pricing Management | High | 1h | Medium | Property ✅ |
| Bookings Management | High | 3h | High | Booking Model ✅ |
| Reviews Management | Medium | 2h | Medium | Review Model ✅ |
| Analytics | Medium | 3h | Medium | Data Aggregation |
| Payments | Medium | 2h | Medium | Payment Integration |
| Profile | Low | 1h | Low | User Model ✅ |
| Settings | Low | 1h | Low | Auth ✅ |

---

## 🚀 Deployment Considerations

### Environment Variables Needed
```env
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
OWNER_VERIFICATION_EMAIL=owner@orbit.com
```

### Testing Checklist
- [ ] Owner can create property
- [ ] Images upload to Cloudinary
- [ ] Pricing calculates correctly
- [ ] Bookings appear in owner dashboard
- [ ] Reviews show with sentiment tags
- [ ] Analytics data is accurate
- [ ] Payments settle correctly
- [ ] Mobile responsive on all pages

### Performance Optimization
- Lazy load analytics charts
- Cache owner stats
- Pagination for bookings/reviews
- Image optimization on upload
- Database indexing on ownerId queries

---

## 📝 Additional Recommendations

### What Else to Add (Enhancement Ideas)

1. **Automation & Rules**
   - Auto-accept bookings from verified students
   - Auto-decline bookings from blacklisted users
   - Auto-send welcome message template
   - Auto-send rent reminders

2. **Insights & Reports**
   - Competitor pricing analysis
   - Market trend reports
   - Seasonal pricing recommendations
   - Student preference analysis

3. **Communication**
   - Email campaign to past students
   - Promotional banners for available rooms
   - Newsletter for new amenities
   - WhatsApp Business API integration

4. **Operations**
   - Maintenance request tracking
   - Expense tracking
   - Inventory management (WiFi router, locks, etc.)
   - Maintenance schedule

5. **Verification & Compliance**
   - Digital lease agreement
   - E-signature for agreements
   - Deposit collection tracking
   - Compliance checklist

6. **Growth Features**
   - Referral program (refer owner to another PG)
   - Rating boosts (verified documents, quick response)
   - Featured listings
   - Premium memberships

7. **Integration**
   - WhatsApp Business API (auto replies)
   - Google Calendar sync
   - Accounting software integration (Zoho, Tally)
   - Bank reconciliation

---

## 📞 Stakeholder Communication

### For Owners (What They Care About)
✅ Easy property management  
✅ More bookings (visibility)  
✅ Timely payments  
✅ Support for issues  
✅ Low commission  

### For Students (What They See)
✅ Verified, legitimate properties  
✅ Quick owner responses  
✅ Professional presentation  
✅ Real images, reviews  

### For Platform (What We Benefit)
✅ User retention  
✅ Quality properties  
✅ More bookings → more commission  
✅ Reduced support load  
✅ Network effects  

---

**Document Status**: Complete Implementation Plan  
**Next Step**: Begin Phase 1 development  
**Questions**: Refer to documentation or discuss with team

