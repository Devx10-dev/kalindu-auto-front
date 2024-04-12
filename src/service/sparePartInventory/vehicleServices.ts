import { ResponseData } from "@/types/component/commonTypes";
import {
  VehicleBrand,
  VehicleModelFormData,
  VehicleModelResponseData,
  VehicleType,
} from "@/types/sparePartInventory/vehicleTypes";
import { AxiosInstance } from "axios";

const VEHICLE_URL = "/vehicle";

export const fetchVehicleModels = async (api: AxiosInstance) => {
  try {
    const response = await api.get<VehicleModelResponseData>(
      `${VEHICLE_URL}/model/0/10`
    );

    return response.data;
  } catch (error : any) {
    if (!error.response) {
      throw new Error("Server not responding!");
    }
    throw new Error("Failed to fetch vehicle models");
  }
};

export const fetchVehicleTypes = async (api: AxiosInstance) => {
  try {
    const response = await api.get<VehicleType[]>(`${VEHICLE_URL}/type`);

    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch vehicle types: " + error.message);
  }
};

export const fetchVehicleBrands = async (api: AxiosInstance) => {
  try {
    const response = await api.get<VehicleBrand[]>(`${VEHICLE_URL}/brand`);

    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch vehicle brands: " + error.message);
  }
};

export const addVehicleModel = async (
  api: AxiosInstance,
  formData: VehicleModelFormData
) => {
  try {
    const response = await api.post<ResponseData<VehicleModelFormData>>(
      `${VEHICLE_URL}/model`,
      formData
    );
    return response.data.data;
  } catch (error) {
    throw new Error("Failed to add vehicle model: " + error.message);
  }
};
