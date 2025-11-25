import mongoose from 'mongoose';
import User from '@/models/User';
import dbConnect from '@/lib/db';

async function addAdmin(email: string) {
  try {
    await dbConnect();
    console.log('Connected to database');

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        name: email.split('@')[0],
        role: 'admin',
        isVerified: true,
      });
      await user.save();
      console.log(`✓ New admin user created: ${email}`);
    } else {
      user.role = 'admin';
      await user.save();
      console.log(`✓ User promoted to admin: ${email}`);
    }

    console.log(`\nAdmin Details:`);
    console.log(`Email: ${user.email}`);
    console.log(`Name: ${user.name}`);
    console.log(`Role: ${user.role}`);

    process.exit(0);
  } catch (error: any) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

const email = process.argv[2] || 'n.bharath3430@gmail.com';
addAdmin(email);
