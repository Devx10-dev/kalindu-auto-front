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
import { DummyInvoiceItem } from "@/types/invoice/dummy/dummyInvoiceTypes";
import { TableBodySkeleton } from "../../view-invoices/components/TableSkeleton";
import { useEffect, useState } from "react";

function InvoiceItemsGrid({
  invoiceDetails,
  invoiceLoading,
}: {
  invoiceDetails: InvoiceState;
  invoiceLoading: boolean;
}) {
  const [items, setItems] = useState<InvoiceItem[]>([]);

  useEffect(() => {
    console.log("intable", invoiceDetails);
    if (invoiceDetails) {
      console.log("setting items");
      setItems(invoiceDetails.invoiceItems);
    }
  }, [invoiceDetails]);

  useEffect(() => {
    console.log("ITEMS", items);
  }, [items]);

  return (
    <Table className="border rounded-md text-md mb-5 table-responsive">
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Discount</TableHead>
          <TableHead>Total</TableHead>
          <TableHead className="text-center">Outsource</TableHead>
        </TableRow>
      </TableHeader>
      {invoiceLoading ? (
        <TableBodySkeleton noHeader={true} cols={6} rows={5} />
      ) : (
        <TableBody>
          {items &&
            items.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="text-xl">{item.name}</TableCell>
                <TableCell className="text-xl" align="left">
                  {item.quantity}
                </TableCell>
                <TableCell className="text-xl" align="left">
                  Rs. {item.price}
                </TableCell>
                <TableCell className="text-xl" align="left">
                  {item.discount}
                </TableCell>
                <TableCell className="text-xl" align="left">
                  Rs.
                  {item.discount !== undefined
                    ? (item.price * item.quantity - item.discount).toFixed(2)
                    : (item.price * item.quantity).toFixed(2)}
                </TableCell>
                <TableCell className="p-0" align="center">
                  <Checkbox
                    defaultChecked={false}
                    checked={item.outsourced}
                    disabled={true}
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      )}
    </Table>
  );
}

export default InvoiceItemsGrid;
