import { ResponseData } from "@/types/component/commonTypes";
import { VehicleModelFormData, VehicleModelResponseData } from "@/types/sparePartInventory/vehicleTypes";
import { AxiosInstance } from "axios";

const VEHICLE_URL = "/vehicle";

export const fetchVehicleModels = async (api: AxiosInstance) => {
  try {
    const response = await api.get<VehicleModelResponseData>(
      `${VEHICLE_URL}/model/0/10`
    );

    console.log(response);
    return response.data;
  } catch (error:any) {
    throw new Error("Failed to fetch vehicle models: " + error.message);
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
  } catch (error:any) {
    throw new Error("Failed to add vehicle model: " + error.message);
  }
};
