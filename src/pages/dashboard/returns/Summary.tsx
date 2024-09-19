import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Delete, Printer } from "lucide-react";
import useReturnInvoiceStore from "./context/useReturnInvoiceStore";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import { useToast } from "@/components/ui/use-toast.ts";
import { ReturnService } from "@/service/return/ReturnService.ts";
import { OptionalLabel } from "@/components/formElements/FormLabel.tsx";

const Summary = () => {
  const {
    customerName,
    sourceInvoiceId,
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
    returnAmount,
    purchaseDate,
    totalPrice,
  } = useReturnInvoiceStore();

  const axiosPrivate = useAxiosPrivate();
  const returnInvoiceService = new ReturnService(axiosPrivate);
  const [netPaidAmount, setNetPaidAmount] = useState(returnAmount);

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
    setNetPaidAmount(totalWithVat - returnAmount);
  }, [totalWithVat, setNetPaidAmount, returnAmount]);

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
    try {
      const requestData = getRequestData();
      console.log(requestData);
      const createdInvoice =
        await returnInvoiceService.createReturnInvoice(requestData);
      console.log("Cash invoice created:", requestData);
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
      <CardContent className="p-5 shadow-sm pt-0">
        <h3 className="text-2xl font-semibold leading-none tracking-tight mb-4">
          Summary
        </h3>
        <div className="flex flex-col">
          {sourceInvoiceId && (
            <div
              className="border-2 border-gray-300 "
              style={{
                padding: 15,
                borderRadius: 5,
              }}
            >
              <div>
                {purchaseDate && (
                  <p className="text-sm text-gray-500">#{sourceInvoiceId}</p>
                )}
              </div>
              <div className="d-flex align">
                <p className="text-2xl text-gray-800">{customerName}</p>
              </div>
              <div className="d-flex align">
                {/* <p className="text-sm text-gray-500">{`Purchased ${purchaseDate[2]}/${purchaseDate[1]}/${purchaseDate[0]}`}</p> */}
                {purchaseDate && (
                  <p className="text-sm text-gray-400">{`Purchased ${purchaseDate[2]}/${purchaseDate[1]}/${purchaseDate[0]}`}</p>
                )}
              </div>
            </div>
          )}
          <div
            className="border-2 border-gray-300 mt-5"
            style={{
              padding: 15,
              borderRadius: 5,
            }}
          >
            <div className="d-flex align justify-between">
              <p className="text-sm text-gray-500">Return Amount: </p>
              <p className="text-sm text-gray-800">
                LKR {returnAmount && returnAmount.toFixed(2)}
              </p>
            </div>
            <div className="d-flex align justify-between">
              <p className="text-sm text-gray-500">Purchase Amount: </p>
              <p className="text-sm text-gray-800">
                LKR {returnAmount && totalWithVat.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* <div className="mt-8">
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
        </div> */}

        <div className="flex justify-start text-left mt-10">
          <div className="text-left">
            <p className="text-lg font-semibold bg-slate-200 text-slate-900 pl-4 pt-2 pb-2 pr-4 rounded-md">
              NET PAID : LKR {netPaidAmount.toFixed(2)}
            </p>
            <div className="d-flex">
              <Button
                className="mt-4 mb-3"
                onClick={() => printAndSaveInvoice()}
              >
                <Printer className={"mr-2"} />
                Print Invoice
              </Button>
              <Button className="mt-4 mb-3 bg-red-400 ml-2 text-white">
                <Delete className={"mr-2"} /> Cancel
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Summary;
