import { OptionalLabel } from "@/components/formElements/FormLabel";
import IconCash from "@/components/icon/IconCash";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { InvoiceState } from "@/types/invoice/cashInvoice";
import { InvoiceData } from "@/types/Invoices/invoiceTypes";
import { extractDateFromIssuedTime } from "@/utils/dateTime";
import { Printer } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import PrintInvoice from "../../components/PrintInvoice";
import CurrencyComponent from "./CurrencyComponent";

function BillSummaryViewCard({
  total,
  vatPercentage,
  discountPercentage,
  discountAmount,
  invoiceData,
}: {
  total: number;
  vatPercentage: number;
  discountPercentage: number;
  discountAmount: number;
  invoiceData?: InvoiceState;
}) {
  // useEffect(() => {
  //   console.log("BillSummaryViewCard.tsx: total: ", total);
  //   console.log("BillSummaryViewCard.tsx: vatPercentage: ", vatPercentage);
  //   console.log(
  //     "BillSummaryViewCard.tsx: discountPercentage: ",
  //     discountPercentage,
  //   );
  //   console.log("BillSummaryViewCard.tsx: discountAmount: ", discountAmount);
  // }, [total, vatPercentage, discountPercentage, discountAmount]);

  const printButtonRef = useRef<HTMLButtonElement | null>(null);
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceData | null>(
    null,
  );

  useEffect(() => {
    if (!invoiceData) return;
    const invoiceD: InvoiceData = {
      commissions: [],
      contactNo: "",
      address: "",
      creditorName: invoiceData?.customerName,
      date: extractDateFromIssuedTime(invoiceData?.issuedTime),
      issuedTime: extractDateFromIssuedTime(invoiceData?.issuedTime),
      invoiceId: invoiceData?.invoiceId.split("-")[2],
      invoiceItems: invoiceData?.invoiceItems ?? [],
      totalDiscount: invoiceData?.discountAmount,
      totalPrice: invoiceData?.totalPrice,
      vat: invoiceData?.vat,
      type: "CASH",
    };

    setInvoiceDetails(invoiceD);
  }, []);

  return (
    <>
      <Card>
        <CardContent className="p-5 shadow-sm pt-0">
          <h3 className="text-2xl font-semibold leading-none tracking-tight mb-4">
            Bill Summary
          </h3>
          <div style={{ marginTop: "30px" }}>
            <div className="d-flex justify-between mb-2">
              <OptionalLabel label="Net Total" style={{ fontSize: 14 }} />
              <p className="text-right text-md font-regular">LKR {total}</p>
            </div>
            <div className="d-flex justify-between mb-2">
              <OptionalLabel
                style={{ fontSize: 14 }}
                label={`Discount (${discountPercentage}%)`}
              />
              <p className="text-right text-md font-regular text-red-500">
                - (LKR {discountAmount})
              </p>
            </div>
            <Separator className="my-2" />
            <div className="d-flex justify-between mb-2">
              <OptionalLabel
                style={{ fontSize: 14 }}
                label="Discounted Total"
              />
              <p className="text-right text-md font-regular">
                LKR {total - discountAmount}
              </p>
            </div>
            <div className="d-flex justify-between mb-2">
              <OptionalLabel
                style={{ fontSize: 14 }}
                label={`VAT (${vatPercentage})`}
              />
              <p className="text-right text-md font-regular">
                LKR {(total - discountAmount) * (vatPercentage / 100)}
              </p>
            </div>
          </div>
          <Separator className="mt-8 mb-4" />
          <div className="">
            <div className="text-right flex-col gap-10 bg-slate-100 rounded-md p-4">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <IconCash className="" color="gray" />
                </div>
                <Label className="text-xl text-left ">Total</Label>
              </div>
              <div className="flex justify-between">
                <p className="text-3xl font-thin align-bottom">Rs.</p>
                {/* <p className="text-4xl font-semibold">{total}</p> */}
                <CurrencyComponent
                  amount={
                    total -
                    discountAmount +
                    (total - discountAmount) * (vatPercentage / 100)
                  }
                  currency="LKR"
                  withoutCurrency
                />
              </div>
            </div>
            <div className="flex-space-between w-full">
              <Button
                className="mt-4 mb-3 w-full"
                onClick={() => setPrintDialogOpen(true)}
              >
                <Printer className={"mr-2"} /> Print Invoice
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <PrintInvoice
        buttonRef={printButtonRef}
        invoiceData={invoiceDetails}
        popupMode
        dialogOpen={printDialogOpen}
        onDialogOpenChange={setPrintDialogOpen}
      />
    </>
  );
}

export default BillSummaryViewCard;
