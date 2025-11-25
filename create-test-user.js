const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, unique: true },
    role: { type: String, default: 'student' },
    image: { type: String },
    isVerified: { type: Boolean, default: false },
    phone: { type: String },
    university: { type: String },
    blacklisted: { type: Boolean, default: false },
  },
  { collection: 'users' }
);

const User = mongoose.model('User', UserSchema);

async function createTestUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Create a random test user
    const testEmail = `testuser${Math.floor(Math.random() * 10000)}@example.com`;
    const testUser = new User({
      email: testEmail,
      name: 'Test User ' + Math.floor(Math.random() * 1000),
      role: 'student',
      isVerified: false,
      university: 'DSU',
      phone: '9876543210',
    });

    await testUser.save();

    console.log('✓ Test user created successfully!');
    console.log('\n📋 User Details:');
    console.log(`  Email: ${testUser.email}`);
    console.log(`  Name: ${testUser.name}`);
    console.log(`  Role: ${testUser.role}`);
    console.log(`  Verified: ${testUser.isVerified}`);
    console.log(`  University: ${testUser.university}`);

    console.log('\n📌 Verification Options:');
    console.log('\n1. Using API endpoint:');
    console.log(`   http://localhost:3000/api/admin/setup?email=${testUser.email}&verify=true`);
    console.log('\n2. Using script command:');
    console.log(`   node verify-user.js ${testUser.email}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

createTestUser();
