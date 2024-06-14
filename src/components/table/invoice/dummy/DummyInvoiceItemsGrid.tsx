import IconButton from "@/components/button/IconButton";
import CancelIcon from "@/components/icon/CancelIcon";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { OutsourcedItem } from "@/types/invoice/cash/cashInvoiceTypes";
import { DummyInvoiceItem } from "@/types/invoice/dummy/dummyInvoiceTypes";

function DummyInvoiceItemsGrid({
  items,
  setItems,
  outsourcedItems,
  setOutsourcedItems,
}: {
  items: DummyInvoiceItem[];
  outsourcedItems: OutsourcedItem[];
  setItems: React.Dispatch<React.SetStateAction<DummyInvoiceItem[]>>;
  setOutsourcedItems: React.Dispatch<React.SetStateAction<OutsourcedItem[]>>;
}) {
  const onChangeCheckHandle = (item: DummyInvoiceItem) => {
    if (item.outsourced) {
      setOutsourcedItems(
        outsourcedItems.filter(
          (outsourcedItem) => outsourcedItem.index !== item.sparePartId,
        ),
      );
      setItems(
        items.map((dummyItem) =>
          dummyItem.sparePartId === item.sparePartId
            ? { ...dummyItem, outsourced: false }
            : dummyItem,
        ),
      );
    } else {
      setItems(
        items.map((dummyItem) =>
          dummyItem.sparePartId === item.sparePartId
            ? { ...dummyItem, outsourced: true }
            : dummyItem,
        ),
      );
      setOutsourcedItems([
        {
          index: item.sparePartId,
          buyingPrice: undefined,
          companyName: undefined,
          itemCode: item.code,
          itemName: item.name,
          quantity: item.quantity,
        },
        ...outsourcedItems,
      ]);
    }
  };

  const removeItem = (item: DummyInvoiceItem) => {
    if (item.outsourced) {
      setOutsourcedItems(
        outsourcedItems.filter(
          (outsourcedItem) => outsourcedItem.index !== item.sparePartId,
        ),
      );
    }
    setItems(
      items.filter((dummyItem) => dummyItem.sparePartId !== item.sparePartId),
    );
  };

  return (
    <Table className="border rounded-md text-md mb-5 table-responsive">
      <TableCaption>Dummy Invoice items</TableCaption>
      <TableBody>
        <TableRow style={{ height: "36px" }}>
          <TableHead style={{ height: "36px" }}>Item</TableHead>
          <TableHead style={{ height: "36px" }} align="right">
            Quantity
          </TableHead>
          <TableHead style={{ height: "36px" }} align="right">
            Price
          </TableHead>
          <TableHead style={{ height: "36px" }} align="right">
            Dummy Price
          </TableHead>
          <TableHead style={{ height: "36px" }} align="right">
            Discount
          </TableHead>
          <TableHead style={{ height: "36px" }} align="right">
            Total
          </TableHead>
          <TableHead style={{ height: "36px" }}>Outsource</TableHead>
          <TableHead style={{ height: "36px" }}>Action</TableHead>
        </TableRow>
        {items.map((item, index) => (
          <TableRow key={index}>
            <TableCell className="p-0">{item.name}</TableCell>
            <TableCell className="p-0" align="right">
              {item.quantity}
            </TableCell>
            <TableCell className="p-0" align="right">
              {item.price}
            </TableCell>
            <TableCell className="p-0" align="right">
              {item.dummyPrice}
            </TableCell>
            <TableCell className="p-0" align="right">
              {item.discount}
            </TableCell>
            <TableCell className="p-0" align="right">
              {item.discount !== undefined
                ? (item.price * item.quantity - item.discount).toFixed(2)
                : (item.price * item.quantity).toFixed(2)}
            </TableCell>
            <TableCell className="p-0" align="center">
              <Checkbox
                defaultChecked={false}
                checked={item.outsourced}
                onCheckedChange={() => onChangeCheckHandle(item)}
              />
            </TableCell>
            <TableCell
              className="p-0"
              style={{ height: "36px", padding: 0, margin: 0 }}
            >
              <IconButton
                handleOnClick={() => removeItem(item)}
                icon={<CancelIcon height="25" width="25" />}
                tooltipMsg="Remove Item"
                variant="ghost"
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default DummyInvoiceItemsGrid;
