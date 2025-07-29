#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting VendorConnect Application...\n');

// Function to start a process
function startProcess(name, command, args, cwd) {
  console.log(`📦 Starting ${name}...`);
  
  const process = spawn(command, args, {
    cwd: cwd,
    stdio: 'inherit',
    shell: true
  });

  process.on('error', (error) => {
    console.error(`❌ Error starting ${name}:`, error);
  });

  process.on('close', (code) => {
    console.log(`📦 ${name} process exited with code ${code}`);
  });

  return process;
}

// Check if we're in development mode
const isDev = process.argv.includes('--dev') || process.env.NODE_ENV === 'development';

try {
  // Start backend
  const backendProcess = startProcess(
    'Backend Server',
    'npm',
    ['run', 'dev'],
    path.join(__dirname, 'b2b-backend')
  );

  // Wait a bit for backend to start
  setTimeout(() => {
    // Start frontend
    const frontendProcess = startProcess(
      'Frontend Server',
      'npm',
      ['start'],
      path.join(__dirname, 'Frontend')
    );

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down servers...');
      backendProcess.kill('SIGINT');
      frontendProcess.kill('SIGINT');
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.log('\n🛑 Shutting down servers...');
      backendProcess.kill('SIGTERM');
      frontendProcess.kill('SIGTERM');
      process.exit(0);
    });

  }, 3000);

} catch (error) {
  console.error('❌ Failed to start application:', error);
  process.exit(1);
} 