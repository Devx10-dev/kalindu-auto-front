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
  }, [props.isLoading]);

  return (
    <>
      <div className="flex flex-col justify-end mt-10">
        <Table className="border rounded-md text-md mb-5">
          <TableHeader>
            <TableRow>
              <TableHead>Shop Name</TableHead>
              <TableHead>Contact Name</TableHead>
              <TableHead>Contact No</TableHead>
              <TableHead>Due Balance</TableHead>
              <TableHead>Cheque Balance</TableHead>
              <TableHead>Credit Limit (LKR)</TableHead>
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
                  className={`${creditor.dueStatus === "OVERDUE" ? "bg-orange-100" : null}`}
                >
                  <TableCell className="font-medium">
                    {creditor.shopName}
                  </TableCell>
                  <TableCell className="font-medium">
                    {creditor?.contactPersonName}
                  </TableCell>
                  <TableCell>{creditor.primaryContact}</TableCell>
                  <TableCell align="right">
                    {creditor.totalDue ? creditor.totalDue : 0}
                  </TableCell>
                  <TableCell align="right">
                    {creditor.totalDue ? creditor.chequeBalance : 0}
                  </TableCell>
                  <TableCell align="right">
                    {creditor.creditLimit ? creditor.creditLimit : "-"}
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
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant={"outline"} className="w-fit p-2">
                                <UserRoundCog className="h-5 w-5" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[1000px]">
                              <DialogHeader>
                                <DialogTitle>Edit Creditor</DialogTitle>
                                <DialogDescription>
                                  Edit the necessary creditor details and hit
                                  save
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <RegisterForm
                                  isEditMode={true}
                                  creditor={creditor}
                                />
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit Creditor</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </div>
    </>
  );
};

export default CreditorsTable;
