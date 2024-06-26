import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Creditor } from "@/types/creditor/creditorTypes";
import { Search, View } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ViewExpiredInvoices } from "./ViewExpiredInvoices";

const CreditorsTable = (props: { creditorData?: Creditor[] }) => {
  return (
    <>
      <div className="flex flex-col justify-end mt-10">
        <Table className="border rounded-md text-md mb-5">
          <TableCaption>Creditor Details</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Creditor Name</TableHead>
              <TableHead> Primary Contact</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Credit Limit (LKR)</TableHead>
              <TableHead>Expired Due Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {props.creditorData?.map((creditor) => (
              <TableRow
                key={creditor.creditorID}
                className={`${creditor.isExpired ? "bg-orange-100" : null}`}
              >
                <TableCell className="font-medium">
                  {creditor.shopName}
                </TableCell>
                <TableCell>{creditor.primaryContact}</TableCell>
                <TableCell>
                  {creditor.totalDue ? creditor.totalDue : 0}
                </TableCell>
                <TableCell>
                  {creditor.creditLimit ? creditor.creditLimit : "-"}
                </TableCell>

                <TableCell>{creditor.isExpired ? "YES" : "NO"}</TableCell>
                <TableCell className="text-right flex">
                  <Link
                    to={`/dashboard/creditors/manage/${creditor.creditorID}`}
                  >
                    <Button className="mr-5 bg-white" variant="outline">
                      View Transactions
                    </Button>
                  </Link>
                  {creditor.isExpired && (
                    <ViewExpiredInvoices
                      invoiceList={creditor.expiredInvoiceList}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default CreditorsTable;
