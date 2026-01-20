import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import Property from '@/models/Property';
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
      logger.warn('Admin properties list rate limited', { ip: metadata.ip });
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
        attemptedResource: 'admin/properties',
        ip: metadata.ip,
      });
      return createErrorResponse('Forbidden - Admin access required', 403);
    }

    logger.info('Admin properties list request', {
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
    const ownerId = searchParams.get('ownerId');

    // Build query with filters
    const query: any = {};

    // Status filter
    if (status) {
      const validStatuses = ['draft', 'published', 'archived'];
      if (validStatuses.includes(status)) {
        query.status = status;
      }
    }

    // Owner filter
    if (ownerId) {
      query.ownerId = ownerId;
    }

    // Search filter (name or location)
    if (search) {
      const sanitizedSearch = sanitizeString(search).slice(0, 100);
      query.$or = [
        { name: { $regex: sanitizedSearch, $options: 'i' } },
        { 'location.city': { $regex: sanitizedSearch, $options: 'i' } },
        { 'location.address': { $regex: sanitizedSearch, $options: 'i' } },
      ];
    }

    // Execute query with pagination
    const [properties, totalCount] = await Promise.all([
      Property.find(query)
        .populate('ownerId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Property.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    logger.info('Admin properties retrieved', {
      email: session.user.email,
      count: properties.length,
      total: totalCount,
      page,
      filters: { status, search: search ? 'provided' : 'none', ownerId },
    });

    logger.logSecurity('ADMIN_PROPERTIES_LIST_ACCESSED', {
      email: session.user.email,
      adminId: adminUser._id.toString(),
      filters: { status, hasSearch: !!search, ownerId },
      resultCount: properties.length,
    });

    const response = NextResponse.json({
      success: true,
      data: properties,
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
    logger.error('Admin properties list failed', sanitizeErrorForLog(error), {
      metadata,
      admin: session?.user?.email || 'unknown',
    });
    return createErrorResponse('Failed to fetch properties', 500);
  }
}
