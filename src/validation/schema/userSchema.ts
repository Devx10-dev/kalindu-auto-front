import { z } from "zod";

export const userSchema = z.object({
  id: z.string().optional(),
  fullName: z.string().min(1, { message: "Full name is required." }),
  email: z.string().optional(),
  address: z.string().optional(),
  mobileNo: z
    .string()
    .regex(/^0\d{9}$/, { message: "Invalid contact number." }),
  homeNo: z
    .string()
    .optional(),
  designation: z.enum(["Manager", "Cashier", "Owner", "User"], {
    errorMap: () => ({ message: "Please select a valid designation." }),
  }),
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." }),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
  active: z.boolean(),
  roles: z.array(z.string()),
});

export type User = z.infer<typeof userSchema>;
