import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import User from '@/models/User';
import connectDB from '@/lib/db';
import speakeasy from 'speakeasy';

async function getAuthOptions() {
  try {
    const { authOptions } = await import('../../../auth/[...nextauth]/route');
    return authOptions;
  } catch {
    return {};
  }
}

export async function POST(req: NextRequest) {
  try {
    const authOptions = await getAuthOptions();
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById((session.user as any).id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `Orbit Admin (${user.email})`,
      issuer: 'Orbit',
    });

    // Generate QR code URL using external service
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(secret.otpauth_url || '')}`;

    // Store temporary secret in session/cache (in production, use Redis)
    // For now, we'll return it to the client to be verified next
    return NextResponse.json({ 
      qrCode: qrCodeUrl,
      secret: secret.base32,
      otpauth_url: secret.otpauth_url
    });
  } catch (error) {
    console.error('Error setting up 2FA:', error);
    return NextResponse.json({ error: 'Failed to setup 2FA' }, { status: 500 });
  }
}
