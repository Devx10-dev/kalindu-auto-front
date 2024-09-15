import {
  Creditor,
  CreditorResponseData,
  CreditorTransaction,
} from "@/types/creditor/creditorTypes";
import { AxiosInstance } from "axios";
import { CreditorEndpoints } from "./CreditorEndpoints";
import { CreditInvoice } from "@/types/invoice/credit/creditInvoiceTypes";

const DEFAULT_PAGE_SIZE = 10;

class CreditorAPI {
  private api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async fetchCreditors(
    pageNo: number = 0,
    searchQuery: string,
    pageSize: number = 10,
  ): Promise<CreditorResponseData> {
    if (pageNo >= 1) pageNo = pageNo - 1;
    const pagedURL = `${CreditorEndpoints.GET_ALL_CREDITORS_URL}?pageNo=${pageNo}&pageSize=${pageSize}&query=${searchQuery}`;
    const response = await this.api.get<CreditorResponseData>(pagedURL);
    return response.data;
  }

  async fetchAllCreditors(): Promise<Creditor[]> {
    const response = await this.api.get<Creditor[]>(
      `${CreditorEndpoints.GET_ALL_CREDITORS_URL}/all`,
    );

    return response.data;
  }

  async fetchSingleCreditor(creditorID?: string) {
    if (creditorID) {
      const response = await this.api.get(
        CreditorEndpoints.GET_ONE_CREDITOR_URL + "/" + creditorID,
      );

      return response.data;
    }
  }

  async fetchCreditorInvoiceIDs(creditorID?: string) {
    if (creditorID) {
      const response = await this.api.get(
        CreditorEndpoints.GET_CREDITOR_INVOICE_IDS_URL + "/" + creditorID,
      );

      return response.data;
    }
  }

  async createCreditor(creditor: Creditor): Promise<Creditor> {
    const response = await this.api.post(
      CreditorEndpoints.CREATE_CREDITOR_URL,
      creditor,
    );
    return response.data;
  }

  async updateCreditor(
    creditor: Creditor,
    creditorID: string,
  ): Promise<Creditor> {
    creditor = {
      ...creditor,
      creditorID,
    };
    const response = await this.api.put(
      CreditorEndpoints.CREDITOR_BASE_URL,
      creditor,
    );
    return response.data;
  }

  async getCreditorTransactions(creditorID?: string) {
    const response = await this.api.get(
      CreditorEndpoints.GET_CREDITOR_TRANSACTIONS_URL + "/" + creditorID,
    );
    return response.data;
  }

  async createCreditorTransaction(
    creditorTransaction: any,
  ): Promise<CreditorTransaction> {
    const response = await this.api.post(
      CreditorEndpoints.CREATE_CREDITOR_TRANSACTIONS_URL,
      {
        ...creditorTransaction,
        isPartial: creditorTransaction.isPartial ? "YES" : "NO",
      },
    );
    return response.data;
  }

  async fetchCreditInvoice(invoiceID: number): Promise<CreditInvoice> {
    const response = await this.api.get(
      CreditorEndpoints.GET_CREDITOR_INVOICE_URL + "/" + invoiceID,
    );
    return response.data;
  }

  async fetchUnsettledCreditInvoicesByID(id: number): Promise<CreditInvoice[]> {
    if (id === undefined || id === 0) return [];
    const response = await this.api.get(
      `${CreditorEndpoints.GET_CREDITOR_INVOICE_URL}/creditor/${id}/unsettled`,
    );
    return response.data;
  }
}

export default CreditorAPI;
