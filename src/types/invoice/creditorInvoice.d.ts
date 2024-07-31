import { Creditor } from "../creditor/creditorTypes";
import { Commission } from "./cashInvoice";

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

  setCommissionName: (commissionName?: string) => void;
  setCommissionRemark: (commissionRemark?: string) => void;
  setCommissionAmount: (commissionAmount?: number) => void;

  getRequestData: () => any;
};

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
