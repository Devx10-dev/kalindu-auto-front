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
    .nullable()
    .optional(),
  price: z.number({ required_error: "Actual price is required" }),
  dummyPrice: z.number().optional(),
  quantity: z.number({ required_error: "Quantity is required" }),
  discount: z.number().optional(),
  outsourced: z.boolean().optional(),
  remark: z.string().optional(),
  code: z.string().optional(),
});

export type DummyItem = z.infer<typeof dummyItemSchema>;
