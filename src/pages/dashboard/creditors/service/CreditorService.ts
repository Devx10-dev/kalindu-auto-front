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

  async fetchCreditors(): Promise<Creditor[]> {
    const response = await this.api.get<Creditor[]>(`${GET_ALL_CREDITORS_URL}`);
    return response.data;
  }

  async createCreditor(creditor: Creditor): Promise<Creditor[]> {
    const response = await this.api.post(CREATE_CREDITOR_URL, creditor);
    return response.data;
  }
}

export default CreditorService;
