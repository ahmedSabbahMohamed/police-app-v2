import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { CriminalCrimeTable } from './criminalCrime';
import { createdAt, updatedAt, id } from '../schemaHelpers';

export const CriminalTable = sqliteTable('criminals', {
  id,
  name: text('name').notNull(),
  nationalId: text('national_id').notNull().unique(),
  job: text('job').notNull(),
  bod: text(),
  motherName: text('mother_name').notNull(),
  stageName: text('stage_name').notNull(),
  impersonation: text('impersonation').notNull(),
  address: text('address'),
  createdAt,
  updatedAt
});

export const criminalRelations = relations(CriminalTable, ({ many }) => ({
  crimes: many(CriminalCrimeTable)
}));
