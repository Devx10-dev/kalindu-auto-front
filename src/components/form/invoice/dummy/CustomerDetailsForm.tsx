import {
  OptionalLabel,
  RequiredLabel,
} from "@/components/formElements/FormLabel";
import { Input } from "@/components/ui/input";
import { useState, useRef } from "react";

function CustomerDetailsForm({
  vehicleNo,
  customerName,
  setVehicleNo,
  setCustomerName,
}: {
  vehicleNo: string;
  customerName: string;
  setVehicleNo: React.Dispatch<React.SetStateAction<string>>;
  setCustomerName: React.Dispatch<React.SetStateAction<string>>;
}) {
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
  return (
    <div className="flex justify-between gap-5">
      <div className="flex flex-col flex-grow">
        <RequiredLabel label="Customer Name" />
        <Input
          type="text"
          value={customerName}
          ref={(el) => (inputRefs.current[1] = el)}
          onKeyDown={(e) => handleKeyDown(e, 1)}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Enter customer name"
        />
      </div>
      <div className="flex flex-col gap-2 flex-grow">
        <OptionalLabel label="Vehicle No" />
        <Input
          type="text"
          value={vehicleNo}
          ref={(el) => (inputRefs.current[2] = el)}
          onKeyDown={(e) => handleKeyDown(e, 2)}
          onChange={(e) => setVehicleNo(e.target.value)}
          placeholder="Enter vehicle number"
        />
      </div>
    </div>
  );
}

export default CustomerDetailsForm;
