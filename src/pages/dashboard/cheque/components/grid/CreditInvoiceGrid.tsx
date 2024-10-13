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
import { Cheque } from "@/types/cheque/chequeTypes";

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
    <div>
      <div
        className="py-4 bg-muted/50"
        style={{
          height: "450px",
          overflowY: "scroll",
          borderRadius: "5px",
          maxWidth: "100%",
        }}
      >
        <div className="overflow-x-auto ">
          <Table className="border rounded-md text-md mb-5 min-w-full table-auto">
            <TableCaption>Settled Credit Invoice Details</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice Id</TableHead>
                <TableHead>Issued Time</TableHead>
                <TableHead style={{ textAlign: "end" }}>Total Price</TableHead>
                <TableHead style={{ textAlign: "end" }}>
                  Settled Amount
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {cheque &&
                cheque.chequeInvoices.map((chequeInvoice) => (
                  <TableRow key={Math.random() * 100}>
                    <TableCell className="font-medium">
                      {chequeInvoice.invoiceNo}
                    </TableCell>
                    <TableCell>{`${chequeInvoice.issuedTime[0]}-${chequeInvoice.issuedTime[1]}-${chequeInvoice.issuedTime[2]} ${chequeInvoice.issuedTime[3]}:${chequeInvoice.issuedTime[4]}:${chequeInvoice.issuedTime[5]}`}</TableCell>

                    <TableCell align="right">
                      {chequeInvoice.totalPrice}
                    </TableCell>
                    <TableCell align="right">{chequeInvoice.amount}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="d-flex justify-end mt-6">
        <Button variant="outline" onClick={closeModal}>
          Close
        </Button>
      </div>
    </div>
  );
}

export default CreditInvoiceGrid;
