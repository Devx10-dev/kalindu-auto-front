import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  CreditorInvoiceList,
  InvoiceState,
} from "@/types/invoice/creditorInvoice";
import dateArrayToString from "@/utils/dateArrayToString";
import { useNavigate } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { TableBodySkeleton } from "./TableSkelton";

const CreditorInvoiceTable = ({ invoices, isLoading, err }) => {
  const nav = useNavigate();
  const handleViewInvoice = (invoiceId) => {
    nav(`/dashboard/invoice/view/creditor/${invoiceId}`);
  };

  const calculateDueDate = (issuedTime: number[], maxDueWeeks: number) => {
    const issuedDate = new Date(issuedTime[0], issuedTime[1], issuedTime[2]);
    const dueDate = new Date(issuedDate);
    dueDate.setDate(dueDate.getDate() + maxDueWeeks * 7);
    // turninto array
    const dateArray = [
      dueDate.getFullYear(),
      dueDate.getMonth(),
      dueDate.getDate(),
      issuedTime[3],
      issuedTime[4],
      issuedTime[5],
    ];
    return dateArray;
  };

  const getDueStatus = (
    issuedTime: number[],
    maxDueWeeks: number,
    isSettled: boolean,
  ) => {
    if (isSettled) {
      return "SETTLED";
    }

    const issuedDate = new Date(
      issuedTime[0],
      issuedTime[1] - 1,
      issuedTime[2],
      issuedTime[3],
      issuedTime[4],
      issuedTime[5],
    );
    const currentDate = new Date();
    let diff = currentDate.getTime() - issuedDate.getTime();
    // convert diff to weeks
    diff = diff / (1000 * 60 * 60 * 24 * 7);
    if (diff < maxDueWeeks) {
      return "DUE";
    } else {
      return "OVERDUE";
    }
  };
  const generateStatusBadge = (invoice: InvoiceState) => {
    console.log("HEREEEE", invoice);
    const status = getDueStatus(
      invoice.issuedTime,
      Number(invoice.creditor.maxDuePeriod) as number,
      invoice.settled,
    );
    let className = "";
    let statusText = "";

    switch (status) {
      case "SETTLED":
        className = "text-white bg-green-400 rounded-sm p-1 hover:bg-green-500";
        statusText = "COMPLETED";
        break;
      case "DUE":
        className =
          "text-white bg-yellow-400 rounded-sm p-1 hover:bg-yellow-500";
        statusText = "DUE";
        break;
      case "OVERDUE":
        className = "text-white bg-red-400 rounded-sm p-1 hover:bg-red-500";
        statusText = "OVERDUE";
        break;
    }

    return (
      <Badge variant="secondary" className={className}>
        {statusText}
      </Badge>
    );
  };

  return (
    <Fragment>
      <Table className="border rounded-md text-md mb-5 table-responsive">
        <TableCaption></TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice No</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Contact Person</TableHead>
            <TableHead>Invoice Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        {isLoading ? (
          <TableBodySkeleton cols={8} rows={10} noHeader={true} />
        ) : !invoices || invoices.length === 0 ? (
          <TableBody>
            <TableRow>
              <TableCell colSpan={8}>
                <div className="flex items-center justify-center">
                  <p className="text-red-500 text-lg font-semibold">
                    No Overdue Invoices Found
                  </p>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.invoiceId}>
                <TableCell>{invoice.invoiceId}</TableCell>
                <TableCell className="w-40 truncate">
                  {invoice.creditor.shopName}
                </TableCell>
                <TableCell className="w-40 truncate">
                  {invoice.creditor.contactPersonName}
                </TableCell>
                <TableCell>{dateArrayToString(invoice.issuedTime)}</TableCell>
                <TableCell>
                  {dateArrayToString(
                    calculateDueDate(
                      invoice.issuedTime,
                      invoice.creditor.maxDuePeriod,
                    ),
                  )}
                </TableCell>
                <TableCell>Rs. {invoice.totalPrice}</TableCell>
                <TableCell>{generateStatusBadge(invoice)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      className="mr-2"
                      onClick={() => handleViewInvoice(invoice.invoiceId)}
                    >
                      View
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </Fragment>
  );
};

export default CreditorInvoiceTable;
