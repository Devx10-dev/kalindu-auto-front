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
        {/* 
                {
                    "creditorID": 512,
                    "shopName": "DN Car Sale",
                    "contactPersonName": "DN Car Sale",
                    "email": "dncarsale@gmail.com",
                    "primaryContact": "0779737738",
                    "secondaryContact": "0779737738",
                    "address": null,
                    "maxDuePeriod": 2,
                    "creditLimit": 100000.00,
                    "totalDue": 10000.00,
                    "status": null,
                    "dueStatus": "DUE",
                    "latestOverdueDays": 0,
                    "latestDueDays": 0,
                    "dueInvoiceCount": 1,
                    "overdueInvoiceCount": 0,
                    "dueAmount": 10000.00,
                    "overdueAmount": 0,
                    "creditInvoices": [
                        {
                            "id": 102,
                            "invoiceId": "INV-CRE-2408181829",
                            "creditorId": null,
                            "issuedTime": [
                                2024,
                                8,
                                18,
                                18,
                                29,
                                11,
                                42735000
                            ],
                            "dueTime": [
                                2024,
                                9,
                                1,
                                18,
                                29,
                                11,
                                42735000
                            ],
                            "totalPrice": 10000.00,
                            "settled": false,
                            "settledAmount": null,
                            "totalDiscount": 0.00,
                            "issuedBy": "b0a8ee5a-b0ec-49db-bef6-cd611b657ecf",
                            "dueStatus": "DUE",
                            "vat": null
                        }
                    ]
                }

                Above is sample creditor object
                i need to display creditor details here
                details i need is contactPersonName, primaryContact, secondaryContact, address, maxDuePeriod, creditLimit
                need it in 3 columns and 2 rows means 6 cells
                in each cell i need to display the label and the value
                label should be bold and value should be normal
                lable should be gray and smaller than value in font size
                value should be displayed in a new line
                address value should be turnacated to 1 line
            */}
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
        {/* 
                i need to display the credit invoices here
                i need to display the invoice id, issued time, due time, total price, settled amount, due status
                use the same table as in the below code snippet
                
                <Table className="border rounded-md text-md mb-5 table-responsive">
                <TableCaption>
                {!err && isLoading ? (
                    <Skeleton className="w-full h-10" />
                ) : (
                    <TablePagination
                    pageNo={pageNo + 1}
                    totalPages={invoices?.totalPages}
                    onPageChange={(page) => {
                        setPageNo(page - 1);
                    }}
                    />
                )}
                </TableCaption>
                <TableHeader>
                <TableRow>
                    <TableHead>Invoice No</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Contact Person</TableHead>
                    <TableHead>Invoice Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                </TableRow>
                </TableHeader>
                {isLoading ? (
                <TableBodySkeleton cols={7} rows={10} noHeader={true} />
                ) : invoices?.invoices.length === 0 ? (
                <TableBody>
                    <TableRow>
                    <TableCell colSpan={6}>
                        <div className="flex items-center justify-center">
                        <p className="text-red-500 text-lg font-semibold">
                            No Invoices Found
                        </p>
                        </div>
                    </TableCell>
                    </TableRow>
                </TableBody>
                ) : (
                <TableBody>
                    {invoices?.invoices &&
                    err === null &&
                    invoices.invoices.map((invoice) => (
                        <TableRow key={invoice.invoiceId}>
                        <TableCell>{invoice.invoiceId}</TableCell>
                        <TableCell className="w-40 turncate">
                            {invoice.creditor.shopName}
                        </TableCell>
                        <TableCell className="w-40 turncate">
                            {invoice.creditor.contactPersonName}
                        </TableCell>
                        <TableCell>{dateArrayToString(invoice.issuedTime)}</TableCell>
                        <TableCell>
                            {dateArrayToString(
                            calculateDueDate(
                                invoice.issuedTime,
                                Number(invoice.creditor.maxDuePeriod) as number,
                            ),
                            )}
                        </TableCell>
                        <TableCell>Rs. {invoice.totalPrice}</TableCell>
                        <TableCell className="text-center">
                            {generateStatusBadge(invoice)}
                        </TableCell>
                        <TableCell className="text-right">
                            <div className="flex justify-center">
                            <Link
                                to={`/dashboard/invoice/${type}/${invoice.invoiceId}`}
                            >
                                <Button variant="outline" className="mr-2">
                                <OpenInNewWindowIcon className="h-5 w-5" /> View
                                </Button>
                            </Link>
                            </div>
                        </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                )}
            </Table> */}
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
