import { CreditorResponseData } from "@/types/creditor/creditorTypes";
import { CreditorInvoiceEndpoints } from "./creditorInvoiceEndpoints";
import { AxiosInstance } from "axios";
import { InvoiceState } from "@/types/invoice/creditorInvoice";

// const DEFAULT_PAGE_SIZE = 10;

class CreditorInvoiceAPI {
  private api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async fetchCreditors(
    pageNo: number = 0,
    pageSize: number = 10
  ): Promise<CreditorResponseData> {
    if (pageNo >= 1) pageNo = pageNo - 1;
    const pagedURL = `${CreditorInvoiceEndpoints.GET_ALL_CREDITORS_URL}?pageNo=${pageNo}&pageSize=${pageSize}`;
    const response = await this.api.get<CreditorResponseData>(pagedURL);
    return response.data;
  }

  async saveInvoice(invoiceState : InvoiceState){
    // TODO : create other data items
    const backendRequest = {
      creditorID : invoiceState.creditorID
    }

    // TODO send API call
    console.log(backendRequest);
    
  }
}

export default CreditorInvoiceAPI;
