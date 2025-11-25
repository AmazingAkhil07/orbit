const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, unique: true },
    role: { type: String, default: 'student' },
    isVerified: { type: Boolean, default: false },
    university: { type: String },
  },
  { collection: 'users' }
);

const User = mongoose.model('User', UserSchema);

async function demonstrateVerification() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const email = 'testuser5075@example.com';

    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║     USER VERIFICATION PROCESS DEMONSTRATION                ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    // Step 1: Show unverified user
    console.log('📍 STEP 1: Check Initial User Status');
    console.log('─'.repeat(60));
    let user = await User.findOne({ email });
    console.log(`Email: ${user.email}`);
    console.log(`Verified: ${user.isVerified ? '✓ YES' : '✗ NO'}`);
    console.log(`Role: ${user.role}`);
    
    // Step 2: Show verification methods
    console.log('\n📍 STEP 2: Available Verification Methods');
    console.log('─'.repeat(60));
    console.log('\n🔧 Method 1 - Using API Endpoint:');
    console.log(`   URL: http://localhost:3000/api/admin/setup`);
    console.log(`   Query Parameters:`);
    console.log(`     • email=${email}`);
    console.log(`     • verify=true`);
    console.log(`   Full URL: http://localhost:3000/api/admin/setup?email=${email}&verify=true`);
    
    console.log('\n🔧 Method 2 - Using CLI Script:');
    console.log(`   Command: node verify-user.js ${email}`);
    
    console.log('\n🔧 Method 3 - Using Database Script:');
    console.log(`   const user = await User.findOne({ email: '${email}' });`);
    console.log(`   user.isVerified = true;`);
    console.log(`   await user.save();`);
    
    // Step 3: Perform verification
    console.log('\n📍 STEP 3: Performing Verification...');
    console.log('─'.repeat(60));
    user.isVerified = true;
    await user.save();
    console.log('✓ User marked as verified in database');
    
    // Step 4: Verify the change
    console.log('\n📍 STEP 4: Verify the Change');
    console.log('─'.repeat(60));
    user = await User.findOne({ email });
    console.log(`Email: ${user.email}`);
    console.log(`Verified: ${user.isVerified ? '✓ YES' : '✗ NO'}`);
    console.log(`Role: ${user.role}`);
    
    // Step 5: Additional operations
    console.log('\n📍 STEP 5: Additional Operations');
    console.log('─'.repeat(60));
    console.log('\n✓ You can combine verification with other changes:');
    console.log(`   http://localhost:3000/api/admin/setup?email=${email}&verify=true&admin=true`);
    console.log('   This would make the user both verified AND admin');
    
    // Step 6: What happens after verification
    console.log('\n📍 STEP 6: After Verification');
    console.log('─'.repeat(60));
    console.log('• User can access verified-only features');
    console.log('• User\'s isVerified flag is set to true');
    console.log('• No automatic email notifications (manual process)');
    console.log('• Admin can view verified status in dashboard');
    console.log('• User can perform restricted operations if verified');

    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║                    ✓ PROCESS COMPLETE                      ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

demonstrateVerification();
