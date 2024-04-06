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
  brand: VehicleBrand;
  type: VehicleType;
  description?: string;
};

export type VehicleModelFormData = {
  id?: number;
  model: string;
  brand: string;
  type: string;
  description?: string;
};

export type VehicleModelResponseData = {
  currentPage: number;
  totalItems: number;
  totalPages: number;
  vehicleModels: VehicleModelFormData[];
};
