import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Fragment, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Customer, Item } from "./DummyInvoice";

const QuotationInvoiceView = ({
  items,
  customer,
  handleCancelBtn,
}: {
  handleCancelBtn: () => void;
  customer: Customer;
  items: Item[];
}) => {
  const today = new Date();
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "FF",
  });

  const calculateTotal = () => {
    if (items.length === 0) return 0;

    return items.reduce((total, item) => total + item.quantity * item.price, 0);
  };

  return (
    <Fragment>
      <Card className={"p-12 mx-auto"} ref={componentRef}>
        <div className="mb-3">
          <h1 className={"text-3xl font-bold"}>{"KALINDU AUTO"}</h1>
          <p className={"text-lg"}>
            {"Colombo-Kandy Highway, 252/4 Kandy Rd, Yakkala"}
          </p>
          <p className={"text-lg"}>{"0332 234 900"}</p>

          <p className={"text-lg"}>
            Quotation #{Math.floor(1000 + Math.random() * 9000)}
          </p>
          <p className={"text-lg"}>Date: {today.toDateString()}</p>
        </div>

        <div className="mb-4">
          <h2 className={"text-xl font-semibold"}>Client Details</h2>
          <p className={"text-md"}>{customer?.name}</p>
          <p className={"text-md"}>{customer?.address}</p>
          <p className={"text-md"}>{customer?.contactNo}</p>
        </div>

        <Table>
          <TableRow>
            <TableCell className={`w-1/2 text-md`}>Spare Part</TableCell>
            <TableCell className={`w-1/6 text-md`}>Quantity</TableCell>
            <TableCell className={`w-1/6 text-md`}>Price</TableCell>
            <TableCell className={`w-1/6 text-md`}>Total</TableCell>
          </TableRow>
          {items?.map((item, index) => (
            <TableRow key={index}>
              <TableCell className={`w-1/2 text-md`}>{item.name}</TableCell>
              <TableCell className={`w-1/6 text-md`}>{item.quantity}</TableCell>
              <TableCell className={`w-1/6 text-md`}>
                ${item.price.toFixed(2)}
              </TableCell>
              <TableCell className={`w-1/6 "text-md`}>
                ${(item.quantity * item.price).toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </Table>

        <div className="mt-4 text-right">
          <p className={"font-bold text-xl"}>Total: ${calculateTotal()}</p>
        </div>
      </Card>
      <div className="flex justify-end">
        <div className="flex gap-2">
          <Button onClick={handleCancelBtn} className="mt-10">
            Cancel
          </Button>
          <Button onClick={handlePrint} className="mt-10">
            Print Invoice
          </Button>
        </div>
      </div>
    </Fragment>
  );
};

export default QuotationInvoiceView;
