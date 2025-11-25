import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import AuditLog from '@/models/AuditLog';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    await dbConnect();
    const { verify } = await req.json();
    const { id } = await params;

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    user.isVerified = verify;
    await user.save();

    // Create audit log
    const adminName = session?.user ? (session.user as Record<string, unknown>).name as string : 'Unknown Admin';
    const action = verify ? 'User Verified' : 'User Unverified';
    const details = `${action}: ${user.name} (${user.email})`;

    await AuditLog.create({
      admin: adminName,
      action: action,
      subject: 'User',
      details: details,
      userId: id,
      changes: { isVerified: verify }
    });

    return NextResponse.json({
      message: verify ? 'User verified' : 'User unverified',
      user: {
        _id: user._id,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to update user', details: String(error) },
      { status: 500 }
    );
  }
}
