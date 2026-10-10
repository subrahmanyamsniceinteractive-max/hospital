import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distPath = path.resolve(rootDir, 'dist');

console.log('📦 Building project for production...');
execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });

// Copy index.html to 404.html for GitHub Pages SPA routing
fs.copyFileSync(path.join(distPath, 'index.html'), path.join(distPath, '404.html'));

console.log('🚀 Initializing deployment commit in dist...');
execSync('git init -b gh-pages', { cwd: distPath, stdio: 'inherit' });
execSync('git config user.name "Nice Interactive"', { cwd: distPath, stdio: 'inherit' });
execSync('git config user.email "niceinteractive@users.noreply.github.com"', { cwd: distPath, stdio: 'inherit' });

try {
  execSync('git remote remove origin', { cwd: distPath, stdio: 'ignore' });
} catch (e) {}

execSync('git remote add origin https://github.com/subrahmanyamsniceinteractive-max/hospital.git', { cwd: distPath, stdio: 'inherit' });
execSync('git add -A', { cwd: distPath, stdio: 'inherit' });
execSync('git commit -m "Deploy: 3D Hospital site to GitHub Pages"', { cwd: distPath, stdio: 'inherit' });

console.log('🌐 Pushing to gh-pages branch...');
execSync('git push -u origin gh-pages --force', { cwd: distPath, stdio: 'inherit' });

fs.rmSync(path.join(distPath, '.git'), { recursive: true, force: true });
console.log('✅ Successfully deployed to GitHub Pages!');
