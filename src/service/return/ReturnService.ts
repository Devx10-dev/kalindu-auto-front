import { AxiosInstance } from "axios";
import { Service } from "../apiService";
import { BaseInvoice, InvoiceState } from "@/types/returns/returnsTypes";

const RETURN_INVOICE_URL = "return";

class ReturnService extends Service {
  constructor(api: AxiosInstance) {
    super(api);
  }

  async fetchAllInvoiceByGivenTerm(term: string): Promise<BaseInvoice[]> {
    try {
      const response = await this.api.get<BaseInvoice[]>(
        `${RETURN_INVOICE_URL}/search/${term}`,
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch cash invoice");
    }
  }

  async createReturnInvoice(
    returnInvoiceData: InvoiceState,
  ): Promise<InvoiceState> {
    try {
      console.log(
        "////////////////// request data in the return service",
        returnInvoiceData,
      );
      const response = await this.api.post<InvoiceState>(
        RETURN_INVOICE_URL,
        returnInvoiceData,
      );
      return returnInvoiceData;
    } catch (error) {
      throw new Error("Failed to create cash invoice");
    }
  }
}

export { ReturnService };
