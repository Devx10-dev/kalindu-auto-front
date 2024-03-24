import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const ViewCreditor = () => {
  const transactionHistory = [
    { amount: 10000, type: "Invoice", invoiceNo: "123456" },
    { amount: 15000, type: "Payment", invoiceNo: "789012" },
    { amount: 8000, type: "Invoice", invoiceNo: "345678" },
  ];

  return (
    <div className="w-3/4">
      <h2 className="mb-4 text-lg font-bold">Creditor Management {'>'} View Creditor</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className=" shadow-md bg-slate-50">
          <CardHeader>
            <h3 className="text-lg font-bold">Transaction History</h3>
          </CardHeader>
          <CardContent>
            <Table>
              <TableRow>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Invoice No</TableHead>
              </TableRow>

              <TableBody>
                {transactionHistory.map((transaction, index) => (
                  <TableRow key={index}>
                    <TableCell>{transaction.amount}</TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell>{transaction.invoiceNo}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card  className=" shadow-md bg-slate-100">
          <CardHeader>
            <h3 className="text-lg font-bold">Selected Creditor</h3>
          </CardHeader>
          <CardContent>
            <p>Susantha Popa Garage</p>
            <p>Total Due: Rs 69000</p>
            <p>Emergency Contact: 0714989848</p>
            <p>Due Estate Date: 2024-01-01</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant='destructive'>Deactivate</Button>
              <Button>Update</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Button variant="outline" className="mt-4">
        Add New Transaction
      </Button>
    </div>
  );
};

export default ViewCreditor;
