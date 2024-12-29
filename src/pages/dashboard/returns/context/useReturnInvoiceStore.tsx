import {
  BaseInvoice,
  InvoiceItem,
  InvoiceState,
  Payment,
  ReturnItem,
} from "@/types/returns/returnsTypes";
import { create } from "zustand";

const useReturnInvoiceStore = create<InvoiceState>((set, get) => ({
  sourceInvoiceId: undefined, //Must be
  returnedItems: [], //Must be
  remainingDue: 0,

  returnType: undefined, //Must be
  newInvoiceType: "CRE", //Must be
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
  selectedInvoice: undefined,
  selectedInvoiceType: undefined,
  cashbackType: undefined,
  payments: [],

  selectedInvoiceId: undefined,
  

  setSourceInvoiceId: (sourceInvoiceId?: string) =>
    set((state) => ({
      ...state,
      sourceInvoiceId: sourceInvoiceId,
    })),

  setSelectedInvoiceType: (selectedInvoiceType?: string) =>
    set((state) => ({
      ...state,
      selectedInvoiceType: selectedInvoiceType,
    })),

  setRemainingDue: (remainingDue: number) =>
    set((state) => ({
      ...state,
      remainingDue: remainingDue,
    })),

  setReturnType: (returnType?: string) =>
    set((state) => ({
      ...state,
      returnType: returnType,
    })),

  setNewInvoiceType: (newInvoiceType?: string) =>
    set((state) => ({
      ...state,
      newInvoiceType: newInvoiceType,
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

  setSelectedInvoice: (invoice: BaseInvoice) =>
    set((state) => ({
      ...state,
      selectedInvoice: invoice,
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

  resetExchangeItemTable: () =>
    set({
      invoiceItemDTOList: [],
      returnAmount: 0,
    }),

  resetState: () =>
    set((state) => ({
      ...state,
      sourceInvoiceId: undefined,
      returnedItems: [],
      remainingDue: 0,
      returnType: undefined,
      newInvoiceType: "CRE",
      reason: undefined,
      cashBackAmount: 0,
      creditorCashBack: 0,
      creditInvoice: false,
      invoiceID: undefined,
      customerName: undefined,
      vehicleNumber: undefined,
      discountPercentage: 0,
      discountAmount: 0,
      vatPercentage: 0,
      vatAmount: 0,
      returnAmount: 0,
      totalPrice: undefined,
      purchaseDate: undefined,
      commissionName: undefined,
      commissionAmount: undefined,
      commissionRemark: undefined,
      invoiceItemDTOList: [],
      selectedInvoice: undefined,
      selectedInvoiceType: undefined,
      cashbackType: undefined,
      payments: [],
      selectedInvoiceId: undefined,
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

      console.log(state.newInvoiceType);
      const invoiceType = state.newInvoiceType == "CASH" ? "CASH" : "CRE";
      return `INV-${invoiceType}-${year}${month}${day}${uniqueNumber}`;
    };

    const invoiceId = generateInvoiceId();

    const requestData = {
      sourceInvoiceId: state.sourceInvoiceId,
      sourceInvoiceType: state.selectedInvoiceType,
      returnedItems: state.returnedItems,
      creditInvoice: state.newInvoiceType == "CASH" ? false : true,
      reason: state.reason,
      exchangeItems: state.invoiceItemDTOList,
      newInvoiceId: invoiceId,
      newInvoiceType: state.newInvoiceType,
      returnType: state.returnType,
      cashBackAmount: state.cashBackAmount,
      cashbackType: state.cashbackType,
      payments: state.payments,
      cashBackType: state.cashbackType,
    };

    return requestData;
  },

  setCashbackType: (cashbackType: string) =>
    set((state) => ({
      ...state,
      cashbackType: cashbackType,
    })),

  setPayments: (payments: Payment[]) =>
    set((state) => ({
      ...state,
      payments: payments,
    })),

  addPayment: (payment: Payment) => {
    set((state) => ({
      ...state,
      payments: [...state.payments, payment],
    }));
  },

  removePayment: (payment: Payment) => {
    set((state) => ({
      ...state,
      payments: state.payments.filter((p) => p !== payment),
    }));
  },

  setSelectedInvoiceId: (selectedInvoiceId: string) =>
    set((state) => ({
      ...state,
      selectedInvoiceId: selectedInvoiceId,
    })),

  
}));

export default useReturnInvoiceStore;
