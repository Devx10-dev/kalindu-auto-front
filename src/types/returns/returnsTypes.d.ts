export interface BaseInvoice {
  id: number;
  invoiceId: string;
  customer: string;
  items: InvoiceItem[];
  returnItems: InvoiceItem[];
  date: number[];
  invoiceType: string;
  totalPrice: number;
  settledAmount: number;
}

export type InvoiceItem = {
  id?: number;
  name?: string;
  code?: string;
  price?: number;
  quantity?: number;
  availableQuantity?: number;
  discount?: number;
  description?: string;
  outsourced?: boolean;
  sparePartId?: number;
  outsourceItem?: {
    companyName?: string;
    buyingPrice?: number;
  };
};

export type ReturnItem = {
  id?: number;
  returnedQuantity?: number;
};

export type Payment = {
  paymentType: string;
  amount: number;
};

export type InvoiceState = {
  sourceInvoiceId?: string;
  returnedItems: ReturnItem[];
  invoiceID: string;
  remainingDue: number;

  returnType?: string;
  newInvoiceType?: string; //Must be
  reason?: string;

  cashBackAmount?: number;
  creditorCashBack?: number;
  creditInvoice?: BaseInvoice;

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
  returnAmount?: number;
  purchaseDate?: Array<number>;
  cashbackType?: string;

  commissionName?: string;
  commissionRemark?: string;
  commissionAmount?: number;
  selectedInvoice?: BaseInvoice;
  selectedInvoiceType?: string;

  commissions?: Commission[];
  payments?: Payment[];

  selectedInvoiceId?: string;

  returnedCreditInvoice?: BaseInvoice;
  returnedInvoice?: BaseInvoice;

  setSourceInvoiceId: (sourceInvoiceId?: string) => void;
  setReturnType: (returnType?: string) => void;
  setNewInvoiceType: (newInvoiceType?: string) => void;
  setReason: (reason?: string) => void;
  setCashBackAmount: (cashBackAmount: number) => void;
  setCreditorCashBack: (creditorCashBack: number) => void;
  setCreditInvoice: (creditInvoice: BaseInvoice) => void;
  addReturnItem: (item: ReturnItem) => void;
  setRemainingDue: (remainingDue: number) => void;

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
  setTotalPrice: (price: number) => void;
  setReturnAmount: (returnAmount: number) => void;
  setPurchaseDate: (purchaseDate: Array<number>) => void;
  setCashbackType: (cashbackType: string) => void;

  setCommissionName: (name?: string) => void;
  setCommissionRemark: (remark?: string) => void;
  setCommissionAmount: (amount?: number) => void;

  getRequestData: () => any;
  resetExchangeItemTable: () => void;
  resetState: () => void;
  setSelectedInvoice: (invoice?: BaseInvoice) => void;
  setSelectedInvoiceType: (invoiceType?: string) => void;
  setPayments: (payments: Payment[]) => void;
  addPayment: (payment: Payment) => void;
  removePayment: (payment: Payment) => void;
  setSelectedInvoiceId: (invoiceId?: string) => void;
};

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

export interface InvoiceID {
  id: number;
  invoiceID: string;
}

type Option = {
  id: string;
  icon: React.ElementType;
  label: string;
};

type IconRadioGroupProps = {
  options: Option[];
  onChange?: (selectedId: string) => void;
};
