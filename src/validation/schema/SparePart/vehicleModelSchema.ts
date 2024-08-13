import { z } from "zod";

export const creatableSelectValueSchema = z
  .object({
    label: z
      .string()
      .min(2, { message: "Label must be at least 2 characters." })
      .max(255, { message: "Label must not be longer than 255 characters." }),
    value: z
      .object({
        value: z
          .string()
          .min(2, { message: "Value must be at least 2 characters." })
          .max(255, {
            message: "Value must not be longer than 255 characters.",
          }),
        id: z.number().optional(),
      })
      .or(
        z
          .string()
          .min(2, { message: "Value must be at least 2 characters." })
          .max(255, {
            message: "Value must not be longer than 255 characters.",
          }),
      ),
    __isNew__: z.boolean(),
  })
  .required();

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
  chassisNo: creatableSelectValueSchema,
  type: creatableSelectValueSchema,
  brand: creatableSelectValueSchema,
  description: z
    .string()
    .max(255, { message: "Description must not be longer than 255 characters" })
    .optional(),
});

export type VehicleModel = z.infer<typeof vehicleModelSchema>;
