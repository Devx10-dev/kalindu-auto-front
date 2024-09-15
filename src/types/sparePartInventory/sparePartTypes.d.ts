import { SparePartService } from "@/service/sparePartInventory/sparePartService";
import { VehicleService } from "@/service/sparePartInventory/vehicleServices";

export type SparePartItem = {
  id?: number;
  partName: string;
  quantity?: number;
  code?: string;
  description?: string;
  chassisNo: string;
};

export interface SparePartGridProps {
  vehicleService: VehicleService;
  sparePartService: SparePartService;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setSparePart: React.Dispatch<React.SetStateAction<SparePartItem | null>>;
}

export type SparePartsResponseData = {
  currentPage: number;
  totalItems: number;
  totalPages: number;
  spareParts: SparePartItem[];
};


