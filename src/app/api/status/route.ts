import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Property from '@/models/Property';

export async function GET() {
    try {
        await dbConnect();
        
        // Test search with empty query (should return all)
        const allProps = await Property.find();
        
        // Test location filter
        const harohalliProps = await Property.find({
            'location.address': { $regex: 'harohalli', $options: 'i' }
        });
        
        // Test price filter
        const cheapProps = await Property.find({
            'price.amount': { $gte: 4000, $lte: 8000 }
        });
        
        return NextResponse.json({
            total: allProps.length,
            inHarohalli: harohalliProps.length,
            inPriceRange: cheapProps.length,
            all: allProps.map(p => ({
                title: p.title,
                address: p.location?.address,
                price: p.price?.amount
            })),
            harohalli: harohalliProps.map(p => ({
                title: p.title,
                address: p.location?.address,
                price: p.price?.amount
            }))
        });
    } catch (error: any) {
        return NextResponse.json({
            error: error.message || String(error)
        }, { status: 500 });
    }
}
