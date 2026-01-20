import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import User from '@/models/User';
import AuditLog from '@/models/AuditLog';
import connectDB from '@/lib/db';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import {
  rateLimit,
  getRateLimitIdentifier,
  addSecurityHeaders,
  addRateLimitHeaders,
  createErrorResponse,
  createRateLimitResponse,
  sanitizeString,
  validateEmail,
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
      logger.warn('Admin profile GET rate limited', { ip: metadata.ip });
      return createRateLimitResponse(rateLimitResult.retryAfter!);
    }

    // Verify admin authentication
    session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return createErrorResponse('Unauthorized', 401);
    }

    await connectDB();

    // Verify admin role
    const user = await User.findOne({ email: session.user.email }).lean();

    if (!user || user.role !== 'admin') {
      logger.logSecurity('ADMIN_ACCESS_DENIED', {
        email: session.user.email,
        role: user?.role || 'unknown',
        attemptedResource: 'admin/profile',
        ip: metadata.ip,
      });
      return createErrorResponse('Forbidden - Admin access required', 403);
    }

    logger.info('Admin profile accessed', {
      email: session.user.email,
      adminId: user._id.toString(),
    });

    const response = NextResponse.json({
      success: true,
      data: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.image,
        phone: user.phone,
        createdAt: user.createdAt,
      },
      timestamp: new Date().toISOString(),
    });

    addSecurityHeaders(response);
    addRateLimitHeaders(response, 100, rateLimitResult.remaining, rateLimitResult.resetTime);

    return response;
  } catch (error: any) {
    logger.error('Admin profile GET failed', sanitizeErrorForLog(error), {
      metadata,
      admin: session?.user?.email || 'unknown',
    });
    return createErrorResponse('Failed to fetch profile', 500);
  }
}

export async function PUT(req: NextRequest) {
  const startTime = Date.now();
  const metadata = getRequestMetadata(req);
  let session: any = null;

  try {
    // Rate limiting - stricter for updates
    const identifier = getRateLimitIdentifier(req);
    const rateLimitResult = rateLimit(identifier, 50, 15 * 60 * 1000);

    if (!rateLimitResult.success) {
      logger.warn('Admin profile update rate limited', { ip: metadata.ip });
      return createRateLimitResponse(rateLimitResult.retryAfter!);
    }

    // Verify admin authentication
    session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return createErrorResponse('Unauthorized', 401);
    }

    await connectDB();

    // Verify admin role
    const currentUser = await User.findOne({ email: session.user.email }).lean();

    if (!currentUser || currentUser.role !== 'admin') {
      logger.logSecurity('ADMIN_ACCESS_DENIED', {
        email: session.user.email,
        role: currentUser?.role || 'unknown',
        attemptedResource: 'admin/profile',
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

    // Build update object
    const updateData: any = {};

    if (body.name) {
      const sanitizedName = sanitizeString(body.name).slice(0, 100);
      if (sanitizedName.length < 2) {
        return createErrorResponse('Name must be at least 2 characters', 400);
      }
      updateData.name = sanitizedName;
    }

    if (body.email) {
      const validEmail = validateEmail(body.email);
      if (!validEmail) {
        return createErrorResponse('Invalid email format', 400);
      }

      // Check if email is already taken by another user
      if (validEmail !== currentUser.email) {
        const existingUser = await User.findOne({ email: validEmail }).lean();
        if (existingUser) {
          return createErrorResponse('Email already in use', 409);
        }
      }

      updateData.email = validEmail;
    }

    if (body.phone) {
      updateData.phone = sanitizeString(body.phone).slice(0, 20);
    }

    if (Object.keys(updateData).length === 0) {
      return createErrorResponse('No valid update fields provided', 400);
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      currentUser._id,
      updateData,
      { new: true }
    )
      .select('-password -verificationToken -resetPasswordToken')
      .lean();

    // Create audit log
    await AuditLog.create({
      userId: currentUser._id,
      action: 'ADMIN_PROFILE_UPDATED',
      changes: {
        before: {
          name: currentUser.name,
          email: currentUser.email,
          phone: currentUser.phone,
        },
        after: updateData,
      },
      ipAddress: metadata.ip,
      userAgent: metadata.userAgent,
      timestamp: new Date(),
    });

    logger.logSecurity('ADMIN_PROFILE_UPDATED', {
      email: session.user.email,
      adminId: currentUser._id.toString(),
      updatedFields: Object.keys(updateData),
    });

    const response = NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'Profile updated successfully',
      timestamp: new Date().toISOString(),
    });

    addSecurityHeaders(response);
    addRateLimitHeaders(response, 50, rateLimitResult.remaining, rateLimitResult.resetTime);

    return response;
  } catch (error: any) {
    logger.error('Admin profile update failed', sanitizeErrorForLog(error), {
      metadata,
      admin: session?.user?.email || 'unknown',
    });

    if (error.code === 11000) {
      return createErrorResponse('Email already in use', 409);
    }

    return createErrorResponse('Failed to update profile', 500);
  }
}
