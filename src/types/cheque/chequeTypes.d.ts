import { Creditor } from "../creditor/creditorTypes";

export interface Cheque {
  id?: number;
  chequeNo: string;
  amount: number;
  dateTime?: number[];
  creditor?: Creditor;
  status?: string;
  creditorName?: string;
}

export type ChequeResponseData = {
  currentPage: number;
  totalItems: number;
  totalPages: number;
  cheques: Cheque[];
};
