import { InvoiceItem, InvoiceState } from "@/types/invoice/cashInvoice";
import {create} from "zustand";

const useCashInvoiceStore = create<InvoiceState>((set, get) =>
    ({
        invoiceID: undefined,
        customerName: undefined,
        vehicleNumber: undefined,
        totalPrice: undefined,

        // final bill summary items
        discountPercentage: 0,
        discountAmount: 0,
        vatPercentage: 0,
        vatAmount: 0,

        //commisions details
        commissionName: undefined,
        commissionAmount: undefined,

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
                    item === itemOutsourced ? {...item, outsourcedStatus: status} : item
                ),
            })),

        setOutsourcedCompanyName: (
            itemOutsourced: InvoiceItem,
            companyName: string
        ) =>
            set((state) => ({
                ...state,
                invoiceItemDTOList: state.invoiceItemDTOList.map((item) =>
                    item === itemOutsourced ? {...item, companyName: companyName} : item
                ),
            })),

        setOutsourcedBuyingPrice: (
            itemOutsourced: InvoiceItem,
            buyingPrice: number
        ) =>
            set((state) => ({
                ...state,
                invoiceItemDTOList: state.invoiceItemDTOList.map((item) =>
                    item === itemOutsourced ? {...item, buyingPrice: buyingPrice} : item
                ),
            })),

        getOutsourcedItems: () => {
            const state = get();
            return state.invoiceItemDTOList.filter(
                (item) => item.outsourcedStatus === true
            );
        },
        setDiscountPercentage: (percentage: number) =>
            set((state) => ({...state, discountPercentage: percentage})),
        setDiscountAmount: (amount: number) =>
            set((state) => ({...state, discountAmount: amount})),
        setVatPercentage: (percentage: number) =>
            set((state) => ({...state, vatPercentage: percentage})),

        setVatAmount: (amount: number) =>
            set((state) => ({
                ...state,
                vatAmount: amount
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

        getRequestData: () => {
            const state = get();

            return {
                invoiceID: "RANDOM ID", //TODO RANDOM ID GENERATIONS
                customerName: state.customerName,
                vehicleNumber: state.vehicleNumber,
                totalPrice: state.totalPrice,
                discount: state.discountAmount,
                vat: state.vatAmount,
                invoiceItemsDTOList: state.invoiceItemDTOList,

            }
        }
    }));

export default useCashInvoiceStore;
