"use client";
import {
  Bar,
  BarChart,
  XAxis,
  CartesianGrid,
  YAxis,
  LineChart,
} from "recharts";
("use client");

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Cat, Dog, Fish, Rabbit, TrendingDown, TrendingUp, Turtle } from "lucide-react";
import { MultiSelect } from "@/components/ui/multi-select";
import { DateRangePicker } from "../../invoice/view-invoices/components/DateRangePicker";
import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnalyticalRange } from "@/types/analytics/dateRangeTypes";
import { set } from "date-fns";


export default function OverviewChart(
  {
    className,
    analyticalRange,
  }: {
    // type of the className prop
    className?: string;
    analyticalRange: AnalyticalRange;
  } 
) {

  const [selectedOption, setSelectedOption] = useState<string[]>(["sales", "expenses"]);
  const [rateSelected, setRateSelected] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("today");

  const chartData = [
    { month: "January", sales: 186, expenses: 80 },
    { month: "February", sales: 305, expenses: 200 },
    { month: "March", sales: 237, expenses: 120 },
    { month: "April", sales: 73, expenses: 190 },
    { month: "May", sales: 209, expenses: 130 },
    { month: "June", sales: 214, expenses: 140 },
  ];

  const frameworksList = [
    { value: "sales", label: "Sales", icon: TrendingUp },
    { value: "expenses", label: "Expenses", icon: TrendingDown },
  ];

  const chartConfig = {
    sales: {
      label: "sales",
      color: "#2563eb",
    },
    expenses: {
      label: "expenses",
      color: "#60a5fa",
    },
  } satisfies ChartConfig;

  useEffect(() => {
    console.log(selectedOption);
  }
  , [selectedOption]);

  useEffect(() => {
    if(analyticalRange) {
      setRateSelected(analyticalRange.defaultRate);
    }
  }
  , [analyticalRange]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    console.log(tab);
  };

  return (
    <div className={className}>
      <Card className="h-full ">
        <CardContent className="py-6">
          <div className="flex justify-between items-center align-items-top">
            <CardHeader className="p-0 ">
              <CardTitle className="pl-0"> Overview </CardTitle>
              <CardDescription className="pl-0">Summay of sales and Expenses</CardDescription>
            </CardHeader>
            <div className="gap-2 pt-0 flex">
              <MultiSelect
                options={frameworksList}
                onValueChange={setSelectedOption}
                defaultValue={selectedOption}
                placeholder="View Options"
                variant="default"
                animation={0}
                maxCount={3}
                modalPopover={true}
                badgeInlineClose={false}
              />
              <Select 
                value={rateSelected}
                onValueChange={setRateSelected}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Rate" />
                </SelectTrigger>
                <SelectContent >
                  {
                    analyticalRange && analyticalRange.rates.map((rate) => (
                      <SelectItem value={rate}>{rate.charAt(0).toUpperCase() + rate.slice(1)}</SelectItem>
                    ))
                  }
                    {/* <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem> */}
                </SelectContent>
              </Select>
            </div>
          </div>
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={chartData}>
              <ChartTooltip content={<ChartTooltipContent />} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              {/* <YAxis
                              tickLine={false}
                              tickMargin={10}
                              axisLine={false}
                              tickFormatter={(value) => value.toLocaleString()}
                          /> */}

              <Bar dataKey="sales" fill="black" radius={4} />
              <Bar dataKey="expenses" fill="#ff6f69" radius={4} />
            </BarChart>
          </ChartContainer>
          <div className="flex justify-between items-center">
            
          </div>
        </CardContent>
        
      </Card>
    </div>
  );
}
