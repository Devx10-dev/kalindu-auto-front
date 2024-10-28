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

const dotSizeClasses = {
  sm: "h-2 w-2",
  md: "h-2.5 w-2.5",
  lg: "h-3 w-3",
};

function SingleInvoiceCredit() {
  const axiosPrivate = useAxiosPrivate();
  const [outsourcedItems, setOutsourcedItems] = useState<OutsourcedItem[]>([]);
  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceState | null>(
    null
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

  return (
    <div className="w-full p-2 md:p-4 max-w-[100vw] overflow-x-hidden">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-[70%] space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardHeader className="p-0 md:p-4">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
              <div className="flex flex-col gap-2">
                <p className="text-sm">Contact Person</p>
                <div className="border border-muted-gray p-2 rounded-md">
                  <p className="text-lg break-words">
                    {invoiceDetails?.creditor.contactPersonName}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">Primary Contact</p>
                <div className="border border-muted-gray p-2 rounded-md">
                  <p className="text-lg break-words">
                    {invoiceDetails?.creditor.primaryContact}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm">Secondary Contact</p>
                <div className="border border-muted-gray p-2 rounded-md">
                  <p className="text-lg break-words">
                    {invoiceDetails?.creditor.secondaryContact}
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full">
              <InvoiceItemsGrid
                invoiceDetails={invoiceDetails}
                invoiceLoading={invoiceLoading}
              />
            </div>

            <Separator className="my-5" />

            <Card>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="1">
                  <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <CardTitle className="text-md">
                        Outsourced Items
                      </CardTitle>
                      <CardDescription className="text-sm">
                        This section contains all the outsourced items
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="whitespace-nowrap p-2 rounded-md"
                      >
                        {invoiceDetails?.invoiceItems.filter(
                          (item) => item.outsourced
                        ).length === 0
                          ? "No Items"
                          : `${invoiceDetails?.invoiceItems.filter((item) => item.outsourced).length} Outsourced`}
                      </Badge>
                      <AccordionTrigger className="p-2 rounded-md bg-primary-500 border border-primary-500" />
                    </div>
                  </CardHeader>
                  <AccordionContent>
                    <CardContent className="p-2 md:p-6">
                      <OutsourceItemsGrid
                        invoiceDetails={invoiceDetails}
                        invoiceLoading={invoiceLoading}
                      />
                    </CardContent>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>

            <Card>
              <Accordion
                type="single"
                collapsible
                className="w-full"
                defaultValue={invoiceDetails?.commissions.length > 0 ? "1" : ""}
              >
                <AccordionItem value="1">
                  <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <CardTitle className="text-md">
                        Commission Details
                      </CardTitle>
                      <CardDescription className="text-sm">
                        This section contains all the commission details
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="whitespace-nowrap p-2 rounded-md"
                      >
                        {invoiceDetails?.commissions.length === 0
                          ? "No Commissions"
                          : `${invoiceDetails?.commissions.length} Commissions`}
                      </Badge>
                      <AccordionTrigger className="p-2 rounded-md bg-primary-500 border border-primary-500" />
                    </div>
                  </CardHeader>
                  <AccordionContent>
                    <CardContent className="p-2 md:p-6">
                      <CommissionDetailsGrid
                        invoiceDetails={invoiceDetails}
                        invoiceLoading={invoiceLoading}
                      />
                    </CardContent>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
          </div>

          <div className="w-full lg:w-[30%] space-y-4 mt-5">
            <div className="flex justify-between items-center gap-4 w-full">
              <div className="flex-grow">
                <StatusCardCredit invoiceDetails={invoiceDetails} />
              </div>
              <div className="relative flex-shrink-0">
                <TransactionDrawer
                  invoiceDetails={invoiceDetails}
                  invoiceLoading={invoiceLoading}
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

            <div className="mt-5 w-full">
              <InvoiceSettledPieChart invoiceDetails={invoiceDetails} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleInvoiceCredit;
