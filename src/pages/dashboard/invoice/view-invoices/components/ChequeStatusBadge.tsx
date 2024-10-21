import { Badge } from "@/components/ui/badge";
import { Cheque } from "@/types/cheque/chequeTypes";
import { InvoiceState } from "@/types/invoice/creditorInvoice";
import { useEffect } from "react";

function ChequeStatusBadge({
  cheque,
  redeemStatus = false,
}: {
  cheque: Cheque;
  redeemStatus?: boolean;
}) {
  const status = cheque.status;
  let background = "";
  let statusText = "";

  switch (status) {
    case "SETTLED":
      background = "green";
      statusText = "Settled";
      break;
    case "REDEEMED":
      background = redeemStatus ? "blue" : "green";
      statusText = redeemStatus ? "Redeemed" : "Settled";
      break;
    case "PENDING":
      background = "yellow";
      statusText = "Pending";
      break;
    case "REJECTED":
      background = "red";
      statusText = "Overdue";
      break;
  }

  return (
    <div className="flex w-fit h-fit justify-center items-center">
      <Badge
        className={`text-xs bg-${background}-500 dark:bg-${background}-900 text-white dark:text-${background}-300 rounded-sm`}
      >
        {statusText}
      </Badge>
    </div>
  );
}

export default ChequeStatusBadge;
