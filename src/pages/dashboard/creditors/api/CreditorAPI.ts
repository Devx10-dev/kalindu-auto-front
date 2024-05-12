import { ResponseData } from "@/types/component/commonTypes";
import { Creditor, CreditorResponseData, CreditorTransaction } from "@/types/creditor/creditorTypes";
import { AxiosInstance } from "axios";
import { CreditorEndpoints } from "./CreditorEndpoints";

const DEFAULT_PAGE_SIZE = 10;

class CreditorAPI {
  private api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async fetchCreditors(
    pageNo: number = 0,
    pageSize: number = 10
  ): Promise<CreditorResponseData> {
    if (pageNo >= 1) pageNo = pageNo - 1;
    const pagedURL = `${CreditorEndpoints.GET_ALL_CREDITORS_URL}?pageNo=${pageNo}&pageSize=${pageSize}`;
    const response = await this.api.get<CreditorResponseData>(pagedURL);
    return response.data;
  }

  async fetchSingleCreditor(creditorID?: string) {
    if (creditorID) {
      const response = await this.api.get(
        CreditorEndpoints.GET_ONE_CREDITOR_URL + "/" + creditorID
      );

      return response.data;
    }
  }

  async createCreditor(creditor: Creditor): Promise<Creditor> {
    const response = await this.api.post(
      CreditorEndpoints.CREATE_CREDITOR_URL,
      creditor
    );
    return response.data;
  }

  async getCreditorTransactions(creditorID?: string) {
    const response = await this.api.get(
      CreditorEndpoints.GET_CREDITOR_TRANSACTIONS_URL + "/" + creditorID
    );
    return response.data;
  }

  async createCreditorTransaction(creditorTransaction : any): Promise<CreditorTransaction>{
    
    const response = await this.api.post(
      CreditorEndpoints.CREATE_CREDITOR_TRANSACTIONS_URL,
      creditorTransaction
    );
    return response.data;
  }
}

export default CreditorAPI;
