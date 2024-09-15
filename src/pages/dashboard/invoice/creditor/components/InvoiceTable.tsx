import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import useCreditorInvoiceStore from "../context/useCreditorInvoiceStore";
import {useEffect, useState} from "react";
import EditIcon from "@/components/icon/EditIcon.tsx";
import IconButton from "@/components/button/IconButton.tsx";
import {InvoiceItem} from "@/types/invoice/creditorInvoice";
import {FormModal} from "@/components/modal/FormModal.tsx";
import EditItem from "@/pages/dashboard/invoice/creditor/components/EditItem.tsx";
import {X} from "lucide-react";
import CancelIcon from "@/components/icon/CancelIcon.tsx";

const InvoiceTable: React.FC = () => {
  const { invoiceItemDTOList, removeInvoiceItem, setOutsourcedStatus } =
    useCreditorInvoiceStore();
  useEffect(() => {}, [invoiceItemDTOList]);

  const [editingItem, setEditingItem] = useState<InvoiceItem | null>(null)

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
            <TableHead className="flex justify-center items-center">Action</TableHead>
          </TableRow>
          {invoiceItemDTOList.length > 0 ? (
            invoiceItemDTOList.map((item: any, index: any) => (
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
                        checked={item.outsourcedStatus}
                        onCheckedChange={(state) =>
                            setOutsourcedStatus(item, state)
                        }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <IconButton
                          handleOnClick={() => removeInvoiceItem(item)}
                          icon={<CancelIcon height="25" width="25" />}
                          tooltipMsg="Remove Item"
                          variant="ghost"
                      />

                      <IconButton
                          icon={<EditIcon height="20" width="20"/>}
                          tooltipMsg="Edit Spare Part"
                          handleOnClick={() => setEditingItem(item)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
            ))
            ) : (
            <TableRow>
            <TableCell colSpan={7} className="text-center py-4">
          No items added for the invoice.
        </TableCell>
      </TableRow>
      )}
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
