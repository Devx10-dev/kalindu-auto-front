import { z } from "zod";

export const vehicleModelSchema = z.object({
  model: z
    .string({ required_error: "Vehicle model is Required" })
    .min(2, {
      message: "Vehicle model must be at least 2 characters.",
    })
    .max(255, {
      message: "Vehicle model must not be longer than 255 characters.",
    }),
  type: z.string({ required_error: "At least one vehicle type is Required" }),
  brand: z.string({ required_error: "At least one vehicle brand is Required" }),
  description: z
    .string()
    .max(255, {
      message: "Description must not be longer than 255 characters.",
    }),
});

export type VehicleModel = z.infer<typeof vehicleModelSchema>;
