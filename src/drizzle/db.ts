import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
import path from "path";
import fs from "fs";

// Get the correct database path for both development and production
const getDatabasePath = () => {
  if (process.env.NODE_ENV === 'development') {
    return "sqlite.db";
  }
  
  // In Electron production, use environment variable or app.getPath('userData')
  if (process.env.DATABASE_PATH) {
    console.log('Using database path from environment:', process.env.DATABASE_PATH);
    return process.env.DATABASE_PATH;
  }
  
  // For Electron main process, we'll handle this in the main process
  // This is just a fallback for development
  return path.join(process.cwd(), "sqlite.db");

  // Fallback: use current working directory (not recommended for production)
  const fallbackPath = path.join(process.cwd(), "sqlite.db");
  console.warn('Using fallback database path:', fallbackPath);
  return fallbackPath;
};

// Create database instance
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let db: any;

// Only initialize database if not during build
if (process.env.SKIP_DATABASE) {
  // Mock database for build time
  db = {};
} else {
  try {
    const dbPath = getDatabasePath();
    console.log('Initializing database at:', dbPath);
    
    const sqlite = new Database(dbPath);
    db = drizzle(sqlite, { schema });
    
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    // Create a mock database object to prevent crashes
    db = {
      query: {
        CriminalTable: {
          findMany: async () => [],
          findFirst: async () => null
        }
      },
      insert: async () => ({ changes: 0 }),
      select: async () => [],
      delete: async () => ({ changes: 0 }),
      update: async () => ({ changes: 0 })
    };
  }
}

export { db };
