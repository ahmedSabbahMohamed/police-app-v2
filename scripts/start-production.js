const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Police App in production mode...');

// Start Next.js server
const serverProcess = spawn('npm', ['start'], {
  stdio: 'inherit',
  shell: true,
  cwd: path.join(__dirname, '..')
});

// Handle server process
serverProcess.on('close', (code) => {
  console.log(`Next.js server exited with code ${code}`);
  process.exit(code);
});

serverProcess.on('error', (error) => {
  console.error('Failed to start Next.js server:', error);
  process.exit(1);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  serverProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('Shutting down server...');
  serverProcess.kill('SIGTERM');
}); 