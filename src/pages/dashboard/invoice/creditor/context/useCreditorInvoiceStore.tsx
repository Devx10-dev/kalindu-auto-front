import { InvoiceItem, InvoiceState } from "@/types/invoice/creditorInvoice";
import { create } from "zustand";

const useCreditorInvoiceStore = create<InvoiceState>((set, get) => ({
  invoiceID: undefined,
  creditorName: undefined,
  creditorID: undefined,
  totalPrice: undefined,

  // final bill summary items
  discountPercentage: 0,
  discountAmount: 0,
  vatPercentage: 0,
  vatAmount: 0,

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

  setOutsourcedCompanyName: (
    itemOutsourced: InvoiceItem,
    companyName: string
  ) =>
    set((state) => ({
      ...state,
      invoiceItemDTOList: state.invoiceItemDTOList.map((item) =>
        item === itemOutsourced ? { ...item, companyName: companyName } : item
      ),
    })),
  setOutsourcedBuyingPrice: (
    itemOutsourced: InvoiceItem,
    buyingPrice: number
  ) =>
    set((state) => ({
      ...state,
      invoiceItemDTOList: state.invoiceItemDTOList.map((item) =>
        item === itemOutsourced ? { ...item, buyingPrice: buyingPrice } : item
      ),
    })),

  getOutsourcedItems: () => {
    const state = get();
    return state.invoiceItemDTOList.filter(
      (item) => item.outsourcedStatus === true
    );
  },
  setDiscountPercentage: (percentage: number) =>
    set((state) => ({ ...state, discountPercentage: percentage })),
  setDiscountAmount: (amount: number) =>
    set((state) => ({ ...state, discountAmount: amount })),
  setVatPercentage: (percentage: number) =>
    set((state) => ({ ...state, vatPercentage: percentage })),
  setVatAmount: (amount: number) =>
    set((state) => ({ ...state, vatAmount: amount })),
  setTotalPrice: (amount: number) =>
    set((state) => ({ ...state, totalPrice: amount })),

  getRequestData: () => {
    const state = get();

    return {
      invoiceID : "RANDOM ID", //TODO RANDOM ID GENERATIONS
      creditorID : state.creditorID,
      creditorName : state.creditorName,
      totalPrice : state.totalPrice,
      discount : state.discountAmount,
      vat : state.vatAmount,

      invoiceItemsDTOList : state.invoiceItemDTOList,
      
    }
  }
}));

export default useCreditorInvoiceStore;
