import { z } from "zod";

export const dummyItemSchema = z.object({
  id: z.number().optional(),
  item: z.object({
    label: z.string().min(2, { message: "Item must be atleast 2 characters." }),
    value: z.object({
      chassisNo: z
        .string()
        .min(2, { message: "Item must be atleast 2 characters." }),
      id: z.number(),
    }),
  }),
  price: z.string({ required_error: "Actual price is required" }),
  dummyPrice: z.string({ required_error: "Dummy price is required" }),
  quantity: z.string({ required_error: "Quantity is required" }),
  discount: z.string().optional(),
  outsourced: z.boolean(),
  remark: z.string().optional(),
});

export type DummyItem = z.infer<typeof dummyItemSchema>;
