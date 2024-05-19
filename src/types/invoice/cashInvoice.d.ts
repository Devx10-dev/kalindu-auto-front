export type InvoiceItem = {
    invoiceID?: string;
    itemName?: string;
    code?: string;
    totalPrice?: string | number;
    VAT?: string | number;
    outsourcedStatus?: boolean;
    companyName?: string;
    buyingPrice?: number;
};

export type InvoiceState = {

    customerName?: string;
    vehicleNumber?: string;
    totalPrice?: number;
    invoiceItemDTOList: InvoiceItem[];

    discountPercentage?: number;
    discountAmount?: number;
    vatPercentage?: number;
    vatAmount?: number;

    commissionName?: string;
    commissionAmount?: number;


    setCustomer: (name?: string) => void;
    setVehicleNumber: (number?: string) => void;

    addInvoiceItem: (item: InvoiceItem) => void;
    removeInvoiceItem: (item: InvoiceItem) => void;

    setOutsourcedStatus: (item: InvoiceItem, status: boolean) => void;
    getOutsourcedItems: () => InvoiceItem[];
    setOutsourcedCompanyName: (item: InvoiceItem, companyName: string) => void;
    setOutsourcedBuyingPrice: (item: InvoiceItem, buyingPrice: number) => void;

    setDiscountPercentage: (percentage: number) => void;
    setDiscountAmount: (amount: number) => void;
    setVatPercentage: (percentage: number) => void;
    setVatAmount: (amount: number) => void;

    setCommissionName: (name?: string) => void;
    setCommissionAmount: (amount?: number) => void;

    getRequestData: () => any;
};