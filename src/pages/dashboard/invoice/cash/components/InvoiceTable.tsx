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
import IconButton from "@/components/button/IconButton";
import EditIcon from "@/components/icon/EditIcon";
import { useState } from "react";
import { InvoiceItem } from "@/types/invoice/cashInvoice";
import { FormModal } from "@/components/modal/FormModal.tsx";
import EditItem from "@/pages/dashboard/invoice/cash/components/EditItem.tsx";

const InvoiceTable: React.FC = () => {
  const { invoiceItemDTOList, removeInvoiceItem, setOutsourcedStatus } =
    useCashInvoiceStore();

  const [editingItem, setEditingItem] = useState<InvoiceItem | null>(null);

  return (
    <div>
      <Table className="border rounded-md text-md mb-5 mt-5">
        <h2 className="text-xl font-bold mt-2 ml-3">Item List</h2>
        <TableBody>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Outsource</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
          {invoiceItemDTOList.map((item: any, index: any) => (
            <TableRow key={index}>
              <TableCell>{item.name}</TableCell>
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
                  checked={item.outsourced}
                  onCheckedChange={(state) => setOutsourcedStatus(item, state)}
                />
              </TableCell>
              <TableCell>
                <div className="flex justify-center items-center gap-2">
                  <Button
                    onClick={() => removeInvoiceItem(item)}
                    variant={"secondary"}
                  >
                    <X className="mr-2" /> Remove
                  </Button>
                  <IconButton
                    icon={<EditIcon height="20" width="20" />}
                    tooltipMsg="Edit Spare Part"
                    handleOnClick={() => setEditingItem(item)}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <FormModal
        title="Edit Item"
        titleDescription="Edit spare part item in the invoice"
        show={!!editingItem}
        onClose={() => setEditingItem(null)}
        component={
          editingItem && (
            <EditItem item={editingItem} onClose={() => setEditingItem(null)} />
          )
        }
      />
    </div>
  );
};

export default InvoiceTable;
