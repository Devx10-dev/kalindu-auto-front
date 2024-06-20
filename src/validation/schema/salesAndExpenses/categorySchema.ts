import { z } from "zod";

export const categorySchema = z.object({
  id: z.number().optional(),
  name: z
    .string({ required_error: "Category name is Required" })
    .min(2, {
      message: "Category name must be at least 2 characters.",
    })
    .max(255, {
      message: "Category name must not be longer than 255 characters.",
    }),
});

export type Category = z.infer<typeof categorySchema>;
