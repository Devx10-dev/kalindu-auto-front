// components/InvoiceTable.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import useInvoiceStore from "../context/store";

const InvoiceTable: React.FC = () => {
  const { items, removeItem } = useInvoiceStore();

  const handleRemoveItem = (index: number) => {
    removeItem(index);
  };

  return (
    <Table className="border rounded-md text-md mb-5 mt-10">
      <TableBody>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Creditor Name</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
        {items.map((item, index) => (
          <TableRow key={index}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.quantity}</TableCell>
            <TableCell>LKR {item.price.toFixed(2)}</TableCell>
            <TableCell>LKR {(item.quantity * item.price).toFixed(2)}</TableCell>
            <TableCell>{item.creditorName}</TableCell>
            <TableCell>
              <Button onClick={() => handleRemoveItem(index)}>Remove</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default InvoiceTable;
