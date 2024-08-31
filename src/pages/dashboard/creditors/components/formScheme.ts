import { z } from "zod";

const numberOnlyRegex = new RegExp(/^\d+$/);
const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

export const creditorFormSchema = z.object({
  shopName: z
    .string({ required_error: "Shop name is Required" })
    .trim()
    .min(2, {
      message: "Shop name must be at least 2 characters.",
    })
    .max(30, {
      message: "Shop name must not be longer than 30 characters.",
    }),

  contactPersonName: z
    .string({ required_error: "Contact person name is Required" })
    .trim()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    })
    .regex(numberOnlyRegex, "Contact person name cannot contain only numbers!"),

  email: z.string({ required_error: "Email is Required" }).email({
    message: "Please enter a valid email",
  }),

  address: z.string({ required_error: "Address is required" }).trim().min(2, {
    message: "Address is required.",
  }),

  primaryContact: z
    .string({
      required_error: "Primary Contact is Required",
    })
    .trim()
    .regex(phoneRegex, "Invalid Phone Number!")
    .length(10, "Phone number should be 10 digits long"),

  secondaryContact: z
    .string({
      required_error: "Phone is Required",
    })
    .trim()
    .regex(phoneRegex, "Invalid Phone Number!")
    .length(10, "Phone number should be 10 digits long"),

  creditLimit: z
    .number({ required_error: "Credit limit is required" })
    .max(9999999, "Exceeds the maximum credit limit of 9999999")
    .min(0, "Credit limit should not be minus value"),

  maxDuePeriod: z.string({ required_error: "Due Period is Required" }),
});
