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
import React, { useCallback, useEffect, useState } from "react";
import EditIcon from "@/components/icon/EditIcon.tsx";
import IconButton from "@/components/button/IconButton.tsx";
import { InvoiceItem } from "@/types/invoice/creditorInvoice";
import { FormModal } from "@/components/modal/FormModal.tsx";
import EditItem from "@/pages/dashboard/invoice/creditor/components/EditItem.tsx";
import { CirclePlus, Pencil, Trash2, X } from "lucide-react";
import CancelIcon from "@/components/icon/CancelIcon.tsx";
import CreatableSelect from "react-select/creatable";
import { Input } from "@/components/ui/input.tsx";
import { SparePartService } from "@/service/sparePartInventory/sparePartService.ts";
import { useQuery } from "@tanstack/react-query";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";

const InvoiceTable: React.FC<{ sparePartService: SparePartService }> = ({
  sparePartService,
}) => {
  const {
    invoiceItemDTOList,
    removeInvoiceItem,
    setOutsourcedStatus,
    addInvoiceItem,
  } = useCreditorInvoiceStore();

  useEffect(() => {}, [invoiceItemDTOList]);

  const [editingItem, setEditingItem] = useState<InvoiceItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: 1,
    price: null,
    discount: 0,
    sparePartId: -1,
    code: "",
  });

  const isFormValid = useCallback(() => {
    return newItem.name !== "" && newItem.price > 0 && newItem.quantity > 0;
  }, [newItem]);

  const { data: spareParts } = useQuery({
    queryKey: ["spareParts", searchTerm],
    queryFn: () => sparePartService.fetchSpaerPartsByNameOrCode(searchTerm),
    retry: 2,
  });

  const sparePartsOptions =
    spareParts?.map((sparePart) => ({
      value: sparePart.id.toString(),
      label: sparePart.partName.toString(),
    })) || [];

  const handleInputChange = (inputValue: string) => {
    setSearchTerm(inputValue);
  };

  const handleSelectChange = (option: any) => {
    if (option === null) {
      // This handles clearing the input
      setNewItem((prev) => ({
        ...prev,
        name: "",
        sparePartId: -1,
      }));
    } else if (option && option.__isNew__) {
      setNewItem((prev) => ({
        ...prev,
        name: option.label,
        sparePartId: -1,
      }));
    } else if (option) {
      const selectedSparePart = spareParts?.find(
        (part) => part.id.toString() === option.value,
      );
      if (selectedSparePart) {
        setNewItem((prev) => ({
          ...prev,
          name: selectedSparePart.partName,
          sparePartId: selectedSparePart.id,
        }));
      }
    }
  };

  const handleAddItem = () => {
    if (isFormValid()) {
      addInvoiceItem({
        ...newItem,
        quantity: Number(newItem.quantity),
        price: Number(newItem.price),
        discount: Number(newItem.discount),
        description: "",
      });
      setNewItem({
        name: "",
        quantity: 1,
        price: null,
        discount: 0,
        sparePartId: -1,
        code: "",
      });
    }
  };

  return (
    <div>
      <Table className="border rounded-md text-md mb-5 mt-5">
        <h2 className="text-xl font-bold mt-2 ml-3">Item List</h2>
        <TableBody>
          <TableRow>
            <TableHead className="w-[300px]">Item</TableHead>
            <TableHead>Item Code</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Outsource</TableHead>
            <TableHead className="flex justify-end items-center">
              Action
            </TableHead>
          </TableRow>
          {invoiceItemDTOList.length > 0 ? (
            invoiceItemDTOList.map((item: any, index: any) => (
              <TableRow key={index}>
                <TableCell className="w-[300px]">{item.name}</TableCell>
                <TableCell>{item.code}</TableCell>
                <TableCell className="text-right w-[100px]">
                  {item.quantity}
                </TableCell>
                <TableCell className="text-right">{item.price}</TableCell>
                <TableCell className="text-right">
                  {(
                    item.quantity * item.price -
                    item.quantity * item.discount
                  ).toFixed(2)}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={item.outsourced}
                    onCheckedChange={(state) =>
                      setOutsourcedStatus(item, state)
                    }
                  />
                </TableCell>
                <TableCell>
                  <div className="flex justify-end items-center gap-4">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            onClick={() => removeInvoiceItem(item)}
                            style={{ cursor: "pointer" }}
                          >
                            <Trash2 color="#C7253E" height={22} width={18} />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{"Remove Item"}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            onClick={() => setEditingItem(item)}
                            style={{ cursor: "pointer" }}
                          >
                            <Pencil color="#E9C46A" height={22} width={18} />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{"Edit Item"}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {/*<IconButton*/}
                    {/*    icon={<EditIcon height="15" width="15"/>}*/}
                    {/*    tooltipMsg="Edit Spare Part"*/}
                    {/*    handleOnClick={() => setEditingItem(item)}*/}
                    {/*/>*/}
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
          <TableRow className="bg-slate-100">
            <TableCell className="w-[300px]">
              <CreatableSelect
                options={sparePartsOptions}
                onInputChange={handleInputChange}
                onChange={handleSelectChange}
                isClearable
                value={
                  newItem.name
                    ? {
                        label: newItem.name,
                        value: newItem.sparePartId.toString(),
                      }
                    : null
                }
              />
            </TableCell>
            <TableCell>
              <Input
                type="text"
                value={newItem.code}
                onChange={(e) =>
                  setNewItem((prev) => ({ ...prev, code: e.target.value }))
                }
                placeholder="Item code"
              />
            </TableCell>
            <TableCell className="w-[100px]">
              <Input
                type="number"
                value={newItem.quantity}
                onChange={(e) =>
                  setNewItem((prev) => ({
                    ...prev,
                    quantity: Number(e.target.value),
                  }))
                }
                placeholder="Quantity"
                min={0}
              />
            </TableCell>
            <TableCell>
              <Input
                type="number"
                value={newItem.price}
                onChange={(e) =>
                  setNewItem((prev) => ({
                    ...prev,
                    price: e.target.value ? parseFloat(e.target.value) : 0,
                  }))
                }
                placeholder="Price"
                min={0}
              />
            </TableCell>

            <TableCell className="text-right">
              {(
                (newItem.quantity || 0) * (newItem.price || 0) -
                (newItem.discount || 0)
              ).toFixed(2)}
            </TableCell>
            <TableCell>
              <Switch disabled />
            </TableCell>
            <TableCell>
              <IconButton
                icon={<CirclePlus height="20" width="20" />}
                tooltipMsg="Add item"
                handleOnClick={handleAddItem}
                disabled={!isFormValid()}
              />
            </TableCell>
          </TableRow>
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
