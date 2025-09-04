#!/usr/bin/env node

/**
 * Build output file for deployment platforms
 * This file serves as the entry point for platforms that expect a build output
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import the main application
import('./index.js').catch(console.error);

console.log('Build output loaded successfully');
console.log('Entry point: index.js');
console.log('Build directory:', __dirname);
