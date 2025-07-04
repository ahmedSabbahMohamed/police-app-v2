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

const dbPath = getDatabasePath();
const sqlite = new Database(dbPath);

export const db = drizzle(sqlite, { schema });
