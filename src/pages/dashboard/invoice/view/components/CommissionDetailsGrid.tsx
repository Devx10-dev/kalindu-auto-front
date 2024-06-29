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
import { useEffect, useState } from "react";
import { TableBodySkeleton } from "../../view-invoices/components/TableSkeleton";

function CommissionDetailsGrid({
  invoiceDetails,
  invoiceLoading,
}: {
  invoiceDetails: InvoiceState | null;
  invoiceLoading: boolean;
}) {
  const [commissionDetails, setCommissionDetails] = useState<Commission[]>([]);

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
