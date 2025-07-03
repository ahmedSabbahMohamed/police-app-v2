import { z } from "zod";

export const CrimeSchema = z.object({
  number: z.string().min(1, "Crime number must be a positive integer"),
  year: z.number().gte(1900, "Invalid year"),
  typeOfAccusation: z.string().min(2, "Accusation type is required"),
  lastBehaviors: z.string()
});

export type Crime = z.infer<typeof CrimeSchema>;
