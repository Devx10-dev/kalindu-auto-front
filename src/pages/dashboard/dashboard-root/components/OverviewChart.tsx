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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OverviewChart() {
  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    // { month: "March", desktop: 237, mobile: 120 },
    // { month: "April", desktop: 73, mobile: 190 },
    // { month: "May", desktop: 209, mobile: 130 },
    // { month: "June", desktop: 214, mobile: 140 },
  ];

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "#2563eb",
    },
    mobile: {
      label: "Mobile",
      color: "#60a5fa",
    },
  } satisfies ChartConfig;

  return (
    <Card className="h-full">
      <CardContent>
        <CardHeader className="pl-0">
          <CardTitle className="pl-0"> Overview </CardTitle>
        </CardHeader>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
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

            <Bar dataKey="desktop" fill="black" radius={4} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
