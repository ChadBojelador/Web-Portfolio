const cp = require('child_process');
const fs = require('fs');
try {
  console.log('Running Vite build check...');
  const out = cp.execSync('npx vite build', { encoding: 'utf8', stdio: 'pipe' });
  fs.writeFileSync('build-error.txt', 'SUCCESS\n' + out);
} catch (e) {
  fs.writeFileSync('build-error.txt', 'ERROR\n' + (e.stdout || '') + '\n' + (e.stderr || '') + '\n' + e.message);
}
