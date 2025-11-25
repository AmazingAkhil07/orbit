import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const emailToPromote = searchParams.get('email');
    const makeAdmin = searchParams.get('admin') === 'true';
    const verify = searchParams.get('verify') === 'true';

    if (emailToPromote) {
      const user = await User.findOne({ email: emailToPromote });
      
      if (!user) {
        return NextResponse.json({ 
          error: 'User not found',
          email: emailToPromote
        }, { status: 404 });
      }

      const updates: any = {};
      const changes: string[] = [];

      // Apply requested changes
      if (makeAdmin) {
        updates.role = 'admin';
        changes.push('promoted to admin');
      }

      if (verify) {
        updates.isVerified = true;
        changes.push('verified');
      }

      // Update user with all changes
      if (Object.keys(updates).length > 0) {
        Object.assign(user, updates);
        await user.save();
        
        return NextResponse.json({ 
          message: `User ${changes.join(' and ')} successfully`,
          email: emailToPromote,
          role: user.role,
          isVerified: user.isVerified,
          changes: changes
        });
      } else {
        return NextResponse.json({ 
          message: 'No changes requested',
          email: emailToPromote,
          note: 'Use ?admin=true to make admin, ?verify=true to verify'
        });
      }
    }

    // Create admin user if it doesn't exist
    const adminExists = await User.findOne({ email: 'admin@orbitpg.com' });

    if (!adminExists) {
      await User.create({
        name: 'Orbit Admin',
        email: 'admin@orbitpg.com',
        role: 'admin',
        isVerified: true,
        phone: '9999999999',
        university: 'DSU',
      });
      return NextResponse.json({ 
        message: 'Admin user created successfully',
        email: 'admin@orbitpg.com',
        note: 'Use Auth0 to login with this email'
      });
    }

    return NextResponse.json({ 
      message: 'Admin user already exists',
      email: 'admin@orbitpg.com'
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json(
      { error: 'Failed to create admin user', details: String(error) },
      { status: 500 }
    );
  }
}
