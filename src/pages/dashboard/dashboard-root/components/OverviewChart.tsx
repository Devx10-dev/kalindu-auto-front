"use client";
import {
  Bar,
  BarChart,
  XAxis,
  CartesianGrid,
  YAxis,
  LineChart,
  Brush,
} from "recharts";
("use client");

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  Cat,
  CreditCard,
  Dog,
  Fish,
  Rabbit,
  TrendingDown,
  TrendingUp,
  Turtle,
} from "lucide-react";
import { MultiSelect } from "@/components/ui/multi-select";
import { DateRangePicker } from "../../invoice/view-invoices/components/DateRangePicker";
import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnalyticalRange } from "@/types/analytics/dateRangeTypes";
import { set } from "date-fns";
import {
  DailySummaryTimeBased,
  DailySummery,
  MonthlySummary,
  WeeklySummary,
  YearlySummary,
} from "@/types/salesAndExpenses/saleAndExpenseTypes";
import {
  processDailyData,
  processMonthlyData,
  processWeeklyData,
  processYearlyData,
} from "@/utils/analyticsUtils";
import DataProcessing from "./DataProcessing";
import NoData from "./NoData";

export default function OverviewChart({
  className,
  analyticalRange,
  analyticData,
  isDataLoading,
}: {
  // type of the className prop
  className?: string;
  analyticalRange: AnalyticalRange;
  analyticData: DailySummery[];
  isDataLoading: boolean;
}) {
  const [selectedOption, setSelectedOption] = useState<string[]>([
    "sales",
    "expenses",
    "credit",
  ]);
  const [rateSelected, setRateSelected] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("today");
  const [dailyProcessed, setDailyProcessed] = useState<DailySummaryTimeBased[]>(
    [],
  );
  const [weeklyProcessed, setWeeklyProcessed] = useState<WeeklySummary[]>([]);
  const [monthlyProcessed, setMonthlyProcessed] = useState<MonthlySummary[]>(
    [],
  );
  const [yearlyProcessed, setYearlyProcessed] = useState<YearlySummary[]>([]);
  const [chartData, setChartData] = useState<
    | DailySummaryTimeBased[]
    | WeeklySummary[]
    | MonthlySummary[]
    | YearlySummary[]
  >([]);
  const [dataProcessing, setDataProcessing] = useState<boolean>(true);

  const rateList = [
    { value: "sales", label: "Sales", icon: TrendingUp },
    { value: "expenses", label: "Expenses", icon: TrendingDown },
    { value: "credit", label: "Credit", icon: CreditCard },
  ];

  const dataKeys = {
    sales: "saleAmount",
    expenses: "expenseAmount",
    credit: "totalCredit",
  };

  const chartConfig = {
    sales: {
      label: "sales",
      color: "#2563eb",
    },
    expenses: {
      label: "expenses",
      color: "#60a5fa",
    },
    credit: {
      label: "credit",
      // faded yellow
      color: "#feff7f",
    },
  } satisfies ChartConfig;

  useEffect(() => {
    if (analyticalRange) {
      setRateSelected(analyticalRange.defaultRate);
    }
  }, [analyticalRange]);

  useEffect(() => {
    if (analyticData) {
      if (analyticData.length === 0) {
        setDataProcessing(true);
      } else {
        setDataProcessing(false);
      }
      analyticalRange.rates.forEach((rate) => {
        switch (rate) {
          case "daily": {
            const processedData = processDailyData(
              analyticData,
              analyticalRange.dateRange,
            );
            setDailyProcessed(processedData);
            break;
          }
          case "weekly": {
            const processedData = processWeeklyData(
              analyticData,
              analyticalRange.dateRange,
            );
            setWeeklyProcessed(processedData);
            break;
          }
          case "monthly": {
            const processedData = processMonthlyData(
              analyticData,
              analyticalRange.dateRange,
            );
            setMonthlyProcessed(processedData);
            break;
          }
          case "yearly": {
            const processedData = processYearlyData(
              analyticData,
              analyticalRange.dateRange,
            );
            setYearlyProcessed(processedData);
            break;
          }
          default:
            break;
        }

        setDataProcessing(false);
      });
    }
  }, [analyticData]);

  useEffect(() => {
    if (analyticData) {
      switch (rateSelected) {
        case "daily":
          setChartData(dailyProcessed);
          break;
        case "weekly":
          setChartData(weeklyProcessed);
          break;
        case "monthly":
          setChartData(monthlyProcessed);
          break;
        case "yearly":
          setChartData(yearlyProcessed);
          break;
        default:
          break;
      }
    }
  }, [
    rateSelected,
    analyticData,
    dailyProcessed,
    weeklyProcessed,
    monthlyProcessed,
    yearlyProcessed,
  ]);

  return (
    <div className={className}>
      <Card className="h-[100%] ">
        <div className="flex justify-between items-center align-items-top p-6">
          <CardHeader className="p-0 ">
            <CardTitle className="pl-0"> Overview </CardTitle>
            <CardDescription className="pl-0">
              Summay of sales and Expenses
            </CardDescription>
          </CardHeader>
          <div className="gap-2 pt-0 flex">
            <MultiSelect
              options={rateList}
              onValueChange={setSelectedOption}
              defaultValue={selectedOption}
              placeholder="View Options"
              variant="default"
              animation={0}
              maxCount={1}
              modalPopover={true}
              badgeInlineClose={false}
            />
            <Select value={rateSelected} onValueChange={setRateSelected}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Rate" />
              </SelectTrigger>
              <SelectContent>
                {analyticalRange &&
                  analyticalRange.rates.map((rate) => (
                    <SelectItem value={rate}>
                      {rate.charAt(0).toUpperCase() + rate.slice(1)}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <CardContent className="py-6 flex flex-col">
          <div className="min-h-[200px] w-full flex-1">
            {dataProcessing || isDataLoading ? (
              <DataProcessing />
            ) : analyticData.length === 0 ||
              (analyticData.length === 1 &&
                (analyticData[0].expenseAmount === 0 ||
                  analyticData[0].expenseAmount === null) &&
                (analyticData[0].saleAmount === 0 ||
                  analyticData[0].saleAmount === null) &&
                (analyticData[0].creditBalance === 0 ||
                  analyticData[0].creditBalance === null)) ? (
              <NoData />
            ) : (
              <ChartContainer config={chartConfig}>
                <BarChart accessibilityLayer data={chartData}>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  {/* <XAxis
                  dataKey="xlabel"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                /> */}
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="xlabel"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={true}
                  />
                  <YAxis
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                  <Brush dataKey="xlabel" height={20} />

                  {
                    // if selected options has sales, then render the sales bar
                    selectedOption.includes("sales") && (
                      <Bar dataKey="totalSales" fill="black" radius={4} />
                    )
                  }
                  {
                    // if selected options has expenses, then render the expenses bar
                    selectedOption.includes("expenses") && (
                      <Bar dataKey="totalExpenses" fill="#ff6f69" radius={4} />
                    )
                  }

                  {
                    // if selected options has credit, then render the credit bar
                    selectedOption.includes("credit") && (
                      <Bar dataKey="totalCredit" fill="#D3D3D3" radius={4} />
                    )
                  }

                  {/* <Bar dataKey="totalSales" fill="black" radius={4} />
                <Bar dataKey="totalExpenses" fill="#ff6f69" radius={4} /> */}
                </BarChart>
              </ChartContainer>
            )}
          </div>
          <div className="flex justify-between items-center"></div>
        </CardContent>
      </Card>
    </div>
  );
}
