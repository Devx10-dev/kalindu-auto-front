import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useCreditorInvoiceStore from "../context/useCreditorInvoiceStore";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const OutsourcedItemDetails: React.FC = () => {
  const {
    invoiceItemDTOList,
    getOutsourcedItems,
    setOutsourcedCompanyName,
    setOutsourcedBuyingPrice,
    setOutsourcedStatus,
  } = useCreditorInvoiceStore();
  const outsourcedItems = getOutsourcedItems();
  return (
    <div>
      <Card className="mt-5 mb-5 shadow-sm">
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue={"1"}
        >
          <AccordionItem value="1">
            <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle className="text-sm">
                  Outsourced Item Details
                </CardTitle>
                <CardDescription className="text-sm">
                  This section is used to add details of outsourced items for
                  the invoice.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <AccordionTrigger className="p-2 rounded-md bg-primary-500 border border-primary-500" />
              </div>
            </CardHeader>
            <AccordionContent>
              <CardContent className="p-2 pt-0 md:p-6">
                {invoiceItemDTOList.map((item: any, index) => (
                  <div key={index} className="grid grid-cols-6 gap-4 mb-4">
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
                        onChange={(e) =>
                          setOutsourcedBuyingPrice(
                            item,
                            parseFloat(e.target.value),
                          )
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-2 items-center">
                      <Label className="text-center">Action</Label>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-fit"
                        onClick={() => {
                          setOutsourcedStatus(item, false);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    </div>
  );
};

export default OutsourcedItemDetails;
