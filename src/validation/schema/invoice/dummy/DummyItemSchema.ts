import { z } from "zod";

export const dummyItemSchema = z.object({
  id: z.number().optional(),
  item: z.object({
    label: z.string(),
    value: z.string(),
  }),
  price: z.number({ required_error: "Actual price is required" }),
  dummyPrice: z.number().optional(),
  quantity: z.number({ required_error: "Quantity is required" }),
  discount: z.number().optional(),
  outsourced: z.boolean().optional(),
  remark: z.string().optional(),
  code: z.string().optional(),
});

export type DummyItem = z.infer<typeof dummyItemSchema>;
