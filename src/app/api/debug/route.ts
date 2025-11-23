import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Property from '@/models/Property';
import User from '@/models/User';

export async function GET() {
    try {
        await dbConnect();
        
        const propertyCount = await Property.countDocuments();
        const userCount = await User.countDocuments();
        const properties = await Property.find().limit(5);
        
        return NextResponse.json({
            propertyCount,
            userCount,
            properties,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return NextResponse.json({
            error: String(error),
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}
