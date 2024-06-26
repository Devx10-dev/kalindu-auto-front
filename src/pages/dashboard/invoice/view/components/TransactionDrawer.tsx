import * as React from "react";
import { ArrowDownUpIcon, Minus, PenBox, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import TimeLine from "./TransactionTimeline";
import { InvoiceState } from "@/types/invoice/cashInvoice";
import dateToString from "@/utils/dateToString";
import Loading from "@/components/Loading";
import dateArrayToString from "@/utils/dateArrayToString";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import TransactionTimeLine from "./TransactionTimeline";

export function TransactionDrawer({
  invoiceDetails,
  invoiceLoading,
}: {
  invoiceDetails: InvoiceState | null;
  invoiceLoading: boolean;
}) {
  const [goal, setGoal] = React.useState(350);

  function onClick(adjustment: number) {
    setGoal(Math.max(200, Math.min(400, goal + adjustment)));
  }

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-full mt-5">
          View Transactions
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-screen top-0 right-0 left-auto mt-0 w-[500px] rounded-none">
        <div className="mx-10 w-auto max-w-120">
          <DrawerHeader className="px-0 w-full -absolute ">
            <DrawerTitle className="flex items-left justify-center w-full text-left text-2xl ">
              Transactions{" "}
              <Badge className="bg-slate-200 text-black ml-2 ">
                #{invoiceDetails?.invoiceId}
              </Badge>
            </DrawerTitle>
            {/* <DrawerDescription>Set your daily activity goal.</DrawerDescription> */}
          </DrawerHeader>
          <Separator className="mb-6 mt-0" />
          {invoiceLoading ? (
            <Loading />
          ) : (
            <TransactionTimeLine
              invoiceDetails={invoiceDetails}
              invoiceLoading={invoiceLoading}
            />
          )}
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
