import { Service } from "@/service/apiService";
import { DummyInvoice } from "@/types/invoice/dummy/dummyInvoiceTypes";
import { AxiosInstance } from "axios";
import { InvoiceList, InvoiceState } from "@/types/invoice/cashInvoice";

const INVOICE_URL = "invoice";

class DummyInvoiceService extends Service {
  constructor(api: AxiosInstance) {
    super(api);
  }

  async createDummyInvoice(dummyInvoice: DummyInvoice): Promise<DummyInvoice> {
    const response = await this.api.post(INVOICE_URL, {
      ...dummyInvoice,
      vat: dummyInvoice.tax,
      invoiceItems: dummyInvoice.invoiceItems.map((invoiceItem) =>
        invoiceItem.new ? { ...invoiceItem, sparePartId: -1 } : invoiceItem,
      ),
    });
    return response.data;
  }

  async fetchDummyInvoices(
    search: string | null,
    fromDate?: string | null,
    toDate?: string | null,
    pageNo?: number,
    pageSize?: number,
  ): Promise<InvoiceList> {
    try {
      const response = await this.api.get<InvoiceList>(
        `${INVOICE_URL}/${search ? search : null}/${fromDate ? fromDate : null}/${toDate ? toDate : null}/${pageNo ? pageNo : 0}/${pageSize ? pageSize : 10}`,
      );

      const filteredInvoices = response.data.invoices.filter(
        (invoice) => invoice.dummy,
      );

      return {
        ...response.data,
        invoices: filteredInvoices,
      };
    } catch (error) {
      throw new Error("Failed to fetch cash invoices");
    }
  }
}

export { DummyInvoiceService };
