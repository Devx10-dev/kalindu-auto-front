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
  type: z
    .enum(["SALE", "EXPENSE", "CREDIT_BALANCE", "UNSETTLED_CHEQUE_BALANCE"])
    .refine((val) => val !== undefined, {
      message: "Financial record type is required",
    }),
});

export type SaleOrExpense = z.infer<typeof saleOrExpenseSchema>;
