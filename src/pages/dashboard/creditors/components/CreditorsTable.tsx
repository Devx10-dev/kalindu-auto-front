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
import { ViewEditCreditor } from "./ViewEditCreditor";

const CreditorsTable = (props: { creditorData?: Creditor[] }) => {
  return (
    <>
      <div className="flex flex-col justify-end">
        <div className="mb-4 flex gap-10">
          <Button variant={"secondary"}>
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
        <Table className="border rounded-md text-md mb-5">
          <TableCaption>Creditor Details</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Creditor Name</TableHead>
              <TableHead> Primary Contact</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {props.creditorData?.map((creditor) => (
              <TableRow key={creditor.creditorID}>
                <TableCell className="font-medium">
                  {creditor.shopName}
                </TableCell>
                <TableCell>{creditor.primaryContact}</TableCell>
                <TableCell>{creditor.secondaryContact}</TableCell>
                <TableCell className="text-right">
                  <Link
                    to={`/dashboard/creditors/manage/${creditor.creditorID}`}
                  >
                    <Button className="mr-5 bg-slate-200 text-black hover:bg-slate-600 hover:text-white">
                      <View className="mr-2 h-4 w-4" />
                      View Transactions
                    </Button>
                  </Link>
                  <ViewEditCreditor />
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
