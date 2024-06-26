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
import { CreditInvoice } from "@/types/invoice/credit/creditInvoiceTypes";
import { useQuery } from "@tanstack/react-query";

function CreditInvoiceGrid({
  chequeService,
  chequeId,
  onClose,
}: {
  chequeId: number;
  chequeService: ChequeService;
  onClose: () => void;
}) {
  const { isLoading, data: creditInvoices } = useQuery<CreditInvoice[]>({
    queryKey: [],
    queryFn: () => chequeService.fetchCreditInvoicesOfCheque(chequeId),
    retry: 2,
  });

  const closeModal = () => {
    onClose();
  };

  return (
    <>
      {isLoading ? (
        <SkeletonGrid noOfColumns={5} noOfItems={10} />
      ) : (
        <Table className="border rounded-md text-md mb-5 table-responsive">
          <TableCaption>Credit Invoice Details</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice Id</TableHead>
              <TableHead>Total Price</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Tax</TableHead>
              <TableHead>Issued Time</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {creditInvoices &&
              creditInvoices.map((creditInvoice) => (
                <TableRow key={creditInvoice.id}>
                  <TableCell className="font-medium">
                    {creditInvoice.invoiceId}
                  </TableCell>
                  <TableCell>{creditInvoice.totalPrice}</TableCell>
                  <TableCell>{creditInvoice.totalDiscount ?? 0}</TableCell>
                  <TableCell>{creditInvoice.vat ?? 0}</TableCell>
                  <TableCell>{`${creditInvoice.issuedTime[0]}-${creditInvoice.issuedTime[1]}-${creditInvoice.issuedTime[2]} ${creditInvoice.issuedTime[3]}:${creditInvoice.issuedTime[4]}:${creditInvoice.issuedTime[5]}`}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
      <div className="d-flex justify-end">
        <Button variant="outline" onClick={closeModal}>
          Close
        </Button>
      </div>
    </>
  );
}

export default CreditInvoiceGrid;
