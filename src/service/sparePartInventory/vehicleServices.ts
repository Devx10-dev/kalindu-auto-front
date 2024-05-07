import {
  ChassisNo,
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
const VEHICLE_CHASSIS_NO_URL = "/vehicle/chassisNo";

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

  async fetchFilteredVehicleModels(
    pageNo: number,
    pageSize: number,
    type: string | null,
    brand: string | null,
    chassisNo: string | null
  ): Promise<VehicleModelResponseData> {
    try {
      const response = await this.api.get<VehicleModelResponseData>(
        `${VEHICLE_MODEL_URL}/${type === "All" ? null : type}/${
          brand === "All" ? null : brand
        }/${chassisNo === "All" ? null : chassisNo}/${pageNo}/${pageSize}`
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

  async fetchVehicleChassisNos(): Promise<ChassisNo[]> {
    try {
      const response = await this.api.get<ChassisNo[]>(
        `${VEHICLE_CHASSIS_NO_URL}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch vehicle chassis numbers");
    }
  }

  async createVehicleModel(vehicleModel: VehicleModel): Promise<VehicleModel> {
    const response = await this.api.post(VEHICLE_MODEL_URL, {
      model: vehicleModel.model,
      description: vehicleModel.description,
      vehicleType:
        typeof vehicleModel.type.value === "string"
          ? vehicleModel.type.value
          : vehicleModel.type.value.type,
      vehicleBrand:
        typeof vehicleModel.brand.value === "string"
          ? vehicleModel.brand.value
          : vehicleModel.brand.value.brand,
      chassisNo:
        typeof vehicleModel.chassisNo.value === "string"
          ? vehicleModel.chassisNo.value
          : vehicleModel.chassisNo.value.chassisNo,
    });
    return response.data;
  }

  async updateVehicleModel(vehicleModel: VehicleModel): Promise<VehicleModel> {
    const response = await this.api.put(VEHICLE_MODEL_URL, {
      id: vehicleModel.id,
      model: vehicleModel.model,
      description: vehicleModel.description,
      vehicleType:
        typeof vehicleModel.type.value === "string"
          ? vehicleModel.type.value
          : vehicleModel.type.value.type,
      vehicleBrand:
        typeof vehicleModel.brand.value === "string"
          ? vehicleModel.brand.value
          : vehicleModel.brand.value.brand,
      chassisNo:
        typeof vehicleModel.chassisNo.value === "string"
          ? vehicleModel.chassisNo.value
          : vehicleModel.chassisNo.value.chassisNo,
    });
    return response.data;
  }
}

export { VehicleService };

