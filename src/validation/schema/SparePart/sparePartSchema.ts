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
  chassisNo: z.object(
    {
      label: z.string(),
      value: z.string(),
    },
    { required_error: "Chassis No is required" }
  ),
  description: z
    .string()
    .max(255, {
      message: "Remark must not be longer than 255 characters.",
    })
    .optional(),
});

export type SparePart = z.infer<typeof spaerPartSchema>;
