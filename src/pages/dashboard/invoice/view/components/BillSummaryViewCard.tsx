import { OptionalLabel } from "@/components/formElements/FormLabel";
import IconCash from "@/components/icon/IconCash";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
  discountPercentage,
  discountAmount,
}: {
  total: number;
  vatPercentage: number;
  discountPercentage: number;
  discountAmount: number;
}) {
  const [netTotal, setNetTotal] = useState<number>(0);

  const calculateNetTotal = (
    total: number,
    vatPercentage: number,
    discountPercentage: number,
    discountAmount: number,
  ) => {
    setNetTotal(total - discountAmount + total * (vatPercentage / 100));
  };

  useEffect(() => {
    if (
      total != undefined &&
      vatPercentage != undefined &&
      discountPercentage != undefined &&
      discountAmount != undefined
    ) {
      calculateNetTotal(
        total,
        vatPercentage,
        discountPercentage,
        discountAmount,
      );
    }
  }, [total, vatPercentage, discountPercentage, discountAmount]);

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
            <p className="text-right text-md font-regular">{vatPercentage}%</p>
          </div>
          <div className="d-flex justify-between mb-2">
            <OptionalLabel style={{ fontSize: 14 }} label="VAT Amount" />
            <p className="text-right text-md font-regular">
              LKR {total * (vatPercentage / 100)}
            </p>
          </div>
        </div>
        <Separator className="mt-8 mb-4" />
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
              <p className="text-4xl font-semibold">{netTotal}</p>
            </div>
          </div>
          <div className="flex-space-between w-full">
            <Button className="mt-4 mb-3 w-full">
              <Printer className={"mr-2"} /> Print Invoice
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default BillSummaryViewCard;
