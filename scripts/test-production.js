const path = require('path');
const fs = require('fs');

console.log('🧪 Testing Police App production build...');

let testResults = {
  passed: 0,
  failed: 0,
  errors: []
};

function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${type.toUpperCase()}] ${message}`);
}

function runTest(testName, testFunction) {
  return new Promise((resolve) => {
    log(`Running test: ${testName}`);
    
    try {
      const result = testFunction();
      if (result) {
        testResults.passed++;
        log(`✅ ${testName} - PASSED`, 'success');
      } else {
        testResults.failed++;
        log(`❌ ${testName} - FAILED`, 'error');
        testResults.errors.push(`${testName}: Test returned false`);
      }
    } catch (error) {
      testResults.failed++;
      log(`❌ ${testName} - ERROR: ${error.message}`, 'error');
      testResults.errors.push(`${testName}: ${error.message}`);
    }
    
    resolve();
  });
}

// Test functions
const tests = {
  'Production Files Exist': () => {
    const requiredFiles = [
      'scripts/start-production.js',
      'electron/main.js',
      'electron/preload.js',
      'scripts/test-production.js'
    ];
    
    return requiredFiles.every(file => fs.existsSync(path.join(__dirname, '..', file)));
  },

  'Next.js Build Output': () => {
    const nextDir = path.join(__dirname, '..', '.next');
    return fs.existsSync(nextDir) && fs.existsSync(path.join(nextDir, 'server'));
  },

  'Package Configuration': () => {
    try {
      const packagePath = path.join(__dirname, '..', 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      const required = ['name', 'version', 'main', 'build', 'scripts'];
      return required.every(field => packageJson[field]);
    } catch (error) {
      return false;
    }
  },

  'Electron Security Settings': () => {
    try {
      const mainPath = path.join(__dirname, '..', 'electron/main.js');
      const mainContent = fs.readFileSync(mainPath, 'utf8');
      
      const securityChecks = [
        'nodeIntegration: false',
        'contextIsolation: true',
        'enableRemoteModule: false',
        'webSecurity: true'
      ];
      
      return securityChecks.every(check => mainContent.includes(check));
    } catch (error) {
      return false;
    }
  },

  'Database Configuration': () => {
    try {
      const dbPath = path.join(__dirname, '..', 'src/drizzle/db.ts');
      const dbContent = fs.readFileSync(dbPath, 'utf8');
      
      return dbContent.includes('SKIP_DATABASE') && dbContent.includes('getDatabasePath');
    } catch (error) {
      return false;
    }
  },

  'TypeScript Declarations': () => {
    const typesPath = path.join(__dirname, '..', 'src/types/electron.d.ts');
    return fs.existsSync(typesPath);
  },

  'GitHub Actions Workflow': () => {
    const workflowPath = path.join(__dirname, '..', '.github/workflows/build-windows.yml');
    return fs.existsSync(workflowPath);
  }
};

// Run all tests
async function runAllTests() {
  log('Starting production build tests...', 'info');
  
  for (const [testName, testFunction] of Object.entries(tests)) {
    await runTest(testName, testFunction);
  }
  
  // Print results
  log('', 'info');
  log('=== PRODUCTION TEST RESULTS ===', 'info');
  log(`Passed: ${testResults.passed}`, 'success');
  log(`Failed: ${testResults.failed}`, testResults.failed > 0 ? 'error' : 'success');
  
  if (testResults.errors.length > 0) {
    log('', 'info');
    log('=== ERRORS ===', 'error');
    testResults.errors.forEach(error => log(error, 'error'));
  }
  
  log('', 'info');
  log(`Overall: ${testResults.failed === 0 ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`, testResults.failed === 0 ? 'success' : 'error');
  
  if (testResults.failed === 0) {
    log('🎉 Your app is ready for production!', 'success');
    log('📦 The .exe file should work correctly on Windows machines.', 'success');
    log('', 'info');
    log('📋 Next steps:', 'info');
    log('1. Push to GitHub to trigger automatic build', 'info');
    log('2. Download the .exe from GitHub Actions', 'info');
    log('3. Test on a Windows machine', 'info');
  } else {
    log('⚠️  Please fix the failing tests before distributing.', 'error');
  }
  
  // Exit with appropriate code
  process.exit(testResults.failed === 0 ? 0 : 1);
}

// Run tests immediately
runAllTests(); 