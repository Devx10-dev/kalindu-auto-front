import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Delete, PlusCircle, Printer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
}

const CashInvoice: React.FC = () => {
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [newItem, setNewItem] = useState("");
  const [newQuantity, setNewQuantity] = useState(1);
  const [newPrice, setNewPrice] = useState(0);

  const handleAddItem = () => {
    if (newItem && newQuantity > 0 && newPrice >= 0) {
      setItems([
        ...items,
        { name: newItem, quantity: newQuantity, price: newPrice },
      ]);
      setNewItem("");
      setNewQuantity(1);
      setNewPrice(0);
    }
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const total = items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  return (
    <div>
      <Card >
        <CardContent className="flex gap-4 mb-4 items-end justify-start p-3 shadow-sm bg-slate-200 h-full">
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

      <Table className="border rounded-md text-md mb-5 mt-10">
        <TableBody>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
          {items.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>LKR {item.price.toFixed(2)}</TableCell>
              <TableCell>
                LKR {(item.quantity * item.price).toFixed(2)}
              </TableCell>
              <TableCell>
                <Button onClick={() => handleRemoveItem(index)}>Remove</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-start">
        <div className="text-left">
          <p className="text-xl bg-slate-200 text-slate-900 p-5 rounded-md">
            Total: LKR {total.toFixed(2)}
          </p>
          <Button className="mt-4 mb-5">
          <Printer className={"mr-2"} />
          Print Invoice
        </Button>
        <Button className="mt-4 mb-5 bg-red-500 ml-2">
          <Delete className={"mr-2"} />
          Cancel
        </Button>
        </div>
      </div>
    </div>
  );
};

export default CashInvoice;