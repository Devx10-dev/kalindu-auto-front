import { z } from "zod";

export const spaerPartSchema = z.object({
  id: z.number().optional(),
  partName: z
    .string({ required_error: "Spare part is Required" })
    .min(2, {
      message: "Spare part must be at least 2 characters.",
    })
    .max(255, {
      message: "Spare part must not be longer than 255 characters.",
    }),
  code: z
    .string({ required_error: "Spare part code is Required" })
    .min(2, {
      message: "Spare part code must be at least 2 characters.",
    })
    .max(255, {
      message: "Spare part code must not be longer than 255 characters.",
    }),
  quantity: z.string({ required_error: "Quantity is required" }),
  chassisNo: z
    .object({
      label: z.string().optional(),
      value: z
        .object({
          chassisNo: z.string().optional(),
          id: z.number().optional(),
        })
        .or(z.string().optional()),
      __isNew__: z.boolean().optional(),
    })
    .optional(),
  description: z.string().optional(),
});

export type SparePart = z.infer<typeof spaerPartSchema>;
