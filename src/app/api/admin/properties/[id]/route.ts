import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import Property from '@/models/Property';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as Record<string, unknown>).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { approvalStatus } = await request.json();

    if (!['approved', 'rejected', 'pending'].includes(approvalStatus)) {
      return NextResponse.json(
        { error: 'Invalid approval status' },
        { status: 400 }
      );
    }

    await dbConnect();

    const property = await Property.findByIdAndUpdate(
      id,
      { approvalStatus },
      { new: true }
    );

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ property });
  } catch (error) {
    console.error('Error in PATCH /api/admin/properties/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to update property' },
      { status: 500 }
    );
  }
}
