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
      label: z
        .string()
        .min(2, { message: "Chassis No must be atleast 2 characters." }),
      value: z
        .object({
          chassisNo: z
            .string()
            .min(2, { message: "Chassis No must be atleast 2 characters." }),
          id: z.number(),
        })
        .or(
          z
            .string()
            .min(2, { message: "Chassis No must be atleast 2 characters." }),
        ),
      __isNew__: z.boolean(),
    })
    .required(),
  description: z.string().optional(),
});

export type SparePart = z.infer<typeof spaerPartSchema>;
