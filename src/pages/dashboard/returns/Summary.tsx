import AmountCard from "@/components/card/AmountCard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast.ts";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import { ReturnService } from "@/service/return/ReturnService.ts";
import { getRandomColor } from "@/utils/colors";
import { convertArrayToISOFormat } from "@/utils/dateTime";
import { getInitials } from "@/utils/string";
import { Delete, Printer } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import useReturnInvoiceStore from "./context/useReturnInvoiceStore";
import { Switch } from "@/components/ui/switch";

const COLOR = getRandomColor();

const Summary = ({
  creditorSelectKey,
  setCreditorSelectKey,
}: {
  creditorSelectKey: number;
  setCreditorSelectKey: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const {
    customerName,
    sourceInvoiceId,
    invoiceItemDTOList,
    discountPercentage,
    setDiscountPercentage,
    discountAmount,
    setDiscountAmount,
    vatPercentage,
    setVatPercentage,
    vatAmount,
    setVatAmount,
    setTotalPrice,
    getRequestData,
    returnAmount,
    purchaseDate,
    totalPrice,
    resetState,
    invoiceId,
    newInvoiceType,
    setNewInvoiceType,
  } = useReturnInvoiceStore();

  const axiosPrivate = useAxiosPrivate();
  const returnInvoiceService = new ReturnService(axiosPrivate);
  const [netPaidAmount, setNetPaidAmount] = useState(returnAmount);

  const cancelReturn = () => {
    resetState();
    setCreditorSelectKey(creditorSelectKey + 1);
  };

  const subtotal = useMemo(() => {
    return invoiceItemDTOList.reduce(
      (acc: any, item: any) =>
        acc + item.quantity * item.price - item.quantity * item.discount,
      0
    );
  }, [invoiceItemDTOList]);

  const discountedTotal = useMemo(
    () => subtotal - (discountAmount || 0),
    [subtotal, discountAmount]
  );
  const totalWithVat = useMemo(
    () => discountedTotal + (vatAmount || 0),
    [discountedTotal, vatAmount]
  );

  // Update the total price when discountedTotal or vatAmount changes
  useEffect(() => {
    setNetPaidAmount(totalWithVat - returnAmount);
  }, [totalWithVat, setNetPaidAmount, returnAmount]);

  useEffect(() => {
    setTotalPrice(totalWithVat);
  }, [totalWithVat, setTotalPrice]);

  const handleDiscountPercentageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const percentage = Math.max(parseFloat(e.target.value), 0);
    setDiscountPercentage(percentage);
    setDiscountAmount((subtotal * percentage) / 100);
  };

  const handleDiscountAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const amount = Math.max(parseFloat(e.target.value), 0);
    setDiscountAmount(amount);
    setDiscountPercentage((amount / subtotal) * 100);
  };

  const handleVatPercentageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const percentage = Math.max(parseFloat(e.target.value), 0);
    setVatPercentage(percentage);
    setVatAmount((discountedTotal * percentage) / 100);
  };

  const handleVatAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = Math.max(parseFloat(e.target.value), 0);
    setVatAmount(amount);
    setVatPercentage((amount / discountedTotal) * 100);
  };

  const { toast } = useToast();
  console.log(newInvoiceType);

  async function printAndSaveInvoice() {
    if (returnAmount === 0) {
      toast({
        title: "Invalid return details",
        description: "Please add return details!",
        variant: "destructive",
      });

      return;
    }

    try {
      const requestData = getRequestData();
      console.log(requestData);

      const createdInvoice =
        await returnInvoiceService.createReturnInvoice(requestData);
      console.log("Cash invoice created:", requestData);
      // Handle success response, such as printing the invoice or displaying a success message
      toast({
        title: "Invoice created successfully",
        description: "The cash invoice has been created and printed.",
        variant: "default",
      });
      cancelReturn();
    } catch (error) {
      console.error("Error creating cash invoice:", error);
      // Handle error
      toast({
        title: "Error creating invoice",
        description: "Failed to create the cash invoice. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid">
          <CardTitle className="group flex items-center gap-2 text-lg">
            <div className="flex gap-2 items-center">
              <Avatar>
                <AvatarFallback style={{ background: COLOR }}>
                  {sourceInvoiceId ? getInitials(customerName) : "NA"}
                </AvatarFallback>
              </Avatar>
              {sourceInvoiceId ? (
                <div>
                  <p>{customerName}</p>
                  <CardDescription>{`Invoice NO: ${sourceInvoiceId}`}</CardDescription>
                  <CardDescription>{`Issued Time : ${convertArrayToISOFormat(purchaseDate)}`}</CardDescription>
                </div>
              ) : (
                <p>Please select invoice</p>
              )}
            </div>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-5 shadow-sm pt-0">
        <div className="flex flex-col">
          <div className="mt-5">
            <div className="d-flex align justify-between">
              <p className="text-sm text-gray-500">Return Amount: </p>
              <AmountCard
                amount={returnAmount ? parseFloat(returnAmount.toFixed(2)) : 0}
                color="#FFAAAA"
              />
            </div>
            <div className="d-flex align justify-between mt-2">
              <p className="text-sm text-gray-500">Purchase Amount: </p>
              <AmountCard
                amount={parseFloat(totalWithVat.toFixed(2))}
                color="#B4E380"
              />
            </div>
            <hr className="mt-4 mb-4" />
            <div className="d-flex align justify-between">
              <p className="text-sm text-gray-500">Cashback Amount: </p>
              <AmountCard
                amount={
                  sourceInvoiceId === undefined ||
                  sourceInvoiceId.split("-")[1] === "CRE"
                    ? 0
                    : returnAmount - totalWithVat
                }
                color="#FFAAAA"
              />
            </div>
            {((sourceInvoiceId !== undefined &&
              sourceInvoiceId.split("-")[1] === "CRE") ||
              returnAmount - totalWithVat < 0) && (
              <div className="error-message fade-in mt-4">
                <span className="error-message-icon">⚠️</span>
                {`${
                  sourceInvoiceId !== undefined &&
                  sourceInvoiceId.split("-")[1] === "CRE"
                    ? "Cashback is not allowed for credit invoices."
                    : "Customer exchange exceeds cashback limit; do not issue cash back."
                }`}
              </div>
            )}

            <hr className="mt-4 mb-4" />
            {sourceInvoiceId !== undefined &&
              sourceInvoiceId.split("-")[1] === "CRE" && (
                <div className="d-flex align justify-between">
                  <p className="text-md text-gray-500">Is credit invoice?</p>
                  <Switch
                    defaultChecked
                    onCheckedChange={(checked) =>
                      setNewInvoiceType(checked ? "CRE" : "CASH")
                    }
                  />
                </div>
              )}
          </div>
        </div>

        <div className="flex justify-start text-left mt-8">
          <div className="text-left">
            <p className="text-lg font-semibold bg-slate-200 text-slate-900 pl-4 pt-2 pb-2 pr-4 rounded-md">
              NET PAID : LKR {netPaidAmount ? netPaidAmount.toFixed(2) : 0}
            </p>
            <div className="d-flex">
              <Button
                className="mt-4 mb-3"
                onClick={() => printAndSaveInvoice()}
              >
                <Printer className={"mr-2"} />
                Print Invoice
              </Button>
              <Button
                className="mt-4 mb-3 bg-red-400 ml-2 text-white"
                onClick={cancelReturn}
              >
                <Delete className={"mr-2"} /> Cancel
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Summary;
