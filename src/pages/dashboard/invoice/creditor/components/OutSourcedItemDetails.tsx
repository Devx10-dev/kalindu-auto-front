import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import useCreditorInvoiceStore from "../context/useCreditorInvoiceStore";

const OutsourcedItemDetails: React.FC = () => {
  const {
    getOutsourcedItems,
    setOutsourcedCompanyName,
    setOutsourcedBuyingPrice,
  } = useCreditorInvoiceStore();
  const outsourcedItems = getOutsourcedItems();
  return (
    <div>
      <Card className="mt-5 mb-5 shadow-sm">
        <CardContent className="p-3 shadow-sm">
          <div>
            <h2 className="text-xl font-bold mb-8">Outsourced Item Details</h2>
          </div>
          {outsourcedItems.map((item: any) => (
            <div key={item.index} className="grid grid-cols-5 gap-4 mb-4">
              <div className="flex flex-col gap-2">
                <Label>Item Name</Label>
                <Input type="text" value={item.name} disabled />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Item Code</Label>
                <Input type="text" value={item.code} disabled />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Quantity</Label>
                <Input type="text" value={item.quantity} disabled />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Company Name</Label>
                <Input
                  type="text"
                  value={item.companyName}
                  onChange={(e) =>
                    setOutsourcedCompanyName(item, e.target.value)
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Buying Price</Label>
                <Input
                  type="number"
                  value={item.buyingPrice}
                  onChange={(e) => {
                    setOutsourcedBuyingPrice(item, parseFloat(e.target.value));
                  }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default OutsourcedItemDetails;
