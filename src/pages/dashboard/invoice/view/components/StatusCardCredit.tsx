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

  useEffect(() => {
    if (invoiceDetails) {
      console.log(invoiceDetails.dueStatus);
      if (invoiceDetails.dueStatus === "COMPLETED") {
        setStatus("COMPLETED");
        setStatusTag("green");
        setStatusIcon(<CheckCircle2 size={20} color="green" />);
        setClassName("bg-green-100");
        setStatusIcon(<CheckCircle2 size={20} color="green" />);
      } else if (invoiceDetails.dueStatus === "DUE") {
        setStatus("DUE");
        setStatusTag("yellow");
        setStatusIcon(<TimerReset size={20} color="yellow" />);
        setClassName("bg-yellow-100");
        setStatusIcon(<TimerReset size={20} color="yellow" />);
      } else {
        setStatus("OVERDUE");
        setStatusTag("red");
        setStatusIcon(<TimerReset size={20} color="red" />);
        setClassName("bg-red-50");
        setStatusIcon(<TimerOff size={20} color="red" />);
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
    const dueDate = new Date(dueTime[0], dueTime[1], dueTime[2]);
    const issuedDate = new Date(issuedTime[0], issuedTime[1], issuedTime[2]);
    const currentDate = new Date();
    const diffTime = Math.abs(dueDate.getTime() - issuedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffTime2 = Math.abs(dueDate.getTime() - currentDate.getTime());
    const diffDays2 = Math.ceil(diffTime2 / (1000 * 60 * 60 * 24));
    const progress = (diffDays2 / (maxDueWeeks * 7)) * 100;
    return progress;
  };

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
              value={60}
              className="h-2 color-green"
              indicatorClassName="bg-yellow-500"
            />
            <p className="text-xs font-regular text-gray-500 mt-1 text">
              5 days remaining
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default StatusCardCredit;
