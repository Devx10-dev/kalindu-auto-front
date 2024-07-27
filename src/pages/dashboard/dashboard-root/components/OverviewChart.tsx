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

export default function OverviewChart(
  {
    className,
  }: {
    className?: string;
  } 
) {

  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>(["react", "angular"]);

  const chartData = [
    { month: "January", sales: 186, expenses: 80 },
    { month: "February", sales: 305, expenses: 200 },
    { month: "March", sales: 237, expenses: 120 },
    { month: "April", sales: 73, expenses: 190 },
    { month: "May", sales: 209, expenses: 130 },
    { month: "June", sales: 214, expenses: 140 },
  ];

  const frameworksList = [
    { value: "react", label: "Sales", icon: TrendingUp },
    { value: "angular", label: "Expenses", icon: TrendingDown },
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
    console.log(selectedFrameworks);
  }
  , [selectedFrameworks]);

  return (
    <div className={className}>
      <Card className="h-full">
        <CardContent>
          <div className="flex justify-between items-center">
            <CardHeader className="pl-0">
              <CardTitle className="pl-0"> Overview </CardTitle>
              <CardDescription className="pl-0">Summay of sales and Expenses</CardDescription>
            </CardHeader>
            <MultiSelect
              options={frameworksList}
              onValueChange={setSelectedFrameworks}
              defaultValue={selectedFrameworks}
              placeholder="Select Filter"
              variant="inverted"
              animation={2}
              maxCount={3}
              modalPopover={false}
            />
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
        </CardContent>
      </Card>
    </div>
  );
}
