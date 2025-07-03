import { z } from "zod";

export const CriminalSchema = z.object({
  name: z.string().min(2, "Name is required"),
  nationalId: z.string().length(14, "National ID must be 14 digits"),
  job: z.string().min(2),
  bod: z.any(),
  motherName: z.string().min(2),
  stageName: z.string().min(2),
  impersonation: z.string().min(2),
  address: z.string().optional()
});

export const AddCriminalsOnlySchema = z.object({
  criminals: z.array(CriminalSchema).min(1, "At least one criminal is required")
});

export type Criminal = z.infer<typeof CriminalSchema>;
export type AddCriminalsOnlyRequest = z.infer<typeof AddCriminalsOnlySchema>;
