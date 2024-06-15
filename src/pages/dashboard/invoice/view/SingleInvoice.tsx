import PageHeader from "@/components/card/PageHeader";
import BillSummaryCard from "@/components/card/invoice/dummy/BillSummaryCard";
import CustomerDetailsForm from "@/components/form/invoice/dummy/CustomerDetailsForm";
import DummyItemForm from "@/components/form/invoice/dummy/DummyItemForm";
import OutSourceItemForm from "@/components/form/invoice/dummy/OutSourceItemForm";
import {
  OptionalLabel,
  RequiredLabel,
} from "@/components/formElements/FormLabel";
import PlusIcon from "@/components/icon/PlusIcon";
import ReceiptIcon from "@/components/icon/ReceiptIcon";
import { FormModal } from "@/components/modal/FormModal";
import DummyInvoiceItemsGrid from "@/components/table/invoice/dummy/DummyInvoiceItemsGrid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import { DummyInvoiceService } from "@/service/invoice/dummy/DummyInvoiceService";
import { SparePartService } from "@/service/sparePartInventory/sparePartService";
import { OutsourcedItem } from "@/types/invoice/cash/cashInvoiceTypes";
import { DummyInvoiceItem } from "@/types/invoice/dummy/dummyInvoiceTypes";
import { Label } from "@radix-ui/react-label";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import InvoiceItemsGrid from "./components/InvoiceItemGrid";
import BillSummaryViewCard from "./components/BillSummaryViewCard";
import OutsourceItemsGrid from "./components/OutSourceItemGrid";
import { CashInvoiceService } from "@/service/invoice/cashInvoiceApi";
import { InvoiceState } from "@/types/invoice/cashInvoice";
import { useParams } from "react-router-dom";

function SingleInvoice() {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  const [show, setShow] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [items, setItems] = useState<DummyInvoiceItem[]>([]);
  const [outsourcedItems, setOutsourcedItems] = useState<OutsourcedItem[]>([]);

  const [vatPrecentage, setVatPrecentage] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);

  const invoiceService = new CashInvoiceService(axiosPrivate);
  
  const { id } = useParams();

  const {
    data: invoiceData,
    isLoading: invoiceLoading,
    error: invoiceError,
  } = useQuery<InvoiceState>({
    queryKey: ["invoice"],
    queryFn: () => invoiceService.fetchCashInvoiceById(id),
    retry: 1,
  });
  
  useEffect(() => {
    if (invoiceLoading) {
      console.log("loading");
    } else {
      console.log("loaded");
    }
    if (!invoiceLoading) {
      console.log("IIINVOICE",invoiceData);
    }
  }
  ,[invoiceData]);

//   commissions: null
// ​
// customerName: "Sanath"
// ​
// discount: 0
// ​
// dummy: true
// ​
// id: 1
// ​
// invoiceId: "1"
// ​
// invoiceItems: null
// ​
// issuedBy: "b0a8ee5a-b0ec-49db-bef6-cd611b657ecf"
// ​
// issuedTime: Array(7) [ 2024, 6, 14, … ]
// ​
// totalDiscount: 0
// ​
// totalPrice: 1000
// ​
// vat: 0
// ​
// vehicleNo: "BIJ - 8011"



  return (
    <Fragment>
      <div className="ml-2">
        <div className="flex justify-between items-center"> 
          <CardHeader>
            <PageHeader
              title ={`Invoice No: ${invoiceData?.invoiceId}`}
              description="Created on 2024-06-14 at 16:16:04 by b0a8ee5a-b0ec-49db-bef6-cd611b657ecf"
              icon={<ReceiptIcon height="30" width="28" color="#162a3b" />}
            />
          </CardHeader>
          <div className="text-left pr-6 rounded-md color-slate-900">
            <Badge variant="secondary" className="h-full w-100 p-5 border-slate-200 rounded-lg">CASH</Badge>
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
                  <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                    Customer Name:
                  </h4>
                  <p className="text-xl font-semibold bg-slate-200 text-slate-900 pl-4 pt-2 pb-2 pr-4 rounded-md">
                    {invoiceData?.customerName}
                  </p>
                </div>
                <div className="flex flex-col gap-2 flex-grow">
                  <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                    Vehicle No:
                  </h4>
                  <p className="text-xl font-semibold bg-slate-200 text-slate-900 pl-4 pt-2 pb-2 pr-4 rounded-md">
                    {invoiceData?.vehicleNo}
                  </p>
                </div>
              </div>



              <InvoiceItemsGrid
                items={items}
                outsourcedItems={outsourcedItems}
                setItems={setItems}
                setOutsourcedItems={setOutsourcedItems}
              />


            </div>
            <div>
                <Card className="mt-4 bg-slate-200">
                  <CardContent className="pl-6 pr-2 pt-4 shadow-sm">
                    <div>
                      <h3 className="text-2xl font-semibold leading-none tracking-tight mb-6">
                        Outsourced Item Details
                      </h3>
                      <OutsourceItemsGrid
                        items={items}
                        outsourcedItems={outsourcedItems}
                        setItems={setItems}
                        setOutsourcedItems={setOutsourcedItems}
                      />
                    </div>
                  </CardContent>
                </Card>
            </div>
          </div>
          <div style={{ flex: 3 }}>
            <BillSummaryViewCard
              total={invoiceData?.totalPrice}
              vatPercentage={invoiceData?.vat}
              vatAmount={0}
              discountPercentage={invoiceData?.discount}
              discountAmount={invoiceData?.totalDiscount}
            />
          </div>
        </CardContent>
      </div>
    </Fragment>
  );
}

export default SingleInvoice;
