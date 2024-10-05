import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Creditor } from "@/types/creditor/creditorTypes";
import { currencyAmountString } from "@/utils/analyticsUtils";
import dateArrayToString from "@/utils/dateArrayToString";
import { OpenInNewWindowIcon } from "@radix-ui/react-icons";
import {
  ChevronRightCircle,
  ChevronRightIcon,
  ExternalLinkIcon,
  Info,
  TimerOff,
  TimerReset,
} from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CreditorPopup({
  creditor,
  popupButtonRef,
}: {
  creditor: Creditor | null;
  popupButtonRef: React.RefObject<HTMLButtonElement>;
}) {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("CreditorPopup.tsx: creditor: ", creditor);
    console.log(
      "CreditorPopup.tsx: popupButtonRef: ",
      typeof creditor?.creditLimit,
    );
  }, [creditor]);

  return (
    <Dialog>
      <DialogTrigger asChild className="hidden">
        <Button
          ref={popupButtonRef}
          className="hidden"
          variant="outline"
          hidden={true}
        >
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-w-[95vw] max-h-[90vh] overflow-y-auto py-0">
        <DialogHeader className="bg-white sticky top-0 z-100 py-5">
          <DialogTitle className="flex flex-row items-between justify-between">
            <div className="flex flex-row items-center justify-center gap-3">
              <Avatar className="hidden h-8 w-8 sm:flex">
                <AvatarImage
                  // seperate by space and add + sign to join
                  src={
                    "https://avatar.iran.liara.run/username?username=" +
                    creditor?.shopName.split(" ").join("+")
                    // creditor.shopName.split(" ").join("+")
                  }
                  alt="Avatar"
                />
              </Avatar>
              <h2 className="text-lg font-semibold">{creditor?.shopName}</h2>
            </div>
            <div className="flex gap-1">
              {creditor?.overdueInvoiceCount > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex gap-1 items-center">
                        <TimerOff className="w-4 h-4 text-red-500" />
                        <Badge className="w-fit" variant="secondary">
                          {creditor?.overdueInvoiceCount}
                        </Badge>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Overdue Invoice Count</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {creditor?.dueInvoiceCount > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex gap-1 items-center">
                        <TimerReset className="w-4 h-4 text-yellow-500" />
                        <Badge className="w-fit" variant="secondary">
                          {" "}
                          {creditor?.dueInvoiceCount}
                        </Badge>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Due Invoice Count</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              <Badge
                className="w-fit"
                variant={
                  creditor?.dueStatus === "OVERDUE"
                    ? "destructive"
                    : "secondary"
                }
              >
                {creditor?.dueStatus}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="p-4 border border-muted-gray bg-muted-background rounded-md">
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Contact Person</p>
              <p>{creditor?.contactPersonName}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Primary Contact</p>
              <p>{creditor?.primaryContact}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Secondary Contact</p>
              <p>{creditor?.secondaryContact}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Total Due</p>
              {creditor?.dueAmount ? (
                <Badge variant="secondary" className="w-fit">
                  {currencyAmountString(creditor?.dueAmount)}
                </Badge>
              ) : (
                <Badge variant="outline" className="w-fit">
                  No Due
                </Badge>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Total Overdue</p>
              {creditor?.overdueAmount ? (
                <Badge variant="destructive" className="w-fit">
                  {currencyAmountString(creditor?.overdueAmount)}
                </Badge>
              ) : (
                <Badge variant="outline" className="w-fit">
                  No Overdue
                </Badge>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Credit Limit</p>
              {/* <p>{currencyAmountString(creditor?.creditLimit)}</p> */}
              {creditor?.creditLimit ? (
                <p>{currencyAmountString(creditor?.creditLimit)}</p>
              ) : (
                <Badge variant="outline" className="w-fit">
                  No Limit
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="relative overflow-y-auto max-w-full max-h-[300px]">
          <Table className="border rounded-md text-md mb-5 overflow-y-auto max-w-full ">
            <TableHeader className="sticky top-0 z-10 bg-white">
              <TableRow>
                <TableHead>Invoice No</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Settled</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="overflow-y-auto h-fit w-full">
              {creditor?.creditInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.invoiceId}</TableCell>
                  <TableCell>
                    {dateArrayToString(invoice.dueTime, true)}
                  </TableCell>
                  <TableCell>
                    {currencyAmountString(invoice.totalPrice)}
                  </TableCell>
                  <TableCell>
                    {invoice.settledAmount
                      ? currencyAmountString(invoice.settledAmount)
                      : currencyAmountString(0)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        invoice.dueStatus === "DUE"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {invoice.dueStatus}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <DialogFooter className="sticky bottom-0 z-1000 bg-white py-5">
          <Button
            variant="outline"
            onClick={() => popupButtonRef.current?.click()}
          >
            Close
          </Button>
          <Button
            variant="secondary"
            className="items-center gap-1 align-middle"
            onClick={() =>
              navigate(`/dashboard/creditors/manage/${creditor?.creditorID}`)
            }
          >
            More Info <ExternalLinkIcon className="w-4 h-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
