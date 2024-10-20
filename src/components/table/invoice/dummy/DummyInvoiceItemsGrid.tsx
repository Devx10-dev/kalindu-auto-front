import IconButton from "@/components/button/IconButton";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import { Item } from "@/pages/dashboard/invoice/dummy/DummyInvoice";
import { SparePartService } from "@/service/sparePartInventory/sparePartService";
import { useQuery } from "@tanstack/react-query";
import { CirclePlus, Trash2 } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import Select from "react-select";
import { Fragment } from "react/jsx-runtime";

function DummyInvoiceItemsGrid({
  items,
  setItems,
}: {
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
}) {
  const axiosPrivate = useAxiosPrivate();
  const sparePartService = new SparePartService(axiosPrivate);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectKey, setSelectKey] = useState(0);
  const [newItem, setNewItem] = useState({
    id: Math.random() * 100,
    name: "",
    quantity: 1,
    price: undefined,
  });

  const { data: spareParts } = useQuery({
    queryKey: [`spareParts-${searchTerm}`, searchTerm],
    queryFn: () => sparePartService.fetchSpaerPartsByNameOrCode(searchTerm),
    retry: 1,
  });

  const sparePartOptions =
    spareParts?.map((sparePart) => ({
      value: sparePart.partName,
      label: sparePart.partName,
    })) || [];

  const removeItem = (item: Item) => {
    setItems(items.filter((dummyItem) => dummyItem.id !== item.id));
  };

  const isFormValid = useCallback(() => {
    return newItem.name !== "" && newItem.price > 0 && newItem.quantity > 0;
  }, [newItem]);

  const handleAddItem = () => {
    if (isFormValid()) {
      setItems([newItem, ...items]);

      // Clear the form by resetting newItem to default values
      setNewItem({
        id: Math.random() * 100,
        name: "",
        quantity: 1,
        price: 0,
      });

      setSelectKey((prevKey) => prevKey + 1);
    }
  };

  const inputRefs = useRef<any[]>([]);
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter") {
      console.log("Enter",index);
      e.preventDefault();
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  return (
    <Fragment>
      <Table className="border rounded-md text-md mb-5">
        <TableCaption>Quotation items</TableCaption>
        <TableBody>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead style={{ textAlign: "end" }}>Quantity</TableHead>
            <TableHead style={{ textAlign: "end" }}>Price</TableHead>
            <TableHead style={{ textAlign: "end" }}>Total</TableHead>
            <TableHead style={{ textAlign: "center" }}>Action</TableHead>
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
                {(item.price * item.quantity).toFixed(2)}
              </TableCell>

              <TableCell
                className="p-0"
                // style={{ height: "36px", padding: 0, margin: 0 }}
                align="center"
              >
                <div
                  onClick={() => removeItem(item)}
                  style={{ cursor: "pointer" }}
                >
                  <Trash2 width={22} height={18} color="#C7253E" />
                </div>
              </TableCell>
            </TableRow>
          ))}
          <TableRow className="bg-slate-100">
            <TableCell className="w-4/12">
              <Select
                key={selectKey}
                options={sparePartOptions}
                onChange={(selectedOption) =>
                  setNewItem({ ...newItem, name: selectedOption.value })
                }
                ref={(el) => (inputRefs.current[1] = el)}
                onKeyDown={(e) => {
                  if (newItem.name!=="") {
                    handleKeyDown(e, 1);
                  }
                }}
                onInputChange={(e) => setSearchTerm(e)}
                // value={{ label: newItem.name, value: newItem.name }}
                placeholder="Select Spare part"
              />
            </TableCell>

            <TableCell className="w-2/12">
              <Input
                type="number"
                value={newItem?.quantity ?? 1}
                onChange={(e) =>
                  setNewItem((prev) => ({
                    ...prev,
                    quantity: Number(e.target.value),
                  }))
                }
                ref={(el) => (inputRefs.current[2] = el)}
                onKeyDown={(e) => handleKeyDown(e, 2)}
                placeholder="Enter Quantity"
                min={1}
                style={{ textAlign: "right" }}
              />
            </TableCell>
            <TableCell className="w-2/12">
              <Input
                type="number"
                value={newItem?.price ?? 0}
                onChange={(e) =>
                  setNewItem((prev) => ({
                    ...prev,
                    price: e.target.value ? parseFloat(e.target.value) : 0,
                  }))
                }
                ref={(el) => (inputRefs.current[3] = el)}
                onKeyDown={(e) => handleKeyDown(e, 3)}
                placeholder="Enter Price"
                min={0}
                style={{ textAlign: "right" }}
              />
            </TableCell>
            <TableCell className="w-2/12 p-0" align="right">
              {(newItem.price * newItem.quantity).toFixed(2) === "NaN"
                ? 0
                : (newItem.price * newItem.quantity).toFixed(2)}
            </TableCell>
            <TableCell align="center" className="w-2/12">
                <IconButton
                  icon={<CirclePlus height="20" width="20" />}
                  tooltipMsg="Add item"
                  ref={(el) => (inputRefs.current[4] = el)}
                  handleOnClick={handleAddItem}
                  disabled={!isFormValid()}
                />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Fragment>
  );
}

export default DummyInvoiceItemsGrid;
