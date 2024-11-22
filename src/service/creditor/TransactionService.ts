import {
  Creditor,
  CreditorResponseData,
  CreditorTransaction,
} from "@/types/creditor/creditorTypes";
import { AxiosInstance } from "axios";
import { CreditInvoice } from "@/types/invoice/credit/creditInvoiceTypes";
import { TransactionList } from "@/types/creditor/creditorTransactions";

const DEFAULT_PAGE_SIZE = 10;
const GET_CREDITOR_TRANSACTIONS_URL = "/creditor/transactions";
const GET_INVOICE_TRANSACTIONS_URL = "/invoice/credit/transactions";

class TransactionService {
  private api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async getCreditorTransactions(
    creditorID?: string,
    pageNo = 0,
    pageSize = DEFAULT_PAGE_SIZE,
    type?: string,
    date?: string,
  ): Promise<TransactionList> {
    const response = await this.api.get(
      GET_CREDITOR_TRANSACTIONS_URL +
        "/" +
        creditorID +
        `?pageNo=${pageNo}&pageSize=${pageSize}` +
        (type && type != "ALL" ? `&type=${type}` : "") +
        (date ? `&date=${date}` : ""),
    );
    return response.data;
  }

  async getInvoiceTransactions(
    invoiceID?: string,
    pageNo = 0,
    pageSize = DEFAULT_PAGE_SIZE,
    type?: string,
    date?: string,
  ): Promise<TransactionList> {
    const response = await this.api.get(
      GET_INVOICE_TRANSACTIONS_URL +
        "/" +
        invoiceID +
        `?pageNo=${pageNo}&pageSize=${pageSize}` +
        (type && type != "ALL" ? `&type=${type}` : "") +
        (date ? `&date=${date}` : ""),
    );
    return response.data;
  }
}

export default TransactionService;
