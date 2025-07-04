import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
import path from "path";

// Get the correct database path for both development and production
const getDatabasePath = () => {
  if (process.env.NODE_ENV === 'development') {
    return "sqlite.db";
  }
  
  // In production (Electron), use the user data directory
  if (typeof window !== 'undefined' && window.electronAPI?.getDatabasePath) {
    return window.electronAPI.getDatabasePath();
  }
  
  // Fallback for server-side rendering
  return path.join(process.cwd(), "sqlite.db");
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
    const sqlite = new Database(dbPath);
    db = drizzle(sqlite, { schema });
  } catch (error) {
    console.warn('Database initialization failed:', error);
    db = {};
  }
}

export { db };
