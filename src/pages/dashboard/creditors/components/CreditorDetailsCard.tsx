import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { CheckCircle, ChevronsDown, ChevronsUp, ChevronUp } from "lucide-react";
import { useState } from "react";
import StatusCard from "../../invoice/view/components/StatusCard";

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
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            <div className="flex gap-2 items-center">
              <Avatar>
                <AvatarFallback style={{ background: color }}>
                  {selectedCreditor !== null
                    ? getInitials(selectedCreditor.contactPersonName)
                    : "NA"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p>
                  {selectedCreditor !== null
                    ? truncate(selectedCreditor?.shopName, 20)
                    : ""}
                </p>
                <CardDescription>{`Contact Name : ${
                  selectedCreditor !== null
                    ? truncate(selectedCreditor?.contactPersonName, 20)
                    : ""
                }`}</CardDescription>
              </div>
            </div>
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
          <div className="md:col-span-1">
            <div className="font-semibold">Creditor Balance Details</div>
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Due Amount</span>
                <span
                  style={{
                    background: "#FFAAAA",
                    paddingLeft: 10,
                    paddingRight: 10,
                    borderRadius: 5,
                  }}
                >
                  Rs {selectedCreditor?.totalDue ?? 0}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Cheque Balance</span>
                <span
                  style={{
                    background: "#B4E380",
                    paddingLeft: 10,
                    paddingRight: 10,
                    borderRadius: 5,
                  }}
                >
                  Rs {selectedCreditor?.chequeBalance ?? 0}
                </span>
              </li>
            </ul>
            <Separator className="my-2" />
            <div className="font-semibold">Contact Details</div>
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Contact No</span>
                <span>{selectedCreditor?.primaryContact ?? ""}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Email Address</span>
                <span>{selectedCreditor?.email ?? ""}</span>
              </li>
            </ul>
          </div>

          {selectedCreditInvoices.length > 0 && (
            <div className="md:col-span-1">
              <Separator
                className={`my-2 hidden lg:block sm:block md:hidden`}
              />
              <div className="font-semibold">Credit Invoices Details</div>
              <li className="flex items-center justify-between mt-1">
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
              </li>
              <Separator
                className={`my-2 hidden lg:block sm:block md:hidden`}
              />
              <div
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
                          Rs {invoice.totalPrice - invoice.settledAmount ?? 0}
                        </span>
                      </li>
                    </ul>
                    <Separator
                      className={`my-4 hidden lg:block sm:block md:hidden`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </>
  );
}

export default CreditorDetailsCard;
