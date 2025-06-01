import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useCreditorInvoiceStore from "../context/useCreditorInvoiceStore.tsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Commissions: React.FC = () => {
  const {
    setCommissionName,
    setCommissionAmount,
    setCommissionRemark,
    commissionName,
    commissionAmount,
    commissionRemark,
  } = useCreditorInvoiceStore();

  return (
    <Card className="mb-3">
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue={"single"}
      >
        <AccordionItem value="1">
          <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-sm">Commission Details</CardTitle>
              <CardDescription className="text-sm">
                This section is used to add commission details for the invoice.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <AccordionTrigger className="p-2 rounded-md bg-primary-500 border border-primary-500" />
            </div>
          </CardHeader>
          <AccordionContent>
            <CardContent className="p-2 pt-0 md:p-6">
              <div className="flex flex-col gap-5">
                <div className="flex justify-between gap-5">
                  <div className="flex flex-col gap-2 flex-grow">
                    <Label>Name</Label>
                    <Input
                      type="text"
                      value={commissionName || ""}
                      onChange={(e) => setCommissionName(e.target.value)}
                      placeholder="Enter commission name"
                    />
                  </div>
                  <div className="flex flex-col gap-2 flex-grow">
                    <Label>Remark</Label>
                    <Input
                      type="text"
                      //this should be number and cannot be negative
                      value={commissionRemark || ""}
                      onChange={(e) => setCommissionRemark(e.target.value)}
                      placeholder="Small remark about the commission"
                    />
                  </div>
                  <div className="flex flex-col gap-2 flex-grow">
                    <Label>Amount (LKR) </Label>
                    <Input
                      type="number"
                      //this should be number and cannot be negative
                      value={commissionAmount || ""}
                      onChange={(e) =>
                        setCommissionAmount(parseInt(e.target.value))
                      }
                      placeholder="Enter the total commise amount"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default Commissions;
