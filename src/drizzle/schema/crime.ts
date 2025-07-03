import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { relations } from "drizzle-orm";
import { CriminalCrimeTable } from "./criminalCrime";

export const CrimeTable = sqliteTable('crimes', {
    id,
    number: text('number').notNull(),
    year: integer('year').notNull(),
    typeOfAccusation: text('type_of_accusation').notNull(),
    lastBehaviors: text('last_behaviors').notNull(),
    createdAt,
    updatedAt
});

export const crimeRelations = relations(CrimeTable, ({ many }) => ({
    criminals: many(CriminalCrimeTable),
}));
