import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AddNewTransaction } from "./components/AddNewTransaction";
import { ViewTransaction } from "./components/ViewTransaction";
import { Label } from "@radix-ui/react-label";
import { Badge } from "@/components/ui/badge";

const ViewCreditor = () => {
  const transactionHistory = [
    { amount: 10000, type: "Invoice", invoiceNo: "123456" },
    { amount: 15000, type: "Payment", invoiceNo: "789012" },
    { amount: 8000, type: "Invoice", invoiceNo: "345678" },
    { amount: 10000, type: "Invoice", invoiceNo: "123456" },
    { amount: 15000, type: "Payment", invoiceNo: "789012" },
    { amount: 8000, type: "Invoice", invoiceNo: "345678" },
    { amount: 10000, type: "Invoice", invoiceNo: "123456" },
    { amount: 15000, type: "Payment", invoiceNo: "789012" },
    { amount: 8000, type: "Invoice", invoiceNo: "345678" },
  ];

  return (
    <div className="w-full h-full">
      <h2 className="mb-4 text-lg font-bold">
        Creditor Management {">"} View Creditor
      </h2>
      <AddNewTransaction />
      <div className="grid gap-10 grid-cols-4">
        <Card className="shadow-md bg-slate-50 h-full col-span-3 ">
          <CardHeader>
            <h3 className="text-lg font-bold">Transaction History</h3>
          </CardHeader>
          <CardContent>
            <Table className="border">
              <TableRow className="bg-slate-200">
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Invoice No</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>

              <TableBody>
                {transactionHistory.map((transaction, index) => (
                  <TableRow key={index}>
                    <TableCell>{transaction.amount}</TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell>{transaction.invoiceNo}</TableCell>
                    <TableCell>
                      <ViewTransaction />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <div className="h-full flex flex-col gap-5">
          <Card className="shadow-md bg-white h-full">
            <CardHeader className="border mb-10">
              <h3 className="text-lg font-bold">Selected Creditor</h3>
            </CardHeader>

            <CardContent className="flex flex-col gap-2">
              <Label>Name : </Label>
              <Badge
                className="rounded-md p-2 text-lg mb-5"
                variant={"secondary"}
              >
                <p>{" Susantha Popa Garage"}</p>{" "}
              </Badge>
              <Label>Total Due : </Label>
              <Badge
                className="rounded-md p-2 text-lg mb-5"
                variant={"secondary"}
              >
                Rs 69000
              </Badge>
              <Label>Emergency Contact : </Label>
              <Badge
                className="rounded-md p-2 text-lg mb-5"
                variant={"secondary"}
              >
                0714989848
              </Badge>
              <Label>Due Date : </Label>
              <Badge
                className="rounded-md p-2 text-lg mb-5"
                variant={"secondary"}
              >
                2024-01-01
              </Badge>

              <div className="mt-4 flex justify-end gap-2">
                <Button variant="destructive">Deactivate</Button>
                <Button>Update</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewCreditor;
