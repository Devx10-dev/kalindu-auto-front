import { Cheque, ChequeResponseData } from "@/types/cheque/chequeTypes";
import { AxiosInstance } from "axios";
import { Service } from "../apiService";
import { CreditInvoice } from "@/types/invoice/credit/creditInvoiceTypes";

const CHEQUE_URL = "/cheque";

class ChequeService extends Service {
  constructor(api: AxiosInstance) {
    super(api);
  }

  async fetchCheques(
    pageNo: number,
    pageSize: number,
    creditorId: number,
    search: string = "",
    status: string[] = [],
  ): Promise<ChequeResponseData> {
    try {
      const bothProvided = search !== "" && status.length !== 0;
      const response = await this.api.get<ChequeResponseData>(
        `${CHEQUE_URL}/${pageNo}/${pageSize}/${creditorId}${search != "" || status.length != 0 ? "?" : ""}${search !== "" ? `search=${search}` : ""}${bothProvided ? "&" : ""}${status.length != 0 ? `status=${status.join(",")}` : ""}`,
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch cheques");
    }
  }

  async fetchCreditInvoicesOfCheque(
    chequeId: number,
  ): Promise<CreditInvoice[]> {
    try {
      const response = await this.api.get<CreditInvoice[]>(
        `${CHEQUE_URL}/invoice/${chequeId}`,
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch credit invoices");
    }
  }

  async createCheque(cheque: Cheque): Promise<Cheque> {
    const response = await this.api.post(CHEQUE_URL, cheque);
    return response.data;
  }

  async settleCheque(id: number) {
    const response = await this.api.put(CHEQUE_URL, {
      id: id,
      status: "SETTLED",
    });
  }

  async rejectCheque(id: number) {
    const response = await this.api.put(CHEQUE_URL, {
      id: id,
      status: "REJECTED",
    });
  }

  async fetchNonRedeemChequesOfCreditor(creditorId: number): Promise<Cheque[]> {
    try {
      const response = await this.api.get<Cheque[]>(
        `${CHEQUE_URL}/${creditorId}`,
      );
      console.log(response);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch cheques");
    }
  }
}

export { ChequeService };
