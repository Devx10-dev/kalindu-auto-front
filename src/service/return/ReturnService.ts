import { AxiosInstance } from "axios";
import { Service } from "../apiService";
import {
  BaseInvoice,
  InvoiceID,
  InvoiceState,
} from "@/types/returns/returnsTypes";

const RETURN_INVOICE_URL = "return";

class ReturnService extends Service {
  constructor(api: AxiosInstance) {
    super(api);
  }

  async fetchAllInvoiceByGivenTerm(term: string): Promise<InvoiceID[]> {
    if (term === undefined || term === null || term === "")
      return;
    try {
      const response = await this.api.get<InvoiceID[]>(
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
      const response = await this.api.post<InvoiceState>(
        RETURN_INVOICE_URL,
        returnInvoiceData,
      );
      return returnInvoiceData;
    } catch (error) {
      throw new Error("Failed to create cash invoice");
    }
  }

  async fetchInvoiceByInvoiceID(invoiceID: string): Promise<BaseInvoice> {
    if (invoiceID === undefined || invoiceID === null || invoiceID === "")
      return;

    try {
      const response = await this.api.get<BaseInvoice>(
        `${RETURN_INVOICE_URL}/invoice/${invoiceID}`,
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch cash invoice");
    }
  }
}

export { ReturnService };
