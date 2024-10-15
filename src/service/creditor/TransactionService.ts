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

class TransactionService {
  private api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async getCreditorTransactions(
    creditorID?: string,
    pageNo = 0,
    pageSize = DEFAULT_PAGE_SIZE,
  ): Promise<TransactionList> {
    const response = await this.api.get(
      GET_CREDITOR_TRANSACTIONS_URL +
        "/" +
        creditorID +
        `?pageNo=${pageNo}&pageSize=${pageSize}`,
    );
    return response.data;
  }
}

export default TransactionService;
