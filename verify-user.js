const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, unique: true },
    role: { type: String },
    isVerified: { type: Boolean, default: false },
  },
  { collection: 'users' }
);

const User = mongoose.model('User', UserSchema);

async function verifyUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'amazingakhil2006@gmail.com';
    const user = await User.findOne({ email });

    if (!user) {
      console.log(`✗ User not found: ${email}`);
      process.exit(1);
    }

    // Mark as verified
    user.isVerified = true;
    await user.save();

    console.log(`✓ User verified successfully: ${email}`);
    console.log(`\nUser Details:`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Name: ${user.name}`);
    console.log(`  Role: ${user.role}`);
    console.log(`  Verified: ${user.isVerified}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

verifyUser();
