import SkeletonGrid from "@/components/loader/SkeletonGrid";
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
import { ChequeService } from "@/service/cheque/ChequeService";
import { Cheque } from "@/types/cheque/chequeTypes";
import { CreditInvoice } from "@/types/invoice/credit/creditInvoiceTypes";
import { useQuery } from "@tanstack/react-query";

function CreditInvoiceGrid({
  cheque,
  onClose,
}: {
  cheque: Cheque;
  onClose: () => void;
}) {
  const closeModal = () => {
    onClose();
  };

  return (
    <>
      <Table className="border rounded-md text-md mb-5 table-responsive">
        <TableCaption>Settled Credit Invoice Details</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice Id</TableHead>
            <TableHead style={{ textAlign: "end" }}>Total Price</TableHead>
            <TableHead>Issued Time</TableHead>
            <TableHead style={{ textAlign: "end" }}>Settled Amount</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {cheque &&
            cheque.chequeInvoices.map((chequeInvoice) => (
              <TableRow key={Math.random() * 100}>
                <TableCell className="font-medium">
                  {chequeInvoice.invoiceNo}
                </TableCell>
                <TableCell align="right">{chequeInvoice.totalPrice}</TableCell>
                <TableCell>{`${chequeInvoice.issuedTime[0]}-${chequeInvoice.issuedTime[1]}-${chequeInvoice.issuedTime[2]} ${chequeInvoice.issuedTime[3]}:${chequeInvoice.issuedTime[4]}:${chequeInvoice.issuedTime[5]}`}</TableCell>
                <TableCell align="right">{chequeInvoice.amount}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <div className="d-flex justify-end">
        <Button variant="outline" onClick={closeModal}>
          Close
        </Button>
      </div>
    </>
  );
}

export default CreditInvoiceGrid;
