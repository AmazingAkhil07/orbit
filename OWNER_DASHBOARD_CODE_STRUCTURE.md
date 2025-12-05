# 🛠️ Owner Dashboard - Code Structure & First Steps

**Ready to Code?** Here's exactly what to build first.

---

## Step 1: Update Database Models

### A. Update User Model
**File**: `src/models/User.ts`

```typescript
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    image?: string;
    role: 'student' | 'owner' | 'admin';
    isVerified: boolean;
    phone?: string;
    university?: 'DSU' | 'Jain' | 'Other';
    blacklisted: boolean;
    password?: string;
    
    // OWNER-SPECIFIC FIELDS (ADD THESE)
    bankAccount?: {
        accountNumber: string;
        ifsc: string;
        accountHolder: string;
        bankName: string;
    };
    aadhaarVerified?: boolean;
    profilePicture?: string;
    bio?: string;
    businessName?: string;
    ownerStats?: {
        totalProperties: number;
        totalBookings: number;
        totalReviews: number;
        averageRating: number;
    };
}

const UserSchema: Schema<IUser> = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        image: { type: String },
        password: { type: String },
        role: {
            type: String,
            enum: ['student', 'owner', 'admin'],
            default: 'student',
        },
        isVerified: { type: Boolean, default: false },
        phone: { type: String },
        university: { type: String, enum: ['DSU', 'Jain', 'Other'] },
        blacklisted: { type: Boolean, default: false },
        
        // OWNER FIELDS (ADD THESE)
        bankAccount: {
            accountNumber: { type: String },
            ifsc: { type: String },
            accountHolder: { type: String },
            bankName: { type: String },
        },
        aadhaarVerified: { type: Boolean, default: false },
        profilePicture: { type: String },
        bio: { type: String },
        businessName: { type: String },
        ownerStats: {
            totalProperties: { type: Number, default: 0 },
            totalBookings: { type: Number, default: 0 },
            totalReviews: { type: Number, default: 0 },
            averageRating: { type: Number, default: 0 },
        },
    },
    { timestamps: true }
);

const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
```

### B. Update Property Model
**File**: `src/models/Property.ts`

```typescript
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProperty extends Document {
    ownerId: mongoose.Types.ObjectId;
    title: string;
    slug: string;
    description: string;
    location: {
        lat: number;
        lng: number;
        address: string;
        directionsVideoUrl?: string;
    };
    price: {
        amount: number;
        period: 'monthly';
    };
    amenities: string[];
    media: {
        images: string[];
        virtualTourUrl?: string;
    };
    liveStats: {
        totalRooms: number;
        occupiedRooms: number;
    };
    verdict?: string;
    sentimentTags: string[];
    
    // OWNER FIELDS (ADD THESE)
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
    features?: {
        wifi: boolean;
        ac: boolean;
        parking: boolean;
        foodIncluded: number;
        guestPolicy: string;
    };
    policies?: {
        cancellation: string;
        refund: string;
        checkInTime: string;
        checkOutTime: string;
    };
    approvalStatus?: 'pending' | 'approved' | 'rejected';
    ownerStats?: {
        totalViews: number;
        totalInquiries: number;
        totalBookings: number;
        activeBookings: number;
        monthlyRevenue: number;
        averageRating: number;
    };
}

const PropertySchema: Schema<IProperty> = new Schema(
    {
        ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        location: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true },
            address: { type: String, required: true },
            directionsVideoUrl: { type: String },
        },
        price: {
            amount: { type: Number, required: true },
            period: { type: String, enum: ['monthly'], default: 'monthly' },
        },
        amenities: [{ type: String }],
        media: {
            images: [{ type: String }],
            virtualTourUrl: { type: String },
        },
        liveStats: {
            totalRooms: { type: Number, required: true },
            occupiedRooms: { type: Number, default: 0 },
        },
        verdict: { type: String },
        sentimentTags: [{ type: String }],
        
        // OWNER FIELDS (ADD THESE)
        roomTypes: [
            {
                type: { type: String },
                count: { type: Number },
                pricePerMonth: { type: Number },
                amenities: [{ type: String }],
            },
        ],
        additionalCharges: {
            food: { type: Number },
            electricity: { type: Number },
            water: { type: Number },
            guest: { type: Number },
        },
        features: {
            wifi: { type: Boolean },
            ac: { type: Boolean },
            parking: { type: Boolean },
            foodIncluded: { type: Number },
            guestPolicy: { type: String },
        },
        policies: {
            cancellation: { type: String },
            refund: { type: String },
            checkInTime: { type: String },
            checkOutTime: { type: String },
        },
        approvalStatus: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        ownerStats: {
            totalViews: { type: Number, default: 0 },
            totalInquiries: { type: Number, default: 0 },
            totalBookings: { type: Number, default: 0 },
            activeBookings: { type: Number, default: 0 },
            monthlyRevenue: { type: Number, default: 0 },
            averageRating: { type: Number, default: 0 },
        },
    },
    { timestamps: true }
);

const Property: Model<IProperty> =
    mongoose.models.Property ||
    mongoose.model<IProperty>('Property', PropertySchema);

export default Property;
```

---

## Step 2: Create Owner Layout & Navigation

### A. Owner Layout
**File**: `src/app/owner/layout.tsx`

```typescript
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import OwnerNav from '@/components/owner/OwnerNav';
import OwnerSidebar from '@/components/owner/OwnerSidebar';

async function getAuthOptions() {
    try {
        const { authOptions } = await import('../auth/[...nextauth]/route');
        return authOptions;
    } catch {
        return {};
    }
}

export default async function OwnerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const authOptions = await getAuthOptions();
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect('/auth/signin');
    }

    const user = session.user as any;
    if (user.role !== 'owner' && user.role !== 'admin') {
        redirect('/');
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <OwnerNav user={user} />
            <div className="flex">
                <OwnerSidebar />
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
```

### B. Owner Navigation
**File**: `src/components/owner/OwnerNav.tsx`

```typescript
'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { LogOut, ChevronDown, Home } from 'lucide-react';
import { useState } from 'react';

export default function OwnerNav({ user }: { user: any }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <nav className="bg-white shadow-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <div>
                    <Link href="/owner/dashboard" className="text-2xl font-bold text-green-600">
                        Orbit Owner
                    </Link>
                </div>

                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                        <Home size={20} />
                        <span>Home</span>
                    </Link>

                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100"
                        >
                            <img
                                src={user.image || 'https://via.placeholder.com/32'}
                                alt="Avatar"
                                className="w-8 h-8 rounded-full"
                            />
                            <span>{user.name}</span>
                            <ChevronDown size={16} />
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-200 z-10">
                                <Link
                                    href="/owner/profile"
                                    className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    Profile
                                </Link>
                                <Link
                                    href="/owner/settings"
                                    className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    Settings
                                </Link>
                                <button
                                    onClick={async () => {
                                        await signOut({ redirect: true, callbackUrl: '/' });
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 flex items-center gap-2"
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
```

### C. Owner Sidebar
**File**: `src/components/owner/OwnerSidebar.tsx`

```typescript
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Building2,
    DollarSign,
    BarChart3,
    MessageSquare,
    Users,
    Settings,
    ChevronLeft,
} from 'lucide-react';
import { useState } from 'react';

const links = [
    { href: '/owner/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/owner/properties', label: 'Properties', icon: Building2 },
    { href: '/owner/bookings', label: 'Bookings', icon: Users },
    { href: '/owner/reviews', label: 'Reviews', icon: MessageSquare },
    { href: '/owner/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/owner/payments', label: 'Payments', icon: DollarSign },
];

export default function OwnerSidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside className={`bg-white shadow-md transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
            <div className="flex justify-between items-center p-4">
                {!collapsed && <h2 className="font-bold text-gray-800">Menu</h2>}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-2 hover:bg-gray-100 rounded"
                >
                    <ChevronLeft size={20} />
                </button>
            </div>

            <nav className="space-y-2 p-4">
                {links.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname.startsWith(href);
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                                isActive
                                    ? 'bg-green-100 text-green-700 font-semibold'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            <Icon size={20} />
                            {!collapsed && <span>{label}</span>}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
```

---

## Step 3: Create Dashboard Page

### Dashboard
**File**: `src/app/owner/dashboard/page.tsx`

```typescript
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Property from '@/models/Property';
import Booking from '@/models/Booking';
import { BarChart3, DollarSign, Users, Building2 } from 'lucide-react';

async function getAuthOptions() {
    try {
        const { authOptions } = await import('../../auth/[...nextauth]/route');
        return authOptions;
    } catch {
        return {};
    }
}

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
}

function StatCard({ title, value, icon, trend }: StatCardProps) {
    return (
        <div className="bg-white shadow-md rounded-lg p-6 flex items-start justify-between">
            <div>
                <p className="text-gray-600 text-sm">{title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                {trend && <p className="text-sm text-green-600 mt-2">{trend}</p>}
            </div>
            <div className="text-green-600">{icon}</div>
        </div>
    );
}

export default async function OwnerDashboard() {
    const authOptions = await getAuthOptions();
    const session = await getServerSession(authOptions);
    const user = session?.user as any;

    try {
        await connectDB();

        const owner = await User.findById(user.id);
        const properties = await Property.find({ ownerId: user.id });
        const bookings = await Booking.find({
            propertyId: { $in: properties.map((p) => p._id) },
        });

        const stats = {
            totalProperties: properties.length,
            activeBookings: bookings.filter((b) => b.status === 'confirmed').length,
            totalBookings: bookings.length,
            monthlyRevenue: bookings
                .filter((b) => b.status === 'confirmed')
                .reduce((sum, b) => sum + (b.rent || 0), 0),
        };

        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Welcome back, {owner?.name}!</h1>
                    <p className="text-gray-600 mt-2">Here's what's happening with your properties</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Properties"
                        value={stats.totalProperties}
                        icon={<Building2 size={32} />}
                    />
                    <StatCard
                        title="Active Bookings"
                        value={stats.activeBookings}
                        icon={<Users size={32} />}
                    />
                    <StatCard
                        title="Total Bookings"
                        value={stats.totalBookings}
                        icon={<BarChart3 size={32} />}
                    />
                    <StatCard
                        title="This Month Revenue"
                        value={`₹${stats.monthlyRevenue.toLocaleString()}`}
                        icon={<DollarSign size={32} />}
                    />
                </div>

                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <a
                            href="/owner/properties/new"
                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
                        >
                            ➕ Add New Property
                        </a>
                        <a
                            href="/owner/properties"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                        >
                            📋 View All Properties
                        </a>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('Dashboard error:', error);
        return <div>Error loading dashboard</div>;
    }
}
```

---

## Step 4: Create Properties List Page

### Properties List
**File**: `src/app/owner/properties/page.tsx`

```typescript
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import Property from '@/models/Property';
import Link from 'next/link';
import { Edit2, Trash2, Eye, BarChart3 } from 'lucide-react';

async function getAuthOptions() {
    try {
        const { authOptions } = await import('../../auth/[...nextauth]/route');
        return authOptions;
    } catch {
        return {};
    }
}

export default async function OwnerPropertiesPage() {
    const authOptions = await getAuthOptions();
    const session = await getServerSession(authOptions);
    const user = session?.user as any;

    await connectDB();
    const properties = await Property.find({ ownerId: user.id });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
                    <p className="text-gray-600 mt-2">Manage all your property listings</p>
                </div>
                <Link
                    href="/owner/properties/new"
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-semibold"
                >
                    ➕ Add Property
                </Link>
            </div>

            {properties.length === 0 ? (
                <div className="bg-white rounded-lg p-12 text-center">
                    <p className="text-gray-600 text-lg mb-4">No properties yet</p>
                    <Link
                        href="/owner/properties/new"
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 inline-block"
                    >
                        Create Your First Property
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((prop) => (
                        <div key={prop._id.toString()} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition">
                            <div className="relative">
                                <img
                                    src={prop.media.images[0] || 'https://via.placeholder.com/400x300'}
                                    alt={prop.title}
                                    className="w-full h-40 object-cover"
                                />
                                <div className="absolute top-2 right-2 bg-gray-800 text-white px-3 py-1 rounded text-sm">
                                    {prop.liveStats.occupiedRooms}/{prop.liveStats.totalRooms} Occupied
                                </div>
                            </div>

                            <div className="p-4">
                                <h3 className="font-bold text-lg text-gray-900">{prop.title}</h3>
                                <p className="text-gray-600 text-sm mt-1">{prop.location.address}</p>
                                <p className="text-green-600 font-bold mt-2">₹{prop.price.amount.toLocaleString()}/month</p>

                                <div className="flex gap-2 mt-4">
                                    <Link
                                        href={`/owner/properties/${prop._id}/edit`}
                                        className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                                    >
                                        <Edit2 size={16} /> Edit
                                    </Link>
                                    <Link
                                        href={`/owner/properties/${prop._id}/analytics`}
                                        className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
                                    >
                                        <BarChart3 size={16} /> Analytics
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
```

---

## Step 5: Environment Variables

### Add to `.env.local`
```env
# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Owner Commission
OWNER_COMMISSION_RATE=15  # 15% commission
```

---

## Next Steps After These Steps

1. ✅ Create add/edit form for properties
2. ✅ Build image upload component
3. ✅ Create room availability page
4. ✅ Create pricing management
5. ✅ Create bookings management
6. ✅ Create reviews page
7. ✅ Create analytics dashboard

---

**This foundation takes ~2 hours to implement.**

After this, the rest flows much easier!

