import { InvoiceItem, InvoiceState } from "@/types/invoice/cashInvoice";
import {create} from "zustand";

const useCashInvoiceStore = create<InvoiceState>((set, get) =>
    ({
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

        getRequestData: () => {
            const state = get();

            return {
                vat: state.vatAmount,
                discount: state.discountAmount,
                invoiceId: "RANDOM ID", //TODO RANDOM ID GENERATIONS
                customerName: state.customerName,
                vehicleNo: state.vehicleNumber,
                totalPrice: state.totalPrice,
                totalDiscount: state.discountAmount,   //TODO :: what is this
                invoiceItems: state.invoiceItemDTOList,
                commission: [{
                    name: state.commissionName,
                    amount: state.commissionAmount,
                    remark: state.commissionRemark
                },]

            }
        }
    }));

export default useCashInvoiceStore;
