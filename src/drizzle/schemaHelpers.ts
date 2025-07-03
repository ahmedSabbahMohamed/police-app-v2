import { integer, text } from "drizzle-orm/sqlite-core";

// Use a random id generator (this will cause SSR/client error in Next.js if imported in client code)
export const id = text('id').primaryKey().$defaultFn(() => 
  Math.random().toString(36).substring(2) + Date.now().toString(36)
);
export const createdAt = integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date());
export const updatedAt = integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date());