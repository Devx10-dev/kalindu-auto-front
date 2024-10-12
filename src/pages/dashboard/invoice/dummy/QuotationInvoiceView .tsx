import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import React, { Fragment, useRef } from "react";
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

  // return (
  //   <Fragment>
  //     <Card className={"p-12 mx-auto"} ref={componentRef}>
  //       <div className="mb-3">
  //         <h1 className={"text-3xl font-bold"}>{"KALINDU AUTO"}</h1>
  //         <p className={"text-lg"}>
  //           {"Colombo-Kandy Highway, 252/4 Kandy Rd, Yakkala"}
  //         </p>
  //         <p className={"text-lg"}>{"0332 234 900"}</p>

  //         <p className={"text-lg"}>
  //           Quotation #{Math.floor(1000 + Math.random() * 9000)}
  //         </p>
  //         <p className={"text-lg"}>Date: {today.toDateString()}</p>
  //       </div>

  //       <div className="mb-4">
  //         <h2 className={"text-xl font-semibold"}>Client Details</h2>
  //         <p className={"text-md"}>{customer?.name}</p>
  //         <p className={"text-md"}>{customer?.address}</p>
  //         <p className={"text-md"}>{customer?.contactNo}</p>
  //       </div>

  //       <Table>
  //         <TableRow>
  //           <TableCell className={`w-1/2 text-md`}>Spare Part</TableCell>
  //           <TableCell className={`w-1/6 text-md`}>Quantity</TableCell>
  //           <TableCell className={`w-1/6 text-md`}>Price</TableCell>
  //           <TableCell className={`w-1/6 text-md`}>Total</TableCell>
  //         </TableRow>
  //         {items?.map((item, index) => (
  //           <TableRow key={index}>
  //             <TableCell className={`w-1/2 text-md`}>{item.name}</TableCell>
  //             <TableCell className={`w-1/6 text-md`}>{item.quantity}</TableCell>
  //             <TableCell className={`w-1/6 text-md`}>
  //               ${item.price.toFixed(2)}
  //             </TableCell>
  //             <TableCell className={`w-1/6 "text-md`}>
  //               ${(item.quantity * item.price).toFixed(2)}
  //             </TableCell>
  //           </TableRow>
  //         ))}
  //       </Table>

  //       <div className="mt-4 text-right">
  //         <p className={"font-bold text-xl"}>Total: ${calculateTotal()}</p>
  //       </div>
  //     </Card>
  //     <div className="flex justify-end">
  //       <div className="flex gap-2">
  //         <Button onClick={handleCancelBtn} className="mt-10">
  //           Cancel
  //         </Button>
  //         <Button onClick={handlePrint} className="mt-10">
  //           Print Invoice
  //         </Button>
  //       </div>
  //     </div>
  //   </Fragment>
  // );

  return (
    <React.Fragment>
      <Card className="w-full max-w-3xl mx-auto bg-white shadow-lg">
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold">KALINDU AUTO (PVT) LTD.</h1>
            <p className="text-sm">
              IMPORTERS OF MOTOR VEHICLES, MACHINERY & BODY PARTS
            </p>
          </div>

          <div className="flex justify-between mb-4 text-sm">
            <div>
              <p>No.250/1, Kandy Road, Yakkala.</p>
              <p>Tel: 033-2234900, Tel/Fax: 033-2234959</p>
              <p>E-mail : kalinduauto@sltnet.lk</p>
              <p>Date: {today.toDateString()}</p>
            </div>
            <div>
              <p className="font-bold text-lg">
                {Math.floor(1000 + Math.random() * 9000)}
              </p>
              <p>Branch:- No. 213A,</p>
              <p>Gampaha Road, Yakkala.</p>
              <p>Tel: 033-2232571</p>
            </div>
          </div>

          <h2 className="text-xl font-bold mb-4 text-center">QUOTATION</h2>

          <div className="mb-4">
            <p className="flex">
              <span className="w-20 flex-shrink-0">Name:</span>
              <span className="flex-grow border-b border-dotted border-black ml-2">
                {customer?.name || ""}
              </span>
            </p>
            <p className="flex mt-2">
              <span className="w-20 flex-shrink-0">Address:</span>
              <span className="flex-grow border-b border-dotted border-black ml-2">
                {customer?.address || ""}
              </span>
            </p>
            <p className="flex mt-2">
              <span className="w-20 flex-shrink-0">Vehicle No:</span>
              <span className="flex-grow border-b border-dotted border-black ml-2">
                {customer?.contactNo || ""}
              </span>
            </p>
          </div>

          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Item Name</th>
                <th className="text-left p-2">Qty</th>
                <th className="text-left p-2">Price</th>
                <th className="text-left p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {items?.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.quantity}</td>
                  <td className="p-2"> Rs.{item.price.toFixed(2)}</td>
                  <td className="p-2">
                    {" "}
                    Rs.{(item.quantity * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 text-right">
            <p className="font-bold text-xl">
              Total: Rs.{calculateTotal().toFixed(2)}
            </p>
          </div>

          <p className="mt-4 text-sm">
            QUOTATION VALID FOR TWO WEEKS SUBJECT TO REMAIN GOOD UNSOLD.
          </p>

          <div className="text-right mt-8">
            <p>KALINDU AUTO (PVT) LTD.</p>
            <p>Manager</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end mt-4">
        <div className="flex gap-2">
          <Button onClick={handleCancelBtn} className="mt-2">
            Cancel
          </Button>
          <Button onClick={handlePrint} className="mt-2">
            Print Quotation
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default QuotationInvoiceView;
