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
// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { VehicleService } from "@/service/sparePartInventory/vehicleServices";

export default function InvoiceTable({
  invoices,
  type,
}: {
  invoices: InvoiceList| undefined;
  type: string;
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
          <TablePagination pageNo={invoices.currentPage} totalPages={invoices.totalPages}/>
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice No</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Invoice Date</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.invoices &&
            invoices.invoices.map((invoice) => (
            <TableRow key={invoice.id}>
                <TableCell>{invoice.invoiceId}</TableCell>
                <TableCell>{invoice.customerName}</TableCell>
                <TableCell>{invoice.issuedTime[0] + "-" + invoice.issuedTime[1] + "-" + invoice.issuedTime[2]} @ {addLeadingZero(invoice.issuedTime[3])}:{addLeadingZero(invoice.issuedTime[4])}:{addLeadingZero(invoice.issuedTime[5])}</TableCell>
                <TableCell>Rs. {invoice.totalPrice}</TableCell>
                <TableCell>
                    <Badge variant="secondary">COMPLETED</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-center">
                    <Link to={`/dashboard/invoice/${type}/${invoice.invoiceId}`}>
                      <Button variant="outline" className="mr-2">
                        <OpenInNewWindowIcon className="h-5 w-5" /> View
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Fragment>
  );
}
