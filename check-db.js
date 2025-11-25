const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const UserSchema = new mongoose.Schema({ email: String }, { collection: 'users' });
const PropertySchema = new mongoose.Schema({ title: String }, { collection: 'properties' });
const BookingSchema = new mongoose.Schema({ status: String }, { collection: 'bookings' });

const User = mongoose.model('User', UserSchema);
const Property = mongoose.model('Property', PropertySchema);
const Booking = mongoose.model('Booking', BookingSchema);

async function checkData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const userCount = await User.countDocuments();
    const propertyCount = await Property.countDocuments();
    const bookingCount = await Booking.countDocuments();

    console.log(`\nDatabase counts:`);
    console.log(`- Users: ${userCount}`);
    console.log(`- Properties: ${propertyCount}`);
    console.log(`- Bookings: ${bookingCount}`);

    if (userCount > 0) {
      const sampleUser = await User.findOne().lean();
      console.log(`\nSample user:`, sampleUser);
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkData();
