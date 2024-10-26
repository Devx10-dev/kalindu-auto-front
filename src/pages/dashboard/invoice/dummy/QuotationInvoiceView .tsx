import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const QuotationPrintPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { items, customer } = location.state;
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Quotation_${Math.floor(1000 + Math.random() * 9000)}`,
  });

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.quantity * item.price, 0);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <React.Fragment>
      <Card
        className="w-full max-w-5xl mx-auto bg-white  mt-5 "
        ref={componentRef}
      >
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
              <p>Date: {new Date().toDateString()}</p>
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
                  <td className="p-2">Rs.{item.price.toFixed(2)}</td>
                  <td className="p-2">
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
        <div className="flex justify-end mt-4 mb-10 mr-5 print:hidden">
          <div className="flex gap-2">
            <Button
              onClick={handleBack}
              className="px-4 py-2 rounded mr-5 mt-2"
              variant="outline"
            >
              Cancel
            </Button>
            <Button onClick={handlePrint} className="mt-2">
              Print Quotation
            </Button>
          </div>
        </div>
      </Card>
    </React.Fragment>
  );
};

export default QuotationPrintPage;
