import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
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
    // Rate limiting for admin list operations
    const identifier = getRateLimitIdentifier(req);
    const rateLimitResult = rateLimit(identifier, 100, 15 * 60 * 1000); // 100 req/15min

    if (!rateLimitResult.success) {
      logger.warn('Admin users list rate limited', { ip: metadata.ip });
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
        attemptedResource: 'admin/users',
        ip: metadata.ip,
      });
      return createErrorResponse('Forbidden - Admin access required', 403);
    }

    logger.info('Admin users list request', {
      email: session.user.email,
      adminId: adminUser._id.toString(),
    });

    // Parse query parameters for pagination and filtering
    const { searchParams } = new URL(req.url);
    const page = validateInteger(searchParams.get('page'), 1, 1000) || 1;
    const limit = validateInteger(searchParams.get('limit'), 1, 100) || 20;
    const skip = (page - 1) * limit;

    const role = searchParams.get('role');
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    // Build query with filters
    const query: any = {};

    // Role filter
    if (role) {
      const validRoles = ['student', 'owner', 'admin'];
      if (validRoles.includes(role)) {
        query.role = role;
      }
    }

    // Status filter
    if (status) {
      const validStatuses = ['active', 'blacklisted', 'suspended'];
      if (validStatuses.includes(status)) {
        query.status = status;
      }
    }

    // Search filter (name or email)
    if (search) {
      const sanitizedSearch = sanitizeString(search).slice(0, 100);
      query.$or = [
        { name: { $regex: sanitizedSearch, $options: 'i' } },
        { email: { $regex: sanitizedSearch, $options: 'i' } },
      ];
    }

    // Execute query with pagination
    const [users, totalCount] = await Promise.all([
      User.find(query)
        .select('-password -verificationToken -resetPasswordToken')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    logger.info('Admin users retrieved', {
      email: session.user.email,
      count: users.length,
      total: totalCount,
      page,
      filters: { role, status, search: search ? 'provided' : 'none' },
    });

    // Log security event for audit
    logger.logSecurity('ADMIN_USERS_LIST_ACCESSED', {
      email: session.user.email,
      adminId: adminUser._id.toString(),
      filters: { role, status, hasSearch: !!search },
      resultCount: users.length,
    });

    const response = NextResponse.json({
      success: true,
      data: users,
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
    logger.error('Admin users list failed', sanitizeErrorForLog(error), {
      metadata,
      admin: session?.user?.email || 'unknown',
    });
    return createErrorResponse('Failed to fetch users', 500);
  }
}
