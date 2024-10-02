import { Creditor } from "../creditor/creditorTypes";
import { Commission } from "./cashInvoice";

export type InvoiceItem = {
  name?: string;
  code?: string;
  price?: number;
  discount?: number;
  sparePartId?: number;
  quantity?: number;
  outsourced?: boolean;
  outsourceItem?: {
    companyName?: string;
    buyingPrice?: number;
  };
  description: string;
};

export type InvoiceState = {
  creditorName?: string;
  creditorID?: number;
  invoiceItemDTOList: InvoiceItem[];
  creditor?: Creditor;
  commissions?: Commission[];
  invoiceId?: number;
  invoiceItems?: InvoiceItem[];
  issuedBy?: string;
  issuedTime?: number[];
  address?: string;
  contactNo?: string;
  settled?: boolean;
  settled_amount?: number;
  invoiceItems?: InvoiceItem[];

  discountPercentage?: number;
  discountAmount?: number;
  vatPercentage?: number;
  vatAmount?: number;
  totalDiscount?: number;
  totalPrice?: number;
  vat?: number;

  commissionName?: string;
  commissionRemark?: string;
  commissionAmount?: number;

  commissions?: Commission[];

  dueTime?: number[];
  dueStatus?: string;

  addInvoiceItem: (item: InvoiceItem) => void;
  removeInvoiceItem: (item: InvoiceItem) => void;
  updateInvoiceItem: (updateItem: InvoiceItem) => void;

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

  setCommissionName: (commissionName?: string) => void;
  setCommissionRemark: (commissionRemark?: string) => void;
  setCommissionAmount: (commissionAmount?: number) => void;

  getRequestData: () => any;
  resetState: () => void;
};

export type CreditorInvoiceList = {
  invoices: InvoiceState[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
};

export type CreditInvoices = {
  creditInvoicesStore: InvoiceState[];
  setCreditInvoicesStore: (invoices: InvoiceState[]) => void;
  addCreditInvoiceToStore: (invoice: InvoiceState) => void;
  getCreditInvoiceById: (invoiceId: string) => InvoiceState;
};

export type CreditInvoiceStats = {
  overdueCreditors: number;
  dueCreditors: number;
  overdueAmount: number;
  dueAmount: number;
  totalCreditBalance: number;
  totalCreditors: number;
  totalDueInvoices: number;
  totalOverdueInvoices: number;
};

export type PieChartData = {
  status: string;
  creditors: number;
  fill: string;
};

export type Commission = {
  id: number;
  personName: string;
  amount: number;
  remark: string;
};
