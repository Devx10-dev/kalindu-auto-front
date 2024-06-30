import { AxiosInstance } from "axios";
import { Service } from "../apiService";
import { BaseInvoice } from "@/types/returns/returnsTypes";

const INVOICE_URL = "invoice";

class ReturnService extends Service {
  constructor(api: AxiosInstance) {
    super(api);
  }

  async fetchAllInvoiceByGivenTerm(term: string): Promise<BaseInvoice[]> {
    try {
      const response = await this.api.get<BaseInvoice[]>(
        `${INVOICE_URL}/${term}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch cash invoice");
    }
  }
}

export { ReturnService };
