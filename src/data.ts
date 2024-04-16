import { VehicleModel } from "./types/sparePartInventory/vehicleTypes";

export const data: VehicleModel[] = [
  {
    id: 1,
    model: "axios",
    brand: { id: 1, brand: "toyota" },
    type: { id: 1, type: "Car" },
    description: "Just description",
  },
  {
    id: 2,
    model: "Aqua",
    brand: { id: 1, brand: "toyota" },
    type: { id: 1, type: "Car" },
    description: "Just description",
  },
  {
    id: 3,
    model: "Hiace",
    brand: { id: 1, brand: "toyota" },
    type: { id: 2, type: "Van" },
    description: "Just description",
  },
];
