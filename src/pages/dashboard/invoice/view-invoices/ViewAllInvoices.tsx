import PageHeader from "@/components/card/PageHeader";
import InvoiceIcon from "@/components/icon/InvoiceIcon";
import { Button } from "@/components/ui/button";
import { CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import useDebounce from "@/hooks/useDebounce";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import { CashInvoiceService } from "@/service/invoice/cashInvoiceApi";
import { DummyInvoiceService } from "@/service/invoice/dummy/DummyInvoiceService";
import { CreditInvoiceService } from "@/service/invoice/creditInvoiceService";
import { InvoiceList } from "@/types/invoice/cashInvoice";
import { CreditorInvoiceList } from "@/types/invoice/creditorInvoice";
import dateToString from "@/utils/dateToString";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { Fragment } from "react/jsx-runtime";
import CreditInvoiceTable from "./components/CreditInvoiceTable";
import { DateRangePicker } from "./components/DateRangePicker";
import { ErrorPage } from "./components/ErrorPage";
import InvoiceTable from "./components/InvoiceTable";
import {
  useCreditInvoiceListStore,
  useInvoiceListStore,
} from "./context/InvoiceListState";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import { MultiSelect } from "@/components/ui/multi-select";

export function ViewAllInvoices() {
  // active tab state
  const [activeTab, setActiveTab] = useState<string>("cash");
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 500);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [pageNo, setPageNo] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const { cashInvoicesStore, setCashInvoicesStore } = useInvoiceListStore();
  const { creditInvoicesStore, setCreditInvoicesStore } = useCreditInvoiceListStore();
  const [selectedOption, setSelectedOption] = useState<string[]>([]);
  const [statusList, setStatusList] = useState<{ label: string; value: string }[]>([
    { label: "COMPLETED", value: "COMPLETED" }
  ]);

  useEffect(() => {
    if(activeTab === "cash") {
      setStatusList([
        { label: "COMPLETED", value: "COMPLETED" },

      ]);
    } else {
      setStatusList(
        [
          { label: "COMPLETED", value: "COMPLETED" },
          { label: "DUE", value: "DUE" },
          { label: "OVERDUE", value: "OVERDUE" },
        ]
      );
    }
  }, [activeTab]);

  const handleFilterClick = () => {
    // set form date and to date
    if (dateRange) {
      setFromDate(dateRange.from);
      setToDate(dateRange.to);
    }
  };

  const handleResetClick = () => {
    // reset date range
    setDateRange({
      from: undefined,
      to: undefined,
    });
    // reset date
    setFromDate(undefined);
    setToDate(undefined);

    // reset search
    setSearch("");
  };

  const axiosPrivate = useAxiosPrivate();
  const invoiceService = new CashInvoiceService(axiosPrivate);

  const {
    data: cashInvoiceData,
    isLoading: cashInvoiceLoading,
    error: cashInvoiceError,
  } = useQuery<InvoiceList>({
    queryKey: [
      "cashInvoices",
      debouncedSearch,
      fromDate,
      toDate,
      pageNo,
      pageSize,
    ],
    queryFn: () =>
      invoiceService.fetchCashInvoices(
        debouncedSearch,
        fromDate ? dateToString(fromDate) : undefined,
        toDate ? dateToString(toDate) : undefined,
        pageNo,
        pageSize,
      ),
    enabled: activeTab === "cash",
  });


  const creditInvoiceService = new CreditInvoiceService(axiosPrivate);

  const {
    data: creditInvoiceData,
    isLoading: creditInvoiceLoading,
    error: creditInvoiceError,
  } = useQuery<CreditorInvoiceList>({
    queryKey: [
      "creditInvoices",
      debouncedSearch,
      fromDate,
      toDate,
      pageNo,
      pageSize,
    ],
    queryFn: () =>
      creditInvoiceService.fetchCreditInvoices(
        debouncedSearch,
        fromDate ? dateToString(fromDate) : undefined,
        toDate ? dateToString(toDate) : undefined,
        pageNo,
        pageSize,
      ),
    enabled: activeTab === "creditor",
  });

  const { toast } = useToast();

  useEffect(() => {
    if (cashInvoiceError) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Failed to fetch invoices",
        duration: 5000,
      });
    }

    if (creditInvoiceError) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Failed to fetch invoices",
        duration: 5000,
      });
    }
  }, [cashInvoiceError, toast]);

  useEffect(() => {
    if (cashInvoiceData?.invoices?.length > 0) {
      setCashInvoicesStore(cashInvoiceData.invoices);
    }
  }, [cashInvoiceData, cashInvoicesStore, setCashInvoicesStore]);

  useEffect(() => {
    if (creditInvoiceData?.invoices?.length > 0) {
      setCreditInvoicesStore(creditInvoiceData.invoices);
    }
  }, [creditInvoiceData, creditInvoicesStore, setCreditInvoicesStore]);

  // on tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <Fragment>
      <Tabs
        defaultValue="cash"
        className="w-[100%]"
        onValueChange={handleTabChange}
      >
        <div className="flex justify-between items-center">
          {/* <h1 className="text-2xl font-semibold">View Invoices</h1> */}
          <CardHeader>
            <PageHeader
              title="Invoices"
              description="All your invoices are listed here."
              icon={<InvoiceIcon height="30" width="28" color="#162a3b" />}
            />
          </CardHeader>
          <TabsList className="grid w-[40%] grid-cols-2">
            {/* <TabsTrigger value="all">All</TabsTrigger> */}
            <TabsTrigger value="cash">Cash</TabsTrigger>
            <TabsTrigger value="creditor">Credit</TabsTrigger>
            {/* <TabsTrigger value="dummy">Dummy</TabsTrigger> */}
          </TabsList>
        </div>
        <div
          className="flex-row gap-3 mb-4 py-1 px-3 space-x-4 h-content-center"
          style={{
            borderRadius: "5px",
            boxShadow:
              "rgba(255, 255, 255, 0.1) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.20) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
          }}
        >
          <div className="d-flex gap-3 mb-4">
            <Input
              type="text"
              placeholder="Search for Invoices"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
            {activeTab === "creditor" &&
              <MultiSelect
                options={statusList}
                onValueChange={setSelectedOption}
                defaultValue={selectedOption}
                placeholder="Select Status"
                variant="secondary"
                animation={1}
                maxCount={1}
                modalPopover={true}
                badgeInlineClose={false}
                className="w-fit"
              />
            }
            <DateRangePicker
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
            <Button variant={"outline"} onClick={handleResetClick}>
              Reset
            </Button>
            <Button variant={"default"} onClick={handleFilterClick}>
              Filter
            </Button>
          </div>
        </div>
        <TabsContent value="cash">
          {cashInvoiceError ? (
            <ErrorPage
              errorHeading="Uh oh! Something went wrong"
              errorSubHeading="There was an unexpected error. Please try again or contact support."
            />
          ) : (
            <InvoiceTable
              invoices={cashInvoiceData}
              setPageNo={setPageNo}
              type="cash"
              pageNo={pageNo}
              pageSize={pageSize}
              isLoading={cashInvoiceLoading}
              err={cashInvoiceError}
            />
          )}
        </TabsContent>
        <TabsContent value="creditor">
          {creditInvoiceError ? (
            <ErrorPage
              errorHeading="Uh oh! Something went wrong"
              errorSubHeading="There was an unexpected error. Please try again or contact support."
            />
          ) : (
            <CreditInvoiceTable
              invoices={creditInvoiceData}
              setPageNo={setPageNo}
              type="creditor"
              pageNo={pageNo}
              pageSize={pageSize}
              isLoading={creditInvoiceLoading}
              err={creditInvoiceError}
            />
          )}
        </TabsContent>
        {/* <TabsContent value="dummy">
          {dummyInvoiceError ? (
            <ErrorPage
              errorHeading="Uh oh! Something went wrong"
              errorSubHeading="There was an unexpected error. Please try again or contact support."
            />
          ) : (
            <InvoiceTable
              invoices={dummyInvoiceData}
              setPageNo={setPageNo}
              type="cash"
              pageNo={pageNo}
              pageSize={pageSize}
              isLoading={dummyInvoiceLoading}
              err={dummyInvoiceError}
            />
          )}
        </TabsContent> */}
      </Tabs>
    </Fragment>
  );
}

