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
  CreativeCommons,
  Edit2Icon,
  Newspaper,
  PenBox,
} from "lucide-react";

function TimeLineComponent({
  title,
  icon,
  subTitle,
  body,
}: {
  title: string | JSX.Element;
  icon: JSX.Element;
  subTitle?: string;
  body?: string | JSX.Element;
}) {
  return (
    <li className="mb-10 ms-6">
      <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-300 rounded-full -start-4 ring-6 ring-white ">
        {icon}
      </span>
      {typeof title === "string" ? (
        <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
      ) : (
        title
      )}
      {/* <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">{title}<span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 ms-3">Latest</span></h3> */}
      <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
        {subTitle}
      </time>
      {typeof body === "string" ? (
        <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
          {body}
        </p>
      ) : (
        body
      )}
      {/* <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">Get access to over 20+ pages including a dashboard layout, charts, kanban board, calendar, and pre-order E-commerce & Marketing pages.</p> */}
    </li>
  );
}

export default TimeLineComponent;
