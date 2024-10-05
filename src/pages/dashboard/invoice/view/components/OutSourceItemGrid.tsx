import IconButton from "@/components/button/IconButton";
import CancelIcon from "@/components/icon/CancelIcon";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OutsourcedItem } from "@/types/invoice/cash/cashInvoiceTypes";
import { InvoiceItem, InvoiceState } from "@/types/invoice/cashInvoice";
import {
  InvoiceItem as CreditInvoiceItem,
  InvoiceState as CreditInvoiceState,
} from "@/types/invoice/creditorInvoice";
import { DummyInvoiceItem } from "@/types/invoice/dummy/dummyInvoiceTypes";
import { useEffect, useState } from "react";
import { TableBodySkeleton } from "../../view-invoices/components/TableSkeleton";
import { LibraryBig, PackageOpen } from "lucide-react";

function OutsourceItemsGrid({
  invoiceDetails,
  invoiceLoading,
}: {
  invoiceDetails: InvoiceState | CreditInvoiceState | null;
  invoiceLoading: boolean;
}) {
  const [outsourcedItems, setOutsourcedItems] = useState<
    InvoiceItem[] | CreditInvoiceItem[]
  >([]);

  useEffect(() => {
    if (invoiceDetails) {
      setOutsourcedItems(
        invoiceDetails.invoiceItems.filter((item) => item.outsourced),
      );
    }
  }, [invoiceDetails]);

  return (
    <Table className="border rounded-md text-md my-0 table-responsive">
      <TableHeader>
        <TableRow style={{ height: "36px" }}>
          <TableHead style={{ height: "36px" }}>Item</TableHead>
          <TableHead style={{ height: "36px" }} align="right">
            Item Code
          </TableHead>
          <TableHead style={{ height: "36px" }} align="right">
            Quantity
          </TableHead>
          <TableHead style={{ height: "36px" }} align="right">
            Company Name
          </TableHead>
          <TableHead style={{ height: "36px" }}>Buying Price</TableHead>
        </TableRow>
      </TableHeader>

      {invoiceLoading ? (
        <TableBodySkeleton noHeader={true} cols={5} rows={5} />
      ) : outsourcedItems.length === 0 ? (
        <TableBody>
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              <div className="flex justify-center items-center gap-2 my-4">
                <LibraryBig size={20} className="text-muted-foreground" />
                <p className="text-sm ml-2 text-muted-foreground">
                  {" "}
                  No Items are outsourced for this invoice
                </p>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      ) : (
        <TableBody>
          {outsourcedItems.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="text-xl">{item.name}</TableCell>
              <TableCell className="text-xl">{item.code}</TableCell>
              <TableCell className="text-xl">{item.quantity}</TableCell>
              <TableCell className="text-xl">
                {item.outsourceItem.companyName}
              </TableCell>
              <TableCell className="text-xl">
                Rs. {item.outsourceItem.buyingPrice}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      )}
    </Table>
  );
}

export default OutsourceItemsGrid;
