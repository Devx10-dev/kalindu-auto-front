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
  Commission,
  InvoiceItem,
  InvoiceState,
} from "@/types/invoice/cashInvoice";
import {
  Commission as CreditorCommission,
  InvoiceItem as CreditorInvoiceItem,
  InvoiceState as CreditorInvoiceState,
} from "@/types/invoice/creditorInvoice";
import { useEffect, useState } from "react";
import { TableBodySkeleton } from "../../view-invoices/components/TableSkeleton";
import { Coins } from "lucide-react";

function CommissionDetailsGrid({
  invoiceDetails,
  invoiceLoading,
}: {
  invoiceDetails: InvoiceState | CreditorInvoiceState | null;
  invoiceLoading: boolean;
}) {
  const [commissionDetails, setCommissionDetails] = useState<Commission[] | CreditorCommission[]>([]);

  useEffect(() => {
    if (invoiceDetails) {
      setCommissionDetails(invoiceDetails.commissions);
    }
  }, [invoiceDetails]);

  return (
    <Table className="border rounded-md text-md mb-5 table-responsive">
      <TableHeader>
        <TableRow style={{ height: "36px" }}>
          <TableHead style={{ height: "36px" }}>Name</TableHead>
          <TableHead style={{ height: "36px" }}>Remark</TableHead>
          <TableHead style={{ height: "36px" }}>Amount</TableHead>
        </TableRow>
      </TableHeader>

      {invoiceLoading ? (
        <TableBodySkeleton noHeader={true} cols={3} rows={5} />
      ) : commissionDetails.length === 0 ? (
        <TableBody>
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              <div className="flex justify-center items-center gap-2 my-4">
                <Coins size={20} className="text-muted-foreground" />
                <p className="text-sm ml-2 text-muted-foreground"> No Commissions were added for this invoice</p>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      ) : (
        <TableBody>
          {commissionDetails.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="text-xl">{item.personName}</TableCell>
              <TableCell className="text-xl">{item.remark}</TableCell>
              <TableCell className="text-xl">{item.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      )}
    </Table>
  );
}

export default CommissionDetailsGrid;
