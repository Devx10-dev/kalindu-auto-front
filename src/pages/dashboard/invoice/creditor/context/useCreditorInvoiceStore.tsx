import { Constants } from "@/types/constants/constants";
import { InvoiceItem, InvoiceState } from "@/types/invoice/creditorInvoice";
import { create } from "zustand";

const useCreditorInvoiceStore = create<InvoiceState>((set, get) => ({
  invoiceID: undefined,
  creditorName: undefined,
  creditorID: undefined,
  totalPrice: undefined,
  VAT: undefined,

  invoiceItemDTOList: [],

  addInvoiceItem: (item: InvoiceItem) =>
    set((state) => ({
      ...state,
      invoiceItemDTOList: [...state.invoiceItemDTOList, item],
    })),

  removeInvoiceItem: (itemToRemove: InvoiceItem) =>
    set((state) => ({
      ...state,
      invoiceItemDTOList: state.invoiceItemDTOList.filter(
        (item) => item !== itemToRemove
      ),
    })),

  setCreditor: (creditorName?: string, creditorID?: number) =>
    set((state) => ({
      ...state,
      creditorName: creditorName,
      creditorID: creditorID,
    })),

  setOutsourcedStatus: (itemOutsourced: InvoiceItem, status: boolean) =>
    set((state) => ({
      ...state,
      invoiceItemDTOList: state.invoiceItemDTOList.map((item) =>
        item === itemOutsourced ? { ...item, outsourcedStatus: status } : item
      ),
    })),

  getOutsourcedItems: () => {
    const state = get();
    return state.invoiceItemDTOList.filter(
      (item) => item.outsourcedStatus === true
    );
  },
}));

export default useCreditorInvoiceStore;
