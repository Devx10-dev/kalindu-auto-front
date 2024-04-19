import { number, object, string, z } from "zod";

export const vehicleModelSchema = z.object({
  model: z
    .string({ required_error: "Vehicle model is Required" })
    .min(2, {
      message: "Vehicle model must be at least 2 characters.",
    })
    .max(255, {
      message: "Vehicle model must not be longer than 255 characters.",
    }),
  type: z
    .object({
      label: string(),
      value: object({ type: string(), id: number() }),
    })
    .required(),
  brand: z
    .object({
      label: string(),
      value: object({ brand: string(), id: number() }),
    })
    .required(),
  description: z.string().optional(),
});

export type VehicleModel = z.infer<typeof vehicleModelSchema>;
