import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import AuditLog from '@/models/AuditLog';
import {
  rateLimit,
  getRateLimitIdentifier,
  addSecurityHeaders,
  addRateLimitHeaders,
  createErrorResponse,
  createRateLimitResponse,
  validateObjectId,
  sanitizeString,
  getRequestMetadata,
  sanitizeErrorForLog,
} from '@/lib/security-enhanced';
import { logger } from '@/lib/logger';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  const startTime = Date.now();
  const metadata = getRequestMetadata(req);
  let session: any = null;

  try {
    // Rate limiting
    const identifier = getRateLimitIdentifier(req);
    const rateLimitResult = rateLimit(identifier, 30, 15 * 60 * 1000);

    if (!rateLimitResult.success) {
      logger.warn('Admin reject promotion rate limited', { ip: metadata.ip });
      return createRateLimitResponse(rateLimitResult.retryAfter!);
    }

    // Verify admin authentication
    session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'admin') {
      logger.warn('Unauthorized rejection attempt', {
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
        attemptedResource: 'reject-owner-promotion',
        ip: metadata.ip,
      });
      return createErrorResponse('Forbidden - Admin access required', 403);
    }

    // Validate user ID
    const { userId } = await context.params;
    const validUserId = validateObjectId(userId);
    
    if (!validUserId) {
      return createErrorResponse('Invalid user ID format', 400);
    }

    // Parse body
    let body;
    try {
      body = await req.json();
    } catch {
      return createErrorResponse('Invalid JSON in request body', 400);
    }

    // Validate and sanitize reason
    const reason = body.reason ? sanitizeString(body.reason).slice(0, 1000) : 'Rejected by admin';
    
    if (reason.length < 10) {
      return createErrorResponse('Rejection reason must be at least 10 characters', 400);
    }

    // Get target user
    const user = await User.findById(validUserId).lean();

    if (!user) {
      logger.warn('User not found for rejection', {
        userId: validUserId,
        admin: session.user.email,
      });
      return createErrorResponse('User not found', 404);
    }

    // Find and update promotion request
    const OwnerPromotionRequest = mongoose.model('OwnerPromotionRequest');
    const promotionRequest = await OwnerPromotionRequest.findOneAndUpdate(
      { userId: validUserId, status: 'pending' },
      {
        status: 'rejected',
        reason: reason,
        reviewedAt: new Date(),
        reviewedBy: adminUser._id,
      },
      { new: true }
    );

    if (!promotionRequest) {
      logger.warn('No pending promotion request found for rejection', {
        userId: validUserId,
        userEmail: user.email,
        admin: session.user.email,
      });
      return createErrorResponse('No pending promotion request found for this user', 404);
    }

    // Create audit log
    await AuditLog.create({
      userId: adminUser._id,
      action: 'OWNER_PROMOTION_REJECTED',
      targetUserId: validUserId,
      changes: {
        promotionRequestId: promotionRequest._id,
        reason: reason,
        status: 'rejected',
      },
      ipAddress: metadata.ip,
      userAgent: metadata.userAgent,
      timestamp: new Date(),
    });

    logger.logSecurity('OWNER_PROMOTION_REJECTED', {
      email: session.user.email,
      adminId: adminUser._id.toString(),
      targetUserId: validUserId,
      targetUserEmail: user.email,
      promotionRequestId: promotionRequest._id.toString(),
      reason: reason,
    });

    const response = NextResponse.json({
      success: true,
      message: `Owner promotion request rejected for ${user.name}`,
      data: promotionRequest,
      timestamp: new Date().toISOString(),
    });

    addSecurityHeaders(response);
    addRateLimitHeaders(response, 30, rateLimitResult.remaining, rateLimitResult.resetTime);

    return response;
  } catch (error: any) {
    logger.error('Owner promotion rejection failed', sanitizeErrorForLog(error), {
      metadata,
      admin: session?.user?.email || 'unknown',
    });
    return createErrorResponse('Failed to reject owner promotion', 500);
  }
}
