import { RequiredLabel } from "@/components/formElements/FormLabel";
import { Input } from "@/components/ui/input";
import { useState } from "react";

function CustomerDetailsForm() {
  const [customerName, setCustomerName] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  
  return (
    <div className="flex justify-between gap-5">
      <div className="flex flex-col gap-2 flex-grow">
        <RequiredLabel label="Customer Name"  />
        <Input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Enter customer name"
        />
      </div>
      <div className="flex flex-col gap-2 flex-grow">
        <RequiredLabel label="Vehicle No" />
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
