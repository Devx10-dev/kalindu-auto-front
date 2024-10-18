import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { OutsourcedItem } from "@/types/invoice/cash/cashInvoiceTypes";
import { DummyInvoiceItem } from "@/types/invoice/dummy/dummyInvoiceTypes";
import { Plus } from "lucide-react";
import TransactionTimeLine from "./TransactionTimeline";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreditorTransactionDrawer } from "./CreditorTransactionDrawer";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import TransactionService from "@/service/creditor/TransactionService";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TransactionList } from "@/types/creditor/creditorTransactions";

function TransactionCard({
  creditorId,
  creditorName,
}: {
  creditorId: string;
  creditorName: string;
}) {
  const axiosPrivate = useAxiosPrivate();
  const transactionService = new TransactionService(axiosPrivate);
  const [transactionCount, setTransactionCount] = useState(5);

  const {
    data: transactions,
    error: transactionError,
    isLoading: transactionLoading,
  } = useQuery<TransactionList>({
    queryKey: ["creditorTransactions", transactionCount, creditorId],
    queryFn: () =>
      transactionService.getCreditorTransactions(
        creditorId,
        0,
        transactionCount,
      ),
  });

  return (
    <>
      <Card className="h-git">
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Recent Transactions</h2>
            <Button variant="outline" className="text-sm" size="sm">
              <Plus className="h-5 w-5" />
              Add
            </Button>
          </div>
        </CardHeader>
        <div className="pt-0 px-3">
          <Separator className="w-[100%] items-center" />
        </div>
        <CardContent className="pl-8 pb-0">
          <div className="py-0 mt-5 h-fit">
            <TransactionTimeLine
              transactions={transactions}
              transactionLoading={transactionLoading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between w-full">
          <Select
            defaultValue="5"
            onValueChange={(e) => setTransactionCount(Number(e))}
          >
            <SelectTrigger className="w-fit">
              <SelectValue placeholder="5">{transactionCount}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
            </SelectContent>
          </Select>
          <CreditorTransactionDrawer
            creditorId={creditorId}
            creditorName={creditorName}
          />
        </CardFooter>
      </Card>
    </>
  );
}

export default TransactionCard;
