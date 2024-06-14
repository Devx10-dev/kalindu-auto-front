import { Service } from "@/service/apiService";
import { DummyInvoice } from "@/types/invoice/dummy/dummyInvoiceTypes";
import { AxiosInstance } from "axios";

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
}

export { DummyInvoiceService };
