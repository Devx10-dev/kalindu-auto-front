import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import useCashInvoiceStore from "../context/useCashInvoiceStore.tsx";
import { useRef, forwardRef } from "react";

// Define the props type if any (can be empty for now)
type CustomerDetailsProps = {
  // Add any other props here if necessary
};
const CustomerDetails = forwardRef<HTMLButtonElement, CustomerDetailsProps>(
  (props, ref) => {
    //================ feild navigaton ==================//
    const customerNameRef = useRef(null);
    const vehicleNoRef = useRef(null);

    const handleKeyDown = (e, nextRef) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (nextRef.current) {
          nextRef.current.focus();
        }
      }
    };
    //================ feild navigaton ==================//

    const { setCustomer, setVehicleNumber, customerName, vehicleNumber } =
      useCashInvoiceStore();

    return (
      <div className="flex flex-col gap-5 mb-7">
        <div className="flex justify-between gap-5">
          <div className="flex flex-col gap-2 flex-grow">
            <Label>Customer Name</Label>
            <Input
              type="text"
              value={customerName || ""}
              onChange={(e) => setCustomer(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, vehicleNoRef)}
              placeholder="Enter customer name"
            />
          </div>
          <div className="flex flex-col gap-2 flex-grow">
            <Label>Vehicle No</Label>
            <Input
              type="text"
              value={vehicleNumber || ""}
              ref={vehicleNoRef}
              onKeyDown={(e) => handleKeyDown(e, ref)}
              onChange={(e) => setVehicleNumber(e.target.value)}
              placeholder="Enter vehicle number"
            />
          </div>
        </div>
      </div>
    );
  },
);

export default CustomerDetails;
