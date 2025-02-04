import { z } from "zod";

export const transactionSchema = z
  .object({
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
    creditInvoices: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
        unsettledAmount: z.number(),
      }),
      {
        required_error: "Select at least one invoice",
      },
    ),
    type: z.enum(["CHEQUE", "CASH", "DEPOSIT"], {
      errorMap: () => ({ message: "Please select a valid transaction type." }),
    }),
    chequeNo: z.string().optional(), // Mark chequeNo as optional initially
    remark: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Perform conditional validation for chequeNo when type is "CHEQUE"
    if (data.type === "CHEQUE" && data.chequeNo === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Cheque number is required when type is CHEQUE",
        path: ["chequeNo"], // points to chequeNo field in the error message
      });
    }
  });

export type Cheque = z.infer<typeof transactionSchema>;
