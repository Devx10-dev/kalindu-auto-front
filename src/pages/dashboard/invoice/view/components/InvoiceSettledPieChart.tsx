"use client";
import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import {
  CreditInvoiceStats,
  InvoiceState,
  PieChartData,
  SettledPieChartData,
} from "@/types/invoice/creditorInvoice";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import { CreditInvoiceService } from "@/service/invoice/creditInvoiceService";
import { Badge } from "@/components/ui/badge";
import { currencyAmountString } from "@/utils/analyticsUtils";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const chartConfig = {
  creditors: {
    label: "Creditors",
  },
  due: {
    label: "Settled",
    color: "#FFD700",
  },
  overdue: {
    label: "Unsettled",
    color: "#F44336",
  }
} satisfies ChartConfig;

function contentRender(contentType: string, content: string) {
  // split from firdst dot from the right
  switch (contentType) {
    case "currencyAmount": {
      // this comes as strig "Rs. 180,666.00" i want to render the decimal part in a smaller font size
      const [currency, amount] = content.split(/(?<=\..*)\./);
      return (
        <div className="text-lg font-bold">
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

export function InvoiceSettledPieChart(
  {
    invoiceDetails,
  }: {
    invoiceDetails: InvoiceState;
  }
) {
  const [chartData, setChartData] = React.useState<SettledPieChartData[]>([
    { status: "settled", amount: 1000, fill: "#4CAF50" },
    { status: "unsettled", amount: 2000, fill: "#FFD700" },
  ]);

  const settledPercentage = React.useMemo(() => {
    // calculate the percentage of settled amount from total amount (settled + unsettled)
    const total = chartData.reduce((acc, item) => acc + item.amount, 0);
    const settled = chartData.find((item) => item.status === "settled")?.amount;
    return ((settled / total) * 100).toFixed(0);
  }, [chartData]);

  React.useEffect(() => {
    if (invoiceDetails) {
      console.log(invoiceDetails);
      setChartData((prev) => {
        return [
          {
            status: "settled",
            amount: invoiceDetails.settledAmount,
            fill: "#4CAF50",
          },
          {
            status: "unsettled",
            amount: invoiceDetails.totalPrice - invoiceDetails.settledAmount,
            fill: "#F44336",
          },
        ];
      });
    }
  }
  , [invoiceDetails]);



  return (
    <Card className="flex flex-col h-200 w-full px-0">
      <CardContent className="flex pb-0 px-0">
        <ChartContainer
          config={chartConfig}
          className="mx-0 aspect-square max-h-[100px] min-w-[100px] my-auto"
        >

            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="amount"
                nameKey="status"
                innerRadius={25}
                outerRadius={35}
                strokeWidth={1}
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
                            className="fill-foreground text-lg font-bold"
                          >
                            {settledPercentage.toLocaleString()}<tspan className="text-xs">%</tspan>
                          </tspan>
                          
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
        </ChartContainer>
        <div className="grid grid-cols-1 grid-rows-1 p-4 pl-0 gap-x-5 w-full">
          {/* <div className="flex col-span-1 row-span-1 justify-between">
            <div>
              <p className="text-xs text-muted-foreground">
                Settled Amount
              </p>
              {contentRender("currencyAmount", currencyAmountString(invoiceDetails.settledAmount))}
            </div>
          </div> */}
          <div className="flex col-span-1 row-span-1 justify-between w-full">
            <div className="flex flex-col justify-center">
              <p className="text-md text-muted-foreground">
                To be Settled
              </p>
              <span>
              { invoiceDetails ? contentRender("currencyAmount", currencyAmountString(invoiceDetails.totalPrice - invoiceDetails.settledAmount)) : <Skeleton className="w-20 h-5" /> }
              </span>
            </div>
            <div className="flex col-span-1 row-span-1 justify-between w-fit items-center">
              <Button variant="outline" className="w-full h-full size-sm" size="sm">
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
         
          {/* <div className="flex col-span-1 row-span-1 justify-between">
            <div>
              <p className="text-xs text-muted-foreground">
                Settled Amount
              </p>
              {contentRender("currencyAmount", currencyAmountString(invoiceDetails.settledAmount))}
            </div>
          </div> */}
          
          
          {/* <div className="col-span-1 row-span-1">
            <p className="text-sm text-muted-foreground">Due Amount</p>
            <h1 className="text-xl font-bold text-black">
              
            </h1>
          </div> */}
        </div>
      </CardContent>
      {/* <CardFooter className="flex justify-between px-4 py-2">
        <div className="flex col-span-1 justify-between w-full">
          <Button variant="secondary" className="w-full size-sm" size="sm">
            Settle Now
          </Button>
        </div>
      </CardFooter> */}
    </Card>
  );
}
