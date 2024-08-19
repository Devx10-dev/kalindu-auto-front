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
import dateArrayToString from "@/utils/dateArrayToString";
import { useNavigate } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { TableBodySkeleton } from "./TableSkelton";

const CreditorInvoiceTable = ({ invoices, isLoading, err }) => {
  const nav = useNavigate();

  const handleViewInvoice = (invoiceId) => {
    nav(`/dashboard/invoice/view/creditor/${invoiceId}`);
  };

  const calculateDueDate = (issuedTime, maxDueWeeks) => {
    const issuedDate = new Date(
      issuedTime[0],
      issuedTime[1] - 1,
      issuedTime[2],
    );
    const dueDate = new Date(issuedDate);
    dueDate.setDate(dueDate.getDate() + maxDueWeeks * 7);
    const dateArray = [
      dueDate.getFullYear(),
      dueDate.getMonth() + 1,
      dueDate.getDate(),
      issuedTime[3],
      issuedTime[4],
      issuedTime[5],
    ];
    return dateArray;
  };

  const getDueStatus = (issuedTime, maxDueWeeks) => {
    const issuedDate = new Date(
      issuedTime[0],
      issuedTime[1] - 1,
      issuedTime[2],
      issuedTime[3],
      issuedTime[4],
      issuedTime[5],
    );
    const currentDate = new Date();
    const diff = currentDate.getTime() - issuedDate.getTime();
    return diff > maxDueWeeks * 7 * 24 * 60 * 60 * 1000 ? "OVERDUE" : "DUE";
  };

  const generateStatusBadge = (issuedTime, maxDueWeeks) => {
    const status = getDueStatus(issuedTime, maxDueWeeks);
    return (
      <Badge
        variant="secondary"
        className={`text-white ${
          status === "DUE" ? "bg-yellow-400" : "bg-red-400"
        } rounded-sm p-1`}
      >
        {status}
      </Badge>
    );
  };

  const overdueInvoices = invoices?.filter(
    (invoice) =>
      getDueStatus(invoice.issuedTime, invoice.creditor.maxDuePeriod) ===
      "OVERDUE",
  );

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
        ) : !overdueInvoices || overdueInvoices.length === 0 ? (
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
            {overdueInvoices.map((invoice) => (
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
                <TableCell>
                  {generateStatusBadge(
                    invoice.issuedTime,
                    invoice.creditor.maxDuePeriod,
                  )}
                </TableCell>
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
