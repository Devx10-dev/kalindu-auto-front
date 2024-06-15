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
import React, { useEffect, useState } from "react";

function BillSummaryViewCard({
  total,
  vatPercentage,
  vatAmount,
  discountPercentage,
  discountAmount,
}: {
  total: number;
  vatPercentage: number;
  vatAmount: number;
  discountPercentage: number;
  discountAmount: number;
}) {

  return (
    <Card>
      <CardContent className="p-5 shadow-sm pt-0">
        <h3 className="text-2xl font-semibold leading-none tracking-tight mb-4">
          Bill Summary
        </h3>
        <div style={{ marginTop: "30px" }}>
          <div className="d-flex justify-between mb-2">
            <OptionalLabel label="Discount (%)" style={{ fontSize: 14 }} />
            <p className="text-right text-md font-regular">
                {discountPercentage}%
            </p>
          </div>
          <div className="d-flex justify-between mb-2">
            <OptionalLabel style={{ fontSize: 14 }} label="Discount Amount" />
            <p className="text-right text-md font-regular">
                LKR {discountAmount}
            </p>
          </div>
          <div className="d-flex justify-between mb-2">
            <OptionalLabel style={{ fontSize: 14 }} label="VAT (%)" />
            <p className="text-right text-md font-regular">
                {vatPercentage}%
            </p>

          </div>
          <div className="d-flex justify-between mb-2">
            <OptionalLabel style={{ fontSize: 14 }} label="VAT Amount" />
            <p className="text-right text-md font-regular">
                LKR {vatAmount}
            </p>
          </div>
        </div>
        <div className="flex space-between text-left mt-16 w-full center">
          <div className="text-center">
            <p className="text-xl font-semibold bg-slate-200 text-slate-900 pl-4 pt-2 pb-2 pr-4 rounded-md">
              {`Total : LKR ${total}`}
            </p>
            <div className="flex-space-between w-full">
              <Button
                className="mt-4 mb-3 w-full"
              >
                <Printer className={"mr-2"} /> Print Invoice
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default BillSummaryViewCard;
