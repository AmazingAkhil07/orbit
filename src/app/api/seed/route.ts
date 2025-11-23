import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Property from '@/models/Property';

export async function GET() {
    console.log('=== API: GET /api/seed ===');
    await dbConnect();

    try {
        // 1. Create an Owner
        console.log('Creating or finding owner...');
        let owner = await User.findOne({ email: 'owner@orbit.com' });
        if (!owner) {
            console.log('  Owner not found, creating...');
            owner = await User.create({
                name: 'Orbit Owner',
                email: 'owner@orbit.com',
                role: 'owner',
                isVerified: true,
                phone: '9999999999',
            });
            console.log('  Owner created');
        } else {
            console.log('  Owner already exists');
        }

        // 2. Create Properties
        console.log('Creating properties...');
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
                    virtualTourUrl: 'https://kuula.co/share/collection/7lVLq', // Example
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
            console.log(`  Checking property: ${prop.slug}`);
            const exists = await Property.findOne({ slug: prop.slug });
            if (!exists) {
                console.log(`    Creating ${prop.slug}...`);
                await Property.create(prop);
                console.log(`    Created successfully`);
            } else {
                console.log(`    Already exists`);
            }
        }

        console.log('Seed complete');
        return NextResponse.json({ message: 'Database seeded successfully' });
    } catch (error) {
        console.error('Seed failed:', error);
        return NextResponse.json({ error: 'Failed to seed database', details: error }, { status: 500 });
    }
}
