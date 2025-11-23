import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Property from '@/models/Property';

export async function GET() {
    try {
        await dbConnect();

        // Get the green-view property
        const property = await Property.findOne({ slug: 'green-view' }).lean();

        return NextResponse.json({
            property,
            imageCount: property?.media?.images?.length || 0,
            images: property?.media?.images || []
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch property', details: error }, { status: 500 });
    }
}
