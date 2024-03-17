import { z } from "zod";

export const accountFormSchema = z.object({
  shopName: z
    .string({ required_error: "Name is Required" })
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
  contactPersonName: z
    .string({ required_error: "Contact person name is Required" })
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
  emailAddress: z.string({ required_error: "Email is Required" }).email({
    message: "Please enter a valid email",
  }),
  primaryContactNo: z
    .string({
      required_error: "Primary Contact is Required",
      invalid_type_error: "Primary Contact must be a number",
    })
    .length(10, {
      message: "Phone number must be 10 digits",
    })
    .max(9999999999, { message: "Phone number must be 10 digits" })
    .refine((val) => val.toString().length === 10, {
      message: "Phone number must be 10 digits",
    }),
  secondaryContactNo: z
    .string({
      required_error: "Phone is Required",
      invalid_type_error: "Secondary Contact must be a number",
    }) // Type checking error: secondaryContactNo is optional
    .length(10, {
      message: "Phone number must be 10 digits",
    })
    .max(9999999999, { message: "Phone number must be 10 digits" }),
  creditLimit: z.number().optional(),
  maxCreditDuePeriod: z.string({ required_error: "Due Period is Required" }),
});
