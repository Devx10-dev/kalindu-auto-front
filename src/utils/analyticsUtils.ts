import {
  DailySummery,
  MonthlySummary,
  TotalSummary,
  WeeklySummary,
  YearlySummary,
} from "@/types/salesAndExpenses/saleAndExpenseTypes";

function currencyAmountString(amount: number, currency: string = "Rs") {
  //   comma seperated amount with 2 decimanls
  return `${currency}. ${amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
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

function processWeeklyData(dailySummaries: DailySummery[]): WeeklySummary[] {
  const weekMap = new Map<string, WeeklySummary>();

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
        salesCount: 0,
        expensesCount: 0,
      });
    }

    const weekSummary = weekMap.get(weekYear)!;
    weekSummary.totalSales += summary.salesAmount;
    weekSummary.totalExpenses += summary.expensesAmount;
    weekSummary.salesCount += summary.sales.length;
    weekSummary.expensesCount += summary.expenses.length;
    weekSummary.startDate = new Date(
      Math.min(weekSummary.startDate.getTime(), date.getTime()),
    );
    weekSummary.endDate = new Date(
      Math.max(weekSummary.endDate.getTime(), date.getTime()),
    );
  });

  return Array.from(weekMap.values());
}

function processMonthlyData(dailySummaries: DailySummery[]): MonthlySummary[] {
  const monthMap = new Map<string, MonthlySummary>();

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
        salesCount: 0,
        expensesCount: 0,
      });
    }

    const monthSummary = monthMap.get(monthYear)!;
    monthSummary.totalSales += summary.salesAmount;
    monthSummary.totalExpenses += summary.expensesAmount;
    monthSummary.salesCount += summary.sales.length;
    monthSummary.expensesCount += summary.expenses.length;
  });

  return Array.from(monthMap.values());
}

function processYearlyData(dailySummaries: DailySummery[]): YearlySummary[] {
  const yearMap = new Map<number, YearlySummary>();

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
        salesCount: 0,
        expensesCount: 0,
      });
    }

    const yearSummary = yearMap.get(year)!;
    yearSummary.totalSales += summary.salesAmount;
    yearSummary.totalExpenses += summary.expensesAmount;
    yearSummary.salesCount += summary.sales.length;
    yearSummary.expensesCount += summary.expenses.length;
  });

  return Array.from(yearMap.values());
}

function calculateTotalSummary(dailySummaries: DailySummery[]): TotalSummary {
  if (dailySummaries.length === 0) {
    return {
      totalRevenue: 0,
      totalSales: 0,
      totalExpenses: 0,
      salesCount: 0,
      expensesCount: 0,
      startDate: new Date(),
      endDate: new Date(),
      totalExpensesString: currencyAmountString(0),
      totalRevenueString: currencyAmountString(0),
      totalSalesString: currencyAmountString(0),
    };
  }

  let totalRevenue = 0;
  let totalSales = 0;
  let totalExpenses = 0;
  let salesCount = 0;
  let expensesCount = 0;

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

    totalSales += summary.salesAmount;
    totalExpenses += summary.expensesAmount;
    salesCount += summary.sales.length;
    expensesCount += summary.expenses.length;
  });

  totalRevenue = totalSales - totalExpenses;
  const totalRevenueString = currencyAmountString(totalRevenue);
  const totalSalesString = currencyAmountString(totalSales);
  const totalExpensesString = currencyAmountString(totalExpenses);

  return {
    totalRevenue,
    totalSales,
    totalExpenses,
    salesCount,
    expensesCount,
    startDate,
    endDate,
    totalRevenueString,
    totalSalesString,
    totalExpensesString,
  };
}

export {
  currencyAmountString,
  getWeekNumber,
  processWeeklyData,
  processMonthlyData,
  processYearlyData,
  calculateTotalSummary,
};
