import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import useCashInvoiceStore from "../context/useCashInvoiceStore.tsx";

const Commissions: React.FC = () => {
    const {
        setCommissionName ,
        setCommissionAmount,
        setCommissionRemark,
        commissionName ,
        commissionAmount,
        commissionRemark
    } = useCashInvoiceStore();

    return (
        <Card className='mb-3'>
            <CardContent className="p-3 shadow-sm">
                <h2 className="text-xl font-bold mb-4">Commission Details</h2>
                <div className="flex flex-col gap-5">
                    <div className='flex justify-between gap-5'>
                        <div className="flex flex-col gap-2 flex-grow">
                            <Label>Name</Label>
                            <Input
                                type="text"
                                value={commissionName}
                                onChange={(e) => setCommissionName(e.target.value)}
                                placeholder="Enter commission name"
                            />
                        </div>
                        <div className="flex flex-col gap-2 flex-grow">
                            <Label>Remark</Label>
                            <Input
                                type="text"
                                //this should be number and cannot be negative
                                value={commissionRemark}
                                onChange={(e) => setCommissionRemark(e.target.value)}
                                placeholder="Small remark about the commission"
                            />
                        </div>
                        <div className="flex flex-col gap-2 flex-grow">
                            <Label>Amount (LKR) </Label>
                            <Input
                                type="number"
                                //this should be number and cannot be negative
                                value={commissionAmount}
                                onChange={(e) => setCommissionAmount(parseInt(e.target.value))}
                                placeholder="Enter the total commise amount"
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default Commissions;