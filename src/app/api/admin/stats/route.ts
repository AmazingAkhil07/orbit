import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Property from '@/models/Property';
import Booking from '@/models/Booking';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import {
  rateLimit,
  getRateLimitIdentifier,
  addSecurityHeaders,
  addRateLimitHeaders,
  createErrorResponse,
  createRateLimitResponse,
  getRequestMetadata,
  sanitizeErrorForLog,
} from '@/lib/security-enhanced';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest) {
  const startTime = Date.now();
  const metadata = getRequestMetadata(req);
  let session: any = null;

  try {
    // Rate limiting
    const identifier = getRateLimitIdentifier(req);
    const rateLimitResult = rateLimit(identifier, 100, 15 * 60 * 1000);

    if (!rateLimitResult.success) {
      logger.warn('Admin stats rate limited', { ip: metadata.ip });
      return createRateLimitResponse(rateLimitResult.retryAfter!);
    }

    // Verify admin authentication
    session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return createErrorResponse('Unauthorized', 401);
    }

    await dbConnect();

    // Verify admin role
    const adminUser = await User.findOne({ email: session.user.email }).lean();

    if (!adminUser || adminUser.role !== 'admin') {
      logger.logSecurity('ADMIN_ACCESS_DENIED', {
        email: session.user.email,
        role: adminUser?.role || 'unknown',
        attemptedResource: 'admin/stats',
        ip: metadata.ip,
      });
      return createErrorResponse('Forbidden - Admin access required', 403);
    }

    // Collect stats in parallel for performance
    const thisMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const [totalUsers, studentCount, ownerCount, verifiedUsers, totalProperties, approvedProperties, pendingProperties, totalBookings, paidBookings, thisMonthBookings, totalRevenue] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'owner' }),
      User.countDocuments({ isVerified: true }),
      Property.countDocuments(),
      Property.countDocuments({ approvalStatus: 'approved' }),
      Property.countDocuments({ approvalStatus: 'pending' }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'paid' }),
      Booking.countDocuments({ createdAt: { $gte: thisMonthStart } }),
      Booking.aggregate([
        { $match: { status: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
    ]);

    const stats = {
      users: {
        total: totalUsers,
        students: studentCount,
        owners: ownerCount,
        verified: verifiedUsers,
      },
      properties: {
        total: totalProperties,
        approved: approvedProperties,
        pending: pendingProperties,
        rejected: totalProperties - approvedProperties - pendingProperties,
      },
      bookings: {
        total: totalBookings,
        paid: paidBookings,
        thisMonth: thisMonthBookings,
      },
      revenue: {
        total: totalRevenue[0]?.total || 0,
      },
    };

    logger.info('Admin stats accessed', {
      email: session.user.email,
      adminId: adminUser._id.toString(),
    });

    const response = NextResponse.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
    });

    addSecurityHeaders(response);
    addRateLimitHeaders(response, 100, rateLimitResult.remaining, rateLimitResult.resetTime);

    return response;
  } catch (error: any) {
    logger.error('Admin stats failed', sanitizeErrorForLog(error), {
      metadata,
      admin: session?.user?.email || 'unknown',
    });
    return createErrorResponse('Failed to fetch stats', 500);
  }
}
