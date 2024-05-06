import { SparePartService } from "@/service/sparePartInventory/sparePartService";
import { VehicleService } from "@/service/sparePartInventory/vehicleServices";

export type SparePartItem = {
  id?: number;
  partName: string;
  quantity?: number;
  code?: string;
  description?: string;
  vechicleModels: string[];
};

export interface SparePartGridProps {
  vehicleService: VehicleService
  sparePartService: SparePartService;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setSparePart: React.Dispatch<React.SetStateAction<SparePartItem | null>>
}