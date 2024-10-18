"use client";

import * as React from "react";
import { CreditCard, Landmark, TimerOff, TimerReset } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Creditor } from "@/types/creditor/creditorTypes";
import NoStats from "./NoStats";

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

function contentRender(
  contentType: string,
  content: string,
  bold: boolean = true,
  mainFontSize: string = "text-2xl",
  subFontSize: string = "text-sm",
  textColor: string = "text-black",
) {
  // split from firdst dot from the right
  switch (contentType) {
    case "currencyAmount": {
      // this comes as strig "Rs. 180,666.00" i want to render the decimal part in a smaller font size
      const [currency, amount] = content.split(/(?<=\..*)\./);
      return (
        <div
          className={`${bold ? "font-bold " : ""} ${mainFontSize} ${textColor}`}
        >
          <span>{currency}</span>
          <span
            className={`color-muted-foreground ${bold ? "font-bold" : ""} ${subFontSize} ${textColor}`}
          >
            .{amount}
          </span>
        </div>
      );
    }
    default:
      return <div className="text-2xl font-bold">{content}</div>;
  }
}

export function SingleCreditorStatPieChart({
  creditorDetails,
  creditorDetailsLoading,
}: {
  creditorDetails: Creditor;
  creditorDetailsLoading: boolean;
}) {
  const [chartData, setChartData] = React.useState<PieChartData[]>([
    { status: "overdue", creditors: 0, fill: "#FF4C61" },
    { status: "due", creditors: 0, fill: "#FFD700" },
    { status: "other", creditors: 0, fill: "#69c893" },
  ]);

  const [chartDataCheque, setChartDataCheque] = React.useState<PieChartData[]>([
    { status: "pending", creditors: 0, fill: "#FFD700" },
    { status: "redeemed", creditors: 0, fill: "#2563eb" },
    { status: "settled", creditors: 0, fill: "#69c893" },
    { status: "rejected", creditors: 0, fill: "#FF4C61" },
  ]);

  const totalCreditors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.creditors, 0);
  }, [chartData]);

  const [activeTab, setActiveTab] = React.useState("credit");
  const [cardHeader, setCardHeader] = React.useState("Credit Summary");

  React.useEffect(() => {
    if (activeTab === "credit") {
      setCardHeader("Credit Summary");
    } else if (activeTab === "cheque") {
      setCardHeader("Cheque Summary");
    }
  }, [activeTab]);

  React.useEffect(() => {
    if (creditorDetails) {
      setChartData([
        {
          status: "overdue",
          creditors: creditorDetails.overdueInvoiceCount,
          fill: "#FF4C61",
        },
        {
          status: "due",
          creditors: creditorDetails.dueInvoiceCount,
          fill: "#FFD700",
        },
        {
          status: "settled",
          creditors:
            creditorDetails.totalInvoiceCount -
            creditorDetails.dueInvoiceCount -
            creditorDetails.overdueInvoiceCount,
          fill: "#69c893",
        },
      ]);
    }
  }, [creditorDetails]);

  React.useEffect(() => {
    if (creditorDetails) {
      setChartDataCheque([
        {
          status: "pending",
          creditors: creditorDetails.pendingChequeCount,
          fill: "#FFD700",
        },
        {
          status: "redeemed",
          creditors: creditorDetails.redeemedChequeCount,
          fill: "#2563eb",
        },
        {
          status: "settled",
          creditors: creditorDetails.settledChequeCount,
          fill: "#69c893",
        },
        {
          status: "rejected",
          creditors: creditorDetails.rejectedChequeCount,
          fill: "#FF4C61",
        },
      ]);
    }
  }, [creditorDetails]);

  return (
    <Card className="flex flex-col h-full w-full px-0 relative">
      <Tabs
        defaultValue="credit"
        className="w-[100%]"
        onValueChange={setActiveTab}
      >
        <div className="flex justify-between items-center w-full px-4 py-2">
          <p className="text-lg font-bold">{cardHeader}</p>
          <TabsList className="grid w-fit grid-cols-2 ">
            {/* <TabsTrigger value="all">All</TabsTrigger> */}
            <TabsTrigger value="credit" className="w-fit">
              <CreditCard className="w-5 h-5" />
            </TabsTrigger>
            <TabsTrigger value="cheque" className="w-fit">
              <Landmark className="w-5 h-5" />
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="credit" className="mt-0">
          {creditorDetails?.totalInvoiceCount === 0 ? (
            <NoStats />
          ) : (
            <CardContent className="flex pb-0 px-0">
              <ChartContainer
                config={chartConfig}
                className="mx-0 aspect-square max-h-[150px] min-w-[150px]"
              >
                {creditorDetailsLoading ? (
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
                                  Invoices
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
                    {!creditorDetailsLoading ? (
                      creditorDetails ? (
                        contentRender(
                          "currencyAmount",
                          currencyAmountString(creditorDetails.totalDue),
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
                  <div>
                    <p className="text-sm text-muted-foreground text-green-500">
                      Creditor Refund
                    </p>
                    {/* <h1 className="text-2xl font-bold text-black">
                        </h1> */}
                    <div className="text-green-200">
                      {!creditorDetailsLoading ? (
                        creditorDetails ? (
                          contentRender(
                            "currencyAmount",
                            currencyAmountString(
                              creditorDetails.creditorRefund,
                            ),
                            true,
                            "text-xl",
                            "text-sm",
                            "text-green-500",
                          )
                        ) : (
                          contentRender("currencyAmount", "Rs. 0.00")
                        )
                      ) : (
                        <Skeleton className="w-40 h-8" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-span-1 row-span-1">
                  <p className="text-sm text-muted-foreground">Due Amount</p>
                  <h1 className="text-xl text-black">
                    {!creditorDetailsLoading ? (
                      creditorDetails ? (
                        contentRender(
                          "currencyAmount",
                          currencyAmountString(creditorDetails.dueAmount),
                          true,
                          "text-xl",
                          "text-sm",
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
                  <p className="text-sm text-muted-foreground">
                    Overdue Amount
                  </p>
                  <h1 className="text-xl text-black">
                    {!creditorDetailsLoading ? (
                      creditorDetails ? (
                        contentRender(
                          "currencyAmount",
                          currencyAmountString(creditorDetails.overdueAmount),
                          true,
                          "text-xl",
                          "text-sm",
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
          )}
        </TabsContent>
        <TabsContent value="cheque" className="mt-0">
          {creditorDetails?.totalChequeCount === 0 ? (
            <NoStats />
          ) : (
            <CardContent className="flex pb-0 px-0">
              <ChartContainer
                config={chartConfig}
                className="mx-0 aspect-square max-h-[150px] min-w-[150px]"
              >
                {creditorDetailsLoading ? (
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
                      data={chartDataCheque}
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
                                  {creditorDetails.totalChequeCount.toLocaleString()}
                                </tspan>
                                <tspan
                                  x={viewBox.cx}
                                  y={(viewBox.cy || 0) + 24}
                                  className="fill-muted-foreground"
                                >
                                  Cheques
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
              <div className="grid grid-cols-3 grid-rows-2 p-4 gap-x-5 w-full">
                <div className="flex col-span-2 row-span-1 justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Available Cheque Balance
                    </p>
                    {/* <h1 className="text-2xl font-bold text-black">
                        </h1> */}
                    {!creditorDetailsLoading ? (
                      creditorDetails ? (
                        contentRender(
                          "currencyAmount",
                          currencyAmountString(
                            creditorDetails.availableChequeBalance,
                          ),
                        )
                      ) : (
                        contentRender("currencyAmount", "Rs. 0.00")
                      )
                    ) : (
                      <Skeleton className="w-40 h-8" />
                    )}
                  </div>
                </div>
                <div className="col-span-1 row-span-1">
                  <p className="text-sm text-muted-foreground">
                    Redeemed Cheques
                  </p>
                  <h1 className="text-xl font-bold text-black">
                    {!creditorDetailsLoading ? (
                      creditorDetails ? (
                        contentRender(
                          "currencyAmount",
                          currencyAmountString(
                            creditorDetails.redeemedChequeAmount,
                          ),
                          true,
                          "text-lg",
                          "text-sm",
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
                  <p className="text-sm text-muted-foreground">
                    Pending Cheques
                  </p>
                  <h1 className="text-xl font-bold text-black">
                    {!creditorDetailsLoading ? (
                      creditorDetails ? (
                        contentRender(
                          "currencyAmount",
                          currencyAmountString(
                            creditorDetails.pendingChequeAmount,
                          ),
                          true,
                          "text-lg",
                          "text-sm",
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
                  <p className="text-sm text-muted-foreground">
                    Rejected Cheques
                  </p>
                  <h1 className="text-xl font-bold text-black">
                    {!creditorDetailsLoading ? (
                      creditorDetails ? (
                        contentRender(
                          "currencyAmount",
                          currencyAmountString(
                            creditorDetails.rejectedChequeAmount,
                          ),
                          true,
                          "text-lg",
                          "text-sm",
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
                  <p className="text-sm text-muted-foreground">
                    Settled Cheques
                  </p>
                  <h1 className="text-xl font-bold text-black">
                    {!creditorDetailsLoading ? (
                      creditorDetails ? (
                        contentRender(
                          "currencyAmount",
                          currencyAmountString(
                            creditorDetails.settledChequeAmount,
                          ),
                          true,
                          "text-lg",
                          "text-sm",
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
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}
