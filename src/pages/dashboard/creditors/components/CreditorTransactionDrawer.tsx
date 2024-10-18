import * as React from "react";
import {
  ArrowDownUp,
  ArrowDownUpIcon,
  CalendarIcon,
  Minus,
  PenBox,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Badge } from "@/components/ui/badge";
import TransactionTimeLine from "./TransactionTimeline";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import TransactionService from "@/service/creditor/TransactionService";
import { useQuery } from "@tanstack/react-query";
import { TransactionList } from "@/types/creditor/creditorTransactions";
import TablePagination from "@/components/TablePagination";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import dateToString from "@/utils/dateToString";

export function CreditorTransactionDrawer({
  nonIcon = true,
  creditorId,
  creditorName,
}: {
  nonIcon?: boolean;
  creditorId: string;
  creditorName?: string;
}) {
  const [goal, setGoal] = React.useState(350);
  const axiosPrivate = useAxiosPrivate();
  const transactionService = new TransactionService(axiosPrivate);
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [totalPages, setTotalPages] = React.useState(0);
  const [selectedOption, setSelectedOption] = React.useState<string>("ALL");
  const [typeList, setTypeList] = React.useState<
    { label: string; value: string }[]
  >([
    { label: "All", value: "ALL" },
    { label: "Cash", value: "CASH" },
    { label: "Deposit", value: "DEPOSIT" },
    { label: "Cheque", value: "CHEQUE" },
    { label: "Return", value: "RETURN" },
  ]);
  const [date, setDate] = React.useState<Date | null>(null);

  function onClick(adjustment: number) {
    setGoal(Math.max(200, Math.min(400, goal + adjustment)));
  }

  const {
    data: transactions,
    error: transactionError,
    isLoading: transactionLoading,
  } = useQuery<TransactionList>({
    queryKey: [
      "creditorTransactions",
      pageSize,
      creditorId,
      pageNo,
      selectedOption,
      date,
    ],
    queryFn: () =>
      transactionService.getCreditorTransactions(
        creditorId,
        pageNo,
        pageSize,
        selectedOption,
        date ? dateToString(date) : "",
      ),
  });

  React.useEffect(() => {
    if (transactions) {
      setTotalPages(transactions.totalPages);
    }
  }, [transactions]);

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        {nonIcon ? (
          <Button variant="outline" className="text-sm" size="sm">
            <ArrowDownUpIcon size={20} className="mr-2" /> View All
          </Button>
        ) : (
          <Button variant="outline" className="text-sm" size="sm">
            <ArrowDownUpIcon size={20} />
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent className="h-screen top-0 right-0 left-auto mt-0 w-[500px] rounded-none flex flex-col">
        {/* <div className="mx-10 w-auto max-w-120"> */}
        <DrawerHeader className="px-10 py-4 border-b">
          <div className="flex-row gap-3">
            <p className="text-lg font-semibold">
              Transactions of {creditorName}
            </p>
            <div className="flex gap-2 justify-between items-center mt-2">
              <Popover>
                <PopoverTrigger asChild className="w-full">
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                  />
                </PopoverContent>
              </Popover>
              <Select
                defaultValue={selectedOption}
                onValueChange={(e) => setSelectedOption(e)}
              >
                <SelectTrigger className="w-fit size-sm">
                  <SelectValue placeholder="Transaction Type">
                    {selectedOption}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {typeList.map((type) => (
                    <SelectItem value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                defaultValue="10"
                onValueChange={(e) => setPageSize(Number(e))}
              >
                <SelectTrigger className="w-fit">
                  <SelectValue placeholder="Count">{pageSize}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </DrawerHeader>
        <div className="flex-grow overflow-y-auto px-10 py-4">
          <TransactionTimeLine
            transactions={transactions}
            transactionLoading={transactionLoading}
          />
        </div>
        <DrawerFooter className="px-10 py-4 border-t">
          {/* <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose> */}
          <TablePagination
            pageNo={pageNo}
            pageSize={pageSize}
            totalPages={totalPages}
            onPageChange={(page) => {
              setPageNo(page - 1);
            }}
          />
        </DrawerFooter>
        {/* </div> */}
      </DrawerContent>
    </Drawer>
  );
}
