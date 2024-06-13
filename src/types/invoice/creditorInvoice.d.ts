export type InvoiceState = {
  creditorName?: string;
  creditorID?: number;
  totalPrice?: number;
  invoiceItemDTOList: InvoiceItem[];

  discountPercentage?: number;
  discountAmount?: number;
  vatPercentage?: number;
  vatAmount?: number;

  addInvoiceItem: (item: InvoiceItem) => void;
  removeInvoiceItem: (item: InvoiceItem) => void;
  setCreditor: (name?: string, id?: number) => void;
  setOutsourcedStatus: (item: InvoiceItem, status: boolean) => void;
  getOutsourcedItems: () => InvoiceItem[];
  setOutsourcedCompanyName: (item: InvoiceItem, companyName: string) => void;
  setOutsourcedBuyingPrice: (item: InvoiceItem, buyingPrice: number) => void;
  setDiscountPercentage: (percentage: number) => void;
  setDiscountAmount: (amount: number) => void;
  setVatPercentage: (percentage: number) => void;
  setVatAmount: (amount: number) => void;
  setTotalPrice: (amount: number) => void;
  getRequestData: () => any;
};

export type InvoiceItem = {
  invoiceID?: string;
  itemName?: string;
  vehicleNo?: string;
  code?: string;
  totalPrice?: string | number;
  VAT?: string | number;
  outsourcedStatus?: boolean;
  companyName?: string;
  buyingPrice?: number;
};
