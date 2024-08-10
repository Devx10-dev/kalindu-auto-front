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
import { CreditCard, SquareGanttChart } from "lucide-react";
import { Key, useState } from "react";
import { useParams } from "react-router-dom";
import CreditorAPI from "./api/CreditorAPI";
import { AddNewTransaction } from "./components/AddNewTransaction";
import CreditorInvoiceTable from "./components/CreditorInvoiceTable";

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

  if (creditorDetails.isLoading || transactionResponse.isLoading) {
    return <Loading />;
  } else
    return (
      <div className="w-full h-full p-10">
        <PageHeader
          title={`View Creditor Data - ${creditorDetails.data.shopName || "-"}`}
          description="View full creditor data and the transactions. You can add new transactions here."
          icon={<CreditCard height="30" width="28" color="#162a3b" />}
        />
        <AddNewTransaction />
        <div className="grid gap-10 grid-cols-4 h-full">
          <Card className="shadow-md bg-slate-50 h-full col-span-3 flex flex-col">
            <div className="flex-1 max-h-80">
              <CardHeader>
                <h3 className="text-lg font-bold">Transaction History</h3>
              </CardHeader>
              <CardContent className="overflow-auto h-4/5">
                <Table className="border bg-white">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Total Price</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Invoice No</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hasData &&
                      transactionResponse.data.creditorTransactions.map(
                        (transaction: any, index: Key | null | undefined) => (
                          <TableRow key={index}>
                            <TableCell> Rs. {transaction.totalPrice}</TableCell>
                            <TableCell>{transaction.transactionType}</TableCell>
                            <TableCell>{transaction.invoiceNo}</TableCell>
                            <TableCell>
                              {transaction.type === "Invoice" ? (
                                <Button variant={"outline"} className="w-48">
                                  View Invoice
                                </Button>
                              ) : null}
                              {transaction.type === "Transaction" ? (
                                <Button variant={"outline"} className="w-48">
                                  View Transaction Details
                                </Button>
                              ) : null}
                            </TableCell>
                          </TableRow>
                        ),
                      )}
                    {!hasData && (
                      <TableRow className="flex p-5">
                        <Label className="font-bold">
                          Empty Transaction history
                        </Label>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </div>
            <CardHeader>
              <h3 className="text-lg font-bold mt-5">Overdue Invoices</h3>
            </CardHeader>
            <div className="flex-1 overflow-auto">
              <CardContent className="overflow-auto mt-100">
                <CreditorInvoiceTable
                  invoices={creditorInvoice.data}
                  isLoading={creditorInvoice.isLoading}
                  err={creditorInvoice.error}
                />
              </CardContent>
            </div>
          </Card>
          <div className="h-full flex flex-col gap-5">
            <Card className="shadow-md bg-white h-full">
              <CardHeader className="border mb-10 flex flex-row gap-2 items-center">
                <SquareGanttChart className="h-4" />
                <h3 className="text-lg font-bold">Selected Creditor</h3>
              </CardHeader>
              <CardContent className="flex flex-col gap-1 overflow-auto">
                <Label className="text-sm">Creditor/Shop Name : </Label>
                <Badge
                  className="rounded-md p-2 text-sm mb-5"
                  variant={"secondary"}
                >
                  {creditorDetails.data.shopName || "-"}
                </Badge>
                <Label>Total Due : </Label>
                <Badge
                  className="rounded-md p-2 text-sm mb-5"
                  variant={"secondary"}
                >
                  {creditorDetails.data.totalDue || "-"}
                </Badge>
                <Label>Primary Contact : </Label>
                <Badge
                  className="rounded-md p-2 text-sm mb-5"
                  variant={"secondary"}
                >
                  {creditorDetails.data.primaryContact || "-"}
                </Badge>
                <Label>Secondary Contact : </Label>
                <Badge
                  className="rounded-md p-2 text-sm mb-5"
                  variant={"secondary"}
                >
                  {creditorDetails.data.secondaryContact || "-"}
                </Badge>
                <Label>Contact Person Name : </Label>
                <Badge
                  className="rounded-md p-2 text-sm mb-5"
                  variant={"secondary"}
                >
                  {creditorDetails.data.contactPersonName || "-"}
                </Badge>
                <Label>Email: </Label>
                <Badge
                  className="rounded-md p-2 text-sm mb-5"
                  variant={"secondary"}
                >
                  {creditorDetails.data.email || "-"}
                </Badge>
                <Label>Address : </Label>
                <Badge
                  className="rounded-md p-2 text-sm mb-5"
                  variant={"secondary"}
                >
                  {creditorDetails.data.address || "-"}
                </Badge>
                <Label>Due Period : </Label>
                <Badge
                  className="rounded-md p-2 text-sm mb-5"
                  variant={"secondary"}
                >
                  {creditorDetails.data.maxDuePeriod + " Weeks" || "-"}
                </Badge>
                <Label>Credit Limit : </Label>
                <Badge
                  className="rounded-md p-2 text-sm mb-5"
                  variant={"secondary"}
                >
                  {creditorDetails.data.creditLimit || "-"}
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
};

export default ViewCreditor;
