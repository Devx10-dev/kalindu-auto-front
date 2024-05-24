import IconButton from "@/components/button/IconButton";
import CancelIcon from "@/components/icon/CancelIcon";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";

function DummyInvoiceItemsGrid() {
  return (
    <Table className="border rounded-md text-md mb-5 table-responsive">
      <TableBody>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead align="right">Quantity</TableHead>
          <TableHead align="right">Price</TableHead>
          <TableHead align="right">Dummy Price</TableHead>
          <TableHead align="right">Discount</TableHead>
          <TableHead align="right">Total</TableHead>
          <TableHead>Outsource</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
        {[1, 2].map((item, index) => (
          <TableRow key={index}>
            <TableCell>{"Front Buffer"}</TableCell>
            <TableCell align="right">{2}</TableCell>
            <TableCell align="right">2000.00</TableCell>
            <TableCell align="right">250.00</TableCell>
            <TableCell align="right">3500.00</TableCell>
            <TableCell align="right">4500.00</TableCell>
            <TableCell align="center">
              <Switch checked />
            </TableCell>
            <TableCell>
              <IconButton
                handleOnClick={() => console.log("yee")}
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
