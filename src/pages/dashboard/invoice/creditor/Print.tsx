import { Button } from "@/components/ui/button";
import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { ReactToPrint, useReactToPrint } from "react-to-print";

const PrintCreditor = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <>
      <div className="bg-gray-100 font-sans" ref={componentRef}>
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Creditor Invoice</h1>
            <div className="flex items-center">
              <div className="bg-gray-200 p-2 rounded-l">Invoice number</div>
              <div className="bg-gray-200 p-2 rounded-r">Date</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-gray-600">Company name:</p>
              <p className="text-gray-600">Address (Head Office):</p>
              <p className="text-gray-600">Tax ID:</p>
            </div>
            <div>
              <p className="text-gray-600">Client name:</p>
              <p className="text-gray-600">Address:</p>
              <p className="text-gray-600">Tax ID:</p>
            </div>
          </div>
          <table className="w-full mb-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4">No</th>
                <th className="py-2 px-4">DESCRIPTION</th>
                <th className="py-2 px-4">PRICE/UNIT</th>
                <th className="py-2 px-4">QUANTITY</th>
                <th className="py-2 px-4">TOTAL (SGD)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border"></td>
                <td className="py-2 px-4 border">0.00</td>
                <td className="py-2 px-4 border">0</td>
                <td className="py-2 px-4 border">0.00</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border"></td>
                <td className="py-2 px-4 border">0.00</td>
                <td className="py-2 px-4 border">0</td>
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

              <p className="font-bold">SGD 0.00</p>
            </div>
            <div className="bg-gray-200 p-2 rounded">
              <p className="text-gray-600">VAT 7%</p>
              <p className="font-bold">SGD 0.00</p>
            </div>
            <div className="bg-gray-200 p-2 rounded">
              <p className="text-gray-600">GRAND TOTAL</p>
              <p className="font-bold">SGD 0.00</p>
            </div>
          </div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-gray-600">Please make payment to:</p>
              <p className="font-bold">Company</p>
              <p className="font-bold">Bank name</p>
            </div>
            <div>
              <p className="text-gray-600">Authorized by:</p>
              <p className="font-bold">Name</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Signature</p>
            <div className="flex justify-center mt-2">
              <div className="bg-gray-200 p-2 rounded-full">
                <p className="font-bold">COMPANY NAME</p>
                <p className="text-sm text-gray-600">company stamp</p>
              </div>
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
