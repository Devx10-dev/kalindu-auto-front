import {
  Category,
  DailySummery,
  Field,
  SaleOrExpense,
} from "@/types/salesAndExpenses/saleAndExpenseTypes";
import { AxiosInstance } from "axios";
import { Service } from "../apiService";
import { DateRange } from "react-day-picker";

const SALE_AND_EXPENSE_URL = "sale-expense";
const CATEGORY_URL = `${SALE_AND_EXPENSE_URL}/category`;
const FIELD_URL = `${SALE_AND_EXPENSE_URL}/field`;
const SALE_URL = "/sale";
const EXPENSE_URL = "/expense";
const DAILY_SUMMERY_URL = `${SALE_AND_EXPENSE_URL}/summery`;
const DAILY_SALES_AND_EXPENSES_VERIFY_URL = `${SALE_AND_EXPENSE_URL}/verify`;

class SaleAndExpenseService extends Service {
  constructor(api: AxiosInstance) {
    super(api);
  }

  async fetchCategories(): Promise<Category[]> {
    try {
      const response = await this.api.get<Category[]>(CATEGORY_URL);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch categories");
    }
  }

  async fetchFields(): Promise<Field[]> {
    try {
      const response = await this.api.get<Field[]>(FIELD_URL);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch fields");
    }
  }

  async fetchDailySummery(date: string): Promise<DailySummery> {
    try {
      const response = await this.api.get<DailySummery>(
        `${DAILY_SUMMERY_URL}/${date.trim()}`,
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch fields");
    }
  }

  async createCategory(category: Category): Promise<Category> {
    const response = await this.api.post(CATEGORY_URL, category);
    return response.data;
  }

  async createField(field: Field): Promise<Field> {
    const response = await this.api.post(FIELD_URL, field);
    return response.data;
  }

  async createSaleOrExpense(
    saleOrExpense: SaleOrExpense,
  ): Promise<SaleOrExpense> {
    const response = await this.api.post(
      `${saleOrExpense.expense ? EXPENSE_URL : SALE_URL}`,
      saleOrExpense,
    );
    return response.data;
  }

  async verifyDailySalesAndExpenses(date: string): Promise<DailySummery> {
    const response = await this.api.put(
      `${DAILY_SALES_AND_EXPENSES_VERIFY_URL}/${date}`,
      null,
    );
    return response.data;
  }

  async fetchSalesAndExpensesForDateRange(
    {
      fromDate,
      toDate,
    }
    : {
      fromDate: string | undefined  ;
      toDate: string | undefined;
    },
  ) {
    try {
      const response = await this.api.get(
        `${SALE_AND_EXPENSE_URL}/summary/${fromDate == undefined ? null : fromDate}/${toDate == undefined ? null : toDate}`,
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch sales and expenses");
    }
  }
}

export { SaleAndExpenseService };
