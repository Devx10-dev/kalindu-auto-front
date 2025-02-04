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
import dateArrayToString from "@/utils/dateArrayToString";

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
    <div className="flex flex-col h-full max-h-[calc(100vh-200px)]">
      <div className="flex-1 min-h-0 overflow-hidden rounded-md bg-muted/50">
        <div className="overflow-auto h-full">
          <div className="min-w-[640px] p-4 overflow-x-auto">
            <Table className="border bg-white rounded-md w-full">
              <TableCaption className="pb-2">
                Settled Credit Invoice Details
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Invoice Id</TableHead>
                  <TableHead className="w-[250px]">Issued Time</TableHead>
                  <TableHead className="text-right w-[150px]">
                    Total Price
                  </TableHead>
                  <TableHead className="text-right w-[150px]">
                    Settled Amount
                  </TableHead>
                </TableRow>
              </TableHeader>

              <div className="overflow-x-auto ">
                <TableBody>
                  {cheque?.chequeInvoices.map((chequeInvoice) => (
                    <TableRow key={chequeInvoice.invoiceNo}>
                      <TableCell className="font-medium">
                        {chequeInvoice.invoiceNo}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {dateArrayToString(chequeInvoice.issuedTime)}
                      </TableCell>
                      <TableCell className="text-right">
                        {typeof chequeInvoice.totalPrice === "number"
                          ? chequeInvoice.totalPrice.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : chequeInvoice.totalPrice}
                      </TableCell>
                      <TableCell className="text-right">
                        {typeof chequeInvoice.amount === "number"
                          ? chequeInvoice.amount.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : chequeInvoice.amount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </div>
            </Table>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-4 px-4">
        <Button variant="outline" onClick={onClose} className="min-w-[100px]">
          Close
        </Button>
      </div>
    </div>
  );
}

export default CreditInvoiceGrid;
