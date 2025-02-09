import { CreditorResponseData } from "@/types/creditor/creditorTypes";
import { CreditorInvoiceEndpoints } from "./creditorInvoiceEndpoints";
import { AxiosInstance } from "axios";

// const DEFAULT_PAGE_SIZE = 10;

class CreditorInvoiceAPI {
  private api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async fetchCreditors(
    pageNo: number = 0,
    searchQuery: string = "",
    pageSize: number = 10,
  ): Promise<CreditorResponseData> {
    if (pageNo >= 1) pageNo = pageNo - 1;
    const pagedURL = `${CreditorInvoiceEndpoints.GET_ALL_CREDITORS_URL}?pageNo=${pageNo}&pageSize=${pageSize}&query=${searchQuery}`;
    const response = await this.api.get<CreditorResponseData>(pagedURL);
    return response.data;
  }
}

export default CreditorInvoiceAPI;
