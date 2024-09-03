import { z } from "zod";

export const transactionSchema = z.object({
  id: z.number().optional(),
  amount: z
    .number({ required_error: "Amount is required" })
    .min(0, "Amount cannot be minus value"),
  creditor: z.object(
    {
      label: z.string(),
      value: z.number(),
    },
    { required_error: "Creditor is required" },
  ),
  creditInvoice: z.object(
    {
      label: z.string(),
      value: z.number(),
    },
    { required_error: "Credit invoice is required" },
  ),
  type: z.enum(["Cheque", "Cash"], {
    errorMap: () => ({ message: "Please select a valid transaction type." }),
  }),
  remark: z.string().optional(),
});

export type Cheque = z.infer<typeof transactionSchema>;
