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
import BillSummaryViewCardCredit from "./components/BillSummaryViewCardCredit";
import { InvoiceSettledPieChart } from "./components/InvoiceSettledPieChart";
import { InvoiceTransactionDrawer } from "../../creditors/components/InvoiceTransactionDrawer";

const dotSizeClasses = {
  sm: "h-2 w-2",
  md: "h-2.5 w-2.5",
  lg: "h-3 w-3",
};

function SingleInvoiceCredit() {
  const axiosPrivate = useAxiosPrivate();
  const [outsourcedItems, setOutsourcedItems] = useState<OutsourcedItem[]>([]);
  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceState | null>(
    null,
  );
  const [invoiceId, setInvoiceId] = useState<string>("");
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
      setInvoiceId(invoiceDetails.invoiceId.toString());
    }
  }, [invoiceDetails]);

  useEffect(() => {
    console.log(total, vatPercentage, discountPercentage, discountAmount);
  }, [total, vatPercentage, discountPercentage, discountAmount]);

  return (
    <Fragment>
      <div className="ml-2">
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
                        ).length === 0 ? (
                          <Badge
                            variant="secondary"
                            className="w-fit p-2 w-full border-radius-5 "
                          >
                            No Items
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="w-fit p-2 w-full border-radius-5 "
                          >
                            {
                              invoiceDetails?.invoiceItems.filter(
                                (item) => item.outsourced,
                              ).length
                            }{" "}
                            Outsourced
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
                <Accordion
                  type="single"
                  collapsible
                  className="w-full"
                  defaultValue={
                    invoiceDetails?.commissions.length > 0 ? "1" : ""
                  }
                >
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
                        {invoiceDetails?.commissions.length === 0 ? (
                          <Badge
                            variant="secondary"
                            className="w-fit p-2 w-full border-radius-5 "
                          >
                            No Commissions
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="w-fit p-2 w-full border-radius-5 "
                          >
                            {invoiceDetails?.commissions.length} Commissions
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
              <div className="relative">
                {/* <TransactionDrawer
                  invoiceDetails={invoiceDetails}
                  invoiceLoading={invoiceLoading}
                /> */}
                <InvoiceTransactionDrawer
                  invoiceId={invoiceId}
                  creditorName={invoiceId}
                />
                <span
                  className={`absolute top-[-5px] right-[-5px] block ${dotSizeClasses["lg"]} rounded-full bg-red-500 ring-2 ring-white shadow-md`}
                />
              </div>
            </div>
            <BillSummaryViewCardCredit
              total={total}
              vatPercentage={vatPercentage}
              discountPercentage={discountPercentage}
              discountAmount={discountAmount}
            />
            <div className="mt-5">
              <InvoiceSettledPieChart invoiceDetails={invoiceDetails} />
            </div>
          </div>
        </CardContent>
      </div>
    </Fragment>
  );
}

export default SingleInvoiceCredit;
