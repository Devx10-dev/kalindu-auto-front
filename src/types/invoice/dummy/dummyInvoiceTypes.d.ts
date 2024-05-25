import { InvoiceItem } from "@/pages/dashboard/invoice/cash/context/Store";

export interface DummyInvoiceItem extends InvoiceItem {
  id: number;
  dummyPrice: number;
  outsourced: boolean;
}
