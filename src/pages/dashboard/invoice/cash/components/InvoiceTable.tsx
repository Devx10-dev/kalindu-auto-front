import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@/components/ui/table";
import {Switch} from "@/components/ui/switch";
import {Button} from "@/components/ui/button";
import useCashInvoiceStore from "../context/useCashInvoiceStore";
import {CirclePlus, PlusIcon, X} from "lucide-react";
import React, {useCallback, useState} from "react";
import {InvoiceItem} from "@/types/invoice/cashInvoice";
import {FormModal} from "@/components/modal/FormModal.tsx";
import EditItem from "@/pages/dashboard/invoice/cash/components/EditItem.tsx";
import IconButton from "@/components/button/IconButton";
import EditIcon from "@/components/icon/EditIcon";
import {SparePartService} from "@/service/sparePartInventory/sparePartService.ts";
import {useQuery} from "@tanstack/react-query";
import CreatableSelect from "react-select/creatable";
import { Input } from "@/components/ui/input.tsx";

const InvoiceTable: React.FC <{sparePartService: SparePartService}> = ({sparePartService}) => {
    const {
        invoiceItemDTOList,
        removeInvoiceItem,
        setOutsourcedStatus,
        addInvoiceItem
    } = useCashInvoiceStore();

    const [editingItem, setEditingItem] = useState<InvoiceItem | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [newItem, setNewItem] = useState({
        name: "",
        quantity: "",
        price: "",
        discount: 0,
        sparePartId: -1,
    });

    const isFormValid = useCallback(() => {
        return newItem.name !== "" &&
            newItem.quantity !== "" &&
            newItem.price !== "" &&
            newItem.discount !== null;
    }, [newItem]);

    const { data: spareParts } = useQuery({
        queryKey: ["spareParts", searchTerm],
        queryFn: () => sparePartService.fetchSpaerPartsByNameOrCode(searchTerm),
        retry: 2,
    });

    const sparePartsOptions =
        spareParts?.map((sparePart) => ({
            value: sparePart,
            label: sparePart.partName.toString(),
        })) || [];

    const handleInputChange = (inputValue: string) => {
        setSearchTerm(inputValue);
    };

    const handleSelectChange = (option: any) => {
        if (option && option.__isNew__) {
            setNewItem(prev => (
                {...prev,
                    name: option.label,
                    sparePartId: -1
                }));
        } else if (option) {
            setNewItem(prev => (
                { ...prev,
                    name: option.value.partName,
                    sparePartId: option.value.id
                }));
        }
    };

    const handleAddItem = () => {
        if(isFormValid()){
            addInvoiceItem({
                ...newItem,
                quantity: Number(newItem.quantity),
                price:Number(newItem.price),
                discount: Number(newItem.discount)
            })
            setNewItem({
                name: "",
                quantity: "",
                price: "",
                discount: 0,
                sparePartId: -1,
            });
        }
    };

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
                                        checked={item.outsourced}
                                        onCheckedChange={(state) =>
                                            setOutsourcedStatus(item, state)
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="flex justify-center items-center gap-2">
                                        <Button
                                            onClick={() => removeInvoiceItem(item)}
                                            variant={"secondary"}
                                        >
                                            <X className="mr-2"/> Remove
                                        </Button>
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
                    <TableRow className="bg-slate-100">
                        <TableCell>
                            <CreatableSelect
                                options={sparePartsOptions}
                                onInputChange={handleInputChange}
                                onChange={handleSelectChange}
                                isClearable
                                value={newItem.name ? {
                                    label: newItem.name,
                                    value: newItem.name
                                } : null}
                            />
                        </TableCell>
                        <TableCell>
                            <Input
                                type="number"
                                value={newItem.quantity}
                                onChange={(e) => setNewItem(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                                placeholder="Quantity"
                            />
                        </TableCell>
                        <TableCell>
                            <Input
                                type="number"
                                value={newItem.price}
                                onChange={(e) => setNewItem(prev => ({ ...prev, price: Number(e.target.value) }))}
                                placeholder="Price"
                            />
                        </TableCell>
                        <TableCell>
                            <Input
                                type="number"
                                value={newItem.discount}
                                onChange={(e) => setNewItem(prev => ({ ...prev, discount: Number(e.target.value) }))}
                                placeholder="Discount"
                            />
                        </TableCell>
                        <TableCell>
                            LKR {((newItem.quantity || 0) * (newItem.price || 0) - (newItem.discount || 0)).toFixed(2)}
                        </TableCell>
                        <TableCell>
                            <Switch disabled />
                        </TableCell>
                        <TableCell>
                            <IconButton
                                icon={<CirclePlus height="20" width="20"/>}
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
                        <EditItem item={editingItem} onClose={() => setEditingItem(null)}/>
                    )
                }
            />
        </div>
    );
};

export default InvoiceTable;
