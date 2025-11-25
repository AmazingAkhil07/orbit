const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    role: {
      type: String,
      enum: ['student', 'owner', 'admin'],
      default: 'student',
    },
    isVerified: { type: Boolean, default: false },
    phone: { type: String },
    university: { type: String, enum: ['DSU', 'Jain', 'Other'] },
    blacklisted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model('User', UserSchema);

async function promoteToAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'amazingakhil2006@gmail.com';
    const user = await User.findOne({ email });

    if (!user) {
      console.log(`User with email ${email} not found`);
      process.exit(1);
    }

    console.log(`Found user: ${user.name} (${user.email})`);
    console.log(`Current role: ${user.role}`);

    user.role = 'admin';
    await user.save();

    console.log(`✅ Successfully promoted to admin!`);
    console.log(`New role: ${user.role}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

promoteToAdmin();
