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
import useInvoiceStore from "../context/useCashInvoiceStore";
import { convertArrayToNormalFormat } from "@/utils/dateTime";
import PrintCashInvoice from "../../components/printCashInvoice";
import IconCash from "@/components/icon/IconCash";
import CurrencyComponent from "../../view/components/CurrencyComponent";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import PrintInvoice from "../../components/PrintInvoice";

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
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [defaultVatPercentage, setDefaultVatPercentage] = useState(18);
  const [vatIncluded, setVatIncluded] = useState(true);

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
    [discountedTotal, vatPercentage, vatAmount]
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
  };

  useEffect(() => {
    if (vatPercentage >= 0) {
      const vatAmount = (discountedTotal * vatPercentage) / 100;
      setVatAmount(vatAmount);
    }
  }, [
    vatPercentage,
    discountedTotal,
    vatAmount,
    setVatAmount,
    totalWithVat,
    setTotalPrice,
  ]);

  const handleVatAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = Math.max(parseFloat(e.target.value), 0);
    setVatAmount(amount);
    setVatPercentage((amount / discountedTotal) * 100);
  };

  const { toast } = useToast();

  const createCashInvoice = useMutation({
    mutationFn: async () => {
      setIsCreatingInvoice(true);

      try {
        const responseData =
          await cashInvoiceService.createCashInvoice(getRequestData());

        setInvoiceData({
          ...(responseData as unknown as InvoiceData),
          creditorName: responseData.customerName,
          invoiceId: responseData.invoiceId.split("-")[2],
          issuedTime: convertArrayToNormalFormat(responseData.issuedTime),
          contactNo: "",
          vehicle: responseData.vehicleNo,
          type: "CASH",
        });
      } finally {
        setIsCreatingInvoice(false);
      }
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
      execute: async () => {
        await createCashInvoice.mutate();
      },
      buttonName: "Create",
      isLoading: isCreatingInvoice,
    },
    {
      title: "Print Invoice",
      description: "Confirm print invoice",
      content: (
        <PrintInvoice
          buttonRef={printButtonRef}
          invoiceData={{ ...invoiceData, type: "CASH" }}
        />
      ),
      execute: () => {
        if (printButtonRef.current) {
          printButtonRef.current.click();
        }
      },
      buttonName: "Print",
      isDisabled: !invoiceData,
    },
  ];

  const handleVatIncludedChange = (checked: boolean) => {
    setVatIncluded(checked);
    if (checked) {
      setVatPercentage(
        vatPercentage > 0 ? vatPercentage : defaultVatPercentage
      );
    } else {
      setVatPercentage(0);
    }
  };

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
            <Separator className="my-4" />
            <div className="d-flex justify-between mb-4">
              <Label>Include VAT</Label>
              <Switch
                checked={vatIncluded}
                onCheckedChange={handleVatIncludedChange}
              />
            </div>
            {vatIncluded && (
              <>
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
                    disabled={!vatIncluded}
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
                    disabled={true}
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex justify-start text-left mt-16">
            <div className="text-left">
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
                      amount={totalWithVat}
                      currency="LKR"
                      withoutCurrency
                    />
                  </div>
                </div>
              </div>
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
