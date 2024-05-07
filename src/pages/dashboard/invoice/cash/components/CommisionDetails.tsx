import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface CommissionDetail {
  personName: string;
  remark: string;
  amount: number;
}

const CommissionDetails: React.FC = () => {
  const [commissionDetails, setCommissionDetails] = useState<
    CommissionDetail[]
  >([]);

  const handleAddCommissionDetail = () => {
    setCommissionDetails([
      ...commissionDetails,
      { personName: "", remark: "", amount: 0 },
    ]);
  };

  const handlePersonNameChange = (index: number, value: string) => {
    setCommissionDetails(
      commissionDetails.map((detail, i) =>
        i === index ? { ...detail, personName: value } : detail
      )
    );
  };

  const handleRemarkChange = (index: number, value: string) => {
    setCommissionDetails(
      commissionDetails.map((detail, i) =>
        i === index ? { ...detail, remark: value } : detail
      )
    );
  };

  const handleAmountChange = (index: number, value: number) => {
    setCommissionDetails(
      commissionDetails.map((detail, i) =>
        i === index ? { ...detail, amount: value } : detail
      )
    );
  };

  return (
    <div className="mb-10">
      <Card >
        <CardContent className="p-3 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Commission Details</h2>
          {commissionDetails.map((detail, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 mb-4">
              <div className="flex flex-col gap-2">
                <Label>Person Name</Label>
                <Input
                  type="text"
                  value={detail.personName}
                  onChange={(e) =>
                    handlePersonNameChange(index, e.target.value)
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Remark</Label>
                <Input
                  type="text"
                  value={detail.remark}
                  onChange={(e) => handleRemarkChange(index, e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Amount</Label>
                <Input
                  type="number"
                  value={detail.amount}
                  onChange={(e) =>
                    handleAmountChange(index, parseFloat(e.target.value))
                  }
                />
              </div>
            </div>
          ))}
          <Button onClick={handleAddCommissionDetail}>
            <PlusCircle />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommissionDetails;
