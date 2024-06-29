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

function StatusCard({
  icon,
  status,
  statusColor,
  statusText,
  type,
}: {
  icon: React.ReactNode;
  status: string;
  statusColor: string;
  statusText: string;
  type: string;
}) {
  return (
    <>
      <Card className="p-4 shadow-sm bg-green-50">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green">
            {icon}
          </div>
          <div className="ml-4">
            <h3 className="text-md font-semibold leading-none tracking-tight">
              {status}
            </h3>
            <p className="text-sm font-regular text-gray-500">{statusText}</p>
          </div>
        </div>
      </Card>
    </>
  );
}

export default StatusCard;
