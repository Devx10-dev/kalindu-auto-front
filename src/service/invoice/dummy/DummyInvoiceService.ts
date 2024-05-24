import { Service } from "@/service/apiService";
import { AxiosInstance } from "axios";

class DummyInvoiceService extends Service {
  constructor(api: AxiosInstance) {
    super(api);
  }
}

export { DummyInvoiceService };
