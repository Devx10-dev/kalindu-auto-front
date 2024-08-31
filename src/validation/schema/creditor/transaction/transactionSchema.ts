import { z } from "zod";

export const transactionSchema = z.object({
  id: z.number().optional(),
  amount: z.number({ required_error: "Amount is required" }),
  creditor: z.object(
    {
      label: z.string(),
      value: z.object({
        id: z.number(),
        contactPersonName: z.string(),
      }),
    },
    { required_error: "Creditor is required" }
  ),
  creditInvoice: z.object(
    {
      label: z.string(),
      value: z.object({
        id: z.number(),
        invoiceNo: z.string(),
      }),
    },
    { required_error: "Credit invoice is required" }
  ),
  type: z
    .enum(["Cheque", "Cash"], {
      errorMap: () => ({ message: "Please select a valid transaction type." }),
    })
    .default("Cash"),
  isPartial: z.boolean().default(false),
  remark: z.string().optional(),
});

export type Cheque = z.infer<typeof transactionSchema>;
