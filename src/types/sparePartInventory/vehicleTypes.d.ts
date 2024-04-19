import { Option } from "../component/propTypes";

export type VehicleType = {
  id: number;
  type: string;
};

export type VehicleBrand = {
  id: number;
  brand: string;
};

export type VehicleModel = {
  id?: number;
  model: string;
  vehicleBrand: string;
  vehicleType: string;
  description?: string;
};

export type VehicleModelResponseData = {
  currentPage: number;
  totalItems: number;
  totalPages: number;
  vehicleModels: VehicleModelFormData[];
};
