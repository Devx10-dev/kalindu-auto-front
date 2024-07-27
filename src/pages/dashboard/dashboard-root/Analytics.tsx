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

export function Analytics() {
  //   active tab state
  const [activeTab, setActiveTab] = useState<string>("today");
  //   const [search, setSearch] = useState<string>("");
  //   const debouncedSearch = useDebounce(search, 500);
  //   const [dateRange, setDateRange] = useState<DateRange | undefined>({
  //     from: undefined,
  //     to: undefined,
  //   });
  //   const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  //   const [toDate, setToDate] = useState<Date | undefined>(undefined);
  //   const [pageNo, setPageNo] = useState<number>(0);
  //   const [pageSize, setPageSize] = useState<number>(10);
  //   const { cashInvoicesStore, setCashInvoicesStore } = useInvoiceListStore();
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

  //   const axiosPrivate = useAxiosPrivate();
  //   const invoiceService = new CashInvoiceService(axiosPrivate);

  //   const {
  //     data: cashInvoiceData,
  //     isLoading: cashInvoiceLoading,
  //     error: cashInvoiceError,
  //   } = useQuery<InvoiceList>({
  //     queryKey: [
  //       "cashInvoices",
  //       debouncedSearch,
  //       fromDate,
  //       toDate,
  //       pageNo,
  //       pageSize,
  //     ],
  //     queryFn: () =>
  //       invoiceService.fetchCashInvoices(
  //         debouncedSearch,
  //         fromDate ? dateToString(fromDate) : undefined,
  //         toDate ? dateToString(toDate) : undefined,
  //         pageNo,
  //         pageSize,
  //       ),
  //     enabled: activeTab === "cash",
  //   });

  //   const creditInvoiceService = new CreditInvoiceService(axiosPrivate);

  //   const {
  //     data: creditInvoiceData,
  //     isLoading: creditInvoiceLoading,
  //     error: creditInvoiceError,
  //   } = useQuery<CreditorInvoiceList>({
  //     queryKey: [
  //       "creditInvoices",
  //       debouncedSearch,
  //       fromDate,
  //       toDate,
  //       pageNo,
  //       pageSize,
  //     ],
  //     queryFn: () =>
  //       creditInvoiceService.fetchCreditInvoices(
  //         debouncedSearch,
  //         fromDate ? dateToString(fromDate) : undefined,
  //         toDate ? dateToString(toDate) : undefined,
  //         pageNo,
  //         pageSize,
  //       ),
  //     enabled: activeTab === "creditor",
  //   });

  //   const { toast } = useToast();

  //   useEffect(() => {
  //     if (cashInvoiceError) {
  //       toast({
  //         variant: "destructive",
  //         title: "Something went wrong",
  //         description: "Failed to fetch invoices",
  //         duration: 5000,
  //       });
  //     }

  //     if (creditInvoiceError) {
  //       toast({
  //         variant: "destructive",
  //         title: "Something went wrong",
  //         description: "Failed to fetch invoices",
  //         duration: 5000,
  //       });
  //     }
  //   }, [cashInvoiceError, toast]);

  //   if (cashInvoiceError) {
  //     console.log(cashInvoiceError);
  //   }

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

  //   useEffect(() => {
  //     if (creditInvoiceData) {
  //       console.log("CREDITTTTTTTT", creditInvoiceData);
  //     }
  //   }, [creditInvoiceData]);

  return (
    <Fragment>
      
      <Tabs
        defaultValue="cash"
        className="w-[100%]"
        // onValueChange={handleTabChange}
      >
        <div className="flex justify-between items-center">
          {/* <h1 className="text-2xl font-semibold">View Invoices</h1> */}
          <CardHeader>
            <PageHeader
              title="Dashboard"
              description=""
              icon={<LayoutDashboard />}
            />
            <CardDescription>
              <p className="text-sm text-muted-foreground">
                Welcome to the Kalindu Auto Dashboard
              </p>
            </CardDescription>
          </CardHeader>
          <Tabs
            defaultValue="today"
            className="w-[40%] size-sm"
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
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 ml-5">
          <DashboardCard
            title="Total Revenue"
            icon={<DollarSign />}
            content="Rs. 100,000"
          />
          <DashboardCard
            title="Total Sales"
            icon={<TrendingUp />}
            content="Rs. 100,000"
          />
          <DashboardCard
            title="Total Expenses"
            icon={<TrendingDown />}
            content="Rs. 100,000"
          />
          <DashboardCard
            title="Total Credit"
            icon={<CreditCard />}
            content="Rs. 100,000"
          />
        </div>
        <div className="grid gap-4 md:grid-cols-1 md:gap-8 lg:grid-cols-5 ml-5 mt-5">
          <OverviewChart className="col-span-3" />
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
      </Tabs>
    </Fragment>
  );
}
