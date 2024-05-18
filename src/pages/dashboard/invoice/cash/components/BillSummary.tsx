import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Delete, Printer } from "lucide-react";
import useInvoiceStore from "../context/useCashInvoiceStore";

type summaryProps = {
  printAndSaveInvoice: () => void;
};

const BillSummary = (props: summaryProps) => {
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
  } = useInvoiceStore();

  const subtotal = invoiceItemDTOList.reduce(
      (acc: any, item: any) => acc + item.quantity * item.price - item.quantity * item.discount,
      0
  );

  const discountedTotal = subtotal - (discountAmount || 0);
  const totalWithVat = discountedTotal + (vatAmount || 0);

  const handleDiscountPercentageChange = (
      e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const percentage = parseFloat(e.target.value);
    setDiscountPercentage(percentage);
    setDiscountAmount((subtotal * percentage) / 100);
  };

  const handleDiscountAmountChange = (
      e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const amount = parseFloat(e.target.value);
    setDiscountAmount(amount);
    setDiscountPercentage((amount / subtotal) * 100);
  };

  const handleVatPercentageChange = (
      e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const percentage = parseFloat(e.target.value);
    setVatPercentage(percentage);
    setVatAmount((discountedTotal * percentage) / 100);
  };

  const handleVatAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(e.target.value);
    setVatAmount(amount);
    setVatPercentage((amount / discountedTotal) * 100);
  };

  return (
      <Card className="w-full">
        <CardContent className="p-3 shadow-sm  bg-slate-200 w-full">
          <h2 className="text-xl font-bold mb-8">Bill Summary</h2>
          <div className="grid grid-cols-7 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Discount Percentage (%)</Label>
              <Input
                  type="number"
                  value={discountPercentage}
                  onChange={handleDiscountPercentageChange}
                  placeholder="Discount Percentage"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Discount Amount (LKR)</Label>
              <Input
                  type="number"
                  value={discountAmount}
                  onChange={handleDiscountAmountChange}
                  placeholder="Discount Amount"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>VAT Percentage (%)</Label>
              <Input
                  type="number"
                  value={vatPercentage}
                  onChange={handleVatPercentageChange}
                  placeholder="VAT Percentage"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>VAT Amount (LKR)</Label>
              <Input
                  type="number"
                  value={vatAmount}
                  onChange={handleVatAmountChange}
                  placeholder="VAT Amount"
              />
            </div>
            <span className="text-xl bg-slate-200 text-slate-900 p-5 rounded-md">
            Total : LKR {totalWithVat.toFixed(2)}
          </span>
            <Button
                className="mt-4 mb-5"
                onClick={() => props.printAndSaveInvoice()}
            >
              <Printer className={"mr-2"} /> Print Invoice
            </Button>
            <Button className="mt-4 mb-5 bg-red-400 ml-2 text-black">
              <Delete className={"mr-2"} /> Cancel
            </Button>
          </div>
          <div className="flex justify-start text-left mt-4">
            <div className="text-left"></div>
          </div>
        </CardContent>
      </Card>
  );
};

export default BillSummary;
