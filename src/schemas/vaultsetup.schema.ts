import { z } from "zod";

export const vaultSetupSchema = z.object({
  ans1: z.string().min(3).max(100),
  ans2: z.string().min(3).max(100),
  ans3: z.string().min(3).max(100),
  pin: z.string().regex(/^\d{4,6}$/, "PIN must be 4-6 digits"),
});
