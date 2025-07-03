import { sqliteTable, text, primaryKey } from "drizzle-orm/sqlite-core";
import { CriminalTable } from "./criminal";
import { CrimeTable } from "./crime";
import { relations } from "drizzle-orm";

export const CriminalCrimeTable = sqliteTable('criminals_crimes', {
  criminalId: text('criminal_id').notNull().references(() => CriminalTable.id),
  crimeId: text('crime_id').notNull().references(() => CrimeTable.id),
}, (table) => ({
  pk: primaryKey({ columns: [table.criminalId, table.crimeId] }),
}));

export const criminalCrimeRelations = relations(CriminalCrimeTable, ({ one }) => ({
  criminal: one(CriminalTable, {
    fields: [CriminalCrimeTable.criminalId],
    references: [CriminalTable.id],
  }),
  crime: one(CrimeTable, {
    fields: [CriminalCrimeTable.crimeId],
    references: [CrimeTable.id],
  }),
}));
