import Loading from "@/components/Loading";
import PageHeader from "@/components/card/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import { Label } from "@radix-ui/react-label";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowUpDown,
  CreditCard,
  LibraryBig,
  SquareGanttChart,
  User,
} from "lucide-react";
import { Key, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CreditorAPI from "./api/CreditorAPI";
import { AddNewTransaction } from "./components/AddNewTransaction";
import CreditorInvoiceTable from "./components/CreditorInvoiceTable";
import { currencyAmountString } from "@/utils/analyticsUtils";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import dateArrayToString from "@/utils/dateArrayToString";
import { Header } from "@radix-ui/react-accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { OpenInNewWindowIcon } from "@radix-ui/react-icons";
import InvoiceStatusBadge from "../invoice/view-invoices/components/InvoiceStatusBadge";
import { InvoiceState } from "@/types/invoice/creditorInvoice";
import NoInvoices from "./components/NoInvoices";
import { ChequeService } from "@/service/cheque/ChequeService";
import ChequesGridCreditorView from "../cheque/components/grid/ChequesGridCreditorView";
import TransactionTimeLine from "./components/TransactionTimeline";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TransactionService from "@/service/creditor/TransactionService";

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

const ViewCreditor = () => {
  const axiosPrivate = useAxiosPrivate();
  const creditorAPI = new CreditorAPI(axiosPrivate);
  const queryClient = useQueryClient();
  const transactionService = new TransactionService(axiosPrivate);
  const [pageNo, setPageNo] = useState(0);
  const { id } = useParams();

  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [chequeSearch, setChequeSearch] = useState("");
  const [statusList, setStatusList] = useState<
    { label: string; value: string }[]
  >([
    { label: "Settled", value: "COMPLETED" },
    { label: "Due", value: "DUE" },
    { label: "Overdue", value: "OVERDUE" },
  ]);
  const [selectedOption, setSelectedOption] = useState<string[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<InvoiceState[]>([]);
  const [chequeStatusList, setChequeStatusList] = useState<
    { label: string; value: string }[]
  >([
    { label: "Settled", value: "COMPLETED" },
    { label: "Due", value: "DUE" },
    { label: "Overdue", value: "OVERDUE" },
  ]);
  const chequeService = new ChequeService(axiosPrivate);

  useEffect(() => {
    console.log("selectedOption", selectedOption);
  }, [selectedOption]);

  const filterInvoices = (invoices: any) => {
    return invoices.filter((invoice: any) => {
      return (
        invoice.invoiceId.toLowerCase().includes(invoiceSearch.toLowerCase()) &&
        (selectedOption.length === 0 ||
          selectedOption.includes(invoice.dueStatus))
      );
    });
  };

  const transactionResponse = useQuery({
    queryKey: ["creditorTransactions"],
    queryFn: () => creditorAPI.getCreditorTransactions(id),
  });

  const creditorDetails = useQuery({
    queryKey: ["creditor", id],
    queryFn: () => creditorAPI.fetchSingleCreditor(id),
  });

  useEffect(() => {
    if (creditorDetails.data) {
      setFilteredInvoices(filterInvoices(creditorDetails.data.creditInvoices));
    }
    console.log("filteredInvoices", filteredInvoices);
  }, [invoiceSearch, selectedOption, creditorDetails.data]);

  if (creditorDetails.isLoading || transactionResponse.isLoading) {
    return <Loading />;
  } else
    return (
      <div className="pt-5 px-0 pl-5">
        <PageHeader
          title={`Creditor Information`}
          description=""
          icon={<CreditCard height="30" width="28" color="#162a3b" />}
        />
        {/* <AddNewTransaction /> */}

        <div className="mt-5">
          <div className="p-4 border border-muted-gray bg-muted-background rounded-md">
            <div className="grid grid-cols-4 gap-2">
              <div className="col-span-4 row-span-1">
                <div className="flex flex-row items-center justify-flex-start gap-3">
                  <Avatar className="hidden h-8 w-8 sm:flex">
                    <AvatarImage
                      // seperate by space and add + sign to join
                      src={
                        "https://avatar.iran.liara.run/username?username=" +
                        creditorDetails.data?.shopName.split(" ").join("+")
                        // creditor.shopName.split(" ").join("+")
                      }
                      alt="Avatar"
                    />
                  </Avatar>
                  <h2 className="text-lg font-semibold">
                    {creditorDetails.data?.shopName}
                  </h2>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground">Contact Person</p>
                <p>{creditorDetails.data?.contactPersonName}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground">Primary Contact</p>
                <p>{creditorDetails.data?.primaryContact}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground">
                  Secondary Contact
                </p>
                <p>{creditorDetails.data?.secondaryContact}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground">Address</p>
                <p>{creditorDetails.data?.address}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground">Total Due</p>
                {creditorDetails.data?.dueAmount ? (
                  <Badge variant="secondary" className="w-fit">
                    {currencyAmountString(creditorDetails.data?.dueAmount)}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="w-fit">
                    No Due
                  </Badge>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground">Total Overdue</p>
                {creditorDetails.data?.overdueAmount ? (
                  <Badge variant="destructive" className="w-fit">
                    {currencyAmountString(creditorDetails.data?.overdueAmount)}
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
                {creditorDetails.data?.creditLimit ? (
                  <p>
                    {currencyAmountString(creditorDetails.data?.creditLimit)}
                  </p>
                ) : (
                  <Badge variant="outline" className="w-fit">
                    No Limit
                  </Badge>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground">
                  Allowed Due Period
                </p>
                <Badge variant="default" className="w-fit">
                  {creditorDetails.data?.maxDuePeriod} weeks
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-8 grid-cols-6 h-full mt-10 justify-between">
          <div className="relative w-[70%] col-span-4">
            <Tabs defaultValue="invoices" className="w-[100%]">
              <div className="flex justify-between items-center mb-3">
                <TabsList className="grid w-[40%] grid-cols-2">
                  {/* <TabsTrigger value="all">All</TabsTrigger> */}
                  <TabsTrigger value="invoices">Invoices</TabsTrigger>
                  <TabsTrigger value="cheques">Cheques</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="invoices" className="mt-0">
                <div className="flex justify-between items-center gap-2 mb-3">
                  <Input
                    type="text"
                    placeholder="Search for Invoices"
                    onChange={(e) => {
                      setInvoiceSearch(e.target.value);
                    }}
                  />
                  <MultiSelect
                    options={statusList}
                    onValueChange={setSelectedOption}
                    defaultValue={selectedOption}
                    placeholder="Select Status"
                    variant="secondary"
                    animation={0}
                    maxCount={1}
                    modalPopover={true}
                    badgeInlineClose={false}
                    className="w-full"
                  />
                </div>
                <Table className="border rounded-md text-sm mb-5 overflow-y-auto ">
                  <TableHeader className="sticky top-0 z-10 bg-white">
                    <TableRow>
                      <TableHead>Invoice No</TableHead>
                      <TableHead>Issued Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead className="text-right">Total Amount</TableHead>
                      <TableHead className="text-right">Settled</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="overflow-y-auto h-fit w-full">
                    {!creditorDetails.data ? (
                      <div className="flex justify-center items-center">
                        <p>No Invoices for the creditor</p>
                      </div>
                    ) : filteredInvoices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          <div className="flex justify-center items-center gap-2 my-4">
                            <NoInvoices />
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      // add filter by search and status
                      filteredInvoices.map((invoice) => (
                        <TableRow key={invoice.invoiceId}>
                          <TableCell>{invoice.invoiceId}</TableCell>
                          <TableCell>
                            {dateArrayToString(invoice.issuedTime, true)}
                          </TableCell>
                          <TableCell>
                            {dateArrayToString(invoice.dueTime, true)}
                          </TableCell>
                          <TableCell align="right">
                            {priceRender(
                              "currencyAmount",
                              currencyAmountString(invoice.totalPrice),
                            )}
                          </TableCell>
                          <TableCell align="right">
                            {invoice.settledAmount
                              ? priceRender(
                                  "currencyAmount",
                                  currencyAmountString(invoice.settledAmount),
                                )
                              : priceRender("currencyAmount", "Rs. 0.00")}
                          </TableCell>
                          <TableCell className="text-center items-center justify-center h-full">
                            {invoice ? (
                              <InvoiceStatusBadge invoice={invoice} />
                            ) : (
                              <Badge variant="outline">No Status</Badge>
                            )}
                          </TableCell>
                          <TableCell align="center">
                            <div className="flex justify-center">
                              <Link
                                to={`/dashboard/invoice/creditor/${invoice.invoiceId}`}
                              >
                                <Button variant="outline" className="mr-2">
                                  <OpenInNewWindowIcon className="h-5 w-5" />
                                </Button>
                              </Link>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="cheques" className="mt-0">
                <ChequesGridCreditorView
                  chequeService={chequeService}
                  creditorId={Number(id)}
                />
              </TabsContent>
            </Tabs>
          </div>
          <div className="col-span-2 w-[30%]">
            <Card className="h-full">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Recent Transactions</h2>
                  <Button variant="outline" className="text-sm" size="sm">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <div className="pt-0 px-3">
                <Separator className="w-[100%] items-center" />
              </div>
              <CardContent>
                <div className="p-5 pt-0 mt-5 h-full">
                  <TransactionTimeLine
                    creditorId={id}
                    transactionService={transactionService}
                    invoiceDetails={filterInvoices[0]}
                    invoiceLoading={creditorDetails.isLoading}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
};

export default ViewCreditor;
