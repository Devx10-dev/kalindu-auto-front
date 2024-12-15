import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Delete, Loader2, Printer } from "lucide-react";
import useCreditorInvoiceStore from "../context/useCreditorInvoiceStore";
import { useToast } from "@/components/ui/use-toast.ts";
import { CreditInvoiceService } from "@/service/invoice/creditInvoiceService.ts";
import useAxiosPrivate from "@/hooks/usePrivateAxios.ts";
import { CashInvoiceService } from "@/service/invoice/cashInvoiceApi.ts";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import Loading from "@/components/Loading";

const BillSummary: React.FC = () => {
  //     ----------     STATE INITIALIZATION     ----------     //

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
  const navigate = useNavigate();
  const { toast } = useToast();

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

  //     ----------     BACKEND API MUTATIONS (CALLS)    ----------     //

  //create creditor mutation
  const createCreditorInvoice = useMutation({
    mutationFn: () =>
      creditInvoiceService.createCreditInvoice(getRequestData()),
    onSuccess: (invoiceData) => {
      resetState();
      navigate("print", { state: { invoiceData } }); // this state will be accessed from the print component
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
    },
  });

  async function printAndSaveInvoice() {
    //validations
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

    //mutation
    createCreditorInvoice.mutate();
  }

  //     ----------     HELPER FUNCTIONS     ----------     //

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

  useEffect(() => {
    // LOG getRequestData()
    console.log(getRequestData());
  }, [
    getRequestData,
    invoiceItemDTOList,
    creditorID,
    discountPercentage,
    discountAmount,
    vatPercentage,
    vatAmount,
    totalWithVat,
  ]);

  return (
    <Card>
      <CardContent className="p-3 shadow-sm w-72">
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
            <Label>VAT (%)</Label>
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
          <div>
            {/* TODO :: Find a better way to have the white space on right */}
          </div>
          <div>
            {/* TODO :: Find a better way to have the white space on right */}
          </div>
        </div>
        <div className="flex justify-start text-left mt-16">
          <div className="text-left">
            <p className="text-xl font-semibold bg-slate-200 text-slate-900 pl-4 pt-2 pb-2 pr-4 rounded-md">
              Total : LKR {totalWithVat.toFixed(2)}
            </p>
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
  );
};

export default BillSummary;
