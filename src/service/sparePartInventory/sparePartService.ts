import { AxiosInstance } from "axios";
import { Service } from "../apiService";

class SparePartService extends Service {
  constructor(api: AxiosInstance) {
    super(api);
  }
}

export { SparePartService };
