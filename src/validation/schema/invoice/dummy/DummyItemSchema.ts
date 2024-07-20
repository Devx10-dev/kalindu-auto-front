import { z } from "zod";

export const dummyItemSchema = z.object({
  id: z.number().optional(),
  item: z
    .object({
      label: z.string().optional(),
      value: z
        .object({
          id: z.number().optional(),
          partName: z.string().optional(),
          quantity: z.number().optional(),
          code: z.string().optional(),
          description: z.string().optional().optional(),
          chassisNo: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
  price: z
    .number({ required_error: "Actual price is required" })
    .min(0, "Price cannot be less than zero"),
  dummyPrice: z.number().optional(),
  quantity: z
    .number({ required_error: "Quantity is required" })
    .min(0, "Quantity cannot be less than zero"),
  discount: z.number().optional(),
  outsourced: z.boolean().optional(),
  remark: z.string().optional(),
  code: z.string().optional(),
});

export type DummyItem = z.infer<typeof dummyItemSchema>;
