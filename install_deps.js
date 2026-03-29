const cp = require('child_process');
const fs = require('fs');

try {
  console.log("Installing missing deps directly...");
  const out = cp.execSync(
    'npm install embla-carousel embla-carousel-react clsx tailwind-merge lucide-react --no-fund --no-audit --prefer-offline', 
    { stdio: 'pipe' }
  );
  fs.writeFileSync('install-log.txt', 'SUCCESS\n' + out.toString());
} catch(e) {
  fs.writeFileSync('install-log.txt', 'ERROR\n' + (e.stdout ? e.stdout.toString() : '') + (e.stderr ? e.stderr.toString() : '') + e.message);
}
