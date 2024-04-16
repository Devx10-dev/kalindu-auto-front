
export type VehicleType = {
  id: number;
  type: string;
};

export type VehicleBrand = {
  id: number;
  brand: string;
};

export type VehicleModelFormData = {
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
