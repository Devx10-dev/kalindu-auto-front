import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible.tsx";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronsUpDown } from "lucide-react";
import React, { useState } from "react";
import useCashInvoiceStore from "../context/useCashInvoiceStore.tsx";

const Commissions: React.FC = () => {
  const {
    setCommissionName,
    setCommissionAmount,
    setCommissionRemark,
    commissionName,
    commissionAmount,
    commissionRemark,
  } = useCashInvoiceStore();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="mb-3">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
        <div className="flex gap-4 items-center ml-4">
          <h2 className="text-xl font-bold mb-4">Commission Details</h2>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              <ChevronsUpDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="space-y-2">
          <CardContent className="p-4 shadow-sm">
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
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default Commissions;
