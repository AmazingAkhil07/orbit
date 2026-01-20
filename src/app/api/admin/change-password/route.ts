import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import User from '@/models/User';
import AuditLog from '@/models/AuditLog';
import connectDB from '@/lib/db';
import bcrypt from 'bcryptjs';
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

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const metadata = getRequestMetadata(req);
  let session: any = null;

  try {
    // Strict rate limiting for password changes
    const identifier = getRateLimitIdentifier(req);
    const rateLimitResult = rateLimit(identifier, 10, 15 * 60 * 1000); // 10 req/15min

    if (!rateLimitResult.success) {
      logger.warn('Password change rate limited', { ip: metadata.ip });
      return createRateLimitResponse(rateLimitResult.retryAfter!);
    }

    // Verify admin authentication
    session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return createErrorResponse('Unauthorized', 401);
    }

    await connectDB();

    // Verify admin role
    const user = await User.findOne({ email: session.user.email });

    if (!user || user.role !== 'admin') {
      logger.logSecurity('ADMIN_ACCESS_DENIED', {
        email: session.user.email,
        role: user?.role || 'unknown',
        attemptedResource: 'change-password',
        ip: metadata.ip,
      });
      return createErrorResponse('Forbidden - Admin access required', 403);
    }

    // Parse body
    let body;
    try {
      body = await req.json();
    } catch {
      return createErrorResponse('Invalid JSON in request body', 400);
    }

    const { currentPassword, newPassword } = body;

    // Validate required fields
    if (!currentPassword || !newPassword) {
      return createErrorResponse('Current password and new password are required', 400);
    }

    // Verify user has a password set
    if (!user.password) {
      logger.warn('User has no password set', {
        userId: user._id.toString(),
        email: user.email,
      });
      return createErrorResponse('User has no password set. Please contact support.', 400);
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isPasswordValid) {
      logger.logSecurity('PASSWORD_CHANGE_FAILED_INVALID_CURRENT', {
        email: session.user.email,
        userId: user._id.toString(),
        ip: metadata.ip,
      });
      return createErrorResponse('Current password is incorrect', 400);
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      return createErrorResponse('New password must be at least 8 characters', 400);
    }

    if (!/[A-Z]/.test(newPassword)) {
      return createErrorResponse('New password must contain at least one uppercase letter', 400);
    }

    if (!/[a-z]/.test(newPassword)) {
      return createErrorResponse('New password must contain at least one lowercase letter', 400);
    }

    if (!/[0-9]/.test(newPassword)) {
      return createErrorResponse('New password must contain at least one number', 400);
    }

    // Prevent reusing same password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return createErrorResponse('New password must be different from current password', 400);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    // Create audit log
    await AuditLog.create({
      userId: user._id,
      action: 'ADMIN_PASSWORD_CHANGED',
      changes: {
        changedAt: new Date(),
      },
      ipAddress: metadata.ip,
      userAgent: metadata.userAgent,
      timestamp: new Date(),
    });

    logger.logSecurity('ADMIN_PASSWORD_CHANGED', {
      email: session.user.email,
      userId: user._id.toString(),
      ip: metadata.ip,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Password changed successfully',
      timestamp: new Date().toISOString(),
    });

    addSecurityHeaders(response);
    addRateLimitHeaders(response, 10, rateLimitResult.remaining, rateLimitResult.resetTime);

    return response;
  } catch (error: any) {
    logger.error('Password change failed', sanitizeErrorForLog(error), {
      metadata,
      admin: session?.user?.email || 'unknown',
    });
    return createErrorResponse('Failed to change password', 500);
  }
}
