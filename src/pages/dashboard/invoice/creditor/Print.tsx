import { Button } from "@/components/ui/button";
import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { ReactToPrint, useReactToPrint } from "react-to-print";
import useCreditorInvoiceStore from "./context/useCreditorInvoiceStore";
import { Separator } from "@/components/ui/separator";
import { InvoiceItem } from "@/types/invoice/creditorInvoice";

const PrintCreditor = () => {
  const componentRef = useRef();
  // Function to generate the file name
  const generatePrintFileName = () => {
    const today = new Date();
    const dateString = today.toISOString().split("T")[0]; // Format: YYYY-MM-DD
    return `${invoiceData.invoiceId}_${dateString}.pdf`;
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: generatePrintFileName(),
  });

  const { getRequestData } = useCreditorInvoiceStore();
  const invoiceData = getRequestData();
  const today = new Date();

  return (
    <>
      <div className="font-sans mt-5" ref={componentRef}>
        <div className="w-full h-24 border flex items-center justify-center flex-col">
          <span className={"font-bold text-2xl"}>KALINDU AUTO</span>
          <span>Colombo-Kandy Highway, 252/4 Kandy Rd, Yakkala</span>
          <span>0332 234 900</span>
        </div>
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold">Creditor Invoice</h1>
            <div className="flex items-start flex-col">
              <div className=" p-2 rounded-l font-bold">
                INVOICE : {invoiceData.invoiceId}
              </div>
              <div className="p-2 rounded-r font-bold">
                Date : {today.toDateString()}
              </div>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-gray-600">
                Creditor Name: {invoiceData.creditorName}
              </p>
              <p className="text-gray-600">Address :</p>
              <p className="text-gray-600">Contact No:</p>
            </div>
            <div>{/* add more data here  */}</div>
          </div>
          <Separator />
          <table className="w-full mb-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4">NAME</th>
                <th className="py-2 px-4">DESCRIPTION</th>
                <th className="py-2 px-4">PRICE/UNIT</th>
                <th className="py-2 px-4">QUANTITY</th>
                <th className="py-2 px-4">DISCOUNT</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.invoiceItems.map((item: any) => (
                <tr key={item.name}>
                  <td className="py-2 px-4 border">{item.name}</td>
                  <td className="py-2 px-4 border">{item.description}</td>
                  <td className="py-2 px-4 border">Rs {item.price}</td>
                  <td className="py-2 px-4 border">{item.quantity}</td>
                  <td className="py-2 px-4 border">Rs {item.discount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Separator />
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="bg-gray-100 p-2 rounded">
              <p className="text-gray-600">DISCOUNT</p>
              <p className="font-bold">Rs : {invoiceData.totalDiscount}</p>
            </div>
            <div className="bg-gray-100 p-2 rounded">
              <p className="text-gray-600">VAT</p>
              <p className="font-bold">Rs : {invoiceData.VAT}</p>
            </div>
            <div className="bg-gray-100 p-2 rounded">
              <p className="text-gray-600">TOTAL</p>
              <p className="font-bold">Rs : {invoiceData.totalPrice}</p>
            </div>
          </div>
          <Separator />
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-gray-600">Authorized by:</p>
              <p className="font-bold">Name</p>
            </div>
          </div>
          {/* <div className="text-center">
            <p className="text-gray-600">Signature</p>
            <div className="flex justify-center mt-2">
              <div className="bg-gray-200 p-2 rounded-full">
                <p className="font-bold">COMPANY NAME</p>
                <p className="text-sm text-gray-600">company stamp</p>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      <div className="w-full flex justify-center">
        <Button onClick={handlePrint} className="mt-10">
          Print Invoice
        </Button>
        <Link to={"/dashboard/invoice/creditor"}>
          <Button
            onClick={handlePrint}
            className="mt-10 ml-5"
            variant="outline"
          >
            Cancel
          </Button>
        </Link>
      </div>
    </>
  );
};

export default PrintCreditor;
