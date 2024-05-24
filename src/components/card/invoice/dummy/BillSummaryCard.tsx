import { OptionalLabel } from "@/components/formElements/FormLabel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Delete, Printer } from "lucide-react";
import React, { useState } from "react";

const BillSummaryCard: React.FC = () => {
  const [discountPercentage, setDiscountPercentage] = useState(0);

  return (
    <Card>
      <CardContent className="p-5 shadow-sm pt-0">
        <h3 className="text-2xl font-semibold leading-none tracking-tight mb-4">
          Bill Summary
        </h3>
        <div style={{ marginTop: "30px" }}>
          <div className="d-flex justify-between mb-2">
            <OptionalLabel label="Discount (%)" style={{ fontSize: 14 }} />
            <Input
              type="number"
              value={discountPercentage}
              placeholder="Discount"
              style={{
                maxWidth: "100px",
                textAlign: "right",
                padding: 1,
                maxHeight: 20,
              }}
              min={0}
              max={100}
            />
          </div>
          <div className="d-flex justify-between mb-2">
            <OptionalLabel style={{ fontSize: 14 }} label="Discount Amount" />
            <Input
              type="number"
              value={discountPercentage}
              placeholder="Discount Amount"
              style={{
                maxWidth: "100px",
                textAlign: "right",
                maxHeight: 20,
                padding: 1,
              }}
              min={0}
            />
          </div>
          <div className="d-flex justify-between mb-2">
            <OptionalLabel style={{ fontSize: 14 }} label="VAT (%)" />
            <Input
              type="number"
              value={discountPercentage}
              placeholder="Discount"
              style={{
                maxWidth: "100px",
                textAlign: "right",
                maxHeight: 20,
                padding: 1,
              }}
            />
          </div>
          <div className="d-flex justify-between mb-2">
            <OptionalLabel style={{ fontSize: 14 }} label="VAT Amount" />
            <Input
              type="number"
              value={discountPercentage}
              placeholder="Discount"
              style={{
                maxWidth: "100px",
                textAlign: "right",
                maxHeight: 20,
                padding: 1,
              }}
            />
          </div>
        </div>
        <div className="flex justify-start text-left mt-16">
          <div className="text-left">
            <p className="text-xl font-semibold bg-slate-200 text-slate-900 pl-4 pt-2 pb-2 pr-4 rounded-md">
              Total : LKR 9000.00
            </p>
            <div className="d-flex">
              <Button className="mt-4 mb-3">
                <Printer className={"mr-2"} /> Print Invoice
              </Button>
              <Button className="mt-4 mb-3 bg-red-500 ml-2">
                <Delete className={"mr-2"}/> Cancel
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BillSummaryCard;
