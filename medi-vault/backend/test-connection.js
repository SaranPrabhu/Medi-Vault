require('dotenv').config();
const mongoose = require('mongoose');

console.log('═══════════════════════════════════════');
console.log('🔍 MongoDB Connection Diagnostic Tool');
console.log('═══════════════════════════════════════\n');

// Check if .env is loaded
console.log('1. Environment Variables Check:');
console.log('   MONGO_URI exists:', !!process.env.MONGO_URI);

if (!process.env.MONGO_URI) {
  console.error('\n❌ ERROR: MONGO_URI not found in .env file!');
  process.exit(1);
}

// Show sanitized connection string
const sanitized = process.env.MONGO_URI.replace(/:[^:@]+@/, ':****@');
console.log('\n2. Connection String (sanitized):');
console.log('  ', sanitized);

console.log('\n3. Attempting Connection...');
console.log('   Timeout: 10 seconds\n');

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
})
  .then(() => {
    console.log('✅ CONNECTION SUCCESSFUL!');
    console.log('   Database:', mongoose.connection.name);
    console.log('   Host:', mongoose.connection.host);
    process.exit(0);
  })
  .catch((err) => {
    console.log('❌ CONNECTION FAILED!');
    console.log('   Error:', err.message);
    console.log('\nFull error:', err);
    process.exit(1);
  });
