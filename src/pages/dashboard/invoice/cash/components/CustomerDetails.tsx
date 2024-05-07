import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

const CustomerDetails: React.FC = () => {
  const [customerName, setCustomerName] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');

  return (
    <Card className='mb-3'>
      <CardContent className="p-3 shadow-sm">
        <div className="flex flex-col gap-5">
          <div>
            <h2 className="text-2xl font-bold mb-4">Create Cash Invoice</h2>
          </div>
          <div className='flex justify-between gap-5'>
              <div className="flex flex-col gap-2 flex-grow">
                <Label>Customer Name</Label>
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