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
import { CreditCard, SquareGanttChart, User } from "lucide-react";
import { Key, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CreditorAPI from "./api/CreditorAPI";
import { AddNewTransaction } from "./components/AddNewTransaction";
import CreditorInvoiceTable from "./components/CreditorInvoiceTable";
import { currencyAmountString } from "@/utils/analyticsUtils";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import dateArrayToString from "@/utils/dateArrayToString";
import { Header } from "@radix-ui/react-accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ViewCreditor = () => {
  const axiosPrivate = useAxiosPrivate();
  const creditorAPI = new CreditorAPI(axiosPrivate);
  const queryClient = useQueryClient();
  const [pageNo, setPageNo] = useState(0);
  const { id } = useParams();

  const transactionResponse = useQuery({
    queryKey: ["creditorTransactions"],
    queryFn: () => creditorAPI.getCreditorTransactions(id),
  });

  const creditorDetails = useQuery({
    queryKey: ["creditor", id],
    queryFn: () => creditorAPI.fetchSingleCreditor(id),
  });

  const creditorInvoice = useQuery({
    queryKey: ["creditorInvoice", id],
    queryFn: () => creditorAPI.fetchCreditorInvoiceIDs(id),
  });

  const onPageChange = (pageNo: number) => {
    setPageNo(pageNo);
    queryClient.invalidateQueries({ queryKey: ["creditorTransactions"] });
  };

  const hasData = transactionResponse.data?.creditorTransactions.length != 0;

  useEffect(() => {
    if (creditorDetails.data) {
      console.log("creditorDetails.data", creditorDetails.data);
    }
  }, [creditorDetails.data]);

  if (creditorDetails.isLoading || transactionResponse.isLoading) {
    return <Loading />;
  } else
    return (
      <div className="w-full h-full p-10">
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

        <div className="grid gap-10 grid-cols-4 h-full mt-10">
          <div className="relative overflow-y-auto w-full col-span-3">
            <Tabs defaultValue="overdue" className="w-[100%]">
              <TabsList className="grid w-[40%] grid-cols-2">
                {/* <TabsTrigger value="all">All</TabsTrigger> */}
                <TabsTrigger value="overdue">Overdue</TabsTrigger>
                <TabsTrigger value="due">Due</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              <TabsContent value="overdue">
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
                    { !creditorDetails.data ? (<div classname="flex justify-center items-center"><p>No Invoices for the creditor</p></div>) : 
                      creditorDetails.data?.creditInvoices.map((invoice) => (
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
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    );
};

export default ViewCreditor;
