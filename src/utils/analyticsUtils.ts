import {
  DailySummaryTimeBased,
  DailySummery,
  MonthlySummary,
  TotalSummary,
  WeeklySummary,
  YearlySummary,
} from "@/types/salesAndExpenses/saleAndExpenseTypes";
import { DateRange } from "react-day-picker";

function currencyAmountString(amount: number, currency: string = "Rs") {
  //   comma seperated amount with currency WITH 2 DECIMAL PLACES.
  return `${currency}. ${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
}

function getWeekNumber(date: Date): number {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function processDailyData(dailySummaries: DailySummery[], dateRange: DateRange): DailySummaryTimeBased[] {
  const dailySummariesMap = new Map<string, DailySummaryTimeBased>();
  
  // Prepare DailySummary from dateRange
  const startDate = new Date(dateRange.from);
  const endDate = new Date(dateRange.to);
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const date = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
    dailySummariesMap.set(date, {
      startDate: new Date(currentDate),
      endDate: new Date(currentDate),
      totalSales: 0,
      totalExpenses: 0,
      totalCredit: 0,
      salesCount: 0,
      expensesCount: 0,
      // DATE MONTH AND YEAR as x-axis label
      xlabel: `${currentDate.getDate()} ${currentDate.toLocaleString("default", { month: "short" })}`,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  dailySummaries.forEach((summary) => {
    const date = `${summary.date[0]}-${summary.date[1]}-${summary.date[2]}`;
    if (!dailySummariesMap.has(date)) {
      dailySummariesMap.set(date, {
        startDate: new Date(
          parseInt(summary.date[0]),
          parseInt(summary.date[1]) - 1,
          parseInt(summary.date[2]),
        ),
        endDate: new Date(
          parseInt(summary.date[0]),
          parseInt(summary.date[1]) - 1,
          parseInt(summary.date[2]),
        ),
        totalSales: 0,
        totalExpenses: 0,
        totalCredit: 0,
        salesCount: 0,
        expensesCount: 0,
      });
    }

    const dailySummary = dailySummariesMap.get(date)!;
    dailySummary.totalSales += summary.saleAmount;
    dailySummary.totalExpenses += summary.expenseAmount;
    dailySummary.totalCredit += summary.creditBalance;
    dailySummary.salesCount += summary.financialRecords.filter(record => record.type === "SALE").length;
    dailySummary.expensesCount += summary.financialRecords.filter(record => record.type === "EXPENSE").length;
  });

  return Array.from(dailySummariesMap.values());
}

function processWeeklyData(
  dailySummaries: DailySummery[],
  dateRange: DateRange,
): WeeklySummary[] {
  const weekMap = new Map<string, WeeklySummary>();

  // Prepare WeeklySummary from dateRange; week should start from Monday
  const startDate = new Date(dateRange.from);
  const endDate = new Date(dateRange.to);
  const currentDate = new Date(startDate);

  // Adjust start date to the previous Monday if it isn't already a Monday
  if (currentDate.getDay() !== 1) {
    const dayOffset = (currentDate.getDay() + 6) % 7; // Days to subtract to reach previous Monday
    currentDate.setDate(currentDate.getDate() - dayOffset);
  }

  while (currentDate <= endDate) {
    const weekYear = `${currentDate.getFullYear()}-${getWeekNumber(currentDate)}`;
    weekMap.set(weekYear, {
      startDate: new Date(currentDate),
      // End date is the following Sunday at 11:59:59 PM
      endDate: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() + 6,
        23,
        59,
        59,
      ),
      totalSales: 0,
      totalExpenses: 0,
      totalCredit: 0,
      salesCount: 0,
      expensesCount: 0,
      // week number as x-axis label
      xlabel: `${getWeekNumber(currentDate)}`,
    });
    currentDate.setDate(currentDate.getDate() + 7);
  }

  dailySummaries.forEach((summary) => {
    const date = new Date(
      parseInt(summary.date[0]),
      parseInt(summary.date[1]) - 1,
      parseInt(summary.date[2]),
    );
    const weekYear = `${date.getFullYear()}-${getWeekNumber(date)}`;

    if (!weekMap.has(weekYear)) {
      weekMap.set(weekYear, {
        startDate: new Date(date),
        endDate: new Date(date),
        totalSales: 0,
        totalExpenses: 0,
        totalCredit: 0,
        salesCount: 0,
        expensesCount: 0,
      });
    }

    const weekSummary = weekMap.get(weekYear)!;
    weekSummary.totalSales += summary.saleAmount;
    weekSummary.totalExpenses += summary.expenseAmount;
    weekSummary.totalCredit += summary.creditBalance;
    weekSummary.salesCount += summary.financialRecords.filter(record => record.type === "SALE").length;
    weekSummary.expensesCount += summary.financialRecords.filter(record => record.type === "EXPENSE").length;
  });

  return Array.from(weekMap.values());
}

function processMonthlyData(
  dailySummaries: DailySummery[],
  dateRange: DateRange,
): MonthlySummary[] {
  const monthMap = new Map<string, MonthlySummary>();

  console.log("HEREEEE",dailySummaries);
  // prpare MonthlySummar from dateRange
  const startDate = new Date(dateRange.from);
  const endDate = new Date(dateRange.to);
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const monthYear = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`;
    monthMap.set(monthYear, {
      startDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      endDate: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0,
      ),
      totalSales: 0,
      totalExpenses: 0,
      totalCredit: 0,
      salesCount: 0,
      expensesCount: 0,
      xlabel: `${currentDate.toLocaleString("default", { month: "short" })} ${currentDate.getFullYear()}`,
    });
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  dailySummaries.forEach((summary) => {
    const date = new Date(
      parseInt(summary.date[0]),
      parseInt(summary.date[1]) - 1,
      parseInt(summary.date[2]),
    );
    const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;

    if (!monthMap.has(monthYear)) {
      monthMap.set(monthYear, {
        startDate: new Date(date.getFullYear(), date.getMonth(), 1),
        endDate: new Date(date.getFullYear(), date.getMonth() + 1, 0),
        totalSales: 0,
        totalExpenses: 0,
        totalCredit: 0,
        salesCount: 0,
        expensesCount: 0,
      });
    }

    const monthSummary = monthMap.get(monthYear)!;
    monthSummary.totalSales += summary.saleAmount;
    monthSummary.totalExpenses += summary.expenseAmount;
    monthSummary.totalCredit += summary.creditBalance;
    monthSummary.salesCount += summary.financialRecords.filter(record => record.type === "SALE").length;
    monthSummary.expensesCount += summary.financialRecords.filter(record => record.type === "EXPENSE").length;
  });

  return Array.from(monthMap.values());
}

function processYearlyData(
  dailySummaries: DailySummery[],
  dateRange: DateRange,
): YearlySummary[] {
  const yearMap = new Map<number, YearlySummary>();

  // prpare YearlySummar from dateRange
  const startDate = new Date(dateRange.from);
  const endDate = new Date(dateRange.to);
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const year = currentDate.getFullYear();
    yearMap.set(year, {
      startDate: new Date(year, 0, 1),
      endDate: new Date(year, 11, 31),
      totalSales: 0,
      totalExpenses: 0,
      totalCredit: 0,
      salesCount: 0,
      expensesCount: 0,
      xlabel: `${currentDate.getFullYear()}`,
    });
    currentDate.setFullYear(currentDate.getFullYear() + 1);
  }

  dailySummaries.forEach((summary) => {
    const date = new Date(
      parseInt(summary.date[0]),
      parseInt(summary.date[1]) - 1,
      parseInt(summary.date[2]),
    );
    const year = date.getFullYear();

    if (!yearMap.has(year)) {
      yearMap.set(year, {
        startDate: new Date(year, 0, 1),
        endDate: new Date(year, 11, 31),
        totalSales: 0,
        totalExpenses: 0,
        totalCredit: 0,
        salesCount: 0,
        expensesCount: 0,
      });
    }

    const yearSummary = yearMap.get(year)!;
    yearSummary.totalSales += summary.saleAmount;
    yearSummary.totalExpenses += summary.expenseAmount;
    yearSummary.totalCredit += summary.creditBalance;
    yearSummary.salesCount += summary.financialRecords.filter(record => record.type === "SALE").length;
    yearSummary.expensesCount += summary.financialRecords.filter(record => record.type === "EXPENSE").length;
  });

  return Array.from(yearMap.values());
}

function calculateTotalSummary(dailySummaries: DailySummery[]): TotalSummary {
  if (dailySummaries.length === 0) {
    return {
      totalRevenue: 0,
      totalSales: 0,
      totalExpenses: 0,
      totalCredit: 0,
      salesCount: 0,
      expensesCount: 0,
      creditCount: 0,
      startDate: new Date(),
      endDate: new Date(),
      totalRevenueString: currencyAmountString(0),
      totalSalesString: currencyAmountString(0),
      totalExpensesString: currencyAmountString(0),
      totalCreditString: currencyAmountString(0),
    };
  }

  let totalRevenue = 0;
  let totalSales = 0;
  let totalExpenses = 0;
  let totalCredit = 0;
  let salesCount = 0;
  let expensesCount = 0;
  let creditCount = 0;

  // Initialize start and end dates with the first summary's date
  let startDate = new Date(
    parseInt(dailySummaries[0].date[0]),
    parseInt(dailySummaries[0].date[1]) - 1,
    parseInt(dailySummaries[0].date[2]),
  );
  let endDate = new Date(startDate);

  dailySummaries.forEach((summary) => {
    const currentDate = new Date(
      parseInt(summary.date[0]),
      parseInt(summary.date[1]) - 1,
      parseInt(summary.date[2]),
    );

    // Update start and end dates
    if (currentDate < startDate) startDate = currentDate;
    if (currentDate > endDate) endDate = currentDate;


    totalSales += summary.saleAmount;
    totalExpenses += summary.expenseAmount;
    totalCredit += summary.creditBalance;
    salesCount += summary.financialRecords.filter(record => record.type === "SALE").length;
    expensesCount += summary.financialRecords.filter(record => record.type === "EXPENSE").length;
    creditCount += summary.financialRecords.filter(record => record.type === "CREDIT_BALANCE").length;
  });

  totalRevenue = totalSales - totalExpenses;
  const totalRevenueString = currencyAmountString(totalRevenue);
  const totalSalesString = currencyAmountString(totalSales);
  const totalExpensesString = currencyAmountString(totalExpenses);
  const totalCreditString = currencyAmountString(totalCredit);

  return {
    totalRevenue,
    totalSales,
    totalExpenses,
    totalCredit,
    salesCount,
    expensesCount,
    creditCount,
    startDate,
    endDate,
    totalRevenueString,
    totalSalesString,
    totalExpensesString,
    totalCreditString,
  };
}

export {
  currencyAmountString,
  getWeekNumber,
  processDailyData,
  processWeeklyData,
  processMonthlyData,
  processYearlyData,
  calculateTotalSummary,
};
