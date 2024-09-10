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

  // useReactToPrint hook for printing with a custom document title
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Summary of ${formatDateToHumanReadable(new Date())}`,
  });

  const handleCancel = () => {
    navigate(-1); // Navigate back to the previous page
  };

  console.log(financialRecords);

  return (
    <div className="border border-gray-300 rounded-md p-6 m-8">
      <div className="w-full border-b mb-4 pb-2">
        <h1 className="font-bold text-2xl">Daily Sales Summary</h1>
        <p>{formatDateToHumanReadable(new Date())}</p>
      </div>

      <div className="mb-4 border p-4 rounded-md">
        <h2 className="font-bold mb-2">Daily Sales</h2>
        <div className="grid grid-cols-2 gap-2">
          <span>Daily Cash sales</span>
          <span>Rs. {summary.saleAmount || ""}</span>
          <span>Credit sales</span>
          <span>Rs. {summary.creditBalance || "0"}</span>
          <span>Daily Deposit sales</span>
          <span>Rs. {summary.depositSales || "0"}</span>
          <span>Cheque sales</span>
          <span>Rs. {summary.unsettledChequeAmount || "0"}</span>
          <span>Card pay</span>
          <span>Rs. {summary.cardPay || "0"}</span>
        </div>
        <div className="border-t mt-2 pt-2">
          <span className="font-bold">Daily Total Sales</span>
          <span className="float-right">
            Rs.{" "}
            {(
              Number(summary.saleAmount || 0) +
              Number(summary.creditBalance || 0) +
              Number(summary.depositSales || 0) +
              Number(summary.unsettledChequeAmount || 0) +
              Number(summary.cardPay || 0)
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

        {/* Total expenses */}
        <div className="border-t mt-2 pt-2">
          <span className="font-bold">Total Expenses</span>
          <span className="float-right">
            Rs. {summary.totalExpenses || "XXX"}
          </span>
        </div>
      </div>

      <div className="border p-4 rounded-md">
        <div className="grid grid-cols-2 gap-2">
          <span className="font-bold">Sales - Exp</span>
          <span>Rs. {summary.salesMinusExpenses || "XXX"}</span>
          <span className="font-bold">Cashin Till a/c Exp</span>
          <span>Rs. {summary.cashInTillAccountExp || "XXX"}</span>
        </div>
      </div>

      <div className="flex justify-end p-4 print:hidden">
        <Button onClick={handlePrint} className="px-4 py-2 text-white rounded">
          Print Daily Summary
        </Button>
      </div>
    </div>
  );
};

export default PrintPage;
