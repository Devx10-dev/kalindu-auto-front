import PageHeader from "@/components/card/PageHeader";
import InvoiceIcon from "@/components/icon/InvoiceIcon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import {
  Activity,
  CreditCard,
  DollarSign,
  History,
  HomeIcon,
  LayoutDashboard,
  LucideHome,
  SquareLibrary,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import DashboardCard from "./components/DashboardCard";
import OverviewChart from "./components/OverviewChart";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { DateRangePicker } from "../invoice/view-invoices/components/DateRangePicker";
import { DateRange } from "react-day-picker";
import { getAnalyticalRange } from "@/utils/dateRangeUtil";
import { AnalyticalRange } from "@/types/analytics/dateRangeTypes";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import { SaleAndExpenseService } from "@/service/salesAndExpenses/SaleAndExpenseService";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import dateToString from "@/utils/dateToString";
import {
  calculateTotalSummary,
  currencyAmountString,
  processDailyData,
  processMonthlyData,
  processWeeklyData,
  processYearlyData,
} from "@/utils/analyticsUtils";
import {
  DailySummery,
  TotalSummary,
} from "@/types/salesAndExpenses/saleAndExpenseTypes";
import { useToast } from "@/components/ui/use-toast";
import { useCacheStore, useTotalSummaryStore } from "./context/AnalyticsState";
import { set } from "date-fns";
import CreditorCard from "./components/CreditorCard";

export function Analytics() {
  //   active tab state
  const [activeTab, setActiveTab] = useState<string>("today");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [analiticalRange, setAnaliticalRange] = useState<
    AnalyticalRange | undefined
  >({
    dateRange: {
      from: undefined,
      to: undefined,
    },
    rates: [],
    defaultRate: "",
  });

  const [salesAndExpenses, setSalesAndExpenses] = useState<
    TotalSummary | undefined
  >();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [todayDataLoaded, setTodayDataLoaded] = useState(false);
  const [weekDataLoaded, setWeekDataLoaded] = useState(false);
  const [monthDataLoaded, setMonthDataLoaded] = useState(false);
  const [yearDataLoaded, setYearDataLoaded] = useState(false);
  const [customDataLoaded, setCustomDataLoaded] = useState(false);
  const [salesAndExpensesDataState, setSalesAndExpensesDataState] = useState<
    DailySummery[] | undefined
  >();
  const [customActive, setCustomActive] = useState(false);

  const {
    todaySummary,
    weekSummary,
    monthSummary,
    yearSummary,
    customSummary,
    setTodaySummary,
    setWeekSummary,
    setMonthSummary,
    setYearlySummary,
    setCustomSummary,
  } = useTotalSummaryStore();

  const {
    todaySummaryCache,
    weekSummaryCache,
    monthSummaryCache,
    yearSummaryCache,
    customSummaryCache,
    setTodaySummaryCache,
    setWeekSummaryCache,
    setMonthSummaryCache,
    setYearlySummaryCache,
    setCustomSummaryCache,
  } = useCacheStore();

  const axiosPrivate = useAxiosPrivate();
  const salesAndExpenceService = new SaleAndExpenseService(axiosPrivate);

  const {
    data: salesAndExpensesData,
    isLoading: salesAndExpensesLoading,
    error: salesAndExpensesError,
  } = useQuery<DailySummery[], Error>({
    queryKey: ["salesAndExpenses", dateRange],
    queryFn: () =>
      salesAndExpenceService.fetchSalesAndExpensesForDateRange({
        fromDate: dateRange?.from ? dateToString(dateRange.from) : undefined,
        toDate: dateRange?.to ? dateToString(dateRange.to) : undefined,
      }),
    enabled: dateRange?.from || dateRange?.to ? true : false,
  });

  const { toast } = useToast();

  useEffect(() => {
    if (salesAndExpensesError) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Failed to fetch invoices",
        duration: 5000,
      });
    }
  }, [salesAndExpensesError, toast]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    if (activeTab === "custom") {
      setAnaliticalRange({
        dateRange: {
          from: new Date(),
          to: undefined,
        },
        rates: ["daily"],
        defaultRate: "daily",
      });
      return;
    }
    const range = getAnalyticalRange({ range: activeTab });
    setAnaliticalRange(range);
  }, [activeTab]);

  useEffect(() => {
    if (analiticalRange.dateRange) {
      setDateRange(analiticalRange.dateRange);
    }
  }, [analiticalRange]);

  useEffect(() => {
    if (!salesAndExpensesLoading && salesAndExpensesData) {
      const calculatedSummary = calculateTotalSummary(salesAndExpensesData);
      switch (activeTab) {
        case "today":
          setTodaySummary(calculatedSummary);
          setTodaySummaryCache(salesAndExpensesData);
          setTodayDataLoaded(true);
          break;
        case "week":
          setWeekSummary(calculatedSummary);
          setWeekSummaryCache(salesAndExpensesData);
          setWeekDataLoaded(true);
          break;
        case "month":
          setMonthSummary(calculatedSummary);
          setMonthSummaryCache(salesAndExpensesData);
          setMonthDataLoaded(true);
          break;
        case "year":
          setYearlySummary(calculatedSummary);
          setYearlySummaryCache(salesAndExpensesData);
          setYearDataLoaded(true);
          break;
        case "custom":
          setCustomSummary(calculatedSummary);
          setCustomSummaryCache(salesAndExpensesData);
          setCustomDataLoaded(true);
          // setCustomSummaryCache(salesAndExpensesData);
          break;
        default:
          break;
      }
    }
  }, [salesAndExpensesLoading]);

  useEffect(() => {
    if (analiticalRange.dateRange) {
      setDateRange(analiticalRange.dateRange);
    }
  }, [analiticalRange]);

  useEffect(() => {
    if (!salesAndExpensesLoading && salesAndExpensesData) {
      switch (activeTab) {
        case "today":
          // setDataLoaded(prev => ({ ...prev, today: true }));
          setSalesAndExpenses(todaySummary);
          setSalesAndExpensesDataState(todaySummaryCache);
          break;
        case "week":
          // setDataLoaded(prev => ({ ...prev, week: true }));
          setSalesAndExpenses(weekSummary);
          setSalesAndExpensesDataState(weekSummaryCache);
          break;
        case "month":
          // setDataLoaded(prev => ({ ...prev, month: true }));
          setSalesAndExpenses(monthSummary);
          setSalesAndExpensesDataState(monthSummaryCache);
          break;
        case "year":
          // setDataLoaded(prev => ({ ...prev, year: true }));
          setSalesAndExpenses(yearSummary);
          setSalesAndExpensesDataState(yearSummaryCache);
          break;
        case "custom":
          // setDataLoaded(prev => ({ ...prev, custom: true }));
          setSalesAndExpenses(customSummary);
          setSalesAndExpensesDataState(customSummaryCache);
          break;
        default:
          break;
      }
    }
  }, [
    activeTab,
    todaySummary,
    weekSummary,
    monthSummary,
    yearSummary,
    customSummary,
    salesAndExpensesLoading,
    salesAndExpensesData,
  ]);

  useEffect(() => {
    switch (activeTab) {
      case "today":
        setDataLoaded(todayDataLoaded);
        break;
      case "week":
        setDataLoaded(weekDataLoaded);
        break;
      case "month":
        setDataLoaded(monthDataLoaded);
        break;
      case "year":
        setDataLoaded(yearDataLoaded);
        break;
      case "custom":
        setDataLoaded(customDataLoaded);
        break;
      default:
        break;
    }
  }, [
    todayDataLoaded,
    weekDataLoaded,
    monthDataLoaded,
    yearDataLoaded,
    customDataLoaded,
    activeTab,
  ]);

  useEffect(() => {
    console.log("Data Loaded", dataLoaded);
  }, [dataLoaded]);

  return (
    <Fragment>
      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* <h1 className="text-2xl font-semibold">View Invoices</h1> */}
          <CardHeader>
            <PageHeader
              title="Analytics"
              description=""
              icon={<SquareLibrary />}
            />
            <CardDescription>
              <p className="text-sm text-muted-foreground">
                Welcome to Analytics! Here you can view statistics of your sales
                and expenses
              </p>
            </CardDescription>
          </CardHeader>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <DateRangePicker
              dateRange={dateRange}
              setDateRange={setDateRange}
              // externalDateRange={dateRange}
              disabled={activeTab !== "custom"}
            />
            <Tabs
              defaultValue="today"
              className="w-[100%] size-sm"
              onValueChange={handleTabChange}
            >
              <TabsList className="grid w-[100%] grid-cols-5 size-sm">
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="year">Year</TabsTrigger>
                <TabsTrigger value="custom">Custom</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard
            title="Total Revenue"
            icon={<DollarSign />}
            content={salesAndExpenses?.totalRevenueString}
            isLoading={!dataLoaded}
            contentType="currencyAmount"
          />
          <DashboardCard
            title="Total Sales"
            icon={<TrendingUp />}
            content={salesAndExpenses?.totalSalesString}
            isLoading={!dataLoaded}
            contentType="currencyAmount"
          />
          <DashboardCard
            title="Total Expenses"
            icon={<TrendingDown />}
            content={salesAndExpenses?.totalExpensesString}
            isLoading={!dataLoaded}
            contentType="currencyAmount"
          />
          <DashboardCard
            title="Credit Sales"
            icon={<CreditCard />}
            content={salesAndExpenses?.totalCreditString}
            isLoading={!dataLoaded}
            contentType="currencyAmount"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <OverviewChart
            className="col-span-3"
            analyticalRange={analiticalRange}
            analyticData={salesAndExpensesDataState}
            isDataLoading={salesAndExpensesLoading}
          />
          <CreditorCard className="col-span-2 h-400 max-h-[500px]" />
        </div>
      </div>
    </Fragment>
  );
}
