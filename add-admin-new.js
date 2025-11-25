const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, unique: true },
    role: { type: String },
    image: { type: String },
    isVerified: { type: Boolean, default: false },
    phone: { type: String },
    university: { type: String },
    blacklisted: { type: Boolean, default: false },
  },
  { collection: 'users' }
);

const User = mongoose.model('User', UserSchema);

async function addAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'n.bharath3430@gmail.com';
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        name: 'Bharath',
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

addAdmin();
