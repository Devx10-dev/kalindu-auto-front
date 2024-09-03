"use client";
("use client");

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import { CreditorsService } from "@/service/creditor/CreditorsService";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import AllCaughtUp from "../../dashboard-root/components/AllCaughtUp";
import { ScanSearchIcon } from "lucide-react";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { PersonIcon } from "@radix-ui/react-icons";
import { CashInvoiceService } from "@/service/invoice/cashInvoiceApi";
import { QuickSearchInvoice } from "@/types/invoice/cashInvoice";
import useDebounce from "@/hooks/useDebounce";

export default function QuickSearch({
  className,
}: {
  // type of the className prop
  className?: string;
}) {
  const [creditorType, setCreditorType] = useState("overdue");

  const axiosPrivate = useAxiosPrivate();
  const cashInvoiceService = new CashInvoiceService(axiosPrivate);
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 500);

  const {
    data: cashInvoices,
    isLoading: cashInvoicesLoading,
    error: cashInvoicesError,
  } = useQuery<QuickSearchInvoice[], Error>({
    queryKey: ["cashInvoices", debouncedSearch],
    queryFn: () =>
      cashInvoiceService.fetchQuickSearchCashInvoices(debouncedSearch),
  });

  const rateList = [
    { label: "Cash Invoices", value: "cash" },
    { label: "Credit Invoices", value: "credit" },
  ];

  const [selectedOption, setSelectedOption] = useState<string[]>([
    "cash",
    "credit",
  ]);

  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (cashInvoices) {
      console.log(cashInvoices);
    }
  }, [cashInvoices]);

  return (
    <div className={className}>
      <Card
        x-chunk="dashboard-01-chunk-5"
        className="h-full max-h-[500px] mb-5"
      >
        <div className="flex h-[20%] justify-between items-center align-items-top m-5">
          <CardHeader className="p-0 h-[100%]  flex flex-col">
            <CardTitle className="pl-0">Quick Search</CardTitle>
            <CardDescription className="pl-0">
              You can search for cash invoices and credit invoices here
            </CardDescription>
          </CardHeader>
          <ScanSearchIcon className="w-8 h-8 text-muted-foreground" />
          {/* <div className="gap-2 pt-0 flex">
            <Select value={creditorType} onValueChange={setCreditorType}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Rate" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="due">Due</SelectItem>
              </SelectContent>
            </Select>
          </div> */}
        </div>

        <CardContent className="flex max-h-[350px] overflow-visible py-5">
          <div className="relative flex flex-col gap-2 w-full">
            <Select
              defaultValue="cash"
              onValueChange={(value) => console.log(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Search" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="cash">Cash Invoices</SelectItem>
                  <SelectItem value="credit">Credit Invoices</SelectItem>
                  <SelectItem value="dummy">Dummy Invoices</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Command className="relative rounded-lg border shadow-md md:min-w-[450px] w-full overflow-visible shadow-none">
              <CommandInput
                placeholder="Type a command or search..."
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className="shadow-none"
                onValueChange={(value) => setSearch(value)}
              />
              {focused && (
                <CommandList className="absolute top-[100%] left-0 z-10 w-full bg-white border rounded-lg shadow-md">
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup heading="Search Results">
                    {/* 
                    [{
                          "id": 15,
                          "customerName": "Kmal",
                          "invoiceId": "INV-CASH-2408261146",
                          "totalPrice": 1000.00
                      },
                      {
                          "id": 14,
                          "customerName": "adisha",
                          "invoiceId": "INV-CASH-2408261145",
                          "totalPrice": 10000.00
                    }]
                  
                    A CommandItem should be like this

                  
                  */}
                    {cashInvoicesLoading ? (
                      <Skeleton className="mr-2 h-4 w-full" />
                    ) : cashInvoices ? (
                      cashInvoices.map((invoice) => (
                        <CommandItem key={invoice?.invoiceId}>
                          <Avatar>
                            <AvatarFallback>
                              <PersonIcon />
                            </AvatarFallback>
                            <AvatarImage src="https://randomuser.me/api" />
                          </Avatar>
                          <span>{invoice?.customerName}</span>
                          <Badge variant="secondary">Due</Badge>
                        </CommandItem>
                      ))
                    ) : (
                      <AllCaughtUp caughtUpText="All caught up!" />
                    )}
                  </CommandGroup>
                  {debouncedSearch === "" ? (
                    <CommandGroup heading="Recent Invoices">
                      {cashInvoicesLoading ? (
                        <Skeleton className="mr-2 h-4 w-full" />
                      ) : cashInvoices ? (
                        cashInvoices.map((invoice) => (
                          <CommandItem key={invoice?.invoiceId}>
                            <Avatar>
                              <AvatarFallback>
                                <PersonIcon />
                              </AvatarFallback>
                              <AvatarImage src="https://randomuser.me/api" />
                            </Avatar>
                            <span>{invoice?.customerName}</span>
                            <Badge variant="secondary">Due</Badge>
                          </CommandItem>
                        ))
                      ) : (
                        <AllCaughtUp caughtUpText="All caught up!" />
                      )}
                    </CommandGroup>
                  ) : (
                    <></>
                  )}
                </CommandList>
              )}
            </Command>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
