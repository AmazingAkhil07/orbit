import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Property from '@/models/Property';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

async function ensureSeeded() {
    try {
        const existingCount = await Property.countDocuments();
        if (existingCount > 0) {
            return; // Already seeded
        }
        
        console.log('Database empty, auto-seeding...');
        
        let owner = await User.findOne({ email: 'owner@orbit.com' });
        if (!owner) {
            owner = await User.create({
                name: 'Orbit Owner',
                email: 'owner@orbit.com',
                role: 'owner',
                isVerified: true,
                phone: '9999999999',
            });
        }

        const properties = [
            {
                ownerId: owner!._id,
                title: 'Sai Balaji PG',
                slug: 'sai-balaji-pg',
                description: 'Premium PG for students near DSU. Includes 3 times food and WiFi.',
                location: {
                    lat: 12.644,
                    lng: 77.436,
                    address: 'Harohalli, Karnataka',
                    directionsVideoUrl: 'https://youtube.com/shorts/example',
                },
                price: { amount: 6500, period: 'monthly' },
                amenities: ['WiFi', 'Mess', 'Hot Water', 'CCTV'],
                media: {
                    images: ['https://placehold.co/600x400/09090b/3b82f6?text=Sai+Balaji'],
                    virtualTourUrl: 'https://kuula.co/share/collection/7lVLq',
                },
                liveStats: { totalRooms: 50, occupiedRooms: 42 },
                verdict: 'Best food in Harohalli. Highly recommended for DSU students.',
                sentimentTags: ['Good Food', 'Strict Warden', 'Walkable to Campus'],
            },
            {
                ownerId: owner!._id,
                title: 'DSU Hostels',
                slug: 'dsu-hostels',
                description: 'Official on-campus accommodation. Very secure but strict rules.',
                location: {
                    lat: 12.642,
                    lng: 77.438,
                    address: 'DSU Campus, Harohalli',
                },
                price: { amount: 9000, period: 'monthly' },
                amenities: ['WiFi', 'Gym', 'Library Access', '24/7 Power'],
                media: {
                    images: ['https://placehold.co/600x400/09090b/3b82f6?text=DSU+Hostel'],
                },
                liveStats: { totalRooms: 200, occupiedRooms: 180 },
                verdict: 'Safest option but expensive. Curfew is strict.',
                sentimentTags: ['Safe', 'On Campus', 'Expensive'],
            },
            {
                ownerId: owner!._id,
                title: 'Green View Residency',
                slug: 'green-view',
                description: 'Budget friendly rooms with a nice view of the hills.',
                location: {
                    lat: 12.646,
                    lng: 77.434,
                    address: 'Near Bus Stand, Harohalli',
                },
                price: { amount: 4500, period: 'monthly' },
                amenities: ['WiFi', 'Parking', 'No Mess'],
                media: {
                    images: ['https://placehold.co/600x400/09090b/3b82f6?text=Green+View'],
                },
                liveStats: { totalRooms: 20, occupiedRooms: 5 },
                verdict: 'Good for budget. You need to arrange your own food.',
                sentimentTags: ['Budget', 'Freedom', 'No Food'],
            },
        ];

        for (const prop of properties) {
            const exists = await Property.findOne({ slug: prop.slug });
            if (!exists) {
                await Property.create(prop);
                console.log(`Created property: ${prop.slug}`);
            }
        }
        
        console.log('Auto-seeding complete');
    } catch (error) {
        console.error('Auto-seeding failed:', error);
    }
}

export async function GET(request: Request) {
    await dbConnect();
    await ensureSeeded();
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { 'location.address': { $regex: search, $options: 'i' } },
        ];
    }

    try {
        const properties = await Property.find(query).populate('ownerId', 'name email');
        console.log('=== API: GET /api/properties ===');
        console.log('Query:', query);
        console.log('Found properties:', properties.length);
        properties.forEach((p: any, i: number) => {
            console.log(`  [${i}] ${p.title} - ${p.location?.address} - ₹${p.price?.amount}`);
        });
        return NextResponse.json(properties);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    // @ts-expect-error - role is not in default session type
    if (!session || session.user.role !== 'owner' && session.user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();

    try {
        const property = await Property.create({
            ...body,
            // @ts-expect-error - id is not in default session type
            ownerId: session.user.id, // Assuming we attach ID to session
        });
        return NextResponse.json(property, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
    }
}
