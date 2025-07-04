const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Electron build process...');

// Start Next.js server
console.log('📦 Building Next.js app...');
const buildProcess = spawn('npm', ['run', 'build'], {
  stdio: 'inherit',
  shell: true
});

buildProcess.on('close', (code) => {
  if (code !== 0) {
    console.error('❌ Next.js build failed');
    process.exit(code);
  }
  
  console.log('✅ Next.js build completed');
  
  // Start Next.js server in background
  console.log('🌐 Starting Next.js server...');
  const serverProcess = spawn('npm', ['start'], {
    stdio: 'pipe',
    shell: true,
    detached: true
  });
  
  // Wait a bit for server to start
  setTimeout(() => {
    console.log('⚡ Building Electron app...');
    const electronProcess = spawn('npm', ['run', 'electron:dist-win'], {
      stdio: 'inherit',
      shell: true
    });
    
    electronProcess.on('close', (electronCode) => {
      // Kill the server process
      serverProcess.kill();
      
      if (electronCode !== 0) {
        console.error('❌ Electron build failed');
        process.exit(electronCode);
      }
      
      console.log('✅ Electron build completed successfully!');
      console.log('📁 Check the dist/ folder for your Windows executable');
    });
  }, 5000); // Wait 5 seconds for server to start
});

buildProcess.on('error', (error) => {
  console.error('❌ Build process error:', error);
  process.exit(1);
}); 