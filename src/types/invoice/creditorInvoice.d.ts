import { Creditor } from "../creditor/creditorTypes";
import { Commission } from "./cashInvoice";

//   "creditInvoices": [
//       {
//           "id": 102,
//           "invoiceId": "INV-CRE-2408181829",
//           "creditorId": null,
//           "issuedTime": [
//               2024,
//               8,
//               18,
//               18,
//               29,
//               11,
//               42735000
//           ],
//           "dueTime": [
//               2024,
//               9,
//               1,
//               18,
//               29,
//               11,
//               42735000
//           ],
//           "totalPrice": 10000.00,
//           "settled": false,
//           "settledAmount": null,
//           "totalDiscount": 0.00,
//           "issuedBy": "b0a8ee5a-b0ec-49db-bef6-cd611b657ecf",
//           "dueStatus": "DUE",
//           "vat": null
//       }
//   ]

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

  dueTime?: number[];
  dueStatus?: string;

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
  resetState: () => void;
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
