import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast.ts";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import { CashInvoiceService } from "@/service/invoice/cashInvoiceApi.ts";
import { InvoiceData } from "@/types/Invoices/invoiceTypes";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useMutation } from "@tanstack/react-query";
import { Delete, Printer } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import DialogStepper from "../../components/DialogStepper";
import InvoiceDetailedView from "../../components/InvoiceDetailedView";
import PrintInvoice from "../../components/PrintInvoice";
import useInvoiceStore from "../context/useCashInvoiceStore";
import { convertArrayToISOFormat } from "@/utils/dateTime";

const BillSummary = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const {
    invoiceItemDTOList,
    discountPercentage,
    setDiscountPercentage,
    discountAmount,
    setDiscountAmount,
    vatPercentage,
    setVatPercentage,
    vatAmount,
    setVatAmount,
    setTotalPrice,
    getRequestData,
    resetState,
  } = useInvoiceStore();

  const printButtonRef = useRef<HTMLButtonElement | null>(null);

  const [invoiceData, setInvoiceData] = useState<InvoiceData>(null);

  const axiosPrivate = useAxiosPrivate();
  const cashInvoiceService = new CashInvoiceService(axiosPrivate);

  const subtotal = useMemo(() => {
    return invoiceItemDTOList.reduce(
      (acc: any, item: any) =>
        acc + item.quantity * item.price - item.quantity * item.discount,
      0
    );
  }, [invoiceItemDTOList]);

  const discountedTotal = useMemo(
    () => subtotal - (discountAmount || 0),
    [subtotal, discountAmount]
  );
  const totalWithVat = useMemo(
    () => discountedTotal + (vatAmount || 0),
    [discountedTotal, vatAmount]
  );

  // Update the total price when discountedTotal or vatAmount changes
  useEffect(() => {
    setTotalPrice(totalWithVat);
  }, [totalWithVat, setTotalPrice]);

  const handleDiscountPercentageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const percentage = Math.max(parseFloat(e.target.value), 0);
    setDiscountPercentage(percentage);
    setDiscountAmount((subtotal * percentage) / 100);
  };

  const handleDiscountAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const amount = Math.max(parseFloat(e.target.value), 0);
    setDiscountAmount(amount);
    setDiscountPercentage((amount / subtotal) * 100);
  };

  const handleVatPercentageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const percentage = Math.max(parseFloat(e.target.value), 0);
    setVatPercentage(percentage);
    setVatAmount((discountedTotal * percentage) / 100);
  };

  const handleVatAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = Math.max(parseFloat(e.target.value), 0);
    setVatAmount(amount);
    setVatPercentage((amount / discountedTotal) * 100);
  };

  const { toast } = useToast();

  const createCashInvoice = useMutation({
    mutationFn: async () => {
      const responseData =
        await cashInvoiceService.createCashInvoice(getRequestData());
      console.log(responseData);

      setInvoiceData({
        ...(responseData as unknown as InvoiceData),
        creditorName: responseData.customerName,
        invoiceId: responseData.invoiceId.split("-")[2],
        issuedTime: convertArrayToISOFormat(responseData.issuedTime),
        contactNo: "",
        vehicle: responseData.vehicleNo,
        type: "CASH",
      });
    },
    onSuccess: (invoiceData) => {
      resetState();
      toast({
        variant: "default",
        title: "Success",
        description: "Successfully created cash invoice ✅",
        className: "bg-green-200",
      });
    },

    onError: (data: any) => {
      toast({
        variant: "destructive",
        title: "Creating invoice failed 🤕",
        description: data.response.data,
        duration: 5000,
      });
    },
  });

  async function printAndSaveInvoice() {
    if (invoiceItemDTOList.length === 0) {
      return toast({
        title: "No items added to the invoice",
        description: "",
        variant: "destructive",
      });
    }

    setOpen(true);
  }

  const printButtonHandleClick = () => {
    if (printButtonRef.current) {
      printButtonRef.current.click();
    }
  };

  const steps = [
    {
      title: "Create Invoice",
      description: "Please review and confirm invoice creation.",
      content: (
        <InvoiceDetailedView invoiceData={getRequestData() as InvoiceData} />
      ),
      execute: () => createCashInvoice.mutate(),
      buttonName: "Create",
    },
    {
      title: "Print Invoice",
      description: "Confirm print invoice",
      content: (
        <PrintInvoice buttonRef={printButtonRef} invoiceData={invoiceData} />
      ),
      execute: () => printButtonHandleClick(),
      buttonName: "Print",
    },
  ];

  return (
    <>
      <Card>
        <CardContent className="p-5 shadow-sm pt-0">
          <h3 className="text-2xl font-semibold leading-none tracking-tight mb-4">
            Bill Summary
          </h3>
          <div className="mt-8">
            <div className="d-flex justify-between mb-4">
              <Label>Discount (%)</Label>
              <Input
                style={{
                  maxWidth: "100px",
                  textAlign: "right",
                  padding: 2,
                  maxHeight: 30,
                }}
                type="number"
                value={discountPercentage}
                onChange={handleDiscountPercentageChange}
                min={0}
                max={100}
              />
            </div>
            <div className="d-flex justify-between mb-4">
              <Label>Discount Amount (LKR)</Label>
              <Input
                style={{
                  maxWidth: "100px",
                  textAlign: "right",
                  padding: 2,
                  maxHeight: 30,
                }}
                type="number"
                value={discountAmount}
                onChange={handleDiscountAmountChange}
              />
            </div>
            <div className="d-flex justify-between mb-4">
              <Label>VAT Percentage (%)</Label>
              <Input
                style={{
                  maxWidth: "100px",
                  textAlign: "right",
                  padding: 2,
                  maxHeight: 30,
                }}
                type="number"
                value={vatPercentage}
                onChange={handleVatPercentageChange}
                min={0}
                max={100}
              />
            </div>
            <div className="d-flex justify-between mb-4">
              <Label>VAT Amount (LKR)</Label>
              <Input
                style={{
                  maxWidth: "100px",
                  textAlign: "right",
                  padding: 2,
                  maxHeight: 30,
                }}
                type="number"
                value={vatAmount}
                onChange={handleVatAmountChange}
              />
            </div>
          </div>
          <div className="flex justify-start text-left mt-16">
            <div className="text-left">
              <p className="text-xl font-semibold bg-slate-200 text-slate-900 pl-4 pt-2 pb-2 pr-4 rounded-md">
                Total : LKR {totalWithVat.toFixed(2)}
              </p>
              <div className="d-flex">
                <Button
                  className="mt-4 mb-3"
                  onClick={() => printAndSaveInvoice()}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ReloadIcon className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Printer className="mr-2" />
                  )}
                  {isLoading ? "Printing..." : "Print Invoice"}
                </Button>
                <Button
                  className="mt-4 mb-3 bg-red-400 ml-2 text-white"
                  onClick={() => resetState()}
                >
                  <Delete className={"mr-2"} /> Cancel
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <DialogStepper open={open} setOpen={setOpen} steps={steps} />
    </>
  );
};

export default BillSummary;
