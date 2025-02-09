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
import { DummyInvoiceItem } from "@/types/invoice/dummy/dummyInvoiceTypes";

function TransactionCard({
  icon,
  header,
  body,
  footer,
  statusColor,
  type,
}: {
  icon: React.ReactNode;
  header: string | JSX.Element;
  body: string | JSX.Element;
  footer: JSX.Element;
  statusColor: string;
  type: string;
}) {
  return (
    <>
      <Card className="p-4 shadow-sm bg-green-50">
        <div className="flex items-center">
          <div className="flex-col justify-flex-start">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
              {icon}
            </div>
          </div>
          <div className="ml-4">
            {typeof header === "string" ? (
              <h3 className="text-md font-semibold leading-none tracking-tight">
                {header}
              </h3>
            ) : (
              header
            )}
            {typeof body === "string" ? (
              <p className="text-sm font-regular text-gray-500">{body}</p>
            ) : (
              body
            )}
            {footer}
          </div>
        </div>
      </Card>
    </>
  );
}

export default TransactionCard;
