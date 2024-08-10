import exp from "constants";
import { To } from "react-router-dom";

export interface Category {
  id?: number;
  name: string;
}

export interface Field {
  id?: number;
  name: string;
  category?: Category;
}

export type FinancialRecordType =
  | "SALE"
  | "EXPENSE"
  | "CREDIT_BALANCE"
  | "UNSETTLED_CHEQUE_BALANCE";

export interface FinancialRecord {
  id?: number;
  amount: number;
  reason: string;
  dateTime?: number[];
  date: string;
  field: Field;
  type: FinancialRecordType;
}

export interface DailySummery {
  id?: number;
  saleAmount: number;
  expenseAmount: number;
  creditBalance: number;
  unsettledChequeAmount: number;
  date: string;
  verified: boolean;
  financialRecords: FinancialRecord[];
}

interface TimeBasedSummary {
  startDate: Date;
  endDate: Date;
  totalSales: number;
  totalExpenses: number;
  salesCount: number;
  expensesCount: number;
}

interface WeeklySummary extends TimeBasedSummary {}
interface MonthlySummary extends TimeBasedSummary {}
interface YearlySummary extends TimeBasedSummary {}

interface TotalSummary {
  totalRevenue: number;
  totalSales: number;
  totalExpenses: number;
  salesCount: number;
  expensesCount: number;
  startDate: Date;
  endDate: Date;
  totalRevenueString?: string;
  totalSalesString?: string;
  totalExpensesString?: string;
}

interface Summary {
  todaySummary: TotalSummary;
  weekSummary: TotalSummary;
  monthSummary: TotalSummary;
  yearSummary: TotalSummary;
  customSummary: TotalSummary;

  setTodaySummary: (summary: TotalSummary) => void;
  setWeekSummary: (summary: TotalSummary) => void;
  setMonthSummary: (summary: TotalSummary) => void;
  setYearlySummary: (summary: TotalSummary) => void;
  setCustomSummary: (summary: TotalSummary) => void;
}

interface AnalyticsCacheState {
  todaySummaryCache: DailySummery[];
  weekSummaryCache: DailySummery[];
  monthSummaryCache: DailySummery[];
  yearSummaryCache: DailySummery[];
  customSummaryCache: DailySummery[];

  setTodaySummaryCache: (summary: DailySummery[]) => void;
  setWeekSummaryCache: (summary: DailySummery[]) => void;
  setMonthSummaryCache: (summary: DailySummery[]) => void;
  setYearlySummaryCache: (summary: DailySummery[]) => void;
  setCustomSummaryCache: (summary: DailySummery[]) => void;
}
