import {
  InvoiceItem,
  InvoiceState,
  ReturnItem,
} from "@/types/returns/returnsTypes";
import { create } from "zustand";

const useReturnInvoiceStore = create<InvoiceState>((set, get) => ({
  sourceInvoiceId: undefined, //Must be
  returnedItems: [], //Must be

  returnType: undefined, //Must be
  reason: undefined, //Must be

  cashBackAmount: 0,
  creditorCashBack: 0,
  creditInvoice: false,

  invoiceID: undefined,
  customerName: undefined,
  vehicleNumber: undefined,

  // final bill summary items
  discountPercentage: 0,
  discountAmount: 0,
  vatPercentage: 0,
  vatAmount: 0,
  returnAmount: 0,
  totalPrice: undefined,
  purchaseDate: undefined,
  //commissions details
  commissionName: undefined,
  commissionAmount: undefined,
  commissionRemark: undefined,
  // exchange items
  invoiceItemDTOList: [],

  setSourceInvoiceId: (sourceInvoiceId?: string) =>
    set((state) => ({
      ...state,
      sourceInvoiceId: sourceInvoiceId,
    })),

  setReturnType: (returnType?: string) =>
    set((state) => ({
      ...state,
      returnType: returnType,
    })),

  setReason: (reason?: string) =>
    set((state) => ({
      ...state,
      reason: reason,
    })),

  setCashBackAmount: (cashBackAmount: number) =>
    set((state) => ({
      ...state,
      cashBackAmount: cashBackAmount,
    })),

  setCreditorCashBack: (creditorCashBack: number) =>
    set((state) => ({
      ...state,
      creditorCashBack: creditorCashBack,
    })),

  setCreditInvoice: (creditInvoice: boolean) =>
    set((state) => ({
      ...state,
      creditInvoice: creditInvoice,
    })),

  setReturnAmount: (returnAmount: number) =>
    set((state) => ({
      ...state,
      returnAmount: returnAmount,
    })),

  setPurchaseDate: (purchaseDate: Array<number>) =>
    set((state) => ({
      ...state,
      purchaseDate: purchaseDate,
    })),

  addReturnItem: (newItem: ReturnItem) =>
    set((state) => {
      const existingItemIndex = state.returnedItems.findIndex(
        (item) => item.id === newItem.id,
      );

      if (existingItemIndex !== -1) {
        // If item exists, update its returnedQuantity
        const updatedReturnedItems = state.returnedItems.map((item, index) =>
          index === existingItemIndex
            ? { ...item, returnedQuantity: newItem.returnedQuantity }
            : item,
        );

        return {
          ...state,
          returnedItems: updatedReturnedItems,
        };
      } else {
        // If item does not exist, add it to the array
        return {
          ...state,
          returnedItems: [...state.returnedItems, newItem],
        };
      }
    }),

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

  setCustomer: (customerName?: string) =>
    set((state) => ({
      ...state,
      customerName: customerName,
    })),

  setVehicleNumber: (vehicleNumber?: string) =>
    set((state) => ({
      ...state,
      vehicleNumber: vehicleNumber,
    })),

  setOutsourcedStatus: (itemOutsourced: InvoiceItem, status: boolean) =>
    set((state) => ({
      ...state,
      invoiceItemDTOList: state.invoiceItemDTOList.map((item) =>
        item === itemOutsourced ? { ...item, outsourced: status } : item,
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
    set((state) => ({
      ...state,
      vatAmount: amount,
    })),
  setTotalPrice: (totalPrice: number) =>
    set((state) => ({
      ...state,
      totalPrice: totalPrice,
    })),

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

    const generateInvoiceId = () => {
      const now = new Date();
      const year = now.getFullYear().toString().slice(2); // Last two digits of the year
      const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Month (0-indexed, so +1)
      const day = now.getDate().toString().padStart(2, "0"); // Day of the month

      // Generate a unique 4-digit number based on time
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const uniqueNumber = (parseInt(hours + minutes, 10) % 10000)
        .toString()
        .padStart(4, "0");

      return `INV-CASH-${year}${month}${day}${uniqueNumber}`;
    };

    const invoiceId = generateInvoiceId();
    console.log(invoiceId);

    const requestData = {
      sourceInvoiceId: state.sourceInvoiceId,
      returnedItems: state.returnedItems,
      returnType: state.returnType,
      reason: state.reason,
      exchangeItems: state.invoiceItemDTOList,
      // vat: state.vatPercentage,
      // discount: state.discountPercentage,
      // customerName: state.customerName,
      // invoiceId: invoiceId,
      // vehicleNo: state.vehicleNumber,
      // totalPrice: state.totalPrice,
      // totalDiscount: state.discountAmount, //TODO :: what is this
      // invoiceItems: state.invoiceItemDTOList,

      // commissions:
      //   state.commissionName && state.commissionAmount
      //     ? [
      //         {
      //           personName: state.commissionName,
      //           amount: state.commissionAmount,
      //           remark: state.commissionRemark,
      //         },
      //       ]
      //     : [],
    };

    return requestData;
  },
}));

export default useReturnInvoiceStore;
