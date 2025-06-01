import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast.ts";
import useAxiosPrivate from "@/hooks/usePrivateAxios.ts";
import { CreditInvoiceService } from "@/service/invoice/creditInvoiceService.ts";
import { InvoiceData } from "@/types/Invoices/invoiceTypes";
import { extractDateFromIssuedTime } from "@/utils/dateTime";
import { useMutation } from "@tanstack/react-query";
import { Delete, Loader2, Printer } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import DialogStepper from "../../components/DialogStepper";
import InvoiceDetailedView from "../../components/InvoiceDetailedView";
import PrintInvoice from "../../components/PrintInvoice";
import useCreditorInvoiceStore from "../context/useCreditorInvoiceStore";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import IconCash from "@/components/icon/IconCash";
import CurrencyComponent from "../../view/components/CurrencyComponent";

const BillSummary: React.FC = () => {
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
    creditorID,
    resetState,
  } = useCreditorInvoiceStore();

  const axiosPrivate = useAxiosPrivate();
  const creditInvoiceService = new CreditInvoiceService(axiosPrivate);
  const { toast } = useToast();
  const printButtonRef = useRef<HTMLButtonElement | null>(null);

  const [open, setOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(null);
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [defaultVatPercentage, setDefaultVatPercentage] = useState(18);
  const [vatIncluded, setVatIncluded] = useState(true);

  const subtotal = useMemo(() => {
    return invoiceItemDTOList.reduce(
      (acc: any, item: any) =>
        acc + item.quantity * item.price - item.quantity * item.discount,
      0,
    );
  }, [invoiceItemDTOList]);

  const discountedTotal = useMemo(
    () => subtotal - (discountAmount || 0),
    [subtotal, discountAmount],
  );
  const totalWithVat = useMemo(
    () => discountedTotal + (vatAmount || 0),
    [discountedTotal, vatAmount],
  );

  // Update the total price when discountedTotal or vatAmount changes
  useEffect(() => {
    setTotalPrice(totalWithVat);
  }, [totalWithVat, setTotalPrice]);

  // const sleep = (ms: number) =>
  //   new Promise((resolve) => setTimeout(resolve, ms));

  const createCreditorInvoice = useMutation({
    mutationFn: async () => {
      setIsCreatingInvoice(true);
      try {
        const responseData =
          await creditInvoiceService.createCreditInvoice(getRequestData());

        // await sleep(10000);

        const formattedInvoiceData = {
          ...(responseData as unknown as InvoiceData),
          creditorName: responseData.creditor.shopName,
          invoiceId: responseData.invoiceId.toString().split("-")[2],
          issuedTime: extractDateFromIssuedTime(responseData.issuedTime),
          contactNo: responseData.creditor.primaryContact,
          vehicle: "",
          type: "CREDIT",
        };

        setInvoiceData(formattedInvoiceData);
        return formattedInvoiceData;
      } finally {
        setIsCreatingInvoice(false);
      }
    },
    onSuccess: () => {
      resetState();
      toast({
        variant: "default",
        title: "Success",
        description: "Successfully created creditor invoice ✅",
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
      setOpen(false); // Close dialog on error
    },
  });

  async function printAndSaveInvoice() {
    // validations
    if (invoiceItemDTOList.length === 0) {
      return toast({
        title: "No items added to the invoice",
        description: "",
        variant: "destructive",
      });
    }

    if (creditorID === undefined || creditorID === null) {
      return toast({
        title: "No creditor selected",
        description: "Please select a creditor and then submit",
        variant: "destructive",
      });
    }

    setOpen(true);
  }

  const handleDiscountPercentageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const percentage = Math.max(parseFloat(e.target.value), 0);
    setDiscountPercentage(percentage);
    setDiscountAmount((subtotal * percentage) / 100);
  };

  const handleDiscountAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const amount = Math.max(parseFloat(e.target.value), 0);
    setDiscountAmount(amount);
    setDiscountPercentage((amount / subtotal) * 100);
  };

  const handleVatPercentageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const percentage = Math.max(parseFloat(e.target.value), 0);
    setVatPercentage(percentage);
    setVatAmount((discountedTotal * percentage) / 100);
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
        await createCreditorInvoice.mutateAsync();
      },
      buttonName: "Create",
      isLoading: isCreatingInvoice,
    },
    {
      title: "Print Invoice",
      description: "Confirm print invoice",
      content: (
        <PrintInvoice buttonRef={printButtonRef} invoiceData={invoiceData} />
      ),
      execute: () => {
        if (printButtonRef.current) {
          printButtonRef.current.click();
        }
      },
      buttonName: "Print",
      isDisabled: !invoiceData, // Disable if invoice data is not available
    },
  ];

  const handleVatIncludedChange = (checked: boolean) => {
    setVatIncluded(checked);
    if (checked) {
      setVatPercentage(
        vatPercentage > 0 ? vatPercentage : defaultVatPercentage,
      );
    } else {
      setVatPercentage(0);
    }
  };

  return (
    <>
      <Card className="w-72">
        <CardContent className="p-3 shadow-sm">
          <h3 className="text-xl font-semibold leading-none tracking-tight mb-4">
            Bill Summary
          </h3>
          <div className="mt-8">
            <div className="d-flex justify-between">
              <Label>Discount (%)</Label>
              <Input
                style={{
                  maxWidth: "100px",
                  textAlign: "right",
                  padding: 2,
                  maxHeight: 24,
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
                  maxHeight: 24,
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
                  <Label>VAT (%)</Label>
                  <Input
                    style={{
                      maxWidth: "100px",
                      textAlign: "right",
                      padding: 2,
                      maxHeight: 24,
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
                      maxHeight: 24,
                    }}
                    type="number"
                    value={vatAmount}
                    onChange={handleVatAmountChange}
                    disabled={true}
                  />
                </div>
              </>
            )}
            <div>
              {/* TODO :: Find a better way to have the white space on right */}
            </div>
            <div>
              {/* TODO :: Find a better way to have the white space on right */}
            </div>
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
              {createCreditorInvoice.isPending ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Printing...
                </Button>
              ) : (
                <Button
                  className="mt-4 mb-5"
                  onClick={() => printAndSaveInvoice()}
                >
                  <Printer className={"mr-2"} /> Print Invoice
                </Button>
              )}

              <Button
                className="mt-4 mb-5 bg-red-500 ml-2"
                onClick={() => resetState()}
              >
                <Delete className={"mr-2"} /> Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <DialogStepper open={open} setOpen={setOpen} steps={steps} />
    </>
  );
};

export default BillSummary;
