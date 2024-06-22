import { z } from "zod";

export const fieldSchema = z.object({
  id: z.number().optional(),
  name: z
    .string({ required_error: "Field name is Required" })
    .min(2, {
      message: "Field name must be at least 2 characters.",
    })
    .max(255, {
      message: "Field name must not be longer than 255 characters.",
    }),
  // category: z.any({ required_error: "Category is required" }),
  category: z.object(
    {
      label: z.string({ required_error: "Category is required" }),
      value: z.object(
        {
          id: z.number().optional(),
          name: z.string(),
        },
        { required_error: "Category is required" },
      ),
    },
    { required_error: "Category is required" },
  ),
});

export type Field = z.infer<typeof fieldSchema>;
