import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
   server: {
      DATABASE_URL: z.string().min(1).default('./sqlite.db'),
   },
   experimental__runtimeEnv: process.env
})