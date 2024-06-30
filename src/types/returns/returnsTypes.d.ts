import { InvoiceItem } from "../invoice/cashInvoice";

export interface BaseInvoice {
  id: number;
  invoiceId: string;
  customer: string;
  items: InvoiceItem[];
  date: number[];
}
