#!/usr/bin/env node

/**
 * Build script for deployment platforms
 * Creates necessary files and ensures proper entry points
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { writeFileSync, existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('🚀 Building backend for deployment...');

// Create build output directory
const buildDir = join(projectRoot, 'dist');
if (!existsSync(buildDir)) {
  mkdirSync(buildDir, { recursive: true });
}

// Create entry point files that deployment platforms expect
const entryPoints = [
  {
    name: 'index.js',
    content: `#!/usr/bin/env node
/**
 * Main entry point for deployment
 */
import '../index.js';
`
  },
  {
    name: 'app.js',
    content: `#!/usr/bin/env node
/**
 * App entry point for deployment platforms
 */
import '../index.js';
`
  },
  {
    name: 'server.js',
    content: `#!/usr/bin/env node
/**
 * Server entry point for deployment platforms
 */
import '../index.js';
`
  }
];

// Write entry point files
entryPoints.forEach(({ name, content }) => {
  const filePath = join(buildDir, name);
  writeFileSync(filePath, content);
  console.log(`✅ Created ${name}`);
});

// Create package.json for build output
const buildPackageJson = {
  name: 'hotel-booking-backend-build',
  version: '1.0.0',
  type: 'module',
  main: 'index.js',
  scripts: {
    start: 'node index.js'
  },
  dependencies: {}
};

writeFileSync(
  join(buildDir, 'package.json'),
  JSON.stringify(buildPackageJson, null, 2)
);

console.log('✅ Created build package.json');

// Create a simple build info file
const buildInfo = {
  buildTime: new Date().toISOString(),
  nodeVersion: process.version,
  platform: process.platform,
  entryPoints: entryPoints.map(ep => ep.name)
};

writeFileSync(
  join(buildDir, 'build-info.json'),
  JSON.stringify(buildInfo, null, 2)
);

console.log('✅ Created build-info.json');

console.log('🎉 Build completed successfully!');
console.log('📁 Build output directory: dist/');
console.log('📄 Entry points created:', entryPoints.map(ep => ep.name).join(', '));
console.log('🚀 Ready for deployment!');
