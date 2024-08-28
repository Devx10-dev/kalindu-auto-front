import {
  Category,
  DailySummery,
  Field,
  FinancialRecord,
} from "@/types/salesAndExpenses/saleAndExpenseTypes";
import { AxiosInstance } from "axios";
import { Service } from "../apiService";
import { DateRange } from "react-day-picker";
import { OverdueCreditors } from "@/types/creditor/creditorTypes";

// const SALE_AND_EXPENSE_URL = "sale-expense";
// const CATEGORY_URL = `${SALE_AND_EXPENSE_URL}/category`;
// const FIELD_URL = `${SALE_AND_EXPENSE_URL}/field`;
// const SALE_URL = "/fin-record";
// const DAILY_SUMMERY_URL = `${SALE_AND_EXPENSE_URL}/summery`;
// const DAILY_SALES_AND_EXPENSES_VERIFY_URL = `${SALE_AND_EXPENSE_URL}/verify`;
const OVERDUE_CREDITOR_URL = "creditor/overdue/all"

class CreditorsService extends Service {
  constructor(api: AxiosInstance) {
    super(api);
  }

  // async fetchSalesAndExpensesForDateRange({
  //   fromDate,
  //   toDate,
  // }: {
  //   fromDate: string | undefined;
  //   toDate: string | undefined;
  // }): Promise<DailySummery[]> {
  //   try {
  //     const response = await this.api.get(
  //       `${SALE_AND_EXPENSE_URL}/summary/${fromDate == undefined ? null : fromDate}/${toDate == undefined ? null : toDate}`,
  //     );
  //     return response.data;
  //   } catch (error) {
  //     throw new Error("Failed to fetch sales and expenses");
  //   }
  // }

  async fetchOverdueCreditors(): Promise<OverdueCreditors[]> {
    try {
      const response = await this.api.get<OverdueCreditors[]>(OVERDUE_CREDITOR_URL);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch overdue creditors");
    }
  }
}

export { CreditorsService };
