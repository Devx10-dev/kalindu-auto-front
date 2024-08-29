import { AxiosInstance } from "axios";
import { Service } from "../apiService";
import { useInvoiceListStore } from "@/pages/dashboard/invoice/view-invoices/context/InvoiceListState";
import {
  CreditInvoiceStats,
  CreditorInvoiceList,
  InvoiceState,
} from "@/types/invoice/creditorInvoice";

const CREDIT_INVOICE_URL = "invoice/credit";

class CreditInvoiceService extends Service {
  constructor(api: AxiosInstance) {
    super(api);
  }

  async fetchCreditInvoices(
    search: string | null,
    fromDate?: string | null,
    toDate?: string | null,
    pageNo?: number,
    pageSize?: number,
  ): Promise<CreditorInvoiceList> {
    try {
      const response = await this.api.get<CreditorInvoiceList>(
        `${CREDIT_INVOICE_URL}/${search ? search : null}/${fromDate ? fromDate : null}/${toDate ? toDate : null}/${pageNo ? pageNo : 0}/${pageSize ? pageSize : 10}`,
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch cash invoices");
    }
  }

  async fetchCreditInvoiceById(invoiceId: string): Promise<InvoiceState> {
    try {
      const response = await this.api.get<InvoiceState>(
        `${CREDIT_INVOICE_URL}/${invoiceId}`,
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch cash invoice");
    }
  }

  async createCreditInvoice(
    creditInvoiceData: InvoiceState,
  ): Promise<InvoiceState> {
    try {
      const response = await this.api.post<InvoiceState>(
        CREDIT_INVOICE_URL,
        creditInvoiceData,
      );
      return response.data;
    } catch (error) {
      throw new Error("Fail to create credit invoice");
    }
  }

  async fetchCreditInvoiceStats(): Promise<CreditInvoiceStats> {
    try {
      const response = await this.api.get<CreditInvoiceStats>(
        `${CREDIT_INVOICE_URL}/stats`,
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch credit invoice stats");
    }
  }
}

export { CreditInvoiceService };
