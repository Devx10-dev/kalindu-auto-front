import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Delete, Printer } from "lucide-react";
import React, { useState } from "react";
import useCreditorInvoiceStore from "../context/useCreditorInvoiceStore";

const BillSummary: React.FC = () => {
  const items = [{}];
  const {
    setCreditor,
    creditorID,
    creditorName,
    getOutsourcedItems,
    invoiceItemDTOList,
  } = useCreditorInvoiceStore();
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [vatPercentage, setVatPercentage] = useState(0);
  const [vatAmount, setVatAmount] = useState(0);

  const subtotal = invoiceItemDTOList.reduce(
    (acc: any, item: any) => acc + item.quantity * item.price - item.discount,
    0,
  );
  let totalWithVat = 0;
  const discountedTotal = subtotal - discountAmount;
  totalWithVat = discountedTotal + vatAmount;

  const handleDiscountPercentageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const percentage = parseFloat(e.target.value);
    setDiscountPercentage(percentage);
    setDiscountAmount((subtotal * percentage) / 100);
  };

  const handleDiscountAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const amount = parseFloat(e.target.value);
    setDiscountAmount(amount);
    setDiscountPercentage((amount / subtotal) * 100);
  };

  const handleVatPercentageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
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
    <Card>
      <CardContent className="p-3 shadow-sm w-72">
        <div>
          <h2 className="text-xl font-bold mb-8">Bill Summary</h2>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Discount (%)</Label>
            <Input
              type="number"
              value={discountPercentage}
              onChange={handleDiscountPercentageChange}
              placeholder="Discount Percentage"
              className="bg-slate-100"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Discount Amount (LKR)</Label>
            <Input
              type="number"
              value={discountAmount}
              onChange={handleDiscountAmountChange}
              placeholder="Discount Amount"
              className="bg-slate-100"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>VAT (%)</Label>
            <Input
              type="number"
              value={vatPercentage}
              onChange={handleVatPercentageChange}
              placeholder="VAT Percentage"
              className="bg-slate-100"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>VAT Amount (LKR)</Label>
            <Input
              type="number"
              value={vatAmount}
              onChange={handleVatAmountChange}
              placeholder="VAT Amount"
              className="bg-slate-100"
            />
          </div>
          <div>
            {/* TODO :: Find a better way to have the white space on right */}
          </div>
          <div>
            {/* TODO :: Find a better way to have the white space on right */}
          </div>
        </div>
        <div className="flex justify-start text-left mt-4">
          <div className="text-left">
            <p className="text-xl bg-slate-200 text-slate-900 p-5 rounded-md font-bold">
              Total : LKR {totalWithVat.toFixed(2)}
            </p>
            <Button className="mt-4 mb-5">
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
