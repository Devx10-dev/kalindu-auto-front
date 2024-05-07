import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Delete, Printer } from "lucide-react";
import useInvoiceStore from "../context/Store";

const BillSummary: React.FC = () => {
  const { items } = useInvoiceStore();
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [vatPercentage, setVatPercentage] = useState(0);
  const [vatAmount, setVatAmount] = useState(0);

  const subtotal = items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  const discountedTotal = subtotal - discountAmount;
  const totalWithVat = discountedTotal + vatAmount;

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
    <Card>
      <CardContent className="p-3 shadow-sm">
        <div>
          <h2 className="text-xl font-bold mb-8">Bill Summary</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label>Discount Percentage</Label>
            <Input
              type="number"
              value={discountPercentage}
              onChange={handleDiscountPercentageChange}
              placeholder="Discount Percentage"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Discount Amount</Label>
            <Input
              type="number"
              value={discountAmount}
              onChange={handleDiscountAmountChange}
              placeholder="Discount Amount"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>VAT Percentage</Label>
            <Input
              type="number"
              value={vatPercentage}
              onChange={handleVatPercentageChange}
              placeholder="VAT Percentage"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>VAT Amount</Label>
            <Input
              type="number"
              value={vatAmount}
              onChange={handleVatAmountChange}
              placeholder="VAT Amount"
            />
          </div>
        </div>
        <div className="flex justify-start text-left mt-4">
          <div className="text-left">
            <p className="text-xl bg-slate-200 text-slate-900 p-5 rounded-md">
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
