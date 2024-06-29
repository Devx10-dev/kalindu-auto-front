import { AxiosInstance } from "axios";
import { InvoiceList, InvoiceState } from "@/types/invoice/cashInvoice";
import { Service } from "../apiService";
import { useInvoiceListStore } from "@/pages/dashboard/invoice/view-invoices/context/InvoiceListState";

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

  async fetchCashInvoices(
    search: string | null,
    fromDate?: string | null,
    toDate?: string | null,
    pageNo?: number,
    pageSize?: number,
  ): Promise<InvoiceList> {
    try {
      const response = await this.api.get<InvoiceList>(
        `${CASH_INVOICE_URL}/${search ? search : null}/${fromDate ? fromDate : null}/${toDate ? toDate : null}/${pageNo ? pageNo : 0}/${pageSize ? pageSize : 10}`,
      );
      console.log("HEREE", response.data);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch cash invoices");
    }
  }

  async fetchCashInvoiceById(invoiceId: string): Promise<InvoiceState> {
    try {
      const response = await this.api.get<InvoiceState>(
        `${CASH_INVOICE_URL}/${invoiceId}`,
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch cash invoice");
    }
  }
}

export { CashInvoiceService };
