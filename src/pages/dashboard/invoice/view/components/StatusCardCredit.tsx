import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { InvoiceState } from "@/types/invoice/creditorInvoice";
import { CheckCircle2, TimerOff, TimerReset } from "lucide-react";
import { useEffect, useState } from "react";

function StatusCardCredit({
  invoiceDetails,
}: {
  invoiceDetails: InvoiceState | null;
}) {
  const [status, setStatus] = useState("COMPLETED");
  const [statusTag, setStatusTag] = useState("green");
  const [statusIcon, setStatusIcon] = useState(
    <CheckCircle2 size={20} color="green" />,
  );
  const [overdueDays, setOverdueDays] = useState(0);
  const [dueDays, setDueDays] = useState(0);
  const [className, setClassName] = useState("bg-green-100");
  const [progress, setProgress] = useState(0);
  const [iconWrapperClassName, setIconWrapperClassName] = useState("");
  const [indicatorClassName, setIndicatorClassName] = useState("bg-yellow-500");
  const [statusText, setStatusText] = useState("This invoice is completed");

  useEffect(() => {
    if (invoiceDetails) {
      console.log(invoiceDetails.dueStatus);
      const { progress: calculatedProgress, remainingDays } = calculateProgress(
        invoiceDetails.dueTime,
        invoiceDetails.issuedTime,
        invoiceDetails.creditor.maxDuePeriod,
      );

      if (invoiceDetails.dueStatus === "COMPLETED") {
        setProgress(100);
        setIndicatorClassName("bg-green-500");
        setStatusText("This invoice is completed");
      } else if (calculatedProgress < 100) {
        setProgress(calculatedProgress);
        setIndicatorClassName("bg-yellow-500");
        setStatusText(remainingDays + " days remaining");
      } else if (calculatedProgress === 100) {
        setProgress(100);
        setIndicatorClassName("bg-red-500");
        setStatusText("Overdue by today");
      } else {
        setProgress(100);
        setIndicatorClassName("bg-red-500");
        setStatusText("Overdue by " + remainingDays + " days");
      }

      if (invoiceDetails.dueStatus === "COMPLETED") {
        setStatus("COMPLETED");
        setStatusTag("green");
        setStatusIcon(<CheckCircle2 size={20} color="green" />);
        setClassName("bg-green-100");
      } else if (invoiceDetails.dueStatus === "DUE") {
        setStatus("DUE");
        setStatusTag("yellow");
        setStatusIcon(<TimerReset size={20} color="darkorange" />);
        setClassName("bg-yellow-100");
      } else {
        setStatus("OVERDUE");
        setStatusTag("red");
        setStatusIcon(<TimerReset size={20} color="red" />);
        setClassName("bg-red-50");
      }
    }
  }, [invoiceDetails]);

  const calculateOverdueDays = (dueTime: number[]) => {
    const dueDate = new Date(dueTime[0], dueTime[1], dueTime[2]);
    const currentDate = new Date();
    const diffTime = Math.abs(dueDate.getTime() - currentDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateDueDays = (dueTime: number[]) => {
    const dueDate = new Date(dueTime[0], dueTime[1], dueTime[2]);
    const currentDate = new Date();
    const diffTime = Math.abs(dueDate.getTime() - currentDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateProgress = (
    dueTime: number[],
    issuedTime: number[],
    maxDueWeeks: number,
  ) => {
    const dueDate = new Date(
      dueTime[0],
      dueTime[1] - 1,
      dueTime[2],
      dueTime[3],
      dueTime[4],
      dueTime[5],
    );
    const issuedDate = new Date(
      issuedTime[0],
      issuedTime[1] - 1,
      issuedTime[2],
      issuedTime[3],
      issuedTime[4],
      issuedTime[5],
    );
    console.log(dueDate, issuedDate);
    const currentDate = new Date();
    const diffTime = Math.abs(dueDate.getTime() - issuedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // due period in days
    const diffTime2 = Math.abs(issuedDate.getTime() - currentDate.getTime());
    const diffDays2 = Math.ceil(diffTime2 / (1000 * 60 * 60 * 24)); // days passed since issued
    const diffTime3 = Math.abs(dueDate.getTime() - currentDate.getTime());
    const diffDays3 = Math.ceil(diffTime3 / (1000 * 60 * 60 * 24)); // days remaining
    console.log(diffDays, diffDays2);
    const progress = (diffDays2 / diffDays) * 100;
    return {
      progress,
      remainingDays: diffDays3,
    };
  };

  useEffect(() => {
    if (invoiceDetails) {
      const { progress, remainingDays } = calculateProgress(
        invoiceDetails.dueTime,
        invoiceDetails.issuedTime,
        invoiceDetails.creditor.maxDuePeriod,
      );
      console.log(progress, remainingDays);
    }
  }, [invoiceDetails]);

  return (
    <Card className={cn("px-4 py-3 shadow-sm", className)}>
      <div className="flex items-center">
        <div className="w-full">
          <div className="flex gap-2">
            <div
              className={cn(
                "flex items-center justify-center rounded-full bg-green",
                iconWrapperClassName,
              )}
            >
              {statusIcon}
            </div>
            <div className="flex gap-2 items-center w-full">
              <h3 className="text-lg font-semibold leading-none tracking-tight">
                {status}
              </h3>
              <Badge color="green" className="text" variant="outline">
                2021NOV01
              </Badge>
            </div>
          </div>
          {/* <p className="text-sm font-regular text-gray-500">{statusText}</p> */}
          <div className="flex-col items-center mt-2">
            <Progress
              value={progress}
              className="h-2 color-green"
              indicatorClassName={indicatorClassName}
            />
            <p className="text-xs font-regular text-gray-500 mt-1 text">
              {statusText}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default StatusCardCredit;
