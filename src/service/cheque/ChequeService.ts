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
  ): Promise<ChequeResponseData> {
    try {
      const response = await this.api.get<ChequeResponseData>(
        `${CHEQUE_URL}/${pageNo}/${pageSize}/${creditorId}`,
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
}

export { ChequeService };
