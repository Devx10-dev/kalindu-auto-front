import { Option } from "../component/propTypes";

export type VehicleType = {
  id: number;
  type: string;
};

export type VehicleBrand = {
  id: number;
  brand: string;
};

export type ChassisNo = {
  id: number;
  chassisNo: string;
};

export type VehicleModel = {
  id?: number;
  chassisNo: string;
  model: string;
  vehicleBrand: string;
  vehicleType: string;
  description?: string;
};

export type VehicleModelResponseData = {
  currentPage: number;
  totalItems: number;
  totalPages: number;
  vehicleModels: VehicleModel[];
};

export interface VehicleModelGridProps {
  vehicleService: VehicleService;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setVehicle: React.Dispatch<React.SetStateAction<VehicleModelType | null>>
}
