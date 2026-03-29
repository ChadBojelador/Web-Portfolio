const { execSync } = require('child_process');
try {
  console.log('Running shadcn add...');
  const output = execSync('npx shadcn@latest add @animate-ui/components-community-motion-carousel -y', { encoding: 'utf-8', stdio: 'pipe' });
  console.log('SUCCESS:', output);
} catch (e) {
  console.error('ERROR:', e.message);
  if (e.stdout) console.error('STDOUT:', e.stdout);
  if (e.stderr) console.error('STDERR:', e.stderr);
}
