const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const PropertySchema = new mongoose.Schema({}, { collection: 'properties', strict: false });
const Property = mongoose.model('Property', PropertySchema);

const newImages = [
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?q=80&w=2070&auto=format&fit=crop'
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Update both properties with working images
    const result1 = await Property.updateOne(
      { slug: 'sai-balaji-pg' },
      { $set: { 'media.images': newImages } }
    );
    
    const result2 = await Property.updateOne(
      { slug: 'dsu-hostels' },
      { $set: { 'media.images': newImages } }
    );
    
    console.log('✓ Updated sai-balaji-pg:', result1.modifiedCount ? 'SUCCESS' : 'No change');
    console.log('✓ Updated dsu-hostels:', result2.modifiedCount ? 'SUCCESS' : 'No change');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (e) {
    console.error('✗ Error:', e.message);
    process.exit(1);
  }
})();
