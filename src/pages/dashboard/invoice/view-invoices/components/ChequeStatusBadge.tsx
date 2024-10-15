import { Cheque } from "@/types/cheque/chequeTypes";
import { InvoiceState } from "@/types/invoice/creditorInvoice";
import { useEffect } from "react";

const getDueStatus = (dueTime: number[], isSettled: boolean) => {
  if (isSettled) {
    return "SETTLED";
  }

  const dueDate = new Date(
    dueTime[0],
    dueTime[1] - 1,
    dueTime[2],
    dueTime[3],
    dueTime[4],
    dueTime[5],
  );

  const currentDate = new Date();

  const diff = dueDate.getTime() - currentDate.getTime();

  if (diff < 0) {
    return "OVERDUE";
  } else {
    return "DUE";
  }
};

function ChequeStatusBadge({ cheque }: { cheque: Cheque }) {
  const status = cheque.status;
  let background = "";
  let statusText = "";

  switch (status) {
    case "SETTLED":
      background = "#198754";
      statusText = "Settled";
      break;
    case "REDEEMED":
      background = "#198754";
      statusText = "Settled";
      break;
    case "PENDING":
      background = "#ffc107";
      statusText = "Due";
      break;
    case "REJECTED":
      background = "#dc3545";
      statusText = "Overdue";
      break;
  }

  return (
    <div className="flex w-fit h-fit justify-center items-center">
      <p
        className="p-badge"
        style={{
          background: background,
        }}
      >
        {statusText}
      </p>
    </div>
  );
}

export default ChequeStatusBadge;
