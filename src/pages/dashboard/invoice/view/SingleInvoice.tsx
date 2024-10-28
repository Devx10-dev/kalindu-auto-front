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

function SingleInvoice() {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const [outsourcedItems, setOutsourcedItems] = useState<OutsourcedItem[]>([]);
  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceState | null>(
    null
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
        <div className="w-full md:w-auto">
          <StatusCard
            icon={<CheckCircle size={30} color="green" />}
            status="Completed"
            statusColor="red"
            statusText="This invoice has been completed"
            type="Cash"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Column */}
        <div className="w-full lg:w-[70%]">
          {/* Customer Info Card */}
          <div className="bg-white rounded-lg p-4 shadow-md mb-4">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-2">Customer Name:</h4>
                <p className="text-lg font-semibold p-3 border rounded-md">
                  {invoiceDetails?.customerName}
                </p>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-2">Vehicle No:</h4>
                <p className="text-lg font-semibold p-3 border rounded-md">
                  {invoiceDetails?.vehicleNo
                    ? invoiceDetails?.vehicleNo.toUpperCase()
                    : "N/A"}
                </p>
              </div>
            </div>
            <div className="overflow-x-auto ">
              <InvoiceItemsGrid
                invoiceDetails={invoiceDetails}
                invoiceLoading={invoiceLoading}
              />
            </div>
          </div>

          {/* Outsourced Items Card */}
          <Card className="mb-4">
            <CardHeader className="p-4">
              <CardTitle>Outsourced Items</CardTitle>
              <CardDescription>
                This section contains all the outsourced items
              </CardDescription>
            </CardHeader>
            <div className="overflow-x-auto ">
              <CardContent className="p-4">
                <OutsourceItemsGrid
                  invoiceDetails={invoiceDetails}
                  invoiceLoading={invoiceLoading}
                />
              </CardContent>
            </div>
          </Card>

          {/* Commission Details Card */}
          <Card>
            <CardHeader className="p-4">
              <CardTitle>Commission Details</CardTitle>
              <CardDescription>
                This section contains all the commission details
              </CardDescription>
            </CardHeader>
            <div className="overflow-x-auto ">
              <CardContent className="p-4">
                <CommissionDetailsGrid
                  invoiceDetails={invoiceDetails}
                  invoiceLoading={invoiceLoading}
                />
              </CardContent>
            </div>
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
          <TransactionDrawer
            invoiceDetails={invoiceDetails}
            invoiceLoading={invoiceLoading}
            nonIcon={true}
          />
        </div>
      </div>
    </div>
  );
}

export default SingleInvoice;
