import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Delete, Printer } from "lucide-react";
import useCreditorInvoiceStore from "../context/useCreditorInvoiceStore";
import { useToast } from "@/components/ui/use-toast.ts";

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
  } = useCreditorInvoiceStore();

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

  const handleVatAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = Math.max(parseFloat(e.target.value), 0);
    setVatAmount(amount);
    setVatPercentage((amount / discountedTotal) * 100);
  };

  const { toast } = useToast();

  async function printAndSaveInvoice() {
    if (invoiceItemDTOList.length === 0) {
      return toast({
        title: "No items added to the invoice",
        description: "",
        variant: "destructive",
      });
    }

    try {
      const requestData = getRequestData();
      console.log(requestData);
      // const createdInvoice =
      //     await cashInvoiceService.createCashInvoice(requestData);
      // console.log("Cash invoice created:", createdInvoice);
      // Handle success response, such as printing the invoice or displaying a success message
      toast({
        title: "Invoice created successfully",
        description: "The cash invoice has been created and printed.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error creating cash invoice:", error);
      // Handle error
      toast({
        title: "Error creating invoice",
        description: "Failed to create the cash invoice. Please try again.",
        variant: "destructive",
      });
    }
  }

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
            <Button className="mt-4 mb-5" onClick={() => printAndSaveInvoice()}>
              <Printer className={"mr-2"} /> Print Invoice
            </Button>
            <Button className="mt-4 mb-5 bg-red-500 ml-2">
              <Delete className={"mr-2"} /> Cancel
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BillSummary;
