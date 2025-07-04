const path = require('path');
const fs = require('fs');

// Mock Electron app for testing
global.app = {
  getPath: (name) => {
    if (name === 'userData') {
      return path.join(process.cwd(), 'test-user-data');
    }
    return path.join(process.cwd(), 'test-data');
  }
};

const DatabaseManager = require('../electron/database');

async function testDatabase() {
  console.log('🧪 Testing database initialization...');
  
  try {
    // Initialize database manager
    const dbManager = new DatabaseManager();
    
    // Get database path
    const dbPath = dbManager.getDatabasePath();
    console.log('📁 Database path:', dbPath);
    
    // Check if directory exists
    const dbDir = path.dirname(dbPath);
    console.log('📁 Database directory exists:', fs.existsSync(dbDir));
    
    // Initialize database
    await dbManager.initializeDatabase();
    
    // Check if database file exists
    console.log('📄 Database file exists:', fs.existsSync(dbPath));
    
    // Get database info
    const dbInfo = dbManager.getDatabaseInfo();
    console.log('📊 Database info:', dbInfo);
    
    // Test database connection
    const Database = require('better-sqlite3');
    const sqlite = new Database(dbPath);
    
    // Test a simple query
    const result = sqlite.prepare('SELECT name FROM sqlite_master WHERE type="table"').all();
    console.log('🗂️ Tables in database:', result.map(r => r.name));
    
    sqlite.close();
    
    console.log('✅ Database test completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Database test failed:', error);
    return false;
  }
}

// Run test if called directly
if (require.main === module) {
  testDatabase().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { testDatabase }; 