import { z } from "zod";

export const updateFileSchema = z.object({
  original_name: z.string().min(1).max(255),
});
