import IconButton from "@/components/button/IconButton";
import CancelIcon from "@/components/icon/CancelIcon";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { OutsourcedItem } from "@/types/invoice/cash/cashInvoiceTypes";
import { InvoiceState } from "@/types/invoice/cashInvoice";
import { InvoiceState as CreditInvoiceState } from "@/types/invoice/creditorInvoice";
import { DummyInvoiceItem } from "@/types/invoice/dummy/dummyInvoiceTypes";
import {
  Calendar,
  CheckCircle2,
  CreativeCommons,
  CreditCard,
  Edit2Icon,
  LibrarySquare,
  Newspaper,
  PenBox,
} from "lucide-react";
import TimeLineComponent from "./TimeLineCompoent";
import TransactionCard from "./TransactionCard";
import { Skeleton } from "@/components/ui/skeleton";
import dateArrayToString from "@/utils/dateArrayToString";
import { Button } from "@/components/ui/button";
import TransactionService from "@/service/creditor/TransactionService";
import { useQuery } from "@tanstack/react-query";
import { TransactionList } from "@/types/creditor/creditorTransactions";
import ChequeStatusBadge from "../../invoice/view-invoices/components/ChequeStatusBadge";
import Loading from "@/components/Loading";
import { Separator } from "@/components/ui/separator";

function TransactionTimeLine({
  creditorId,
  transactionService,
  invoiceDetails,
  invoiceLoading,
}: {
  creditorId: string;
  transactionService: TransactionService;
  invoiceDetails?: InvoiceState | CreditInvoiceState | null;
  invoiceLoading?: boolean;
}) {
  const {
    data: transactions,
    error: transactionError,
    isLoading: transactionLoading,
  } = useQuery<TransactionList>({
    queryKey: ["creditorTransactions"],
    queryFn: () =>
      transactionService.getCreditorTransactions(creditorId, 0, 10),
  });

  const invoiceCreatedCard = ({
    invoiceDetails,
  }: {
    invoiceDetails?: InvoiceState | CreditInvoiceState | null;
  }) => {
    return (
      <TransactionCard
        icon={<Newspaper size={24} />}
        header={
          invoiceDetails?.invoiceId
            ? `Invoice No: #${invoiceDetails?.invoiceId}`
            : ""
        }
        body={
          invoiceDetails?.invoiceId
            ? `Amount: ${invoiceDetails?.totalPrice}`
            : ""
        }
        footer={
          <a
            href="#"
            className="text-blue-600 dark:text-blue-300 hover:underline"
          >
            View Invoice
          </a>
        }
        statusColor="blue"
        type="invoice"
      />
    );
  };

  return (
    <>
      <div className="relative border-l border-gray-200 dark:border-gray-700 w-full h-fit">
        {transactionLoading ? (
          <Loading />
        ) : (
          transactions?.creditorTransactions?.map((transaction) =>
            generateTimelineComponent({ transaction }),
          )
        )}
      </div>
    </>
  );
}

function generateTimelineComponent({ transaction }: { transaction: any }) {
  switch (transaction.transactionType) {
    case "CASH":
      return (
        <TimeLineComponent
          title={
            <div className="flex-col gap-2 w-fit">
              <p className="text-gray-700 dark:text-white">
                {dateArrayToString(transaction.createdDate, false, true)}
              </p>
              <div className="flex gap-2 ">
                <p className="text-gray-1000 dark:text-white">Cash Payment</p>
              </div>
            </div>
          }
          subTitle={
            <div className="flex-col gap-2 w-fit">
              <div className="flex gap-2 w-fit items-center">
                <p className="text-gray-900 dark:text-white text-xs">
                  Cheque No:
                </p>
                <p className="text-gray-500 dark:text-gray-400 max-w-xs truncate text-sm">
                  {transaction.cheque.chequeNo}
                </p>
              </div>
            </div>
          }
          icon={
            <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-300" />
          }
        />
      );
    case "CHEQUE":
      return (
        <TimeLineComponent
          title={
            <div className="flex-col gap-2 w-fit">
              <p className="text-gray-700 dark:text-white">
                {dateArrayToString(transaction.createdDate, false, true)}
              </p>
              <div className="flex gap-2 ">
                <p className="text-gray-1000 dark:text-white">Cheque Payment</p>
                <ChequeStatusBadge cheque={transaction.cheque} />
              </div>
            </div>
          }
          subTitle={
            <div className="flex-col gap-2 w-fit">
              <div className="flex gap-2 w-fit items-center">
                <p className="text-gray-900 dark:text-white text-xs">
                  Cheque No:
                </p>
                <p className="text-gray-500 dark:text-gray-400 max-w-xs truncate text-sm">
                  {transaction.cheque.chequeNo}
                </p>
              </div>
            </div>
          }
          icon={
            <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-300" />
          }
          body={<TransactionInvoiceCard transaction={transaction} />}
        />
      );
    case "DEPOSIT":
      return (
        <TimeLineComponent
          title={
            <Badge
              className="bg-green-200 text-green-800 h-8"
              variant="secondary"
            >
              Bank Deposit
            </Badge>
          }
          icon={
            <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-300" />
          }
        />
      );
  }
}

function TransactionInvoiceCard({ transaction }: { transaction: any }) {
  return (
    <Card className="w-full">
      <CardHeader className="p-2">
        <div className="flex justify-between items-center">
          <p className="text-sm">Total Amount</p>
          <p className="text-md">{transaction.totalPrice}</p>
        </div>
      </CardHeader>
      <div className="w-full flex items-center justify-center">
        <Separator className="w-full" />
      </div>
      <CardContent className="p-2"></CardContent>
    </Card>
  );
}

export default TransactionTimeLine;
