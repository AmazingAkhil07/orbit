import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import AuditLog from '@/models/AuditLog';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
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
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  const metadata = getRequestMetadata(req);
  let session: any = null;

  try {
    // Rate limiting - strict for blacklist operations
    const identifier = getRateLimitIdentifier(req);
    const rateLimitResult = rateLimit(identifier, 20, 15 * 60 * 1000); // 20 req/15min

    if (!rateLimitResult.success) {
      logger.warn('Admin blacklist rate limited', { ip: metadata.ip });
      return createRateLimitResponse(rateLimitResult.retryAfter!);
    }

    // Verify admin authentication
    session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      logger.warn('Unauthorized blacklist attempt', {
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
        attemptedResource: 'blacklist user',
        ip: metadata.ip,
      });
      return createErrorResponse('Forbidden - Admin access required', 403);
    }

    // Parse params and body
    const { id } = await params;
    
    let body;
    try {
      body = await req.json();
    } catch {
      return createErrorResponse('Invalid JSON in request body', 400);
    }

    // Validate user ID
    const validUserId = validateObjectId(id);
    if (!validUserId) {
      return createErrorResponse('Invalid user ID format', 400);
    }

    // Validate blacklist value
    if (typeof body.blacklist !== 'boolean') {
      return createErrorResponse('Blacklist value must be a boolean', 400);
    }

    // Get target user
    const targetUser = await User.findById(validUserId).lean();
    
    if (!targetUser) {
      logger.warn('User not found for blacklist', {
        userId: validUserId,
        admin: session.user.email,
      });
      return createErrorResponse('User not found', 404);
    }

    // Prevent admin from blacklisting themselves
    if (validUserId === adminUser._id.toString()) {
      logger.logSecurity('ADMIN_SELF_BLACKLIST_ATTEMPT', {
        email: session.user.email,
        adminId: adminUser._id.toString(),
      });
      return createErrorResponse('Cannot blacklist yourself', 403);
    }

    // Prevent blacklisting other admins
    if (targetUser.role === 'admin') {
      logger.logSecurity('ADMIN_BLACKLIST_ADMIN_ATTEMPT', {
        email: session.user.email,
        targetEmail: targetUser.email,
      });
      return createErrorResponse('Cannot blacklist other administrators', 403);
    }

    // Build update data
    const updateData: any = { blacklisted: body.blacklist };
    
    if (body.blacklist) {
      // Validate and sanitize reason
      const reason = body.reason ? sanitizeString(body.reason).slice(0, 500) : 'No reason provided';
      
      if (reason.length < 10) {
        return createErrorResponse('Blacklist reason must be at least 10 characters', 400);
      }

      updateData.blacklistReason = reason;
      updateData.blacklistedAt = new Date();
      updateData.blacklistedBy = adminUser._id;
    } else {
      // Clear blacklist data when unblacklisting
      updateData.blacklistReason = undefined;
      updateData.blacklistedAt = undefined;
      updateData.blacklistedBy = undefined;
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      validUserId,
      updateData,
      { new: true }
    )
      .select('-password -verificationToken -resetPasswordToken')
      .lean();

    // Create audit log
    const action = body.blacklist ? 'USER_BLACKLISTED' : 'USER_UNBLACKLISTED';
    
    await AuditLog.create({
      userId: adminUser._id,
      action: action,
      targetUserId: validUserId,
      changes: {
        before: {
          blacklisted: targetUser.blacklisted || false,
          blacklistReason: targetUser.blacklistReason,
        },
        after: {
          blacklisted: body.blacklist,
          blacklistReason: updateData.blacklistReason,
        },
      },
      ipAddress: metadata.ip,
      userAgent: metadata.userAgent,
      timestamp: new Date(),
    });

    logger.logSecurity(action, {
      email: session.user.email,
      adminId: adminUser._id.toString(),
      targetUserId: validUserId,
      targetUserEmail: targetUser.email,
      reason: updateData.blacklistReason || 'unblacklisted',
    });

    const response = NextResponse.json({
      success: true,
      data: updatedUser,
      message: body.blacklist ? 'User blacklisted successfully' : 'User unblacklisted successfully',
      timestamp: new Date().toISOString(),
    });

    addSecurityHeaders(response);
    addRateLimitHeaders(response, 20, rateLimitResult.remaining, rateLimitResult.resetTime);

    return response;
  } catch (error: any) {
    logger.error('Admin blacklist operation failed', sanitizeErrorForLog(error), {
      metadata,
      admin: session?.user?.email || 'unknown',
    });
    return createErrorResponse('Failed to update user blacklist status', 500);
  }
}

