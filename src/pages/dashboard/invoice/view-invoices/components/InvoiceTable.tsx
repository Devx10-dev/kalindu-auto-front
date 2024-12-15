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
import { InvoiceList } from "@/types/invoice/cashInvoice";
import addLeadingZero from "@/utils/addLeadingZero";
import { OpenInNewWindowIcon } from "@radix-ui/react-icons";
import { Link, useNavigate } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { TableBodySkeleton } from "./TableSkeleton";
import useQueryParams from "@/hooks/getQueryParams";
import { currencyAmountString } from "@/utils/analyticsUtils";
import dateArrayToString from "@/utils/dateArrayToString";

function priceRender(contentType: string, content: string) {
  // split from firdst dot from the right
  switch (contentType) {
    case "currencyAmount": {
      // this comes as strig "Rs. 180,666.00" i want to render the decimal part in a smaller font size
      const [currency, amount] = content.split(/(?<=\..*)\./);
      return (
        <div className="text-md font-bold">
          {/* remove Rs. from begininh */}
          <span>{currency}</span>
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
  const nav = useNavigate();

  const handleViewInvoice = (invoiceId: string) => {
    nav(`/dashboard/invoice/view/${type}/${invoiceId}`);
  };

  const { setQueryParam } = useQueryParams();

  return (
    <Fragment>
      <div className="overflow-x-auto ">
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
              <TableHead>Customer Name</TableHead>
              <TableHead>Vehicle No</TableHead>
              <TableHead>Invoice Date</TableHead>
              <TableHead className="text-right">Total Amount</TableHead>
              <TableHead className="text-center">Status</TableHead>
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
                      {invoice.customerName === null
                        ? "N/A"
                        : invoice.customerName}
                    </TableCell>
                    <TableCell>
                      {invoice.vehicleNo
                        ? invoice.vehicleNo.toUpperCase()
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {dateArrayToString(invoice.issuedTime, false, true)}
                    </TableCell>
                    <TableCell align="right">
                      {priceRender(
                        "currencyAmount",
                        currencyAmountString(invoice.totalPrice),
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {/* make background greem intag */}
                      <p
                        className="p-badge"
                        style={{
                          background: "#198754",
                        }}
                      >
                        COMPLETED
                      </p>
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
      </div>
    </Fragment>
  );
}
