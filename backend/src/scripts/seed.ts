import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../features/auth/model';
import { config } from '../config/env';

dotenv.config();

const FORCE_RESeed = process.argv.includes('--force');

const seedAdmin = async (): Promise<void> => {
  try {
    // Validate MongoDB URI
    if (!config.mongodbUri || config.mongodbUri.includes('YOUR_PASSWORD')) {
      console.error('❌ Error: MONGODB_URI is not properly configured in .env file');
      console.error('Please update the .env file with your actual MongoDB password');
      process.exit(1);
    }

    // Validate admin credentials
    if (!config.adminEmail || !config.adminPassword) {
      console.error('❌ Error: ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env file');
      process.exit(1);
    }

    console.log('🔌 Connecting to MongoDB...');
    
    // Connect to MongoDB
    await mongoose.connect(config.mongodbUri);
    console.log('✅ MongoDB Connected successfully!');
    console.log(`📍 Database: ${mongoose.connection.name}`);
    console.log(`🌐 Host: ${mongoose.connection.host}`);

    // Check if admin already exists
    console.log(`\n🔍 Checking if admin user exists (${config.adminEmail})...`);
    const existingAdmin = await User.findOne({ email: config.adminEmail });
    
    if (existingAdmin) {
      if (FORCE_RESeed) {
        console.log('🔄 Force reseed enabled. Deleting existing admin user...');
        await User.deleteOne({ email: config.adminEmail });
        console.log('✅ Existing admin user deleted');
      } else {
        console.log('ℹ️  Admin user already exists in database');
        console.log('   Email:', existingAdmin.email);
        console.log('   Role:', existingAdmin.role);
        console.log('   ID:', existingAdmin._id);
        console.log('\n💡 To force reseed, run: npm run seed:force');
        await mongoose.connection.close();
        console.log('\n✅ Seed process completed');
        process.exit(0);
      }
    }

    // Create admin user
    console.log('\n👤 Creating admin user...');
    const admin = await User.create({
      name: 'Admin',
      email: config.adminEmail,
      password: config.adminPassword,
      role: 'admin',
    });

    console.log('\n✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password:', config.adminPassword);
    console.log('👤 Role:', admin.role);
    console.log('🆔 ID:', admin._id);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n💡 You can now use these credentials to login');

    await mongoose.connection.close();
    console.log('\n✅ Seed process completed successfully');
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Error seeding admin user:');
    if (error.message) {
      console.error('   Message:', error.message);
    }
    if (error.code) {
      console.error('   Code:', error.code);
    }
    if (error.name === 'MongoServerError' && error.code === 11000) {
      console.error('\n💡 This email is already registered. The user might exist with a different ID.');
    }
    if (error.message?.includes('authentication failed')) {
      console.error('\n💡 Authentication failed. Please check your MongoDB password in .env file');
    }
    if (error.message?.includes('getaddrinfo ENOTFOUND')) {
      console.error('\n💡 Cannot connect to MongoDB. Please check your connection string and network');
    }
    console.error('\nFull error:', error);
    
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

seedAdmin();

