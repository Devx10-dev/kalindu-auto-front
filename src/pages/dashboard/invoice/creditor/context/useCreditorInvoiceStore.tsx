import { InvoiceItem, InvoiceState } from "@/types/invoice/creditorInvoice";
import { create } from "zustand";

const useCreditorInvoiceStore = create<InvoiceState>((set, get) => ({
  invoiceID: undefined,
  creditorName: undefined,
  creditorID: undefined,
  address: undefined,
  contactNo: undefined,

  // final bill summary items
  discountPercentage: 0,
  discountAmount: 0,
  vatPercentage: 0,
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
    const invoiceId = generateInvoiceId();
    return {
      invoiceId: invoiceId,
      creditorId: state.creditorID,
      totalPrice: state.totalPrice,
      totalDiscount: state.discountAmount,
      VAT: state.vatAmount,
      creditorName: state.creditorName,
      invoiceItems: state.invoiceItemDTOList,

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

/**
 * Generates a unique invoice ID in the format INV-CRE-YYMMDDXXXX
 *
 * @returns {string} The generated invoice ID
 *
 * @description
 * This function creates a unique invoice ID using the following components:
 * 1. A fixed prefix: 'INV-CRE-'
 * 2. Current date in YYMMDD format:
 *    - Uses toISOString() to get the date in ISO format (YYYY-MM-DD)
 *    - Slices from index 2 to 10 to get 'YY-MM-DD'
 *    - Removes hyphens to get 'YYMMDD'
 * 3. A random 4-digit number:
 *    - Generates a number between 1000 and 9999
 */
const generateInvoiceId = (): string => {
  const now = new Date();
  const date = now.toISOString().slice(2, 10).replace(/-/g, "");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `INV-CRE-${date}${random}`;
};

export default useCreditorInvoiceStore;
