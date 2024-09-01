export type InvoiceItem = {
  name?: string;
  code?: string;
  price?: number;
  quantity?: number;
  discount?: number;
  description?: string;
  outsourced?: boolean;
  sparePartId?: number;
  outsourceItem?: {
    companyName?: string;
    buyingPrice?: number;
  };
};

export type InvoiceState = {
  dummy: any;
  id?: number;
  invoiceId?: string;
  issuedTime?: number[];
  customerName?: string;
  vehicleNumber?: string;
  totalPrice?: number;
  invoiceItemDTOList: InvoiceItem[];
  vehicleNo?: string;
  invoiceItems?: InvoiceItem[];

  discountPercentage?: number;
  discountAmount?: number;
  vatPercentage?: number;
  vatAmount?: number;
  discount?: number;
  vat?: number;
  totalDiscount?: number;

  commissionName?: string;
  commissionRemark?: string;
  commissionAmount?: number;

  commissions?: Commission[];

  setCustomer: (name?: string) => void;
  setVehicleNumber: (number?: string) => void;

  addInvoiceItem: (item: InvoiceItem) => void;
  removeInvoiceItem: (item: InvoiceItem) => void;
  updateInvoiceItem: (updateItem: InvoiceItem) => void;

  setOutsourcedStatus: (item: InvoiceItem, status: boolean) => void;
  getOutsourcedItems: () => InvoiceItem[];
  setOutsourcedCompanyName: (item: InvoiceItem, companyName: string) => void;
  setOutsourcedBuyingPrice: (item: InvoiceItem, buyingPrice: number) => void;

  setDiscountPercentage: (percentage: number) => void;
  setDiscountAmount: (amount: number) => void;
  setVatPercentage: (percentage: number) => void;
  setVatAmount: (amount: number) => void;
  setTotalPrice: (price: number) => void;

  setCommissionName: (name?: string) => void;
  setCommissionRemark: (remark?: string) => void;
  setCommissionAmount: (amount?: number) => void;

  resetState: () => void;
  getRequestData: () => any;
};

export type InvoiceList = {
  invoices: InvoiceState[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
};

export type Invoices = {
  cashInvoicesStore: InvoiceState[];
  setCashInvoicesStore: (invoices: InvoiceState[]) => void;
  addCashInvoiceToStore: (invoice: InvoiceState) => void;
  getCashInvoiceById: (invoiceId: string) => InvoiceState;
};

export type Commission = {
  id: number;
  personName: string;
  amount: number;
  remark: string;
};

// {
//   "id": 15,
//   "customerName": "Kmal",
//   "invoiceId": "INV-CASH-2408261146",
//   "totalPrice": 1000.00
// }

export type QuickSearchInvoice = {
  id: number;
  customerName: string;
  invoiceId: string;
  totalPrice: number;
};
