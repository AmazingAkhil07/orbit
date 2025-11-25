import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import AuditLog from '@/models/AuditLog';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as Record<string, unknown>).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { blacklist, reason } = await request.json();
    const { id } = await params;

    if (typeof blacklist !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid blacklist value' },
        { status: 400 }
      );
    }

    await dbConnect();

    const updateData: any = { blacklisted: blacklist };
    
    if (blacklist && reason) {
      updateData.blacklistReason = reason;
      updateData.blacklistedAt = new Date();
      updateData.blacklistedBy = (session.user as Record<string, unknown>).name as string || 'Unknown Admin';
    } else if (!blacklist) {
      // Clear blacklist data when unblacklisting
      updateData.blacklistReason = undefined;
      updateData.blacklistedAt = undefined;
      updateData.blacklistedBy = undefined;
    }

    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create audit log
    const adminName = (session.user as Record<string, unknown>).name as string || 'Unknown Admin';
    const action = blacklist ? 'User Blacklisted' : 'User Unblacklisted';
    const reasonText = reason ? ` - Reason: ${reason}` : '';
    const details = `${action}: ${user.name} (${user.email})${reasonText}`;

    await AuditLog.create({
      admin: adminName,
      action: action,
      subject: 'User',
      details: details,
      userId: id,
      changes: { 
        blacklisted: blacklist,
        reason: reason || 'No reason provided',
        timestamp: new Date()
      }
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error in POST /api/admin/users/[id]/blacklist:', error);
    return NextResponse.json(
      { error: 'Failed to update user', details: String(error) },
      { status: 500 }
    );
  }
}
