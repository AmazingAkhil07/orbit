import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Property from '@/models/Property';
import Booking from '@/models/Booking';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: Request) {
  try {
    // Check admin authorization
    const session = await getServerSession(authOptions);
    if (!session || (session.user as Record<string, unknown>).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const totalUsers = await User.countDocuments();
    const totalProperties = await Property.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const paidBookings = await Booking.countDocuments({ status: 'paid' });

    const totalRevenue = await Booking.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amountPaid' } } },
    ]);

    const thisMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const thisMonthBookings = await Booking.countDocuments({
      createdAt: { $gte: thisMonthStart },
    });

    const studentCount = await User.countDocuments({ role: 'student' });
    const ownerCount = await User.countDocuments({ role: 'owner' });
    const verifiedUsers = await User.countDocuments({ isVerified: true });

    return NextResponse.json({
      totalUsers,
      studentCount,
      ownerCount,
      verifiedUsers,
      totalProperties,
      approvedProperties: await Property.countDocuments({ approvalStatus: 'approved' }),
      pendingProperties: await Property.countDocuments({ approvalStatus: 'pending' }),
      totalBookings,
      paidBookings,
      thisMonthBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
    });
  } catch (error) {
    console.error('Error in GET /api/admin/stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
