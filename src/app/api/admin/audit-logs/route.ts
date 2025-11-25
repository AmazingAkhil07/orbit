import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';

// Get authOptions from NextAuth route
async function getAuthOptions() {
  try {
    const { authOptions } = await import('../../auth/[...nextauth]/route');
    return authOptions;
  } catch {
    return {};
  }
}

// Define AuditLog schema
const auditLogSchema = new mongoose.Schema({
  admin: String,
  action: String,
  subject: String,
  details: String,
  changes: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now },
});

const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);

export async function GET(req: NextRequest) {
  try {
    const authOptions = await getAuthOptions();
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const logs = await AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(500);

    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 });
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

    const { action, subject, details, changes } = await req.json();

    const log = new AuditLog({
      admin: session.user.name || session.user.email,
      action,
      subject,
      details,
      changes,
    });

    await log.save();

    return NextResponse.json({ log });
  } catch (error) {
    console.error('Error creating audit log:', error);
    return NextResponse.json({ error: 'Failed to create audit log' }, { status: 500 });
  }
}
