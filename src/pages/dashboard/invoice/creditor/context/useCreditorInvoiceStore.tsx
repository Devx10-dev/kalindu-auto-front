import { InvoiceItem, InvoiceState } from "@/types/invoice/creditorInvoice";
import { create } from "zustand";

const useCreditorInvoiceStore = create<InvoiceState>((set, get) => ({
  id: undefined,
  invoiceID: undefined,
  creditorName: undefined,
  creditorID: undefined,
  address: undefined,
  contactNo: undefined,

  // final bill summary items
  discountPercentage: 0,
  discountAmount: 0,
  vatPercentage: 18,
  vatAmount: 0,
  totalPrice: undefined,

  //commissions details
  commissionName: undefined,
  commissionAmount: undefined,
  commissionRemark: undefined,

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
        (item) => item !== itemToRemove,
      ),
    })),

  updateInvoiceItem: (updateItem: InvoiceItem) =>
    set((state) => ({
      ...state,
      invoiceItemDTOList: state.invoiceItemDTOList.map((item) =>
        item.name === updateItem.name ? updateItem : item,
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
        item === itemOutsourced
          ? {
              ...item,
              outsourced: status,
            }
          : item,
      ),
    })),

  setOutsourcedCompanyName: (
    itemOutsourced: InvoiceItem,
    companyName: string,
  ) =>
    set((state) => ({
      ...state,
      invoiceItemDTOList: state.invoiceItemDTOList.map((item) =>
        item === itemOutsourced
          ? {
              ...item,
              outsourceItem: {
                ...item.outsourceItem,
                companyName: companyName,
              },
            }
          : item,
      ),
    })),
  setOutsourcedBuyingPrice: (
    itemOutsourced: InvoiceItem,
    buyingPrice: number,
  ) =>
    set((state) => ({
      ...state,
      invoiceItemDTOList: state.invoiceItemDTOList.map((item) =>
        item === itemOutsourced
          ? {
              ...item,
              outsourceItem: {
                ...item.outsourceItem,
                buyingPrice: buyingPrice,
              },
            }
          : item,
      ),
    })),

  getOutsourcedItems: () => {
    const state = get();
    return state.invoiceItemDTOList.filter((item) => item.outsourced === true);
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

  setCommissionName: (commissionName?: string) =>
    set((state) => ({
      ...state,
      commissionName: commissionName,
    })),

  setCommissionAmount: (CommissionAmount?: number) =>
    set((state) => ({
      ...state,
      commissionAmount: CommissionAmount,
    })),

  setCommissionRemark: (commissionRemark?: string) =>
    set((state) => ({
      ...state,
      commissionRemark: commissionRemark,
    })),

  getRequestData: () => {
    const state = get();
    return {
      creditorId: state.creditorID,
      totalPrice: state.totalPrice,
      totalDiscount: state.discountAmount,
      vat: state.vatAmount,
      creditorName: state.creditorName,
      invoiceItems: state.invoiceItemDTOList,
      contactNo: state?.creditor?.primaryContact,
      issuedTime: state.issuedTime,

      commissions:
        state.commissionName && state.commissionAmount
          ? [
              {
                personName: state.commissionName,
                amount: state.commissionAmount,
                remark: state.commissionRemark,
              },
            ]
          : [],
    };
  },

  resetState: () =>
    set({
      invoiceId: undefined,
      creditorName: undefined,
      creditorID: undefined,
      address: undefined,
      contactNo: undefined,
      discountPercentage: 0,
      discountAmount: 0,
      vatPercentage: 0,
      vatAmount: 0,
      totalPrice: undefined,
      commissionName: undefined,
      commissionAmount: undefined,
      commissionRemark: undefined,
      invoiceItemDTOList: [],
    }),
}));

export default useCreditorInvoiceStore;
