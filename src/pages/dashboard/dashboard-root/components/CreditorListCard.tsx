import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Creditor } from "@/types/creditor/creditorTypes";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { TimerOff, TimerReset } from "lucide-react";
import { cloneElement, useEffect } from "react";

export default function CreditorListCard({
  creditorDetails,
}: {
  creditorDetails: Creditor;
}) {
  useEffect(() => {
    console.log("CreditorListCard", creditorDetails);
  }, [creditorDetails]);

  return (
    <div className="flex items-center gap-4 rounded-md hover:bg-gray-100 p-2 cursor-pointer">
      <div className="flex items-center justify-between align-items-between w-full">
        <div className="flex items-center gap-2">
          <Avatar className="hidden h-9 w-9 sm:flex">
            <AvatarImage
              // seperate by space and add + sign to join
              src={
                "https://avatar.iran.liara.run/username?username=" +
                creditorDetails.shopName.split(" ").join("+")
              }
              alt="Avatar"
            />
            {/* <AvatarFallback>
                {creditorDetails?.shopName
                  .split(" ")
                  .map((word) => word[0].toUpperCase())
                  .join("")}
              </AvatarFallback> */}
          </Avatar>
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">
              {creditorDetails?.shopName}
            </p>
            <p className="text-sm text-muted-foreground">
              {creditorDetails?.primaryContact}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <div className="ml-auto font-medium">
            Rs. {creditorDetails?.totalDue}
          </div>
          <div className="flex gap-1">
            {creditorDetails?.overdueInvoiceCount > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex gap-1 items-center">
                      <TimerOff className="w-4 h-4 text-red-500" />
                      <Badge className="w-fit" variant="secondary">
                        {creditorDetails?.overdueInvoiceCount}
                      </Badge>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Overdue Invoice Count</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {creditorDetails?.dueInvoiceCount > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex gap-1 items-center">
                      <TimerReset className="w-4 h-4 text-yellow-500" />
                      <Badge className="w-fit" variant="secondary">
                        {" "}
                        {creditorDetails?.dueInvoiceCount}
                      </Badge>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Due Invoice Count</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <Badge className="w-fit" variant="destructive">
              {" "}
              {creditorDetails?.dueStatus === "OVERDUE"
                ? creditorDetails?.latestOverdueDays
                : creditorDetails?.latestDueDays}{" "}
              days
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
