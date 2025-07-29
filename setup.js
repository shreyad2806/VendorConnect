#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 VendorConnect Setup Script\n');

function runCommand(command, description) {
  try {
    console.log(`📦 ${description}...`);
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed`);
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    throw error;
  }
}

function checkFileExists(filePath) {
  return fs.existsSync(filePath);
}

function createEnvFile(sourcePath, targetPath, description) {
  if (!checkFileExists(targetPath)) {
    try {
      console.log(`📝 Creating ${description}...`);
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`✅ ${description} created`);
      console.log(`💡 Please edit ${targetPath} with your configuration`);
    } catch (error) {
      console.error(`❌ Failed to create ${description}:`, error.message);
    }
  } else {
    console.log(`✅ ${description} already exists`);
  }
}

async function setup() {
  try {
    console.log('🔍 Checking prerequisites...');
    
    // Check if Node.js is installed
    try {
      const nodeVersion = execSync('node --version', { encoding: 'utf8' });
      console.log(`✅ Node.js version: ${nodeVersion.trim()}`);
    } catch (error) {
      console.error('❌ Node.js is not installed. Please install Node.js first.');
      process.exit(1);
    }

    // Check if npm is installed
    try {
      const npmVersion = execSync('npm --version', { encoding: 'utf8' });
      console.log(`✅ npm version: ${npmVersion.trim()}`);
    } catch (error) {
      console.error('❌ npm is not installed. Please install npm first.');
      process.exit(1);
    }

    console.log('\n📦 Installing dependencies...');
    
    // Install root dependencies
    runCommand('npm install', 'Installing root dependencies');
    
    // Install backend dependencies
    runCommand('cd b2b-backend && npm install', 'Installing backend dependencies');
    
    // Install frontend dependencies
    runCommand('cd Frontend && npm install', 'Installing frontend dependencies');
    
    console.log('\n📝 Setting up environment files...');
    
    // Create backend environment file
    createEnvFile(
      'b2b-backend/env.example',
      'b2b-backend/.env',
      'Backend environment file'
    );
    
    // Create frontend environment file
    createEnvFile(
      'Frontend/env.example',
      'Frontend/.env',
      'Frontend environment file'
    );
    
    console.log('\n📋 Setup Summary:');
    console.log('✅ Dependencies installed');
    console.log('✅ Environment files created');
    console.log('\n📝 Next Steps:');
    console.log('1. Edit b2b-backend/.env with your database credentials');
    console.log('2. Edit Frontend/.env with your API URL');
    console.log('3. Create MySQL database: CREATE DATABASE b2b_vendor_platform;');
    console.log('4. Run: npm run setup-db (to initialize database)');
    console.log('5. Run: npm start (to start the application)');
    
    console.log('\n🎉 Setup completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.log('\n💡 Please check the error messages above and try again.');
    process.exit(1);
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setup();
}

module.exports = { setup }; 