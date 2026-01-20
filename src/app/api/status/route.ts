import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Property from '@/models/Property';
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

  try {
    // Public endpoint but with rate limiting to prevent abuse
    const identifier = getRateLimitIdentifier(req);
    const rateLimitResult = rateLimit(identifier, 50, 15 * 60 * 1000); // 50 req/15min

    if (!rateLimitResult.success) {
      logger.warn('Status check rate limited', { ip: metadata.ip });
      return createRateLimitResponse(rateLimitResult.retryAfter!);
    }

    // Check database connectivity
    let dbStatus = 'disconnected';
    let dbLatency = 0;
    
    try {
      const dbStartTime = Date.now();
      await dbConnect();
      await Property.countDocuments().limit(1);
      dbLatency = Date.now() - dbStartTime;
      dbStatus = 'connected';
    } catch (dbError) {
      logger.error('Database health check failed', sanitizeErrorForLog(dbError), { metadata });
      dbStatus = 'error';
    }

    const totalLatency = Date.now() - startTime;

    const status = {
      status: dbStatus === 'connected' ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        status: dbStatus,
        latency: dbLatency,
      },
      api: {
        latency: totalLatency,
      },
      environment: process.env.NODE_ENV || 'development',
    };

    logger.info('Health check performed', {
      status: status.status,
      dbLatency,
      totalLatency,
      ip: metadata.ip,
    });

    const response = NextResponse.json(status, {
      status: dbStatus === 'connected' ? 200 : 503,
    });

    addSecurityHeaders(response);
    addRateLimitHeaders(response, 50, rateLimitResult.remaining, rateLimitResult.resetTime);

    return response;
  } catch (error: any) {
    logger.error('Health check failed', sanitizeErrorForLog(error), { metadata });
    
    const response = NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      message: 'Health check failed',
    }, { status: 503 });

    addSecurityHeaders(response);

    return response;
  }
}
