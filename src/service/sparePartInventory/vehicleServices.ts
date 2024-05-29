import {
  VehicleBrand,
  VehicleModelResponseData,
  VehicleType,
} from "@/types/sparePartInventory/vehicleTypes";
import { VehicleModel } from "@/validation/schema/SparePart/vehicleModelSchema";
import { AxiosInstance } from "axios";
import { Service } from "../apiService";

const VEHICLE_MODEL_URL = "/vehicle/model";
const VEHICLE_TYPE_URL = "/vehicle/type";
const VEHICLE_BRAND_URL = "/vehicle/brand";

class VehicleService extends Service {
  constructor(api: AxiosInstance) {
    super(api);
  }

  async fetchVehicleModels(
    pageNo: number,
    pageSize: number,
  ): Promise<VehicleModelResponseData> {
    try {
      const response = await this.api.get<VehicleModelResponseData>(
        `${VEHICLE_MODEL_URL}/${pageNo}/${pageSize}`,
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch vehicle models");
    }
  }

  async fetchVehicleTypes(): Promise<VehicleType[]> {
    try {
      const response = await this.api.get<VehicleType[]>(`${VEHICLE_TYPE_URL}`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch vehicle types");
    }
  }

  async fetchVehicleBrands(): Promise<VehicleBrand[]> {
    try {
      const response = await this.api.get<VehicleBrand[]>(
        `${VEHICLE_BRAND_URL}`,
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch vehicle brands");
    }
  }

  async createVehicleModel(vehicleModel: VehicleModel): Promise<VehicleModel> {
    const response = await this.api.post(VEHICLE_MODEL_URL, {
      model: vehicleModel.model,
      description: vehicleModel.description,
      vehicleType: vehicleModel.type.value.type,
      vehicleBrand: vehicleModel.brand.value.brand,
    });
    return response.data;
  }
}

export { VehicleService };
