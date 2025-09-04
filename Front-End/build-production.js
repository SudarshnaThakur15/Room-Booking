#!/usr/bin/env node

/**
 * Production build script for frontend
 * Sets the correct API URL and builds the project
 */

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Building frontend for production...');
console.log('📡 API URL: https://room-booking-symf.onrender.com');

try {
  // Set environment variable and build
  process.env.VITE_API_URL = 'https://room-booking-symf.onrender.com';
  
  console.log('📦 Running build command...');
  execSync('npm run build', { 
    stdio: 'inherit',
    cwd: __dirname,
    env: { ...process.env, VITE_API_URL: 'https://room-booking-symf.onrender.com' }
  });
  
  console.log('✅ Frontend build completed successfully!');
  console.log('📁 Build output: dist/');
  console.log('🌐 Ready for deployment to Render!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
