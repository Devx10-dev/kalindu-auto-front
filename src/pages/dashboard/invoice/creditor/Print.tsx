import { Button } from "@/components/ui/button";
import { Creditor } from "@/types/creditor/creditorTypes";
import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

interface PrintProps {
  creditorDetails: Creditor;
  invoiceData: any;
}

const PrintCreditor = (props?: PrintProps) => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <>
      <div className="bg-gray-100 font-sans" ref={componentRef}>
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="w-full flex items-center justify-center">
            <h1 className="text-3xl font-bold mb-10">
              KALINDU AUTO (PVT) LTD - YAKKALA
            </h1>
          </div>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Creditor Invoice</h1>

            <div className="flex items-start flex-col justify-start gap-2">
              <div className="bg-gray-200 p-2 rounded-l">
                Invoice number : INV-0934043423
              </div>
              <div className="bg-gray-200 p-2 rounded-r">Date : 2024-01-10</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-gray-600">Customer name :</p>
              <p className="text-gray-600">Customer Address :</p>
              <p className="text-gray-600">Customer Contact :</p>
            </div>
            {/* <div>
              <p className="text-gray-600">Client name:</p>
              <p className="text-gray-600">Address:</p>
              <p className="text-gray-600">Tax ID:</p>
            </div> */}
          </div>
          <table className="w-full mb-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4">NAME</th>
                <th className="py-2 px-4">DESCRIPTION</th>
                <th className="py-2 px-4">PRICE/UNIT</th>
                <th className="py-2 px-4">QUANTITY</th>
                <th className="py-2 px-4">TOTAL </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border"></td>
                <td className="py-2 px-4 border">0.00</td>
                <td className="py-2 px-4 border">0</td>
                <td className="py-2 px-4 border">0.00</td>
                <td className="py-2 px-4 border">0.00</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border"></td>
                <td className="py-2 px-4 border">0.00</td>
                <td className="py-2 px-4 border">0</td>
                <td className="py-2 px-4 border">0.00</td>
                <td className="py-2 px-4 border">0.00</td>
              </tr>
            </tbody>
          </table>
          <p className="text-gray-600 mb-2">
            Note: withholding tax can be deducted 15% of the price before VAT.
          </p>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-200 p-2 rounded">
              <p className="text-gray-600">TOTAL</p>

              <p className="font-bold">0.00</p>
            </div>
            <div className="bg-gray-200 p-2 rounded">
              <p className="text-gray-600">VAT</p>
              <p className="font-bold">0.00</p>
            </div>
            <div className="bg-gray-200 p-2 rounded">
              <p className="text-gray-600">DISCOUNT</p>
              <p className="font-bold">0.00</p>
            </div>
            <div className="bg-gray-200 p-2 rounded">
              <p className="text-gray-600">GRAND TOTAL</p>
              <p className="font-bold">0.00</p>
            </div>
          </div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-gray-600">Authorized by:</p>
              <p className="font-bold">Name</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Signature/Stamp</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-end">
        <Button onClick={handlePrint} className="mt-10">
          Print Invoice
        </Button>
        <Link to={"/dashboard/invoice/creditor"}>
          <Button
            onClick={handlePrint}
            className="mt-10 ml-5"
            variant="outline"
          >
            Back
          </Button>
        </Link>
      </div>
    </>
  );
};

export default PrintCreditor;
