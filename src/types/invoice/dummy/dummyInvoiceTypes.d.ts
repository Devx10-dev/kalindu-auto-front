import { OutsourcedItem } from "../cash/cashInvoiceTypes";
import { InvoiceItem } from "../cashInvoice";

export interface DummyInvoiceItem extends InvoiceItem {
  id?: number;
  dummyPrice: number;
  outsourced: boolean;
  new: boolean;
  outsourceItem?: OutsourcedItem;
}

export interface DummyInvoice {
  discount: number;
  tax: number;
  customerName: string;
  vehicleNo?: string;
  totalPrice?: number;
  invoiceId?: string;
  dummy: boolean;
  invoiceItems: DummyInvoiceItem[];
}
