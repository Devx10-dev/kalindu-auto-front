import { InvoiceItem } from "@/pages/dashboard/invoice/cash/context/Store";
import { OutsourcedItem } from "../cash/cashInvoiceTypes";

export interface DummyInvoiceItem extends InvoiceItem {
  id?: number;
  dummyPrice: number;
  outsourced: boolean;
  new: boolean;
  outsourceItem?: OutsourcedItem;
}
