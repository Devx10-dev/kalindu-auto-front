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
import { InvoiceState } from "@/types/invoice/cashInvoice";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { useInvoiceListStore } from "../view-invoices/context/InvoiceListState";
import BillSummaryViewCard from "./components/BillSummaryViewCard";
import CommissionDetailsGrid from "./components/CommissionDetailsGrid";
import InvoiceItemsGrid from "./components/InvoiceItemGrid";
import OutsourceItemsGrid from "./components/OutSourceItemGrid";
import StatusCard from "./components/StatusCard";
import { TransactionDrawer } from "./components/TransactionDrawer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CashInvoiceTransactionDrawer } from "../../creditors/components/CashInvoiceTransactionDrawer";

const dotSizeClasses = {
  sm: "h-2 w-2",
  md: "h-2.5 w-2.5",
  lg: "h-3 w-3",
};

function SingleInvoice() {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const [outsourcedItems, setOutsourcedItems] = useState<OutsourcedItem[]>([]);
  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceState | null>(
    null,
  );
  const [isAvailableInStore, setIsAvailableInStore] = useState<boolean>(true);

  const invoiceService = new CashInvoiceService(axiosPrivate);

  const { id } = useParams();

  const { cashInvoicesStore, getCashInvoiceById, addCashInvoiceToStore } =
    useInvoiceListStore();

  useEffect(() => {
    if (id) {
      const invoice = getCashInvoiceById(id);
      if (invoice) {
        setInvoiceDetails(invoice);
        setIsAvailableInStore(true);
      } else {
        setIsAvailableInStore(false);
      }
    }
  }, [cashInvoicesStore, id]);

  const {
    data: invoiceData,
    isLoading: invoiceLoading,
    error: invoiceError,
  } = useQuery<InvoiceState>({
    queryKey: ["invoice"],
    queryFn: () => invoiceService.fetchCashInvoiceById(id),
    retry: 1,
    enabled: !!id && !isAvailableInStore,
  });

  useEffect(() => {
    if (!isAvailableInStore && !invoiceLoading && invoiceData) {
      if (invoiceData) {
        setInvoiceDetails(invoiceData);
        addCashInvoiceToStore(invoiceData);
      }
    }
  }, [invoiceData, isAvailableInStore, invoiceLoading]);

  useEffect(() => {}, [cashInvoicesStore]);

  return (
    <div className="p-2 md:p-4 max-w-[100vw] overflow-x-hidden">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <CardHeader className="p-0 md:p-4">
          <PageHeader
            title={`Invoice No: ${invoiceDetails?.invoiceId}`}
            description="Created on 2024-06-14 at 16:16:04 by b0a8ee5a-b0ec-49db-bef6-cd611b657ecf"
            icon={<ReceiptIcon height="30" width="28" color="#162a3b" />}
            badge={
              <Badge className="bg-green-200 text-black rounded-md">
                Cash Invoice
              </Badge>
            }
          />
        </CardHeader>

        <div className="w-full lg:w-[30%] space-y-4 mt-5">
          <div className="flex justify-between items-center gap-4 w-full">
            <div className="flex-grow">
              <StatusCard
                icon={<CheckCircle size={30} color="green" />}
                status="Completed"
                statusColor="red"
                statusText="This invoice has been completed"
                type="Cash"
              />
            </div>
            <div className="relative flex-shrink-0">
              {/* <TransactionDrawer
                invoiceDetails={invoiceDetails}
                invoiceLoading={invoiceLoading}
              /> */}
              {!invoiceLoading && invoiceDetails && (
                <CashInvoiceTransactionDrawer
                  invoiceId={invoiceDetails?.invoiceId}
                  creditorName={invoiceDetails?.invoiceId}
                />
              )}
              <span
                className={`absolute top-[-5px] right-[-5px] block ${dotSizeClasses["lg"]} rounded-full bg-red-500 ring-2 ring-white shadow-md`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Column */}
        <div className="w-full lg:w-[70%]">
          {/* Customer Info Card */}
          {/* <div className="bg-white rounded-lg p-4 shadow-md mb-4"> */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <h4 className="text-sm  mb-2">Customer Name:</h4>
              <p className="text-md font-regular p-2 border rounded-md">
                {invoiceDetails?.customerName
                  ? invoiceDetails?.customerName
                  : "Not Provided"}
              </p>
            </div>
            <div className="flex-1">
              <h4 className="text-sm  mb-2">Vehicle No:</h4>
              <p className="text-md font-regular  p-2 border rounded-md">
                {invoiceDetails?.vehicleNo
                  ? invoiceDetails?.vehicleNo.toUpperCase()
                  : "Not Provided"}
              </p>
            </div>
          </div>
          <div className="overflow-x-auto ">
            <InvoiceItemsGrid
              invoiceDetails={invoiceDetails}
              invoiceLoading={invoiceLoading}
            />
          </div>
          {/* </div> */}

          {/* Outsourced Items Card */}
          <Card className="mb-5">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="1">
                <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <CardTitle className="text-sm">Outsourced Items</CardTitle>
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
                        (item) => item.outsourced,
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
                    <CardTitle className="text-sm">
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

        {/* Right Column */}
        <div className="w-full lg:w-[30%] space-y-4">
          <BillSummaryViewCard
            total={invoiceDetails?.totalPrice}
            vatPercentage={
              (invoiceDetails?.vat * 100) /
              (invoiceDetails?.totalPrice - invoiceDetails?.totalDiscount)
            }
            discountPercentage={invoiceDetails?.discount}
            discountAmount={invoiceDetails?.totalDiscount}
          />
        </div>
      </div>
    </div>
  );
}

export default SingleInvoice;
