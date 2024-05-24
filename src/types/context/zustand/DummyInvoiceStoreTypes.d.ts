import {
  InvoiceItem,
  InvoiceState,
} from "@/pages/dashboard/invoice/cash/context/Store";

export interface DummyInvoiceItem extends InvoiceItem {
  dummyPrice: number;
}

const useDummyInvoiceStore = create((set) => ({
    spareParts: [],
    setSpareParts: (spareParts) => set({spareParts: spareParts})
  }))