import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Creditor } from "@/types/creditor/creditorTypes";
import { CreditInvoice } from "@/types/invoice/credit/creditInvoiceTypes";
import { convertArrayToISOFormat } from "@/utils/dateTime";
import { getInitials, truncate } from "@/utils/string";
import { ChevronsDown, ChevronsUp, CircleAlert } from "lucide-react";
import { useState } from "react";
import { CardCarousel } from "./CardCarousel";
import AmountCard from "@/components/card/AmountCard";
import { Label } from "@/components/ui/label";
import CurrencyComponent from "../../invoice/view/components/CurrencyComponent";
import NoInvoices from "./NoInvoices";
import NotSelected from "./NotSelected";

function CreditorDetailsCard({
  selectedCreditor,
  selectedCreditInvoices,
  color,
}: {
  selectedCreditor: Creditor;
  selectedCreditInvoices: CreditInvoice[];
  color: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <>
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5 grid-cols-1 w-full">
          <CardTitle className="group flex items-center gap-2 text-lg w-full">
            {selectedCreditor ? (
              <div className="flex-row gap-5 items-center w-full">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="size-7">
                    <AvatarFallback
                      style={{ background: color }}
                      className="text-xs"
                    >
                      {selectedCreditor
                        ? getInitials(selectedCreditor.shopName)
                        : "AN"}
                    </AvatarFallback>
                  </Avatar>
                  <p>
                    {selectedCreditor
                      ? selectedCreditor.shopName
                      : "Anonymous Customer"}
                  </p>
                </div>
                <div className="flex-col items-center">
                  <div className="flex justify-between w-full mb-3">
                    <CardDescription className="flex-col w-full gap-5">
                      <p className="text-muted-foreground text-xs">
                        Contact Person:
                      </p>
                      <p className="font-bold text-lg text-black">
                        {selectedCreditor.contactPersonName}
                      </p>
                    </CardDescription>
                    <CardDescription className="flex-col w-full gap-2">
                      <p className="text-muted-foreground text-xs">
                        Contact No:{" "}
                      </p>
                      <Badge className="rounded-sm text-md " variant="outline">
                        {selectedCreditor.primaryContact}
                      </Badge>
                    </CardDescription>
                  </div>
                  <div className="flex justify-between w-full">
                    <CardDescription className="flex flex-col w-full gap-1">
                      <p className="text-muted-foreground text-xs">
                        Total Due:
                      </p>
                      {/* <Badge className="rounded-sm text-md bg-red-200" variant="outline">
                        Rs {selectedCreditor?.totalDue ?? 0}
                      </Badge> */}
                      <AmountCard
                        amount={selectedCreditor.totalDue}
                        color="#fed7d7"
                        fontStyle="font-bold text-black"
                        withoutCurrency={false}
                      />
                    </CardDescription>
                    <CardDescription className="flex flex-col w-full gap-1">
                      <p className="text-muted-foreground text-xs">
                        Cheque Balance:
                      </p>
                      {/* <Badge className="rounded-sm text-md bg-green-200" variant="outline">
                        Rs {selectedCreditor?.chequeBalance ?? 0}
                      </Badge> */}
                      <AmountCard
                        amount={selectedCreditor.chequeBalance}
                        color="#c6f6d5"
                        fontStyle="font-bold text-black"
                        withoutCurrency={false}
                      />
                    </CardDescription>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex w-full gap-3 items-center justify-center">
                <CircleAlert className="text-yellow-500 size-8" />
                <p className="w-full text-sm">
                  Please select creditor to continue
                </p>
              </div>
            )}
          </CardTitle>
        </div>
        <div className="ml-auto flex items-center gap-1 sm:block md:hidden lg:hidden">
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1"
            onClick={() => setShow(!show)}
          >
            {show ? (
              <ChevronsUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronsDown className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent
        className={`p-6 text-sm sm:${show ? "block" : "hidden"} md:block`}
      >
        <div
          className={`grid gap-6 grid-cols-1 lg:grid-cols-1 ${selectedCreditInvoices.length === 0 ? "" : "md:grid-cols-2"}`}
        >
          {selectedCreditInvoices.length > 0 ? (
            <div className="md:col-span-1">
              {/* <div className="font-semibold">Credit Invoices Details</div> */}
              {/* <li className="flex items-center justify-between mt-1">
                <span>Total Amount</span>
                <span
                  style={{
                    background: "#FFAAAA",
                    paddingLeft: 10,
                    paddingRight: 10,
                    borderRadius: 5,
                  }}
                >
                  Rs{" "}
                  {selectedCreditInvoices.reduce(
                    (total, invoice) =>
                      total + (invoice.totalPrice - invoice.settledAmount),
                    0,
                  )}
                </span>
              </li> */}
              <div className="text-right flex-col gap-10 bg-slate-100 rounded-md p-4">
                <div className="flex justify-between">
                  <Label className="text-lg text-left ">Total Payable</Label>
                </div>
                <div className="flex justify-between">
                  <p className="text-2xl font-thin align-bottom">Rs.</p>
                  {/* <p className="text-4xl font-semibold">{total}</p> */}
                  <CurrencyComponent
                    amount={selectedCreditInvoices.reduce(
                      (total, invoice) =>
                        total +
                        (invoice.totalPrice -
                          invoice.settledAmount -
                          invoice.pendingPayments),
                      0,
                    )}
                    currency="LKR"
                    withoutCurrency
                    mainTextSize="text-2xl"
                    subTextSize="text-sm"
                  />
                </div>
              </div>
              <Separator
                className={`my-2 hidden lg:block sm:block md:hidden`}
              />
              <div className="w-full">
                <CardCarousel creditInvoices={selectedCreditInvoices} />
              </div>
              {/* <div
                style={{
                  height: "180px",
                  overflowY: "scroll",
                  paddingLeft: "15px",
                  paddingRight: "15px",
                  paddingTop: "5px",
                  borderRadius: "5px",
                }}
                className="bg-muted/50"
              >
                {selectedCreditInvoices.map((invoice, index) => (
                  <div key={index}>
                    <ul className="grid gap-3 mt-2">
                      <li className="flex items-center justify-between font-semibold">
                        <span className="font-semibold">Invoice ID</span>
                        <span>{invoice?.invoiceId ?? ""}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">Date</span>
                        <span>
                          {invoice
                            ? convertArrayToISOFormat(invoice?.issuedTime)
                            : ""}
                        </span>
                      </li>
                    </ul>
                    <ul className="grid gap-3">
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Total Amount
                        </span>
                        <span>{invoice?.totalPrice ?? ""}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Settled Amount
                        </span>
                        <span
                          style={{
                            background: "#B4E380",
                            paddingLeft: 10,
                            paddingRight: 10,
                            borderRadius: 5,
                          }}
                        >
                          Rs {invoice?.settledAmount}
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Due Amount
                        </span>
                        <span
                          style={{
                            background: "#FFAAAA",
                            paddingLeft: 10,
                            paddingRight: 10,
                            borderRadius: 5,
                          }}
                        >
                          Rs {invoice.totalPrice - invoice.settledAmount}
                        </span>
                      </li>
                    </ul>
                    <Separator
                      className={`my-4 hidden lg:block sm:block md:hidden`}
                    />
                  </div>
                ))}
              </div> */}
            </div>
          ) : (
            <NotSelected message="Invoice details will be shown here once creditor and invoices are selected." />
          )}
        </div>
      </CardContent>
    </>
  );
}

export default CreditorDetailsCard;
