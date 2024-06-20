import { z } from "zod";

export const saleOrExpenseSchema = z.object({
  id: z.number().optional(),
  amount: z.number({ required_error: "Amount is required" }),
  reason: z.string().optional(),
  field: z.object(
    {
      label: z.string({ required_error: "Field is required" }),
      value: z.object(
        {
          id: z.number().optional(),
          name: z.string(),
        },
        { required_error: "Field is required" }
      ),
    },
    { required_error: "Field is required" }
  ),
  isExpense: z.boolean().default(true),
});

export type SaleOrExpense = z.infer<typeof saleOrExpenseSchema>;
