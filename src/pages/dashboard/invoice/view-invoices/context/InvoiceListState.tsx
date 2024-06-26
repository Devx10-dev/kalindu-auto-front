import { create } from "zustand";
import {
  InvoiceList,
  InvoiceState,
  Invoices,
} from "@/types/invoice/cashInvoice";

import {
  InvoiceState as CreditInvoiceState,
  CreditInvoices,
  CreditorInvoiceList,
} from "@/types/invoice/creditorInvoice";

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

const useCreditInvoiceListStore = create<CreditInvoices>((set, get) => ({
  creditInvoicesStore: [],

  setCreditInvoicesStore: (invoices: CreditInvoiceState[]) => {
    const newInvoices = get().creditInvoicesStore;
    invoices.forEach((invoice) => {
      newInvoices[invoice.invoiceId] = invoice;
    });
    set({ creditInvoicesStore: newInvoices });
  },

  addCreditInvoiceToStore: (invoice: CreditInvoiceState) => {
    const newInvoices = get().creditInvoicesStore;
    newInvoices[invoice.invoiceId] = invoice;
    set({ creditInvoicesStore: newInvoices });
  },

  getCreditInvoiceById: (invoiceId: string) => {
    return get().creditInvoicesStore[invoiceId];
  },
}));

export { useInvoiceListStore, useCreditInvoiceListStore };
