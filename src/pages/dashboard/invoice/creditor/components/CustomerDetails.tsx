import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

type creditorData = {
  creditorName : string,
  creditorID : number
}

const CustomerDetails: React.FC = () => {
  const [customerName, setCustomerName] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');

  return (
    <Card className='mb-3'>
      <CardContent className="p-3 shadow-sm">
        <div className="flex flex-col gap-5">
          <div className='flex justify-between gap-5'>
              <div className="flex flex-col gap-2 flex-grow">
                <Label>Select Creditor</Label>
                <Input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer name"
                />
                
              </div> 
              <div className="flex flex-col gap-2 flex-grow">
                <Label>Vehicle No</Label>
                <Input
                  type="text"
                  value={vehicleNo}
                  onChange={(e) => setVehicleNo(e.target.value)}
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