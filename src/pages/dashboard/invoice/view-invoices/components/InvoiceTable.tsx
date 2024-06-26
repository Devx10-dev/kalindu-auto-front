import { Option } from "@/types/component/propTypes";
import { VehicleModel } from "@/types/sparePartInventory/vehicleTypes";
import { Fragment } from "react/jsx-runtime";
import IconButton from "@/components/button/IconButton";
import FormSelect from "@/components/formElements/FormSelect";
import EditIcon from "@/components/icon/EditIcon";
import SparePartIcon from "@/components/icon/SparePartIcon";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "./DateRangePicker";
import { Invoice } from "@/types/Invoices/invoiceTypes";
import { OpenInNewWindowIcon } from "@radix-ui/react-icons";
import { Badge } from "@/components/ui/badge";
import TablePagination from "@/components/TablePagination";
import { InvoiceList, InvoiceState } from "@/types/invoice/cashInvoice";
import { useEffect } from "react";
import addLeadingZero from "@/utils/addLeadingZero";
import { Link, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { TableBodySkeleton } from "./TableSkeleton";
import ErrorIcon from "@/components/icon/ErrorIcon";
import ErrorPageIcon from "@/components/icon/ErrorPageIcon";
// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { VehicleService } from "@/service/sparePartInventory/vehicleServices";

export default function InvoiceTable({
  invoices,
  type,
  pageNo,
  setPageNo,
  pageSize,
  isLoading,
  err,
}: {
  invoices: InvoiceList | undefined;
  type: string;
  pageNo: number;
  setPageNo: React.Dispatch<React.SetStateAction<number>>;
  pageSize: number;
  isLoading?: boolean;
  err?: any;
}) {
  useEffect(() => {
    console.log(invoices);
  }, [invoices]);

  const nav = useNavigate();

  const handleViewInvoice = (invoiceId: string) => {
    nav(`/dashboard/invoice/view/${type}/${invoiceId}`);
  };

  return (
    <Fragment>
      <Table className="border rounded-md text-md mb-5 table-responsive">
        <TableCaption>
          {!err && isLoading ? (
            <Skeleton className="w-full h-10" />
          ) : (
            <TablePagination
              pageNo={pageNo + 1}
              totalPages={invoices?.totalPages}
              onPageChange={(page) => {
                console.log(page);
                setPageNo(page - 1);
              }}
            />
          )}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice No</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Vehicle No</TableHead>
            <TableHead>Invoice Date</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        {isLoading ? (
          <TableBodySkeleton cols={7} rows={10} noHeader={true} />
        ) : invoices?.invoices.length === 0 ? (
          <TableBody>
            <TableRow>
              <TableCell colSpan={6}>
                <div className="flex items-center justify-center">
                  <p className="text-red-500 text-lg font-semibold">
                    No Invoices Found
                  </p>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <TableBody>
            {invoices?.invoices &&
              err === null &&
              invoices.invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.invoiceId}</TableCell>
                  <TableCell className="w-40 turncate">
                    {invoice.customerName}
                  </TableCell>
                  <TableCell>
                    {invoice.vehicleNo
                      ? invoice.vehicleNo.toUpperCase()
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {invoice.issuedTime[0] +
                      "-" +
                      invoice.issuedTime[1] +
                      "-" +
                      invoice.issuedTime[2]}{" "}
                    {addLeadingZero(invoice.issuedTime[3])}:
                    {addLeadingZero(invoice.issuedTime[4])}:
                    {addLeadingZero(invoice.issuedTime[5])}
                  </TableCell>
                  <TableCell>Rs. {invoice.totalPrice}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">COMPLETED</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-center">
                      <Link
                        to={`/dashboard/invoice/${type}/${invoice.invoiceId}`}
                      >
                        <Button variant="outline" className="mr-2">
                          <OpenInNewWindowIcon className="h-5 w-5" /> View
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        )}
      </Table>
    </Fragment>
  );
}
