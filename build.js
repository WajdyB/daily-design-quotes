const fs = require('fs');
const path = require('path');

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// Files to copy
const filesToCopy = [
  'index.html',
  'script.js',
  'style.css',
  'manifest.json',
  'sw.js'
];

// Copy files to public directory
filesToCopy.forEach(file => {
  const sourcePath = path.join(__dirname, file);
  const destPath = path.join(publicDir, file);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied ${file} to public/`);
  } else {
    console.warn(`Warning: ${file} not found`);
  }
});

console.log('Build completed successfully!'); 