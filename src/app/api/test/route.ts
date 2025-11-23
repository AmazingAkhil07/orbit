import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Property from '@/models/Property';

export async function GET() {
    try {
        await dbConnect();
        const count = await Property.countDocuments();
        const all = await Property.find();
        
        return NextResponse.json({
            count,
            properties: all.map(p => ({
                id: p._id,
                title: p.title,
                address: p.location?.address,
                price: p.price?.amount,
                amenities: p.amenities
            }))
        });
    } catch (error: any) {
        return NextResponse.json({
            error: error.message || String(error)
        }, { status: 500 });
    }
}
