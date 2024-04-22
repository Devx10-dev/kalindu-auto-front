// components/AddItem.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import useInvoiceStore from "../context/store";

const creditorNames = [
  "John Doe",
  "Jane Smith",
  "Bob Johnson",
  "Alice Williams",
];

const AddItem: React.FC = () => {
  const {
    newItem,
    newQuantity,
    newPrice,
    newCreditorName,
    setNewItem,
    setNewQuantity,
    setNewPrice,
    setNewCreditorName,
    addItem,
  } = useInvoiceStore();

  const handleAddItem = () => {
    if (newItem && newQuantity > 0 && newPrice >= 0) {
      addItem({
        name: newItem,
        quantity: newQuantity,
        price: newPrice,
        creditorName: newCreditorName,
      });
      setNewItem("");
      setNewQuantity(1);
      setNewPrice(0);
    }
  };

  return (
    <Card>
      <CardContent className="flex gap-4 mb-4 items-end justify-start p-3 shadow-sm bg-slate-200 h-full">
        <div className="flex flex-col gap-5 w-1/4">
          <Label className="ml-2 text-lg">Creditor Name</Label>
          <select
            value={newCreditorName}
            onChange={(e) => setNewCreditorName(e.target.value)}
            className="h-10"
          >
            <option value="">Select Creditor</option>
            {creditorNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-5 w-1/4 border-b-2">
          <Label className="ml-2 text-lg">Item Name</Label>
          <Input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Item name"
          />
        </div>
        <div className="flex flex-col gap-5 w-1/4">
          <Label className="ml-2 text-lg">Quantity</Label>
          <Input
            type="number"
            value={newQuantity}
            onChange={(e) => setNewQuantity(parseInt(e.target.value))}
            placeholder="Quantity"
          />
        </div>
        <div className="flex flex-col gap-5 w-1/4">
          <Label className="ml-2 text-lg">Price</Label>
          <Input
            type="number"
            value={newPrice}
            onChange={(e) => setNewPrice(parseFloat(e.target.value))}
            placeholder="Price"
          />
        </div>

        <Button className="" onClick={handleAddItem}>
          <PlusCircle className={"mr-2"} />
          Add Item
        </Button>
      </CardContent>
    </Card>
  );
};

export default AddItem;
