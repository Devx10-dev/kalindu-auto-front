import { z } from "zod";

export const userSchema = z.object({
  id: z.string().optional(),
  fullName: z.string().min(1, { message: "Full name is required." }).max(255, {
    message: "Full Name must not be longer than 255 characters.",
  }),
  email: z
    .string()
    .optional()
    .refine(
      (email) =>
        email === undefined ||
        email === "" ||
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email),
      { message: "Invalid email address" },
    ),
  address: z
    .string()
    .max(255, {
      message: "Address must not be longer than 255 characters.",
    })
    .optional(),
  mobileNo: z
    .string()
    .optional()
    .refine(
      (mobileNo) =>
        mobileNo === undefined || mobileNo === "" || /^0\d{9}$/.test(mobileNo),
      { message: "Invalid contact number." },
    ),
  homeNo: z
    .string()
    .optional()
    .refine(
      (mobileNo) =>
        mobileNo === undefined || mobileNo === "" || /^0\d{9}$/.test(mobileNo),
      { message: "Invalid home number." },
    ),
  designation: z.enum(["Manager", "Cashier", "Owner", "User"], {
    errorMap: () => ({ message: "Please select a valid designation." }),
  }),
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." })
    .max(255, {
      message: "Username must not be longer than 255 characters.",
    })
    .regex(/^[a-z]+$/, {
      message: "Username must contain only lowercase letters",
    }),
  password: z
    .string()
    .optional()
    .refine(
      (password) =>
        password === undefined ||
        password === "" ||
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/.test(
          password,
        ),
      { message: "Password didn't meet the requirements. Ex: Pwd@123" },
    ),
  confirmPassword: z.string().optional(),
  active: z.boolean(),
  gender: z.enum(["Male", "Female", "Non Binary"], {
    errorMap: () => ({ message: "Please select a valid gender." }),
  }),
  roles: z.array(z.string()),
});

export type User = z.infer<typeof userSchema>;
