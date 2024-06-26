import { create } from "zustand";
import {
  InvoiceList,
  InvoiceState,
  Invoices,
} from "@/types/invoice/cashInvoice";

const useInvoiceListStore = create<Invoices>((set, get) => ({
  cashInvoicesStore: [],

  setCashInvoicesStore: (invoices: InvoiceState[]) => {
    const newInvoices = get().cashInvoicesStore;
    invoices.forEach((invoice) => {
      newInvoices[invoice.invoiceId] = invoice;
    });
    set({ cashInvoicesStore: newInvoices });
  },

  addCashInvoiceToStore: (invoice: InvoiceState) => {
    const newInvoices = get().cashInvoicesStore;
    newInvoices[invoice.invoiceId] = invoice;
    set({ cashInvoicesStore: newInvoices });
  },

  getCashInvoiceById: (invoiceId: string) => {
    return get().cashInvoicesStore[invoiceId];
  },
}));

export { useInvoiceListStore };
