const mongoose = require('mongoose');

// Import the User model
const User = require('./src/models/User').default || require('./src/models/User');

const email = process.argv[2] || 'n.bharath3430@gmail.com';

async function addAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/orbit');
    console.log('Connected to MongoDB');

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new admin user
      user = new User({
        email,
        name: email.split('@')[0],
        role: 'admin',
        isVerified: true,
      });
      await user.save();
      console.log(`✓ New admin user created: ${email}`);
    } else {
      // Promote existing user to admin
      user.role = 'admin';
      await user.save();
      console.log(`✓ User promoted to admin: ${email}`);
    }

    console.log(`\nAdmin Details:`);
    console.log(`Email: ${user.email}`);
    console.log(`Name: ${user.name}`);
    console.log(`Role: ${user.role}`);
    console.log(`Verified: ${user.isVerified}`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

addAdmin();
