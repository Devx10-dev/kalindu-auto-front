import PageHeader from "@/components/card/PageHeader";
import ReceiptIcon from "@/components/icon/ReceiptIcon";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import { CashInvoiceService } from "@/service/invoice/cashInvoiceApi";
import { OutsourcedItem } from "@/types/invoice/cash/cashInvoiceTypes";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDownUp,
  CheckCircle,
  PackageOpen,
  TimerOff,
  TimerReset,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import {
  useCreditInvoiceListStore,
  useInvoiceListStore,
} from "../view-invoices/context/InvoiceListState";
import BillSummaryViewCard from "./components/BillSummaryViewCard";
import CommissionDetailsGrid from "./components/CommissionDetailsGrid";
import InvoiceItemsGrid from "./components/InvoiceItemGrid";
import OutsourceItemsGrid from "./components/OutSourceItemGrid";
import StatusCard from "./components/StatusCard";
import { TransactionDrawer } from "./components/TransactionDrawer";
import { InvoiceState, PieChartData } from "@/types/invoice/creditorInvoice";
import { CreditInvoiceService } from "@/service/invoice/creditInvoiceService";
import { Accordion } from "@radix-ui/react-accordion";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import dateArrayToString from "@/utils/dateArrayToString";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Label, Pie, PieChart } from "recharts";
import StatusCardCredit from "./components/StatusCardCredit";
import { Button } from "@/components/ui/button";

function PaymentStat() {
  const isLoading = false;

  const chartConfig = {
    creditors: {
      label: "Creditors",
    },
    due: {
      label: "Due",
      color: "#FFD700",
    },
  } satisfies ChartConfig;

  const chartData = [
    {
      status: "Creditors",
      creditors: 100,
      fill: "#FFD700",
    },
    {
      status: "Due",
      creditors: 50,
      fill: "#FFD700",
    },
    {
      status: "Overdue",
      creditors: 30,
      fill: "#FFD700",
    },
    {
      status: "Other",
      creditors: 20,
      fill: "#FFD700",
    },
  ] satisfies PieChartData[];

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-0 aspect-square max-h-[100px] min-w-[100px]"
    >
      {isLoading ? (
        <div className="h-[100px] w-[100px] flex items-center justify-center">
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
            innerRadius={25}
            outerRadius={30}
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
                        150
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
  );
}

function SingleInvoiceCredit() {
  const axiosPrivate = useAxiosPrivate();
  const [outsourcedItems, setOutsourcedItems] = useState<OutsourcedItem[]>([]);
  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceState | null>(
    null,
  );
  const [isAvailableInStore, setIsAvailableInStore] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [vatPercentage, setVatPercentage] = useState<number>(0);
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  const invoiceService = new CreditInvoiceService(axiosPrivate);

  const { id } = useParams();

  const { creditInvoicesStore, getCreditInvoiceById, addCreditInvoiceToStore } =
    useCreditInvoiceListStore();

  useEffect(() => {
    if (id) {
      const invoice = getCreditInvoiceById(id);
      if (invoice) {
        setInvoiceDetails(invoice);
        setIsAvailableInStore(true);
      } else {
        setIsAvailableInStore(false);
      }
    }
  }, [creditInvoicesStore, id]);

  const {
    data: invoiceData,
    isLoading: invoiceLoading,
    error: invoiceError,
  } = useQuery<InvoiceState, Error>({
    queryKey: ["invoice"],
    queryFn: () => invoiceService.fetchCreditInvoiceById(id),
    retry: 1,
    enabled: !!id && !isAvailableInStore,
  });

  useEffect(() => {
    if (!isAvailableInStore && !invoiceLoading && invoiceData) {
      if (invoiceData) {
        setInvoiceDetails(invoiceData);
        addCreditInvoiceToStore(invoiceData);
      }
    }
  }, [
    invoiceData,
    isAvailableInStore,
    invoiceLoading,
    addCreditInvoiceToStore,
  ]);

  useEffect(() => {
    console.log(invoiceDetails);
    if (invoiceDetails) {
      setTotal(invoiceDetails.totalPrice);
      setVatPercentage(invoiceDetails.vat);
      setDiscountPercentage(invoiceDetails.discountPercentage);
      setDiscountAmount(invoiceDetails.totalDiscount);
    }
  }, [invoiceDetails]);

  useEffect(() => {
    console.log(total, vatPercentage, discountPercentage, discountAmount);
  }, [total, vatPercentage, discountPercentage, discountAmount]);

  // function renderStatus(invoiceDetails: InvoiceState | null) {
  //   switch (invoiceDetails?.dueStatus) {
  //     case "COMPLETED":
  //       return (
  //         <StatusCard
  //           icon={<CheckCircle size={30} color="green" />}
  //           status="Completed"
  //           statusColor="red"
  //           statusText="This invoice has been completed"
  //           type={"Cash"}
  //           className="bg-green-50"
  //         />
  //       );
  //     case "DUE":
  //       return (
  //         <StatusCard
  //           icon={<PaymentStat />}
  //           status={"DUE on " + dateArrayToString(invoiceDetails?.dueTime, true)}
  //           statusColor="yellow"
  //           statusText="This invoice is Due"
  //           type={"Cash"}
  //           className="bg-yellow-50"
  //         />
  //       );
  //     case "OVERDUE":
  //       return (
  //         <StatusCard
  //           icon={<TimerOff size={30} color="red" />}
  //           status="Overdue"
  //           statusColor="red"
  //           statusText="This invoice is overdue"
  //           type={"Cash"}
  //           className="bg-red-50"
  //         />
  //       );
  //   }
  // }

  return (
    <Fragment>
      <div className="ml-2">
        {/* <div className="flex justify-between items-center">
          <CardHeader>
            <PageHeader
              title={`Invoice No: ${invoiceDetails?.invoiceId}`}
              description="Created on 2024-06-14 at 16:16:04 by b0a8ee5a-b0ec-49db-bef6-cd611b657ecf"
              icon={<ReceiptIcon height="30" width="28" color="#162a3b" />}
              badge={
                <Badge className="bg-yellow-200 text-black rounded-md">
                  Credit Invoice
                </Badge>
              }
            />
          </CardHeader>
          <div className="text-left pr-6 rounded-md color-slate-900">
            {
              renderStatus(invoiceDetails)
            }
            
          </div>
        </div> */}
        <CardContent
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <div className="gap-5" style={{ flex: 9 }}>
            <div className="flex-col gap-5">
              <div className="flex justify-between items-center">
                <CardHeader className="px-0">
                  <PageHeader
                    title={`Invoice No: ${invoiceDetails?.invoiceId}`}
                    description="Created on 2024-06-14 at 16:16:04 by b0a8ee5a-b0ec-49db-bef6-cd611b657ecf"
                    icon={
                      <ReceiptIcon height="30" width="28" color="#162a3b" />
                    }
                    badge={
                      <Badge className="bg-yellow-200 text-black rounded-md">
                        Credit Invoice
                      </Badge>
                    }
                  />
                </CardHeader>
                {/* <div className="text-left pr-6 rounded-md color-slate-900">
                {
                  renderStatus(invoiceDetails)
                }
                
              </div> */}
              </div>
              <div className="grid grid-cols-3 gap-2 mb-5">
                <div className="flex flex-col gap-1">
                  <p className="text-sm">Contact Person</p>
                  <div className="border border-muted-gray p-1 rounded-md mr-5">
                    <p className="text-lg ">
                      {invoiceDetails?.creditor.contactPersonName}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-muted-foreground">
                    Primary Contact
                  </p>
                  <div className="border border-muted-gray p-1 rounded-md mr-5">
                    <p className="text-lg">
                      {invoiceDetails?.creditor.primaryContact}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm">Secondary Contact</p>
                  <div className="border border-muted-gray p-1 rounded-md mr-5">
                    <p className="text-lg">
                      {invoiceDetails?.creditor.secondaryContact}
                    </p>
                  </div>
                </div>
              </div>

              <InvoiceItemsGrid
                invoiceDetails={invoiceDetails}
                invoiceLoading={invoiceLoading}
              />
            </div>
            <Separator className="my-5" />
            <div>
              <Card className="mt-4 ">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="1">
                    <CardHeader className="flex-row justify-between items-center">
                      <div>
                        <CardTitle className="text-md">
                          Outsourced Items
                        </CardTitle>
                        <CardDescription className="text-sm">
                          This section contains all the outsourced items
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {invoiceDetails?.invoiceItems.filter(
                          (item) => item.outsourced,
                        ).length === 0 && (
                          <Badge
                            variant="secondary"
                            className="w-fit p-2 w-full border-radius-5 "
                          >
                            No Items
                          </Badge>
                        )}
                        <AccordionTrigger className="p-2 rounded-md bg-primary-500 border border-primary-500" />
                      </div>
                    </CardHeader>
                    <AccordionContent>
                      <CardContent className="pl-6 pr-6 pt-0 pb-0 shadow-sm">
                        <div>
                          <OutsourceItemsGrid
                            invoiceDetails={invoiceDetails}
                            invoiceLoading={invoiceLoading}
                          />
                        </div>
                      </CardContent>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Card>
            </div>
            <div>
              <Card className="mt-4 ">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="1">
                    <CardHeader className="flex-row justify-between items-center">
                      <div>
                        <CardTitle className="text-md">
                          CommissionDetails
                        </CardTitle>
                        <CardDescription className="text-sm">
                          This section contains all the commission details
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {invoiceDetails?.commissions.length === 0 && (
                          <Badge
                            variant="secondary"
                            className="w-fit p-2 w-full border-radius-5 "
                          >
                            No Commissions
                          </Badge>
                        )}
                        <AccordionTrigger className="p-2 rounded-md bg-primary-500 border border-primary-500" />
                      </div>
                    </CardHeader>
                    <AccordionContent>
                      <CardContent className="pl-6 pr-6 pt-0 pb-0 shadow-sm">
                        <div>
                          <CommissionDetailsGrid
                            invoiceDetails={invoiceDetails}
                            invoiceLoading={invoiceLoading}
                          />
                        </div>
                      </CardContent>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Card>
            </div>
          </div>
          <div style={{ flex: 3 }}>
            <div className="flex justify-between items-center gap-3 py-5">
              <div className="w-full">
                <StatusCardCredit invoiceDetails={invoiceDetails} />
              </div>
              <TransactionDrawer
                invoiceDetails={invoiceDetails}
                invoiceLoading={invoiceLoading}
              />
            </div>
            <BillSummaryViewCard
              total={total}
              vatPercentage={vatPercentage}
              discountPercentage={discountPercentage}
              discountAmount={discountAmount}
            />
          </div>
        </CardContent>
      </div>
    </Fragment>
  );
}

export default SingleInvoiceCredit;
