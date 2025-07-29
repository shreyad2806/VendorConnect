const { testConnection } = require('./b2b-backend/config/database');

console.log('🔍 Testing database connection...');

testConnection()
  .then(() => {
    console.log('✅ Database connection successful!');
    console.log('🚀 You can now start the application with: npm start');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n📋 Please check your database configuration:');
    console.log('1. Make sure MySQL is running');
    console.log('2. Verify database credentials in b2b-backend/.env');
    console.log('3. Ensure database "b2b_vendor_platform" exists');
    console.log('\n💡 To create the database, run:');
    console.log('mysql -u root -p -e "CREATE DATABASE b2b_vendor_platform;"');
    process.exit(1);
  }); 