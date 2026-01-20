import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import User from '@/models/User';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import {
  rateLimit,
  getRateLimitIdentifier,
  addSecurityHeaders,
  addRateLimitHeaders,
  createErrorResponse,
  createRateLimitResponse,
  validateInteger,
  sanitizeString,
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
      logger.warn('Admin bookings list rate limited', { ip: metadata.ip });
      return createRateLimitResponse(rateLimitResult.retryAfter!);
    }

    // Verify admin authentication
    session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      logger.warn('Unauthorized admin access attempt', {
        method: req.method,
        url: req.url,
        ip: metadata.ip,
      });
      return createErrorResponse('Unauthorized', 401);
    }

    await dbConnect();

    // Verify admin role
    const adminUser = await User.findOne({ email: session.user.email }).lean();
    
    if (!adminUser || adminUser.role !== 'admin') {
      logger.logSecurity('ADMIN_ACCESS_DENIED', {
        email: session.user.email,
        role: adminUser?.role || 'unknown',
        attemptedResource: 'admin/bookings',
        ip: metadata.ip,
      });
      return createErrorResponse('Forbidden - Admin access required', 403);
    }

    logger.info('Admin bookings list request', {
      email: session.user.email,
      adminId: adminUser._id.toString(),
    });

    // Parse query parameters for pagination and filtering
    const { searchParams } = new URL(req.url);
    const page = validateInteger(searchParams.get('page'), 1, 1000) || 1;
    const limit = validateInteger(searchParams.get('limit'), 1, 100) || 20;
    const skip = (page - 1) * limit;

    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const userId = searchParams.get('userId');
    const propertyId = searchParams.get('propertyId');

    // Build query with filters
    const query: any = {};

    // Status filter
    if (status) {
      const validStatuses = ['pending', 'confirmed', 'rejected', 'cancelled', 'completed'];
      if (validStatuses.includes(status)) {
        query.status = status;
      }
    }

    // User filter
    if (userId) {
      query.userId = userId;
    }

    // Property filter
    if (propertyId) {
      query.propertyId = propertyId;
    }

    // Search filter (property title or user name/email)
    let bookingIds: any[] = [];
    if (search) {
      const sanitizedSearch = sanitizeString(search).slice(0, 100);
      // This is a simplified search - in production you might want more complex logic
      query.$or = [
        { bookingId: { $regex: sanitizedSearch, $options: 'i' } },
      ];
    }

    // Execute query with pagination
    const [bookings, totalCount] = await Promise.all([
      Booking.find(query)
        .populate('userId', 'name email phone')
        .populate('propertyId', 'name location monthlyRate')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Booking.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    logger.info('Admin bookings retrieved', {
      email: session.user.email,
      count: bookings.length,
      total: totalCount,
      page,
      filters: { status, search: search ? 'provided' : 'none', userId, propertyId },
    });

    logger.logSecurity('ADMIN_BOOKINGS_LIST_ACCESSED', {
      email: session.user.email,
      adminId: adminUser._id.toString(),
      filters: { status, hasSearch: !!search, userId, propertyId },
      resultCount: bookings.length,
    });

    const response = NextResponse.json({
      success: true,
      data: bookings,
      pagination: {
        page,
        limit,
        totalPages,
        totalCount,
        hasMore: page < totalPages,
      },
      timestamp: new Date().toISOString(),
    });

    addSecurityHeaders(response);
    addRateLimitHeaders(response, 100, rateLimitResult.remaining, rateLimitResult.resetTime);

    return response;
  } catch (error: any) {
    logger.error('Admin bookings list failed', sanitizeErrorForLog(error), {
      metadata,
      admin: session?.user?.email || 'unknown',
    });
    return createErrorResponse('Failed to fetch bookings', 500);
  }
}
