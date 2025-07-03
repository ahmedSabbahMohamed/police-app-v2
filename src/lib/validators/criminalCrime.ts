import { z } from "zod";
import { CrimeSchema } from "./crime";
import { CriminalSchema } from "./criminal";

export const CriminalCrimeLinkSchema = z.object({
  criminalId: z.string().min(2),
  crimeId: z.string().min(2)
});

export const AddCrimeWithCriminalsSchema = z.object({
  crime: CrimeSchema,
  criminals: z.array(CriminalSchema).min(1, "At least one criminal is required")
});

export type CriminalCrime = z.infer<typeof CriminalCrimeLinkSchema>;

export type AddCrimeRequest = z.infer<typeof AddCrimeWithCriminalsSchema>;
