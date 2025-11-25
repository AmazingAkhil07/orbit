const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, unique: true },
    role: { type: String },
    isVerified: { type: Boolean },
  },
  { collection: 'users' }
);

const User = mongoose.model('User', UserSchema);

async function verifyAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const user = await User.findOne({ email: 'n.bharath3430@gmail.com' });
    if (user) {
      console.log('✓ Admin verified in database:');
      console.log(`  Email: ${user.email}`);
      console.log(`  Role: ${user.role}`);
      console.log(`  Name: ${user.name}`);
      console.log(`  Verified: ${user.isVerified}`);
    } else {
      console.log('✗ Admin not found');
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

verifyAdmin();
