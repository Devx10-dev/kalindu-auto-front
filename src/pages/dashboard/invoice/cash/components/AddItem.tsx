import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PlusCircle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import useInvoiceStore from "../context/Store";

const AddItem: React.FC = () => {
  const {
    newItem,
    newQuantity,
    newPrice,
    newDescription,
    newDiscount,
    newCode,
    setNewItem,
    setNewQuantity,
    setNewPrice,
    setNewDescription,
    setNewDiscount,
    setNewCode,
    addItem,
    clearNewItem,
  } = useInvoiceStore();

  const handleAddItem = () => {
    if (newItem && newQuantity > 0 && newPrice >= 0) {
      addItem({
        name: newItem,
        quantity: newQuantity,
        price: newPrice,
        description: newDescription,
        discount: newDiscount,
        code: newCode,
        isOutsourced: false,
      });
      clearNewItem();
    }
  };

  const handleClearItem = () => {
    clearNewItem();
  };

  return (
    <Card>
      <CardContent className="p-3 shadow-sm bg-slate-200">
        <div className="grid  gap-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Item Name</Label>
              <Input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Item name"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Price</Label>
              <Input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(parseFloat(e.target.value))}
                placeholder="Price"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Quantity</Label>
              <Input
                type="number"
                value={newQuantity}
                onChange={(e) => setNewQuantity(parseInt(e.target.value))}
                placeholder="Quantity"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Code</Label>
              <Input
                type="text"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="Code"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Description</Label>
              <Input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Description"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Discount</Label>
              <Input
                type="number"
                value={newDiscount}
                onChange={(e) => setNewDiscount(parseFloat(e.target.value))}
                placeholder="Discount"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <Button className="" onClick={handleAddItem}>
            <PlusCircle className="mr-2" /> Add Item
          </Button>
          <Button className="bg-slate-500" onClick={handleClearItem}>
            <XCircle className="mr-2" /> Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddItem;
