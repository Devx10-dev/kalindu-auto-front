import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateToHumanReadable } from "@/utils/dateToString";
import { Button } from "@/components/ui/button";

const PrintPage = () => {
  const componentRef = useRef();
  const location = useLocation();
  const summary = location.state?.summary || {};
  const financialRecords = location.state?.financialRecords || {};
  const navigate = useNavigate();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Summary of ${formatDateToHumanReadable(new Date())}`,
  });

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div
      ref={componentRef}
      className="border border-gray-300 rounded-md p-6 m-8"
    >
      <div className="w-full h-24 flex items-center justify-center flex-col">
        <span className={"font-bold text-2xl"}>
          KALINDU AUTO DAILY SALES SUMMARY
        </span>
        <p>{formatDateToHumanReadable(new Date())}</p>
        <span>Colombo-Kandy Highway, 252/4 Kandy Rd, Yakkala</span>
        <span>0332 234 900</span>
      </div>
      <div className="w-full border-b mb-4 pb-2"></div>

      <div className="mb-4 border p-4 rounded-md">
        <h2 className="font-bold mb-2">Daily Sales</h2>
        <div className="grid grid-cols-2 gap-2">
          <span>Daily Cash sales</span>
          <span>Rs. {summary.saleAmount || ""}</span>
          <span>Credit sales</span>
          <span>Rs. {summary.creditBalance || "0"}</span>
          <span>Daily Deposit sales</span>
          <span>Rs. {summary.depositAmount || "0"}</span>
          <span>Unsettled Cheque sales</span>
          <span>Rs. {summary.unsettledChequeAmount || "0"}</span>
        </div>
        <div className="border-t mt-2 pt-2">
          <span className="font-bold">Daily Total Sales</span>
          <span className="float-right">
            Rs.{" "}
            {(
              Number(summary.saleAmount || 0) +
              Number(summary.creditBalance || 0) +
              Number(summary.depositAmount || 0) +
              Number(summary.unsettledChequeAmount || 0)
            ).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="mb-4 border p-4 rounded-md">
        <h2 className="font-bold mb-2">Expenses</h2>
        <div className="grid grid-cols-2 gap-2">
          {financialRecords
            .filter((financialRecord) => financialRecord.type === "EXPENSE")
            .map((expenseRecord, index) => (
              <React.Fragment key={index}>
                <span>{expenseRecord.field.name}</span>
                <span>Rs. {expenseRecord.amount || "XXX"}</span>
              </React.Fragment>
            ))}
        </div>

        <div className="border-t mt-2 pt-2">
          <span className="font-bold">Total Expenses</span>
          <span className="float-right">
            Rs.{" "}
            {financialRecords
              .filter((financialRecord) => financialRecord.type === "EXPENSE")
              .reduce(
                (total, expenseRecord) =>
                  total + Number(expenseRecord.amount || 0),
                0,
              )
              .toFixed(2)}
          </span>
        </div>
      </div>

      <div className="border p-4 rounded-md">
        <div className="grid grid-cols-2 gap-2">
          <span className="font-bold">Total Sales - Exp</span>
          <span className="text-right">
            Rs.
            {(
              Number(summary.saleAmount || 0) +
              Number(summary.creditBalance || 0) +
              Number(summary.depositAmount || 0) +
              Number(summary.unsettledChequeAmount || 0) -
              financialRecords
                .filter((financialRecord) => financialRecord.type === "EXPENSE")
                .reduce(
                  (total, expenseRecord) =>
                    total + Number(expenseRecord.amount || 0),
                  0,
                )
            ).toFixed(2)}
          </span>
          <span className="font-bold">Cashier Total - Exp</span>
          <span className="text-right">
            Rs.
            {(
              Number(summary.saleAmount || 0) -
              financialRecords
                .filter((financialRecord) => financialRecord.type === "EXPENSE")
                .reduce(
                  (total, expenseRecord) =>
                    total + Number(expenseRecord.amount || 0),
                  0,
                )
            ).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="flex justify-end p-4 print:hidden">
        <Button
          onClick={handleCancel}
          className="px-4 py-2 rounded mr-5"
          variant="outline"
        >
          Cancel
        </Button>
        <Button onClick={handlePrint} className="px-4 py-2 text-white rounded">
          Print Daily Summary
        </Button>
      </div>
    </div>
  );
};

export default PrintPage;
