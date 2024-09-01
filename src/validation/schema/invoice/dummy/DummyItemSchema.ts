import { z } from "zod";
import { creatableSelectValueSchema } from "../../SparePart/vehicleModelSchema";

export const dummyItemSchema = z.object({
  id: z.number().optional(),
  item: creatableSelectValueSchema,
  price: z
    .number({ required_error: "Actual price is required" })
    .min(0, "Price cannot be less than zero"),
  dummyPrice: z.number().min(0, "Price cannot be less than zero").optional(),
  quantity: z
    .number({ required_error: "Quantity is required" })
    .min(0, "Quantity cannot be less than zero"),
  discount: z.number().min(0, "Price cannot be less than zero").optional(),
  outsourced: z.boolean().optional(),
  remark: z
    .string()
    .max(255, "Remark should not be exceed 255 characters")
    .optional(),
  code: z.string().optional(),
});

export type DummyItem = z.infer<typeof dummyItemSchema>;
