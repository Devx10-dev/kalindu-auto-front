import { z } from "zod";

export const vehicleModelSchema = z.object({
  id: z.number().optional(),
  model: z
    .string({ required_error: "Vehicle model is Required" })
    .min(2, {
      message: "Vehicle model must be at least 2 characters.",
    })
    .max(255, {
      message: "Vehicle model must not be longer than 255 characters.",
    }),
  chassisNo: z
    .object({
      label: z
        .string()
        .min(2, { message: "Chassis No must be atleast 2 characters." }),
      value: z
        .object({
          chassisNo: z
            .string()
            .min(2, { message: "Chassis No must be atleast 2 characters." }),
          id: z.number(),
        })
        .or(
          z
            .string()
            .min(2, { message: "Chassis No must be atleast 2 characters." }),
        ),
      __isNew__: z.boolean(),
    })
    .required(),
  type: z
    .object({
      label: z
        .string()
        .min(2, { message: "Vechicle type must be atleast 2 characters." }),
      value: z
        .object({
          type: z
            .string()
            .min(2, { message: "Vechicle type must be atleast 2 characters." }),
          id: z.number(),
        })
        .or(
          z
            .string()
            .min(2, { message: "Vechicle type must be atleast 2 characters." }),
        ),
      __isNew__: z.boolean(),
    })
    .required(),
  brand: z
    .object({
      label: z
        .string()
        .min(2, { message: "Vechicle brand must be atleast 2 characters." }),
      value: z
        .object({
          brand: z.string().min(2, {
            message: "Vechicle brand must be atleast 2 characters.",
          }),
          id: z.number(),
        })
        .or(
          z.string().min(2, {
            message: "Vechicle brand must be atleast 2 characters.",
          }),
        ),
      __isNew__: z.boolean(),
    })
    .required(),
  description: z.string().optional(),
});

export type VehicleModel = z.infer<typeof vehicleModelSchema>;
