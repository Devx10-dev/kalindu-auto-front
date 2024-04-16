import { ResponseData } from "@/types/component/commonTypes";
import { Creditor, CreditorResponseData } from "@/types/creditor/creditorTypes";
import axios, { AxiosInstance } from "axios";

const GET_ALL_CREDITORS_URL = "/creditor";
const CREATE_CREDITOR_URL = "/creditor/create";

class CreditorService {
  private api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async fetchCreditors(pageNo: number = 0, pageSize: number = 7): Promise<CreditorResponseData> {
    if(pageNo >= 1) pageNo = pageNo - 1;
    let pagedURL = `${GET_ALL_CREDITORS_URL}?pageNo=${pageNo}&pageSize=${pageSize}`;
    console.log(pagedURL);
    const response = await this.api.get<CreditorResponseData>(pagedURL);
    return response.data;
}

  async createCreditor(creditor: Creditor): Promise<Creditor> {
    const response = await this.api.post(CREATE_CREDITOR_URL, creditor);
    return response.data;
  }
}

export default CreditorService;
