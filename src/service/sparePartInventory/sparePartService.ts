import { SparePartsResponseData } from "@/types/sparePartInventory/sparePartTypes";
import { SparePart } from "@/validation/schema/SparePart/sparePartSchema";
import { AxiosInstance } from "axios";
import { Service } from "../apiService";

const SPARE_PART_URL = "spare-part";

class SparePartService extends Service {
  constructor(api: AxiosInstance) {
    super(api);
  }

  async fetchFilteredSpaerParts(
    pageNo: number,
    pageSize: number,
    chassisNo: string | null,
  ): Promise<SparePartsResponseData> {
    try {
      const response = await this.api.get<SparePartsResponseData>(
        `${SPARE_PART_URL}/${
          chassisNo === "All" ? null : chassisNo
        }/${pageNo}/${pageSize}`,
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch vehicle spare parts");
    }
  }

  async createSparePart(sparePart: SparePart): Promise<SparePart> {
    const response = await this.api.post(SPARE_PART_URL, {
      partName: sparePart.partName,
      code: sparePart.code,
      quantity: sparePart.quantity,
      description: sparePart.description,
      chassisNo:
        typeof sparePart.chassisNo.value === "string"
          ? sparePart.chassisNo.value
          : sparePart.chassisNo.value.chassisNo,
    });
    return response.data;
  }

  async updateSparePart(sparePart: SparePart): Promise<SparePart> {
    const response = await this.api.put(SPARE_PART_URL, {
      id: sparePart.id,
      partName: sparePart.partName,
      code: sparePart.code,
      quantity: sparePart.quantity,
      description: sparePart.description,
      chassisNo:
        typeof sparePart.chassisNo.value === "string"
          ? sparePart.chassisNo.value
          : sparePart.chassisNo.value.chassisNo,
    });
    return response.data;
  }
}

export { SparePartService };
