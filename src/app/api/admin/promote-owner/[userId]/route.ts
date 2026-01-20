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
    // Rate limiting - strict for promotion operations
    const identifier = getRateLimitIdentifier(req);
    const rateLimitResult = rateLimit(identifier, 30, 15 * 60 * 1000); // 30 req/15min

    if (!rateLimitResult.success) {
      logger.warn('Admin promote owner rate limited', { ip: metadata.ip });
      return createRateLimitResponse(rateLimitResult.retryAfter!);
    }

    // Verify admin authentication
    session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'admin') {
      logger.warn('Unauthorized promotion attempt', {
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
        attemptedResource: 'promote-owner',
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

    // Get target user
    const user = await User.findById(validUserId).lean();

    if (!user) {
      logger.warn('User not found for promotion', {
        userId: validUserId,
        admin: session.user.email,
      });
      return createErrorResponse('User not found', 404);
    }

    // Prevent promoting if already owner or admin
    if (user.role === 'owner') {
      logger.warn('User already owner', {
        userId: validUserId,
        userEmail: user.email,
        admin: session.user.email,
      });
      return createErrorResponse('User is already an owner', 400);
    }

    if (user.role === 'admin') {
      logger.logSecurity('ADMIN_PROMOTION_TO_OWNER_ATTEMPT', {
        email: session.user.email,
        targetEmail: user.email,
      });
      return createErrorResponse('Cannot change admin role to owner', 403);
    }

    // Verify promotion request exists
    const OwnerPromotionRequest = mongoose.model('OwnerPromotionRequest');
    const promotionRequest = await OwnerPromotionRequest.findOne({
      userId: validUserId,
      status: 'pending',
    });

    if (!promotionRequest) {
      logger.warn('No pending promotion request found', {
        userId: validUserId,
        userEmail: user.email,
        admin: session.user.email,
      });
      return createErrorResponse('No pending promotion request found for this user', 404);
    }

    // Update user role to 'owner'
    const updatedUser = await User.findByIdAndUpdate(
      validUserId,
      { role: 'owner' },
      { new: true }
    ).select('-password -verificationToken -resetPasswordToken').lean();

    // Mark promotion request as approved
    await OwnerPromotionRequest.findByIdAndUpdate(promotionRequest._id, {
      status: 'approved',
      reviewedAt: new Date(),
      reviewedBy: adminUser._id,
    });

    // Create audit log
    await AuditLog.create({
      userId: adminUser._id,
      action: 'OWNER_PROMOTED',
      targetUserId: validUserId,
      changes: {
        before: { role: user.role },
        after: { role: 'owner' },
        promotionRequestId: promotionRequest._id,
      },
      ipAddress: metadata.ip,
      userAgent: metadata.userAgent,
      timestamp: new Date(),
    });

    logger.logSecurity('OWNER_PROMOTED', {
      email: session.user.email,
      adminId: adminUser._id.toString(),
      targetUserId: validUserId,
      targetUserEmail: user.email,
      promotionRequestId: promotionRequest._id.toString(),
    });

    const response = NextResponse.json({
      success: true,
      message: `${user.name} promoted to owner`,
      data: updatedUser,
      timestamp: new Date().toISOString(),
    });

    addSecurityHeaders(response);
    addRateLimitHeaders(response, 30, rateLimitResult.remaining, rateLimitResult.resetTime);

    return response;
  } catch (error: any) {
    logger.error('Owner promotion failed', sanitizeErrorForLog(error), {
      metadata,
      admin: session?.user?.email || 'unknown',
    });
    return createErrorResponse('Failed to promote owner', 500);
  }
}
