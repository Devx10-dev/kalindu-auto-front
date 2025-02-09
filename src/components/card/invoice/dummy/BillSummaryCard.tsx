import { OptionalLabel } from "@/components/formElements/FormLabel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { OutsourcedItem } from "@/types/invoice/cash/cashInvoiceTypes";
import {
  DummyInvoice,
  DummyInvoiceItem,
} from "@/types/invoice/dummy/dummyInvoiceTypes";
import { UseMutationResult } from "@tanstack/react-query";
import { Delete, Printer } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";

function BillSummaryCard({
  total,
  vatPercentage,
  discountPercentage,
  setVatPrecentage,
  setDiscountPrecentage,
  setCustomerName,
  setVehicleNo,
  setItems,
  setOutsourcedItems,
  createDummyInvoiceMutation,
}: {
  total: number;
  vatPercentage: number;
  discountPercentage: number;
  setVatPrecentage: React.Dispatch<React.SetStateAction<number>>;
  setDiscountPrecentage: React.Dispatch<React.SetStateAction<number>>;
  setItems: React.Dispatch<React.SetStateAction<DummyInvoiceItem[]>>;
  setCustomerName: React.Dispatch<React.SetStateAction<string>>;
  setVehicleNo: React.Dispatch<React.SetStateAction<string>>;
  setOutsourcedItems: React.Dispatch<React.SetStateAction<OutsourcedItem[]>>;
  createDummyInvoiceMutation: UseMutationResult<
    DummyInvoice,
    Error,
    void,
    unknown
  >;
}) {
  const [vat, setVat] = useState(0);
  const [discount, setDiscount] = useState(0);

  //================ feild navigaton ==================//
  const inputRefs = useRef<any[]>([]);
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };
  //================ feild navigaton ==================//

  const [finalPrice, setFinalPrice] = useState(total);

  const calculateFinalPrice = () => {
    setFinalPrice(total - discount + vat);
  };

  const calculateDiscount = (percentage: number) => {
    setDiscountPrecentage(percentage);
    setDiscount((total * percentage) / 100);
  };

  const calculateDiscountPercentage = (amount: number) => {
    setDiscount(amount);
    setDiscountPrecentage(parseFloat(((amount / total) * 100).toFixed(2)));
  };

  const calculateVat = (vatPercentage: number) => {
    setVatPrecentage(vatPercentage);
    setVat(total * (vatPercentage / 100));
  };

  const calculateVatPercentage = (vatAmount: number) => {
    setVat(vatAmount);
    setVatPrecentage((vatAmount / total) * 100);
  };

  useEffect(() => {
    calculateFinalPrice();
  }, [discount, discountPercentage, vat, vatPercentage, total]);

  const cancelInvoice = () => {
    setItems([]);
    setOutsourcedItems([]);
    setCustomerName("");
    setVehicleNo("");
  };

  return (
    <Card>
      <CardContent className="p-5 shadow-sm pt-0">
        <h3 className="text-2xl font-semibold leading-none tracking-tight mb-4">
          Bill Summary
        </h3>
        <div style={{ marginTop: "30px" }}>
          <div className="d-flex justify-between mb-2 mt-2">
            <OptionalLabel
              label="Discount (%)"
              style={{ fontSize: 14, fontWeight: "bold" }}
            />
            <Input
              type="number"
              ref={(el) => (inputRefs.current[1] = el)}
              onKeyDown={(e) => handleKeyDown(e, 1)}
              value={discountPercentage}
              placeholder="Discount"
              style={{
                maxWidth: "100px",
                textAlign: "right",
                padding: 1,
                maxHeight: 30,
              }}
              step={"0.01"}
              onChange={(e) => calculateDiscount(parseFloat(e.target.value))}
              min={0}
              max={100}
            />
          </div>
          <div className="d-flex justify-between mb-2 mt-4">
            <OptionalLabel
              style={{ fontSize: 14, fontWeight: "bold" }}
              label="Discount Amount"
            />
            <Input
              type="number"
              value={discount}
              ref={(el) => (inputRefs.current[2] = el)}
              onKeyDown={(e) => handleKeyDown(e, 2)}
              placeholder="Discount Amount"
              style={{
                maxWidth: "100px",
                textAlign: "right",
                maxHeight: 30,
                padding: 1,
              }}
              min={0}
              step={"0.01"}
              onChange={(e) =>
                calculateDiscountPercentage(parseFloat(e.target.value))
              }
            />
          </div>
          <div className="d-flex justify-between mb-2 mt-4">
            <OptionalLabel
              style={{ fontSize: 14, fontWeight: "bold" }}
              label="VAT (%)"
            />
            <Input
              type="number"
              value={vatPercentage}
              ref={(el) => (inputRefs.current[3] = el)}
              onKeyDown={(e) => handleKeyDown(e, 3)}
              placeholder="VAT"
              style={{
                maxWidth: "100px",
                textAlign: "right",
                maxHeight: 30,
                padding: 1,
              }}
              step={"0.01"}
              min={0}
              onChange={(e) => calculateVat(parseFloat(e.target.value))}
            />
          </div>
          <div className="d-flex justify-between mb-2 mt-4">
            <OptionalLabel
              style={{ fontSize: 14, fontWeight: "bold" }}
              label="VAT Amount"
            />
            <Input
              type="number"
              value={vat}
              ref={(el) => (inputRefs.current[4] = el)}
              onKeyDown={(e) => handleKeyDown(e, 4)}
              placeholder="VAT amount"
              style={{
                maxWidth: "100px",
                textAlign: "right",
                maxHeight: 30,
                padding: 1,
              }}
              min={0}
              step={"0.01"}
              onChange={(e) =>
                calculateVatPercentage(parseFloat(e.target.value))
              }
            />
          </div>
        </div>
        <div className="flex justify-start text-left mt-16">
          <div className="text-left">
            <p className="text-xl font-semibold bg-slate-200 text-slate-900 pl-4 pt-2 pb-2 pr-4 rounded-md">
              {`Total : LKR ${
                finalPrice === undefined ? 0 : finalPrice.toFixed(2)
              }`}
            </p>
            <div className="d-flex">
              <Button
                ref={(el) => (inputRefs.current[5] = el)}
                className="mt-4 mb-3"
                onClick={() => createDummyInvoiceMutation.mutate()}
              >
                <Printer className={"mr-2"} /> Print Invoice
              </Button>
              <Button
                className="mt-4 mb-3 bg-red-500 ml-2"
                onClick={cancelInvoice}
              >
                <Delete className={"mr-2"} /> Cancel
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default BillSummaryCard;
