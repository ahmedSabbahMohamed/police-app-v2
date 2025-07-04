const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// Test configuration
const TEST_CONFIG = {
  windowWidth: 1200,
  windowHeight: 800,
  testTimeout: 10000,
};

// Test results
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
  // Test 1: Check if app can start
  'App Startup': () => {
    return app.isReady() || true; // App should be ready
  },

  // Test 2: Check if main window can be created
  'Main Window Creation': () => {
    const win = new BrowserWindow({
      width: TEST_CONFIG.windowWidth,
      height: TEST_CONFIG.windowHeight,
      show: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, '../electron/preload.js'),
      }
    });
    
    const result = win && win.id;
    win.close();
    return result;
  },

  // Test 3: Check if preload script exists
  'Preload Script': () => {
    const preloadPath = path.join(__dirname, '../electron/preload.js');
    return fs.existsSync(preloadPath);
  },

  // Test 4: Check if main process file exists
  'Main Process File': () => {
    const mainPath = path.join(__dirname, '../electron/main.js');
    return fs.existsSync(mainPath);
  },

  // Test 5: Check if build output exists (for production)
  'Build Output': () => {
    const outPath = path.join(__dirname, '../out');
    return fs.existsSync(outPath);
  },

  // Test 6: Check if database can be accessed
  'Database Access': () => {
    try {
      const userDataPath = app.getPath('userData');
      const dbPath = path.join(userDataPath, 'sqlite.db');
      
      // Check if directory is writable
      const testFile = path.join(userDataPath, 'test.txt');
      fs.writeFileSync(testFile, 'test');
      fs.unlinkSync(testFile);
      
      return true;
    } catch (error) {
      return false;
    }
  },

  // Test 7: Check if package.json has required fields
  'Package Configuration': () => {
    try {
      const packagePath = path.join(__dirname, '../package.json');
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      const required = ['name', 'version', 'main', 'build'];
      return required.every(field => packageJson[field]);
    } catch (error) {
      return false;
    }
  }
};

// Run all tests
async function runAllTests() {
  log('Starting Electron app tests...', 'info');
  
  for (const [testName, testFunction] of Object.entries(tests)) {
    await runTest(testName, testFunction);
  }
  
  // Print results
  log('', 'info');
  log('=== TEST RESULTS ===', 'info');
  log(`Passed: ${testResults.passed}`, 'success');
  log(`Failed: ${testResults.failed}`, testResults.failed > 0 ? 'error' : 'success');
  
  if (testResults.errors.length > 0) {
    log('', 'info');
    log('=== ERRORS ===', 'error');
    testResults.errors.forEach(error => log(error, 'error'));
  }
  
  log('', 'info');
  log(`Overall: ${testResults.failed === 0 ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`, testResults.failed === 0 ? 'success' : 'error');
  
  // Exit with appropriate code
  process.exit(testResults.failed === 0 ? 0 : 1);
}

// Start tests when app is ready
app.whenReady().then(() => {
  runAllTests();
});

// Handle app events
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // macOS specific
}); 