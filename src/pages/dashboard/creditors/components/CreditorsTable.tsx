import AmountCard from "@/components/card/AmountCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Creditor } from "@/types/creditor/creditorTypes";
import {
  ArrowLeftRight,
  BadgeInfo,
  CircleHelp,
  Info,
  Pencil,
  TimerOff,
  TimerReset,
  UserRoundCog,
} from "lucide-react";
import { Link } from "react-router-dom";
import { RegisterForm } from "./CreditorForm";
import { ViewExpiredInvoices } from "./ViewExpiredInvoices";
import { TableSkeleton } from "./TableSkelton";
import { useEffect, useState } from "react";
import { set } from "date-fns";
import { TableBodySkeleton } from "../../invoice/view-invoices/components/TableSkeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { currencyAmountString } from "@/utils/analyticsUtils";
import { DialogClose } from "@radix-ui/react-dialog";
import CancelIcon from "@/components/icon/CancelIcon";

function priceRender(contentType: string, content: string) {
  // split from firdst dot from the right
  switch (contentType) {
    case "currencyAmount": {
      // this comes as strig "Rs. 180,666.00" i want to render the decimal part in a smaller font size
      const [currency, amount] = content.split(/(?<=\..*)\./);
      return (
        <div className="text-md font-bold">
          {/* remove Rs. from begininh */}
          <span>{currency.slice(4)}</span>
          <span className="text-xs font-bold color-muted-foreground">
            .{amount}
          </span>
        </div>
      );
    }
    default:
      return <div className="text-2xl font-bold">{content}</div>;
  }
}

const CreditorsTable = (props: {
  creditorData?: Creditor[];
  isLoading?: boolean;
}) => {
  const [isContentLoading, setIsContentLoading] = useState<boolean>(false);

  useEffect(() => {
    if (props.isLoading == undefined) {
      setIsContentLoading(true);
    } else {
      setIsContentLoading(props.isLoading);
    }
    console.log("isLoading", props.creditorData);
    // console.log((props.creditorData[0]?.totalDue))
  }, [props.isLoading]);

  return (
    <>
      <div className="flex flex-col justify-end mt-10">
        <div className="overflow-x-auto ">
          <Table className="border rounded-md text-md mb-5">
            <TableHeader>
              <TableRow>
                <TableHead>Shop Name</TableHead>
                <TableHead>Contact Name</TableHead>
                <TableHead>Contact No</TableHead>
                <TableHead className="text-right">Due Balance(Rs)</TableHead>
                <TableHead className="text-right">Cheque Balance(Rs)</TableHead>
                <TableHead className="text-right">Credit Limit(Rs)</TableHead>
                <TableHead>Due/Overdue</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            {isContentLoading ? (
              <TableBodySkeleton cols={8} rows={10} noHeader={true} />
            ) : (
              <TableBody>
                {props.creditorData?.map((creditor) => (
                  <TableRow
                    key={creditor.creditorID}
                    className={`${creditor.dueStatus === "OVERDUE" ? "bg-orange-50" : null}`}
                  >
                    <TableCell className="font-medium">
                      {creditor.shopName}
                    </TableCell>
                    <TableCell className="font-medium">
                      {creditor?.contactPersonName}
                    </TableCell>
                    <TableCell>{creditor.primaryContact}</TableCell>
                    <TableCell align="right">
                      {creditor.totalDue ? (
                        priceRender(
                          "currencyAmount",
                          currencyAmountString(creditor.totalDue)
                        )
                      ) : (
                        <div className="flex gap-1 items-right justify-end">
                          <Badge className="w-fit" variant="secondary">
                            No Due
                          </Badge>
                        </div>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {/* {creditor.totalDue ? creditor.chequeBalance : 0} */}
                      {creditor.chequeBalance ? (
                        priceRender(
                          "currencyAmount",
                          currencyAmountString(creditor.chequeBalance)
                        )
                      ) : (
                        <div className="flex gap-1 items-right justify-end">
                          <Badge className="w-fit" variant="secondary">
                            No Cheques
                          </Badge>
                        </div>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {/* {creditor.creditLimit ? creditor.creditLimit : "-"} */}
                      {creditor.creditLimit ? (
                        priceRender(
                          "currencyAmount",
                          currencyAmountString(creditor.creditLimit)
                        )
                      ) : (
                        <div className="flex gap-1 items-right justify-end">
                          <Badge className="w-fit" variant="destructive">
                            Not Set
                          </Badge>
                        </div>
                      )}
                    </TableCell>

                    <TableCell align="center">
                      {/* {creditor.isExpired ? "Yes" : "No"} */}
                      <div className="flex gap-1 justify-center">
                        {creditor?.dueInvoiceCount >= 0 && (
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
                        {creditor?.overdueInvoiceCount >= 0 && (
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
                      </div>
                    </TableCell>
                    <TableCell className="text-center flex justify-between gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link
                              to={`/dashboard/creditors/manage/${creditor.creditorID}`}
                            >
                              <Button className="p-2" variant="outline">
                                <Info className="h-5 w-5" />
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View Creditor Details</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {/* {creditor.isExpired && (
                    <ViewExpiredInvoices
                      invoiceList={creditor.expiredInvoiceList}
                    />
                  )} */}
                      <Dialog>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <DialogTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className="w-fit p-2"
                                >
                                  <UserRoundCog className="h-5 w-5" />
                                </Button>
                              </DialogTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit Creditor</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <DialogContent className="sm:max-w-[425px] md:max-w-[1000px] w-[90vw] max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Edit Creditor</DialogTitle>
                            <DialogDescription>
                              Edit the necessary creditor details and hit save
                            </DialogDescription>
                            {/* <DialogClose asChild>
                              <Button
                                type="button"
                                variant="outline"
                                className="absolute top-0 right-0 mt-2 mr-2"
                              >
                                <CancelIcon width="10px" height="2px" />
                              </Button>
                            </DialogClose> */}
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <RegisterForm
                              isEditMode={true}
                              creditor={creditor}
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </div>
      </div>
    </>
  );
};

export default CreditorsTable;
