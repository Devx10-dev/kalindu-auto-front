import IconButton from "@/components/button/IconButton";
import CancelIcon from "@/components/icon/CancelIcon";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
import { DummyInvoiceItem } from "@/types/invoice/dummy/dummyInvoiceTypes";
import {
  Calendar,
  CheckCircle2,
  CreativeCommons,
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

function TransactionTimeLine({
  invoiceDetails,
  invoiceLoading,
}: {
  invoiceDetails?: InvoiceState | null;
  invoiceLoading?: boolean;
}) {
  const invoiceCreatedCard = ({
    invoiceDetails,
  }: {
    invoiceDetails?: InvoiceState | null;
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
      <ol className="relative border-l border-gray-200 dark:border-gray-700">
        {invoiceLoading ? (
          <Skeleton className="w-full h-16" />
        ) : (
          <TimeLineComponent
            title={"Invoice Creation"}
            icon={
              <PenBox className="w-4 h-4 text-blue-600 dark:text-blue-300" />
            }
            subTitle={
              invoiceDetails?.issuedTime
                ? dateArrayToString(invoiceDetails?.issuedTime)
                : ""
            }
            body={invoiceCreatedCard({ invoiceDetails })}
          />
        )}
        <TimeLineComponent
          title={
            <Badge
              className="bg-green-200 text-green-800 h-8"
              variant="secondary"
            >
              Completed
            </Badge>
          }
          icon={
            <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-300" />
          }
        />
      </ol>
    </>
  );
}

export default TransactionTimeLine;
