import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import useCashInvoiceStore from "../context/useCashInvoiceStore";
import { X } from "lucide-react";

const InvoiceTable: React.FC = () => {
  const { invoiceItemDTOList, removeInvoiceItem, setOutsourcedStatus } =
      useCashInvoiceStore();

  return (
      <div>

        <Table className="border rounded-md text-md mb-5 mt-10">
          <h2 className="text-xl font-bold mt-2 ml-3">Item List</h2>
          <TableBody>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Outsource</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
            {invoiceItemDTOList.map((item: any, index: any) => (
                <TableRow key={index}>
                  <TableCell>{item.itemName}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>LKR {item.price}</TableCell>
                  <TableCell>LKR {item.discount}</TableCell>
                  <TableCell>
                    LKR{" "}
                    {(
                        item.quantity * item.price -
                        item.quantity * item.discount
                    ).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Switch
                        checked={item.outsourcedStatus}
                        onCheckedChange={(state) => setOutsourcedStatus(item, state)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                        onClick={() => removeInvoiceItem(item)}
                        variant={"secondary"}
                    >
                      <X className="mr-2" /> Remove
                    </Button>
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
  );
};

export default InvoiceTable;
