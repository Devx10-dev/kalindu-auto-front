import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type Invoice = {
  id?: number;
  invoiceId?: string;
  issuedTime?: string;
  customerName?: string;
  vehicleNumber?: string;
  totalPrice?: number;
  totalDiscount?: number;
};
export function ViewExpiredInvoices({
  invoiceList,
}: {
  invoiceList: Invoice[];
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="bg-orange-300 text-orange-900 hover:bg-orange-300 hover:text-orange-900"
        >
          View Expired Invoices
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Expired Invoices</DialogTitle>
          <DialogDescription>
            Expired invoices of the creditor
          </DialogDescription>
        </DialogHeader>
        <Table>
          <TableCaption>A list of expired invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice NO</TableHead>
              <TableHead>Total Price</TableHead>
              {/* <TableHead>Total Discount</TableHead> */}
              <TableHead className="text-right">Issued Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoiceList.map((invoice) => (
              <TableRow key={invoice.invoiceId}>
                <TableCell className="font-medium">
                  {invoice.invoiceId}
                </TableCell>
                <TableCell>{invoice.totalPrice}</TableCell>
                {/* <TableCell>{invoice.totalDiscount}</TableCell> */}
                <TableCell className="text-right">
                  {invoice.issuedTime.slice(6)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <DialogFooter>
          {/* <Button type="submit">Save changes</Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
