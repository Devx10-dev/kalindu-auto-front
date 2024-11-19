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
  Coins,
  CreativeCommons,
  CreditCard,
  Edit2Icon,
  Landmark,
  LibrarySquare,
  Newspaper,
  PenBox,
  TriangleAlert,
  Undo2,
} from "lucide-react";
import TimeLineComponent from "./TimeLineCompoent";
import { Skeleton } from "@/components/ui/skeleton";
import dateArrayToString from "@/utils/dateArrayToString";
import { Button } from "@/components/ui/button";
import TransactionService from "@/service/creditor/TransactionService";
import { useQuery } from "@tanstack/react-query";
import { TransactionList } from "@/types/creditor/creditorTransactions";
import ChequeStatusBadge from "../../invoice/view-invoices/components/ChequeStatusBadge";
import Loading from "@/components/Loading";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import PriceComponent from "./PriceComponent";
import { currencyAmountString } from "@/utils/analyticsUtils";
import TransactionLoading from "./TransactionLoading";
import NoInvoices from "./NoInvoices";

function InvoiceTransactionTimeLine({
  invoiceId,
  transactions,
  transactionLoading,
}: {
  invoiceId?: string;
  transactions: TransactionList;
  transactionLoading: boolean;
}) {
  return (
    <>
      {transactionLoading ? (
        <TransactionLoading />
      ) : transactions?.creditorTransactions.length === 0 ? (
        <NoInvoices message="No transactions found" />
      ) : (
        <div className="relative border-l border-gray-200 dark:border-gray-700 w-full h-fit">
          {transactions?.creditorTransactions?.map((transaction) =>
            generateTimelineComponent({ transaction, invoiceId }),
          )}
        </div>
      )}
    </>
  );
}

function generateTimelineComponent({
  transaction,
  invoiceId,
}: {
  transaction: any;
  invoiceId?: string;
}) {
  switch (transaction.transactionType) {
    case "CASH":
      return (
        <TimeLineComponent
          title={
            <div className="flex justify-between items-flex-start w-full">
              <div className="flex-col gap-2 w-fit">
                <p className="text-gray-700 dark:text-white">
                  {dateArrayToString(transaction.createdDate, false, true)}
                </p>
                <div className="flex gap-2 ">
                  {/* <p className="text-gray-1000 dark:text-white">Cash Payment</p> */}
                  <Badge className="text-xs bg-green-700 dark:bg-green-700 text-green-100 dark:text-green-300 rounded-sm">
                    Cash Payment
                  </Badge>
                </div>
              </div>
              <div>
                <Badge variant="outline">
                  #{transaction.creditorTransactionID}
                </Badge>
              </div>
            </div>
          }
          subTitle={
            <div className="flex-col gap-2 w-fit">
              <div className="flex gap-2 w-fit items-center"></div>
            </div>
          }
          icon={
            <Coins className="w-4 h-4 text-green-600 dark:text-green-300" />
          }
          body={
            <TransactionInvoiceCard
              transaction={transaction}
              invoiceId={invoiceId}
            />
          }
          iconColor="bg-green-100 text-green-800"
        />
      );
    case "CHEQUE":
      return (
        <TimeLineComponent
          title={
            <div className="flex justify-between items-flex-start w-full">
              <div className="flex-col gap-2 w-fit">
                <p className="text-gray-700 dark:text-white">
                  {dateArrayToString(transaction.createdDate, false, true)}
                </p>
                <div className="flex gap-1 ">
                  {/* <p className="text-gray-1000 dark:text-white">Cheque Payment</p> */}
                  <Badge className="text-xs bg-gray-600 dark:bg-gray-900 text-gray-100 dark:text-gray-300 rounded-sm">
                    Cheque Payment
                  </Badge>
                  <ChequeStatusBadge cheque={transaction.cheque} />
                </div>
              </div>
              <div>
                <Badge variant="outline">
                  #{transaction.creditorTransactionID}
                </Badge>
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
                  {transaction.cheque.chequeNo ? (
                    transaction.cheque.chequeNo
                  ) : (
                    <Badge className="text-xs rounded-sm" variant="destructive">
                      N/A
                    </Badge>
                  )}
                </p>
              </div>
            </div>
          }
          icon={
            <CreditCard className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          }
          body={
            <TransactionInvoiceCard
              transaction={transaction}
              invoiceId={invoiceId}
            />
          }
          iconColor="bg-gray-100 text-gray-800"
        />
      );
    case "DEPOSIT":
      return (
        <TimeLineComponent
          title={
            <div className="flex justify-between items-flex-start w-full">
              <div className="flex-col gap-2 w-fit">
                <p className="text-gray-700 dark:text-white">
                  {dateArrayToString(transaction.createdDate, false, true)}
                </p>
                <div className="flex gap-2 ">
                  {/* <p className="text-gray-1000 dark:text-white">Bank Deposit</p> */}
                  <Badge className="text-xs bg-blue-700 dark:bg-blue-900 text-blue-100 dark:text-blue-300 rounded-sm">
                    Bank Deposit
                  </Badge>
                </div>
              </div>
              <div>
                <Badge variant="outline">
                  #{transaction.creditorTransactionID}
                </Badge>
              </div>
            </div>
          }
          icon={
            <Landmark className="w-4 h-4 text-blue-600 dark:text-blue-300" />
          }
          body={
            <TransactionInvoiceCard
              transaction={transaction}
              invoiceId={invoiceId}
            />
          }
        />
      );
    case "RETURN":
      return (
        <TimeLineComponent
          title={
            <div className="flex justify-between items-flex-start w-full">
              <div className="flex-col gap-2 w-fit">
                <p className="text-gray-700 dark:text-white">
                  {dateArrayToString(transaction.createdDate, false, true)}
                </p>
                <div className="flex gap-1 ">
                  {/* <p className="text-gray-1000 dark:text-white">Bank Deposit</p> */}
                  <Badge className="text-xs bg-red-700 dark:bg-red-900 text-red-100 dark:text-red-300 rounded-sm">
                    Return
                  </Badge>
                  {transaction.transactionInvoices?.length > 0 &&
                    transaction.transactionInvoices.file.map((invoice: any) => (
                      <Badge className="text-xs bg-red-200 dark:bg-red-900 text-black dark:text-black rounded-sm">
                        {invoice.creditorInvoice.invoiceId}
                      </Badge>
                    ))}
                </div>
              </div>
              <div>
                <Badge variant="outline">
                  #{transaction.creditorTransactionID}
                </Badge>
              </div>
            </div>
          }
          icon={<Undo2 className="w-4 h-4 text-red-600 dark:text-red-300" />}
          body={
            <TransactionInvoiceCard
              transaction={transaction}
              invoiceId={invoiceId}
            />
          }
          iconColor="bg-red-100 text-red-800"
        />
      );
  }
}

function TransactionInvoiceCard({
  transaction,
  invoiceId,
}: {
  transaction: any;
  invoiceId?: string;
}) {
  return (
    <Card className="w-full mt-2">
      <CardHeader className="p-0">
        <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-2">
          <p className="text-sm">Total Amount</p>
          <PriceComponent
            content={currencyAmountString(transaction.totalPrice)}
            contentType="currencyAmount"
          />
        </div>
      </CardHeader>
      <div className="w-full flex items-center justify-center">
        <Separator className="w-full" />
      </div>
      <CardContent className="p-2">
        {transaction.transactionInvoices &&
        transaction.transactionInvoices.length > 0
          ? transaction.transactionInvoices.map(
              (invoice: any) =>
                invoiceId == invoice.creditorInvoice.invoiceId && (
                  <div className="flex items-center justify-between">
                    <Link
                      to={`/dashboard/invoice/creditor/${invoice.creditorInvoice.invoiceId}`}
                    >
                      <p className="text-xs">
                        {invoice.creditorInvoice.invoiceId}
                      </p>
                    </Link>
                    <PriceComponent
                      content={currencyAmountString(invoice.settledAmount)}
                      contentType="currencyAmount"
                      bold={false}
                    />
                  </div>
                ),
            )
          : transaction.creditorRefund == null && (
              <div className="flex items-center justify-center gap-2">
                <TriangleAlert className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <p className="text-xs">No invoice records found</p>
              </div>
            )}
        {/* <Separator className="w-full my-2" /> */}
        {transaction.creditorRefund && (
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs">REFUNDS</p>
            <PriceComponent
              content={currencyAmountString(
                transaction.creditorRefund.refundAmount,
              )}
              contentType="currencyAmount"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default InvoiceTransactionTimeLine;
