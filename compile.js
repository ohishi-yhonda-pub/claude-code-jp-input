const fs = require('fs');
const { execSync } = require('child_process');

// Get current time
const now = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });

// Read the extension.ts file
const filePath = './src/extension.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Replace the compile time
content = content.replace(
    /const compiledAt = '.*?';/,
    `const compiledAt = '${now}';`
);

// Write back
fs.writeFileSync(filePath, content);

console.log(`Updated compile time to: ${now}`);

// Run TypeScript compiler
console.log('Compiling TypeScript...');
execSync('npx tsc -p ./', { stdio: 'inherit' });

console.log('Compilation complete!');