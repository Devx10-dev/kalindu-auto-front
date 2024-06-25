import { z } from "zod";

export const chequeSchema = z.object({
  id: z.number().optional(),
  amount: z.number({ required_error: "Amount is required" }),
  chequeNo: z
    .string({ required_error: "ChequeNo is required" })
    .min(2, "Cheque No must be at least 2 characters")
    .max(255, "Cheque No must be at most 255 characters"),
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
});

export type Cheque = z.infer<typeof chequeSchema>;
