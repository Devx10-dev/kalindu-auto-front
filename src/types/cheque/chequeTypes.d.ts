import { Creditor } from "../creditor/creditorTypes";

export interface Cheque {
  id?: number;
  chequeNo: string;
  amount: number;
  availableAmount?: number;
  dateTime?: number[];
  creditor?: Creditor;
  status?: "PENDING" | "SETTLED" | "REJECTED" | "REDEEMED";
  creditorName?: string;
  chequeInvoices?: ChequeInvoice[];
}

export interface ChequeInvoice {
  invoiceNo: string;
  totalPrice: number;
  issuedTime: number[];
  chequeNo: string;
  amount: number;
}

export type ChequeResponseData = {
  currentPage: number;
  totalItems: number;
  totalPages: number;
  cheques: Cheque[];
};
