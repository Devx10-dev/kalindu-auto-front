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
import { toast } from "@/components/ui/use-toast";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import { OutsourcedItem } from "@/types/invoice/cash/cashInvoiceTypes";
import { DummyInvoiceItem } from "@/types/invoice/dummy/dummyInvoiceTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import InvoiceItemsGrid from "./components/InvoiceItemGrid";
import BillSummaryViewCard from "./components/BillSummaryViewCard";
import OutsourceItemsGrid from "./components/OutSourceItemGrid";
import { CashInvoiceService } from "@/service/invoice/cashInvoiceApi";
import { InvoiceState } from "@/types/invoice/cashInvoice";
import { useParams } from "react-router-dom";
import { useInvoiceListStore } from "../view-invoices/context/InvoiceListState";
import StatusCard from "./components/StatusCard";
import CancelIcon from "@/components/icon/CancelIcon";
import { CheckCircle } from "lucide-react";
import CommissionDetailsGrid from "./components/CommissionDetailsGrid";
import TimeLine from "./components/TransactionTimeline";
import { TransactionDrawer } from "./components/TransactionDrawer";

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
        console.log("INVOICE IN STORE", invoice);
        setInvoiceDetails(invoice);
        setIsAvailableInStore(true);
      } else {
        console.log("INVOICE NOT IN STORE");
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

  useEffect(() => {
    console.log("STOREE", cashInvoicesStore);
  }, [cashInvoicesStore]);

  useEffect(() => {
    if (invoiceLoading) {
      console.log("loading");
    } else {
      console.log("loaded");
    }
    if (!invoiceLoading) {
      console.log("IIINVOICE", invoiceDetails);
    }
  }, [invoiceDetails]);

  return (
    <Fragment>
      <div className="ml-2">
        <div className="flex justify-between items-center">
          <CardHeader>
            <PageHeader
              title={`Invoice No: ${invoiceData?.invoiceId}`}
              description="Created on 2024-06-14 at 16:16:04 by b0a8ee5a-b0ec-49db-bef6-cd611b657ecf"
              icon={<ReceiptIcon height="30" width="28" color="#162a3b" />}
              badge={
                <Badge className="bg-green-200 text-black rounded-md">
                  Cash Invoice
                </Badge>
              }
            />
          </CardHeader>
          <div className="text-left pr-6 rounded-md color-slate-900">
            <StatusCard
              icon={<CheckCircle size={30} color="green" />}
              status="Completed"
              statusColor="red"
              statusText="This invoice has been completed"
              type={"Cash"}
            />
          </div>
        </div>
        <CardContent
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <div style={{ flex: 9 }}>
            <div
              style={{
                boxShadow:
                  "rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px",
                borderRadius: 5,
              }}
              className="p-6 "
            >
              <div className="flex justify-between gap-5 mb-10">
                <div className="flex flex-col gap-2 flex-grow">
                  <h4 className="scroll-m-20 text-l font-semibold tracking-tight">
                    Customer Name:
                  </h4>
                  <p className="text-xl font-semibold text-slate-900 pl-4 pt-2 pb-2 pr-4 rounded-md border border-slate-200">
                    {invoiceDetails?.customerName}
                  </p>
                </div>
                <div className="flex flex-col gap-2 flex-grow">
                  <h4 className="scroll-m-20 text-l font-semibold tracking-tight">
                    Vehicle No:
                  </h4>
                  <p className="text-xl font-semibold text-slate-900 pl-4 pt-2 pb-2 pr-4 rounded-md border border-slate-200">
                    {invoiceDetails?.vehicleNo
                      ? invoiceDetails?.vehicleNo.toUpperCase()
                      : "N/A"}
                  </p>
                </div>
              </div>

              <InvoiceItemsGrid
                invoiceDetails={invoiceDetails}
                invoiceLoading={invoiceLoading}
              />
            </div>
            <div>
              <Card className="mt-4 ">
                <CardHeader className="pb-0">
                  <CardTitle>Outsourced Items</CardTitle>
                  <CardDescription>
                    This section contains all the outsourced items
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-6 pr-6 pt-6 pb-6 shadow-sm">
                  <div>
                    <OutsourceItemsGrid
                      invoiceDetails={invoiceDetails}
                      invoiceLoading={invoiceLoading}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card className="mt-4 ">
                <CardHeader className="pb-0">
                  <CardTitle>CommissionDetails</CardTitle>
                  <CardDescription>
                    This section contains all the commission details
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-6 pr-6 pt-6 pb-6 shadow-sm">
                  <div>
                    <CommissionDetailsGrid
                      invoiceDetails={invoiceDetails}
                      invoiceLoading={invoiceLoading}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div style={{ flex: 3 }}>
            <BillSummaryViewCard
              total={invoiceDetails?.totalPrice}
              vatPercentage={invoiceDetails?.vat}
              discountPercentage={invoiceDetails?.discount}
              discountAmount={invoiceDetails?.totalDiscount}
            />
            <TransactionDrawer
              invoiceDetails={invoiceDetails}
              invoiceLoading={invoiceLoading}
            />
          </div>
        </CardContent>
      </div>
    </Fragment>
  );
}

export default SingleInvoice;
