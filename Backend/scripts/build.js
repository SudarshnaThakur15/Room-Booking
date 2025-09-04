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

// Copy the main application file to dist
import { copyFileSync, readFileSync } from 'fs';

// Copy the main index.js file
const mainFile = join(projectRoot, 'index.js');
const distMainFile = join(buildDir, 'index.js');
copyFileSync(mainFile, distMainFile);
console.log('✅ Copied index.js');

// Copy the src directory
import { cpSync } from 'fs';
const srcDir = join(projectRoot, 'src');
const distSrcDir = join(buildDir, 'src');
if (existsSync(srcDir)) {
  cpSync(srcDir, distSrcDir, { recursive: true });
  console.log('✅ Copied src directory');
}

// Create entry point files that deployment platforms expect
const entryPoints = [
  {
    name: 'app.js',
    content: `#!/usr/bin/env node
/**
 * App entry point for deployment platforms
 */
import './index.js';
`
  },
  {
    name: 'server.js',
    content: `#!/usr/bin/env node
/**
 * Server entry point for deployment platforms
 */
import './index.js';
`
  }
];

// Write entry point files
entryPoints.forEach(({ name, content }) => {
  const filePath = join(buildDir, name);
  writeFileSync(filePath, content);
  console.log(`✅ Created ${name}`);
});

// Copy package.json and install dependencies
const packageJsonPath = join(projectRoot, 'package.json');
const distPackageJsonPath = join(buildDir, 'package.json');
copyFileSync(packageJsonPath, distPackageJsonPath);
console.log('✅ Copied package.json');

// Create package.json for build output (simplified for deployment)
const buildPackageJson = {
  name: 'hotel-booking-backend-build',
  version: '1.0.0',
  type: 'module',
  main: 'index.js',
  scripts: {
    start: 'node index.js'
  },
  dependencies: JSON.parse(readFileSync(packageJsonPath, 'utf8')).dependencies || {}
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
