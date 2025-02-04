import AmountCard from "@/components/card/AmountCard";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CreditInvoice } from "@/types/invoice/credit/creditInvoiceTypes";
import dateArrayToString from "@/utils/dateArrayToString";

interface CardProps {
  invoice: CreditInvoice;
}

export default function InvoiceCard({ invoice }: CardProps) {
  return (
    <Card className="w-full  mx-auto">
      <CardHeader className="p-4">
        <div className="flex flex-col justify-between">
          <CardTitle className="text-md">#{invoice.invoiceId}</CardTitle>
          <p className="text-xs">
            Issued: {dateArrayToString(invoice.issuedTime, false, true)}
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <CardDescription className="text-sm">Total Price</CardDescription>
            {/* <Badge className="rounded-sm text-md " variant="secondary">
                    {invoice.totalPrice}
                </Badge> */}
            <AmountCard
              amount={invoice.totalPrice}
              color="#f3f4f6"
              fontStyle="font-semibold"
            />
          </div>
          <div className="flex justify-between">
            <CardDescription className="text-sm">
              Settled Amount
            </CardDescription>
            {/* <Badge className="rounded-sm text-md bg-green-200" variant="outline">
                    {invoice.settledAmount}
                </Badge> */}
            <AmountCard
              amount={invoice.settledAmount}
              color="#c6f6d5"
              fontStyle="font-semibold"
            />
          </div>
          <div className="flex justify-between">
            <CardDescription className="text-sm">
              Pending Payments
            </CardDescription>
            {/* <Badge className="rounded-sm text-md bg-yellow-200" variant="outline">
                    {invoice.pendingPayments}
                </Badge> */}
            <AmountCard
              amount={invoice.pendingPayments}
              color="#fefcbf"
              fontStyle="font-semibold"
            />
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between">
            <CardDescription className="text-sm">Total Payable</CardDescription>
            {/* <Badge className="rounded-sm text-md bg-red-200" variant="outline">
                    {invoice.totalPrice - invoice.pendingPayments - invoice.settledAmount}
                </Badge> */}
            <AmountCard
              amount={
                invoice.totalPrice -
                invoice.pendingPayments -
                invoice.settledAmount
              }
              color="#fed7d7"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
