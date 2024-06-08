import {
  OptionalLabel,
  RequiredLabel,
} from "@/components/formElements/FormLabel";
import { Input } from "@/components/ui/input";
import { useState } from "react";

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
  return (
    <div className="flex justify-between gap-5">
      <div className="flex flex-col gap-2 flex-grow">
        <RequiredLabel label="Customer Name" />
        <Input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Enter customer name"
        />
      </div>
      <div className="flex flex-col gap-2 flex-grow">
        <OptionalLabel label="Vehicle No" />
        <Input
          type="text"
          value={vehicleNo}
          onChange={(e) => setVehicleNo(e.target.value)}
          placeholder="Enter vehicle number"
        />
      </div>
    </div>
  );
}

export default CustomerDetailsForm;
