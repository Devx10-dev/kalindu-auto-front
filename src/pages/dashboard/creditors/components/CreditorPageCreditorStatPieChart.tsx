"use client";

import * as React from "react";
import { TimerOff, TimerReset } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import {
  CreditInvoiceStats,
  PieChartData,
} from "@/types/invoice/creditorInvoice";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import { CreditInvoiceService } from "@/service/invoice/creditInvoiceService";
import { TooltipContent, TooltipProvider } from "@radix-ui/react-tooltip";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { currencyAmountString } from "@/utils/analyticsUtils";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  creditors: {
    label: "Creditors",
  },
  due: {
    label: "Due",
    color: "#FFD700",
  },
  overdue: {
    label: "Overdue",
    color: "#FF4C61",
  },
  other: {
    label: "Other",
    color: "#69c893",
  },
} satisfies ChartConfig;

function contentRender(contentType: string, content: string) {
  // split from firdst dot from the right
  switch (contentType) {
    case "currencyAmount": {
      // this comes as strig "Rs. 180,666.00" i want to render the decimal part in a smaller font size
      const [currency, amount] = content.split(/(?<=\..*)\./);
      return (
        <div className="text-2xl font-bold">
          <span>{currency}</span>
          <span className="text-sm font-bold color-muted-foreground">
            .{amount}
          </span>
        </div>
      );
    }
    default:
      return <div className="text-2xl font-bold">{content}</div>;
  }
}

export function CreditorPageCreditorStatPieChart() {
  const [chartData, setChartData] = React.useState<PieChartData[]>([
    { status: "overdue", creditors: 0, fill: "#FF4C61" },
    { status: "due", creditors: 0, fill: "#FFD700" },
    { status: "other", creditors: 0, fill: "#69c893" },
  ]);

  const totalCreditors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.creditors, 0);
  }, [chartData]);

  const axiosPrivate = useAxiosPrivate();
  const creditorsService = new CreditInvoiceService(axiosPrivate);

  const { data, isLoading, error } = useQuery<CreditInvoiceStats, Error>({
    queryKey: ["credit-invoice-stats"],
    queryFn: () => creditorsService.fetchCreditInvoiceStats(),
  });

  React.useEffect(() => {
    if (data) {
      console.log("NEWWWWWWWWWWWWW", data);
    }
  }, [data]);

  React.useEffect(() => {
    if (data) {
      setChartData([
        {
          status: "overdue",
          creditors: data.overdueCreditors,
          fill: "#FF4C61",
        },
        { status: "due", creditors: data.dueCreditors, fill: "#FFD700" },
        {
          status: "other",
          creditors:
            data.totalCreditors - (data.dueCreditors + data.overdueCreditors),
          fill: "#69c893",
        },
      ]);
    }
  }, [data]);

  return (
    <Card className="flex flex-col h-200 w-full px-0">
      <CardContent className="flex pb-0 px-0">
        <ChartContainer
          config={chartConfig}
          className="mx-0 aspect-square max-h-[150px] min-w-[150px]"
        >
          {isLoading ? (
            <div className="h-[150px] w-[150px] flex items-center justify-center">
              <Skeleton className="h-[110px] w-[110px] rounded-full" />
            </div>
          ) : (
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="creditors"
                nameKey="status"
                innerRadius={35}
                outerRadius={50}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-2xl font-bold"
                          >
                            {totalCreditors.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Creditors
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          )}
        </ChartContainer>
        <div className="grid grid-cols-2 grid-rows-2 p-4 gap-x-5 w-full">
          <div className="flex col-span-1 row-span-1 justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Total Credit Balance
              </p>
              {/* <h1 className="text-2xl font-bold text-black">
                    </h1> */}
              {!isLoading ? (
                data ? (
                  contentRender(
                    "currencyAmount",
                    currencyAmountString(data.totalCreditBalance),
                  )
                ) : (
                  contentRender("currencyAmount", "Rs. 0.00")
                )
              ) : (
                <Skeleton className="w-40 h-8" />
              )}
            </div>
          </div>
          <div className="flex col-span-1 row-span-1 justify-between">
            <div className="flex gap-1 items-right">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex gap-1 items-center">
                      <TimerOff className="w-5 h-5 text-red-500" />
                      <Badge className="w-fit" variant="secondary">
                        {!isLoading ? (
                          data?.totalOverdueInvoices
                        ) : (
                          <Skeleton className="h-5 w-5" />
                        )}
                      </Badge>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Overdue Invoice Count</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex gap-1 items-center">
                      <TimerReset className="w-5 h-5 text-yellow-500" />
                      <Badge className="w-fit" variant="secondary">
                        {!isLoading ? (
                          data?.totalDueInvoices
                        ) : (
                          <Skeleton className="h-5 w-5" />
                        )}
                      </Badge>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Due Invoice Count</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="col-span-1 row-span-1">
            <p className="text-sm text-muted-foreground">Due Amount</p>
            <h1 className="text-xl font-bold text-black">
              {!isLoading ? (
                data ? (
                  contentRender(
                    "currencyAmount",
                    currencyAmountString(data.dueAmount),
                  )
                ) : (
                  contentRender("currencyAmount", "Rs. 0.00")
                )
              ) : (
                <Skeleton className="w-40 h-8" />
              )}
            </h1>
          </div>
          <div className="col-span-1 row-span-1">
            <p className="text-sm text-muted-foreground">Overdue Amount</p>
            <h1 className="text-xl font-bold text-black">
              {!isLoading ? (
                data ? (
                  contentRender(
                    "currencyAmount",
                    currencyAmountString(data.overdueAmount),
                  )
                ) : (
                  contentRender("currencyAmount", "Rs. 0.00")
                )
              ) : (
                <Skeleton className="w-40 h-8" />
              )}
            </h1>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
