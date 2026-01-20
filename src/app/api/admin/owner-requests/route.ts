import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import mongoose from 'mongoose';
import {
  rateLimit,
  getRateLimitIdentifier,
  addSecurityHeaders,
  addRateLimitHeaders,
  createErrorResponse,
  createRateLimitResponse,
  validateInteger,
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
      logger.warn('Admin owner requests rate limited', { ip: metadata.ip });
      return createRateLimitResponse(rateLimitResult.retryAfter!);
    }

    // Verify admin authentication
    session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'admin') {
      logger.warn('Unauthorized owner requests access', {
        email: session?.user?.email || 'unknown',
        ip: metadata.ip,
      });
      return createErrorResponse('Unauthorized: Admin access required', 401);
    }

    await dbConnect();

    // Verify admin role from database
    const adminUser = await User.findOne({ email: session.user.email }).lean();
    
    if (!adminUser || adminUser.role !== 'admin') {
      logger.logSecurity('ADMIN_ACCESS_DENIED', {
        email: session.user.email,
        role: adminUser?.role || 'unknown',
        attemptedResource: 'owner-requests',
        ip: metadata.ip,
      });
      return createErrorResponse('Forbidden - Admin access required', 403);
    }

    const OwnerPromotionRequest = mongoose.model('OwnerPromotionRequest');

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'pending';
    const page = validateInteger(searchParams.get('page'), 1, 1000) || 1;
    const limit = validateInteger(searchParams.get('limit'), 1, 100) || 20;
    const skip = (page - 1) * limit;

    // Validate status
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return createErrorResponse(`Status must be one of: ${validStatuses.join(', ')}`, 400);
    }

    // Build query
    const query: any = { status };

    // Execute query with pagination
    const [requests, totalCount] = await Promise.all([
      OwnerPromotionRequest.find(query)
        .populate('userId', 'name email phone')
        .populate('reviewedBy', 'name email')
        .sort({ requestedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      OwnerPromotionRequest.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    logger.info('Admin owner requests retrieved', {
      email: session.user.email,
      count: requests.length,
      total: totalCount,
      status,
      page,
    });

    logger.logSecurity('ADMIN_OWNER_REQUESTS_ACCESSED', {
      email: session.user.email,
      adminId: adminUser._id.toString(),
      status,
      resultCount: requests.length,
    });

    const response = NextResponse.json({
      success: true,
      data: requests,
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
    logger.error('Admin owner requests failed', sanitizeErrorForLog(error), {
      metadata,
      admin: session?.user?.email || 'unknown',
    });
    return createErrorResponse('Failed to fetch owner promotion requests', 500);
  }
}
