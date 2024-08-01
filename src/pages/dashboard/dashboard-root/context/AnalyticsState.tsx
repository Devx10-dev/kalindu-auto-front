import { AnalyticsCacheState, DailySummery, Summary, TotalSummary } from "@/types/salesAndExpenses/saleAndExpenseTypes";
import {create} from "zustand";



const useTotalSummaryStore = create<Summary>((set, get) => ({
  todaySummary: {
    endDate: new Date(),
    salesCount: 0,
    totalExpenses: 0,
    totalRevenue: 0,
    totalSales: 0,
    startDate: new Date(),
    expensesCount: 0,
    totalExpensesString: "",
    totalRevenueString: "",
    totalSalesString: "",
  },
  weekSummary: {
    endDate: new Date(),
    salesCount: 0,
    totalExpenses: 0,
    totalRevenue: 0,
    totalSales: 0,
    startDate: new Date(),
    expensesCount: 0,
    totalExpensesString: "",
    totalRevenueString: "",
    totalSalesString: "",
  },
  monthSummary: {
    endDate: new Date(),
    salesCount: 0,
    totalExpenses: 0,
    totalRevenue: 0,
    totalSales: 0,
    startDate: new Date(),
    expensesCount: 0,
    totalExpensesString: "",
    totalRevenueString: "",
    totalSalesString: "",
  },
  yearSummary: {
    endDate: new Date(),
    salesCount: 0,
    totalExpenses: 0,
    totalRevenue: 0,
    totalSales: 0,
    startDate: new Date(),
    expensesCount: 0,
    totalExpensesString: "",
    totalRevenueString: "",
    totalSalesString: "",
  },
  customSummary: {
    endDate: new Date(),
    salesCount: 0,
    totalExpenses: 0,
    totalRevenue: 0,
    totalSales: 0,
    startDate: new Date(),
    expensesCount: 0,
    totalExpensesString: "",
    totalRevenueString: "",
    totalSalesString: "",
  },

  setTodaySummary: (summary: TotalSummary) => {
    set({ todaySummary: summary });
  },
  setWeekSummary: (summary: TotalSummary) => {
    set({ weekSummary: summary });
  },
  setMonthSummary: (summary: TotalSummary) => {
    set({ monthSummary: summary });
  },
  setYearlySummary: (summary: TotalSummary) => {
    set({ yearSummary: summary });
  },
  setCustomSummary: (summary: TotalSummary) => {
    set({ customSummary: summary });
  },
}));


const useCacheStore = create<AnalyticsCacheState>((set, get) => ({
  todaySummaryCache: [],
  weekSummaryCache: [],
  monthSummaryCache: [],
  yearSummaryCache: [],
  customSummaryCache: [],

  setTodaySummaryCache: (summary: DailySummery[]) => {
    set({ todaySummaryCache: summary });
  },
  setWeekSummaryCache: (summary: DailySummery[]) => {
    set({ weekSummaryCache: summary });
  },
  setMonthSummaryCache: (summary: DailySummery[]) => {
    set({ monthSummaryCache: summary });
  },
  setYearlySummaryCache: (summary: DailySummery[]) => {
    set({ yearSummaryCache: summary });
  },
  setCustomSummaryCache: (summary: DailySummery[]) => {
    set({ customSummaryCache: summary });
  },
}));

export { useTotalSummaryStore, useCacheStore };