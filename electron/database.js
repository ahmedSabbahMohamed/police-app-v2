const path = require('path');
const fs = require('fs');

// Try to get Electron app, but handle cases where it's not available
let app;
try {
  app = require('electron').app;
} catch (error) {
  // Electron not available (e.g., in testing environment)
  app = null;
}

class DatabaseManager {
  constructor() {
    this.dbPath = null;
    this.isInitialized = false;
  }

  getDatabasePath() {
    if (this.dbPath) {
      return this.dbPath;
    }

    // Use Electron's userData directory for the database if available
    if (app) {
      const userDataPath = app.getPath('userData');
      this.dbPath = path.join(userDataPath, 'police-app.db');
    } else {
      // Fallback for testing or non-Electron environments
      this.dbPath = path.join(process.cwd(), 'test-user-data', 'police-app.db');
    }
    
    // Ensure the directory exists
    const dbDir = path.dirname(this.dbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    console.log('📁 Database path:', this.dbPath);
    return this.dbPath;
  }

  async initializeDatabase() {
    if (this.isInitialized) {
      return;
    }

    try {
      const dbPath = this.getDatabasePath();
      
      // Check if database exists
      const dbExists = fs.existsSync(dbPath);
      
      if (!dbExists) {
        console.log('🆕 Creating new database...');
        // Create empty database file
        fs.writeFileSync(dbPath, '');
      }

      // Run database migrations
      await this.runMigrations();
      
      this.isInitialized = true;
      console.log('✅ Database initialized successfully');
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
  }

  async runMigrations() {
    try {
      // Import and run migrations
      const { migrate } = require('drizzle-orm/better-sqlite3/migrator');
      const Database = require('better-sqlite3');
      const dbPath = this.getDatabasePath();
      
      const sqlite = new Database(dbPath);
      const migrationsPath = path.join(__dirname, '..', 'src', 'drizzle', 'migrations');
      
      if (fs.existsSync(migrationsPath)) {
        console.log('🔄 Running database migrations...');
        migrate(sqlite, { migrationsFolder: migrationsPath });
        console.log('✅ Database migrations completed');
      } else {
        console.log('⚠️ No migrations folder found, skipping migrations');
      }
      
      sqlite.close();
    } catch (error) {
      console.error('❌ Migration failed:', error);
      // Don't throw here, as the app can still work without migrations
    }
  }

  getDatabaseInfo() {
    const dbPath = this.getDatabasePath();
    const exists = fs.existsSync(dbPath);
    const stats = exists ? fs.statSync(dbPath) : null;
    
    return {
      path: dbPath,
      exists,
      size: stats ? stats.size : 0,
      created: stats ? stats.birthtime : null,
      modified: stats ? stats.mtime : null
    };
  }
}

module.exports = DatabaseManager; 