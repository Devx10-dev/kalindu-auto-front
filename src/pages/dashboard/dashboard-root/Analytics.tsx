import PageHeader from "@/components/card/PageHeader";
import InvoiceIcon from "@/components/icon/InvoiceIcon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { calculateTotalSummary, currencyAmountString } from "@/utils/analyticsUtils";
import { TotalSummary } from "@/types/salesAndExpenses/saleAndExpenseTypes";
import { useToast } from "@/components/ui/use-toast";
import {  useCacheStore, useTotalSummaryStore } from "./context/AnalyticsState";
import { set } from "date-fns";
export function Analytics() {
  //   active tab state
  const [activeTab, setActiveTab] = useState<string>("today");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [analiticalRange, setAnaliticalRange] = useState<AnalyticalRange | undefined>({
    dateRange: {
      from: undefined,
      to: undefined,
    },
    rates: [],
    defaultRate: "",
  });

  const [salesAndExpenses, setSalesAndExpenses] = useState<TotalSummary | undefined>();


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


  //   const { creditInvoicesStore, setCreditInvoicesStore } =
  //     useCreditInvoiceListStore();

  //   const handleFilterClick = () => {
  //     // set form date and to date
  //     if (dateRange) {
  //       setFromDate(dateRange.from);
  //       setToDate(dateRange.to);
  //     }
  //   };

  //   const handleResetClick = () => {
  //     // reset date range
  //     setDateRange({
  //       from: undefined,
  //       to: undefined,
  //     });
  //     // reset date
  //     setFromDate(undefined);
  //     setToDate(undefined);

  //     // reset search
  //     setSearch("");
  //   };

    const axiosPrivate = useAxiosPrivate();
    const salesAndExpenceService = new SaleAndExpenseService(axiosPrivate);

    const {
      data: salesAndExpensesData,
      isLoading: salesAndExpensesLoading,
      error: salesAndExpensesError,
    } = useQuery<any[]>({
      queryKey: [
        "salesAndExpenses",
        dateRange,
      ],
      queryFn: () =>
        salesAndExpenceService.fetchSalesAndExpensesForDateRange(
          {
            fromDate: dateRange?.from ? dateToString(dateRange.from) : undefined,
            toDate: dateRange?.to ? dateToString(dateRange.to) : undefined,
          },
        ),
      enabled: (dateRange?.from || dateRange?.to) ? true : false,
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

  //   useEffect(() => {
  //     if (cashInvoiceData?.invoices?.length > 0) {
  //       setCashInvoicesStore(cashInvoiceData.invoices);
  //     }
  //   }, [cashInvoiceData, cashInvoicesStore, setCashInvoicesStore]);

  //   useEffect(() => {
  //     if (creditInvoiceData?.invoices?.length > 0) {
  //       setCreditInvoicesStore(creditInvoiceData.invoices);
  //     }
  //   }, [creditInvoiceData, creditInvoicesStore, setCreditInvoicesStore]);

  //   // on tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    console.log(tab);
  };

  useEffect(() => {
    console.log("ACTIVE TAB", activeTab);
    const range = getAnalyticalRange({ range: activeTab });
    setAnaliticalRange(range);
    console.log("RANGE", range);
  }
  , [activeTab]);

  useEffect(() => {
    if(analiticalRange.dateRange){
      setDateRange(analiticalRange.dateRange);
    }
  }
  , [analiticalRange]);

  useEffect(() => {
    console.log("DATE RANGE", dateRange);
  }
  , [dateRange]);

  useEffect(() => {
    if (!salesAndExpensesLoading && salesAndExpensesData) {
      switch (activeTab) {
        case "today":
          setTodaySummary(calculateTotalSummary(salesAndExpensesData));
          setTodaySummaryCache(salesAndExpensesData);
          break;
        case "week":
          setWeekSummary(calculateTotalSummary(salesAndExpensesData));
          setWeekSummaryCache(salesAndExpensesData);
          break;
        case "month":
          setMonthSummary(calculateTotalSummary(salesAndExpensesData));
          setMonthSummaryCache(salesAndExpensesData);
          break;
        case "year":
          setYearlySummary(calculateTotalSummary(salesAndExpensesData));
          setYearlySummaryCache(salesAndExpensesData);
          console.log("YEAR", yearSummary);
          break;
        case "custom":
          setCustomSummary(calculateTotalSummary(salesAndExpensesData));
          setCustomSummaryCache(salesAndExpensesData);
          break;
        default:
          break;
      }
    }
  }
  , [salesAndExpensesData, salesAndExpensesLoading, activeTab, setTodaySummary, setWeekSummary, setMonthSummary, setYearlySummary, setCustomSummary]);

  useEffect(() => {
    switch (activeTab) {
      case "today":
        setSalesAndExpenses(todaySummary);
        break;
      case "week":
        setSalesAndExpenses(weekSummary);
        console.log("WEEKe", salesAndExpenses);
        console.log("WEEK", weekSummary);
        break;
      case "month":
        setSalesAndExpenses(monthSummary);
        break;
      case "year":
        setSalesAndExpenses(yearSummary);
        break;
      case "custom":
        setSalesAndExpenses(customSummary);
        break;
      default:
        break;
    }
  }
  , [activeTab, todaySummary, weekSummary, monthSummary, yearSummary, customSummary]);




  //   useEffect(() => {
  //     if (creditInvoiceData) {
  //       console.log("CREDITTTTTTTT", creditInvoiceData);
  //     }
  //   }, [creditInvoiceData]);

  return (
    <Fragment>
        <div className="flex justify-between items-center">
          {/* <h1 className="text-2xl font-semibold">View Invoices</h1> */}
          <CardHeader>
            <PageHeader
              title="Analytics"
              description=""
              icon={<LayoutDashboard />}
            />
            <CardDescription>
              <p className="text-sm text-muted-foreground">
                Welcome to the Kalindu Auto Dashboard
              </p>
            </CardDescription>
          </CardHeader>
          <div className="flex gap-2 justify-end">
            <DateRangePicker  
              // dateRange={dateRange}
              // setDateRange={setDateRange}
              externalDateRange={dateRange}
              disabled={true}
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
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 ml-5">
          <DashboardCard
            title="Total Revenue"
            icon={<DollarSign />}
            content={ salesAndExpenses?.totalRevenueString }
            // isLoading={salesAndExpensesLoading}
          />
          <DashboardCard
            title="Total Sales"
            icon={<TrendingUp />}
            content={ salesAndExpenses?.totalSalesString }
            isLoading={salesAndExpensesLoading}
          />
          <DashboardCard
            title="Total Expenses"
            icon={<TrendingDown />}
            content={ salesAndExpenses?.totalExpensesString }
            isLoading={salesAndExpensesLoading}
          />
          <DashboardCard
            title="Total Credit"
            icon={<CreditCard />}
            content="Rs. 100,000"
            isLoading={salesAndExpensesLoading}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-1 md:gap-8 lg:grid-cols-5 ml-5 mt-5">
          <OverviewChart className="col-span-3" analyticalRange={analiticalRange} />
          <div className="col-span-2">
            <Card x-chunk="dashboard-01-chunk-5">
              <CardHeader>
                <CardTitle>Creditors</CardTitle>
                <CardDescription>Latest due and overdue creditors</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-8">
                <div className="flex items-center gap-4">
                  <Avatar className="hidden h-9 w-9 sm:flex">
                    <AvatarImage src="https://avatar.iran.liara.run/username?username=olivia+martin" alt="Avatar" />
                    <AvatarFallback>OM</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">
                      Olivia Martin
                    </p>
                    <p className="text-sm text-muted-foreground">
                      0716748593
                    </p>
                  </div>
                  <div className="ml-auto font-medium">+$1,999.00</div>
                </div>
                <div className="flex items-center gap-4">
                  <Avatar className="hidden h-9 w-9 sm:flex">
                    <AvatarImage src="https://avatar.iran.liara.run/username?username=jackson+lee" alt="Avatar" />
                    <AvatarFallback>JL</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">
                      Jackson Lee
                    </p>
                    <p className="text-sm text-muted-foreground">
                      0716748593
                    </p>
                  </div>
                  <div className="ml-auto font-medium">+$39.00</div>
                </div>
                <div className="flex items-center gap-4">
                  <Avatar className="hidden h-9 w-9 sm:flex">
                    <AvatarImage src="https://avatar.iran.liara.run/username?username=isabella+nguyen" alt="Avatar" />
                    <AvatarFallback>IN</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">
                      Isabella Nguyen
                    </p>
                    <p className="text-sm text-muted-foreground">
                      0716748593
                    </p>
                  </div>
                  <div className="ml-auto font-medium">+$299.00</div>
                </div>
                <div className="flex items-center gap-4">
                  <Avatar className="hidden h-9 w-9 sm:flex">
                    <AvatarImage src="https://avatar.iran.liara.run/username?username=william+kim" alt="Avatar" />
                    <AvatarFallback>WK</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">
                      William Kim
                    </p>
                    <p className="text-sm text-muted-foreground">
                      0776374859
                    </p>
                  </div>
                  <div className="ml-auto font-medium">+$99.00</div>
                </div>
                <div className="flex items-center gap-4">
                  <Avatar className="hidden h-9 w-9 sm:flex">
                    <AvatarImage src="https://avatar.iran.liara.run/username?username=sofia+davis&color=3498db&background=f0f0f0" alt="Avatar" />
                    <AvatarFallback>SD</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">
                      Sofia Davis
                    </p>
                    <p className="text-sm text-muted-foreground">
                      0748596374
                    </p>
                  </div>
                  <div className="ml-auto font-medium">+$39.00</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* <TabsContent value="cash">
          
        </TabsContent>
        <TabsContent value="creditor">
          
        </TabsContent>
        <TabsContent value="dummy">
         
        </TabsContent> */}
    </Fragment>
  );
}
