import IconButton from "@/components/button/IconButton";
import DummyItemForm from "@/components/form/invoice/dummy/DummyItemForm";
import CancelIcon from "@/components/icon/CancelIcon";
import EditIcon from "@/components/icon/EditIcon";
import { FormModal } from "@/components/modal/FormModal";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import { SparePartService } from "@/service/sparePartInventory/sparePartService";
import { OutsourcedItem } from "@/types/invoice/cash/cashInvoiceTypes";
import { DummyInvoiceItem } from "@/types/invoice/dummy/dummyInvoiceTypes";
import { useState } from "react";
import { Fragment } from "react/jsx-runtime";

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
  const axiosPrivate = useAxiosPrivate();
  const sparePartService = new SparePartService(axiosPrivate);

  const [show, setShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DummyInvoiceItem | null>(
    null
  );

  const onChangeCheckHandle = (item: DummyInvoiceItem) => {
    if (item.outsourced) {
      setOutsourcedItems(
        outsourcedItems.filter(
          (outsourcedItem) => outsourcedItem.index !== item.sparePartId
        )
      );
      setItems(
        items.map((dummyItem) =>
          dummyItem.sparePartId === item.sparePartId
            ? { ...dummyItem, outsourced: false }
            : dummyItem
        )
      );
    } else {
      setItems(
        items.map((dummyItem) =>
          dummyItem.sparePartId === item.sparePartId
            ? { ...dummyItem, outsourced: true }
            : dummyItem
        )
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
          (outsourcedItem) => outsourcedItem.index !== item.sparePartId
        )
      );
    }
    setItems(
      items.filter((dummyItem) => dummyItem.sparePartId !== item.sparePartId)
    );
  };

  const handleEditBtn = (item: DummyInvoiceItem) => {
    setSelectedItem(item);
    setShow(true);
  };

  const handleCancelBtn = () => {
    setSelectedItem(null);
    setShow(false);
  };

  return (
    <Fragment>
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
                // style={{ height: "36px", padding: 0, margin: 0 }}
              >
                <IconButton
                  handleOnClick={() => removeItem(item)}
                  icon={<CancelIcon height="25" width="25" />}
                  tooltipMsg="Remove Item"
                  variant="ghost"
                />
                <IconButton
                  handleOnClick={() => handleEditBtn(item)}
                  icon={<EditIcon height="25" width="25" />}
                  tooltipMsg="Edit Item"
                  variant="ghost"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <FormModal
        title="Update Spare Part Item"
        titleDescription="Update spare part item in the invoice"
        show={show}
        onClose={handleCancelBtn}
        component={
          <DummyItemForm
            item={selectedItem}
            onClose={handleCancelBtn}
            sparePartService={sparePartService}
            items={items}
            setItems={setItems}
            outsourcedItems={outsourcedItems}
            setOutsourcedItems={setOutsourcedItems}
          />
        }
      />
    </Fragment>
  );
}

export default DummyInvoiceItemsGrid;
