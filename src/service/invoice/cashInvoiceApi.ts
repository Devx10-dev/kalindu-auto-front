import { AxiosInstance } from "axios";
import { InvoiceState } from "@/types/invoice/cashInvoice";
import { Service } from "../apiService";

const CASH_INVOICE_URL = "invoice";

class CashInvoiceService extends Service {
  constructor(api: AxiosInstance) {
    super(api);
  }

  async createCashInvoice(
    cashInvoiceData: InvoiceState,
  ): Promise<InvoiceState> {
    try {
      const response = await this.api.post<InvoiceState>(
        CASH_INVOICE_URL,
        cashInvoiceData,
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to create cash invoice");
    }
  }
}

export { CashInvoiceService };
