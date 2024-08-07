import { InvoiceItem, InvoiceState } from "@/types/invoice/cashInvoice";
import { create } from "zustand";

const useCashInvoiceStore = create<InvoiceState>((set, get) => ({
  invoiceID: undefined,
  customerName: undefined,
  vehicleNumber: undefined,

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

  updateInvoiceItem: (updateItem: InvoiceItem) =>
    set((state) => ({
      ...state,
      invoiceItemDTOList: state.invoiceItemDTOList.map((item) =>
        item.name === updateItem.name ? updateItem : item,
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
  setTotalPrice: (price: number) =>
    set((state) => ({
      ...state,
      totalPrice: price,
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

  resetState: () =>
    set({
      invoiceId: undefined,
      customerName: undefined,
      vehicleNumber: undefined,
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

    const requestData = {
      vat: state.vatPercentage,
      discount: state.discountPercentage,
      customerName: state.customerName,
      invoiceId: invoiceId,
      vehicleNo: state.vehicleNumber,
      totalPrice: state.totalPrice,
      totalDiscount: state.discountAmount, //TODO :: what is this
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

    return requestData;
  },
}));

export default useCashInvoiceStore;
