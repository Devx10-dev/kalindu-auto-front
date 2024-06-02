import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import useCashInvoiceStore from "../context/useCashInvoiceStore.tsx";

const CustomerDetails: React.FC = () => {
  const {setCustomer, setVehicleNumber, customerName, vehicleNumber} = useCashInvoiceStore();

  return (
    <Card className="mb-3">
      <CardContent className="p-3 shadow-sm">
        <div className="flex flex-col gap-5">
          <div className='flex justify-between gap-5'>
              <div className="flex flex-col gap-2 flex-grow">
                <Label>Customer Name</Label>
                <Input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomer(e.target.value)}
                  placeholder="Enter customer name"
                />
              </div> 
              <div className="flex flex-col gap-2 flex-grow">
                <Label>Vehicle No</Label>
                <Input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  placeholder="Enter vehicle number"
                />
              </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerDetails;
