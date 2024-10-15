import TablePagination from "@/components/TablePagination";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
import { OpenInNewWindowIcon } from "@radix-ui/react-icons";
import { Link, useNavigate } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { TableBodySkeleton } from "./TableSkeleton";
import useQueryParams from "@/hooks/getQueryParams";
import { currencyAmountString } from "@/utils/analyticsUtils";

function priceRender(contentType: string, content: string) {
  // split from firdst dot from the right
  switch (contentType) {
    case "currencyAmount": {
      // this comes as strig "Rs. 180,666.00" i want to render the decimal part in a smaller font size
      const [currency, amount] = content.split(/(?<=\..*)\./);
      return (
        <div className="text-md font-bold">
          {/* remove Rs. from begininh */}
          <span>{currency.slice(4)}</span>
          <span className="text-xs font-bold color-muted-foreground">
            .{amount}
          </span>
        </div>
      );
    }
    default:
      return <div className="text-2xl font-bold">{content}</div>;
  }
}

const dotSizeClasses = {
  sm: "h-2 w-2",
  md: "h-2.5 w-2.5",
  lg: "h-3 w-3",
};

export default function CreditInvoiceTable({
  invoices,
  type,
  pageNo,
  setPageNo,
  pageSize,
  isLoading,
  err,
}: {
  invoices: CreditorInvoiceList | undefined;
  type: string;
  pageNo: number;
  setPageNo: React.Dispatch<React.SetStateAction<number>>;
  pageSize: number;
  isLoading?: boolean;
  err?: any;
}) {
  const nav = useNavigate();

  const handleViewInvoice = (invoiceId: string) => {
    nav(`/dashboard/invoice/view/${type}/${invoiceId}`);
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
    const status = getDueStatus(
      invoice.issuedTime,
      Number(invoice.creditor.maxDuePeriod) as number,
      invoice.settled,
    );
    let background = "";
    let statusText = "";

    switch (status) {
      case "SETTLED":
        background = "#198754";
        statusText = "Settled";
        break;
      case "DUE":
        background = "#ffc107";
        statusText = "Due";
        break;
      case "OVERDUE":
        background = "#dc3545";
        statusText = "Overdue";
        break;
    }

    return (
      <p
        className="p-badge"
        style={{
          background: background,
        }}
      >
        {statusText}
      </p>
    );
  };

  const { setQueryParam } = useQueryParams();

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
                setPageNo(page - 1);
                setQueryParam("pageNo", page - 1);
              }}
            />
          )}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice No</TableHead>
            <TableHead>Shop Name</TableHead>
            <TableHead>Invoice Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="text-end">Total Amount</TableHead>
            <TableHead className="text-end">Due Amount</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        {isLoading ? (
          <TableBodySkeleton cols={8} rows={10} noHeader={true} />
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
                <TableRow key={invoice.invoiceId}>
                  <TableCell>{invoice.invoiceId}</TableCell>
                  <TableCell className="w-40 turncate">
                    {invoice.creditor.shopName}
                  </TableCell>

                  <TableCell>{dateArrayToString(invoice.issuedTime)}</TableCell>
                  <TableCell>
                    {dateArrayToString(
                      calculateDueDate(
                        invoice.issuedTime,
                        Number(invoice.creditor.maxDuePeriod) as number,
                      ),
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {priceRender(
                      "currencyAmount",
                      currencyAmountString(invoice.totalPrice),
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <div className="flex items-center justify-end gap-2 relative">
                      {!invoice.settled && (
                        <span
                          className={`block ${dotSizeClasses["sm"]} rounded-full bg-red-500 ring-2 ring-white shadow-md`}
                        />
                      )}
                      {priceRender(
                        "currencyAmount",
                        currencyAmountString(
                          invoice.totalPrice - invoice.settledAmount,
                        ),
                      )}
                    </div>
                  </TableCell>
                  <TableCell align="center">
                    {/* make background greem intag */}
                    {generateStatusBadge(invoice)}
                  </TableCell>
                  <TableCell align="center">
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
