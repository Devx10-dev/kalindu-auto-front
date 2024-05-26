import Loading from "@/components/Loading";
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
import { Key, useState } from "react";
import { useParams } from "react-router-dom";
import CreditorAPI from "./api/CreditorAPI";
import { AddNewTransaction } from "./components/AddNewTransaction";


const ViewCreditor = () => {
  const axiosPrivate = useAxiosPrivate();
  const creditorAPI = new CreditorAPI(axiosPrivate);
  const queryClient = useQueryClient();
  const [pageNo, setPageNo] = useState(0);
  const { id } = useParams();

  const creditorTransactions = useQuery({
    queryKey: ["creditorTransactions", id, pageNo],
    queryFn: () => creditorAPI.getCreditorTransactions(id),
  });

  const creditorDetails = useQuery({
    queryKey: ['creditor', id],
    queryFn: () => creditorAPI.fetchSingleCreditor(id),
  });

  const onPageChange = (pageNo: number) => {
    setPageNo(pageNo);
    queryClient.invalidateQueries({ queryKey: ['creditorTransactions'] });
  };

  console.log(creditorTransactions.data);

  console.log(creditorDetails.data);

  if (creditorDetails.isLoading || creditorTransactions.isLoading) {
    return <Loading />;
  } else
    return (
      <div className="w-full h-full">
        <h2 className="mb-4 text-lg font-bold">
          Creditor Management {">"} View Creditor
        </h2>
        <AddNewTransaction />
        <div className="grid gap-10 grid-cols-4">
          <Card className="shadow-md bg-slate-50 h-full col-span-3 ">
            <CardHeader>
              <h3 className="text-lg font-bold">Transaction History</h3>
            </CardHeader>
            <CardContent>
              <Table className="border">
                <TableHeader>
                  <TableRow>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Invoice No</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {creditorTransactions.data.map(
                    (transaction: any, index: Key | null | undefined) => (
                      <TableRow key={index}>
                        <TableCell>{transaction.amount}</TableCell>
                        <TableCell>{transaction.type}</TableCell>
                        <TableCell>{transaction.invoiceNo}</TableCell>
                        <TableCell>{transaction.paymentDate}</TableCell>
                        <TableCell>
                          {/* <ViewTransaction /> */}
                          {transaction.type === 'Invoice' ? (
                            <Button variant={"outline"} className="w-48">
                              View Invoice
                            </Button>
                          ) : null}
                          {transaction.type === 'Transaction'  ? (
                            <Button variant={"outline"} className="w-48">
                              View Transaction Details
                            </Button>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <div className="h-full flex flex-col gap-5">
            <Card className="shadow-md bg-white h-full">
              <CardHeader className="border mb-10">
                <h3 className="text-lg font-bold">Selected Creditor</h3>
              </CardHeader>

              <CardContent className="flex flex-col gap-2">
                <Label>Name : </Label>
                <Badge
                  className="rounded-md p-2 text-lg mb-5"
                  variant={"secondary"}
                >
                  <p>{creditorDetails.data.shopName}</p>{" "}
                </Badge>
                <Label>Total Due : </Label>
                <Badge
                  className="rounded-md p-2 text-lg mb-5"
                  variant={"secondary"}
                >
                  {creditorDetails.data.totalDue}
                </Badge>
                <Label>Emergency Contact : </Label>
                <Badge
                  className="rounded-md p-2 text-lg mb-5"
                  variant={"secondary"}
                >
                  {creditorDetails.data.primaryContact}
                </Badge>
                <Label>Due Period : </Label>
                <Badge
                  className="rounded-md p-2 text-lg mb-5"
                  variant={"secondary"}
                >
                  {creditorDetails.data.maxDuePeriod}
                </Badge>

                <div className="mt-4 flex justify-end gap-2">
                  <Button variant="destructive">Deactivate</Button>
                  <Button>Update</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
};

export default ViewCreditor;
