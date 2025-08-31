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
import { CircleAlert, Coins, CreditCard, Delete, Printer } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import useReturnInvoiceStore from "./context/useReturnInvoiceStore";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import dateArrayToString from "@/utils/dateArrayToString";
import { Option } from "@/types/returns/returnsTypes";
import IconRadioGroup from "./components/IconRadioGroup";
import IconCash from "@/components/icon/IconCash";
import { Label } from "@/components/ui/label";
import CurrencyComponent from "../invoice/view/components/CurrencyComponent";
import ReturnPopup from "./components/ReturnPopup";

const COLOR = getRandomColor();

const Summary = ({
  creditorSelectKey,
  setCreditorSelectKey,
  isDataLoading,
}: {
  creditorSelectKey: number;
  setCreditorSelectKey: React.Dispatch<React.SetStateAction<number>>;
  isDataLoading: boolean;
}) => {
  const {
    customerName,
    sourceInvoiceId,
    invoiceItemDTOList,
    discountAmount,
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
    newInvoiceType,
    returnType,
    remainingDue,
    cashBackAmount,
    setReturnType,
    returnDiscountPercentage,
    returnVatPercentage,
    returnItemValue,
    discountForSelectedReturnItems,
    vatForSelectedReturnItems,
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
      0,
    );
  }, [invoiceItemDTOList]);

  const discountedTotal = useMemo(
    () => subtotal - (discountAmount || 0),
    [subtotal, discountAmount],
  );
  const totalWithVat = useMemo(
    () => discountedTotal + (vatAmount || 0),
    [discountedTotal, vatAmount],
  );

  // Update the total price when discountedTotal or vatAmount changes
  useEffect(() => {
    setNetPaidAmount(totalWithVat - returnAmount + remainingDue);
    console.log("Net Paid Amount: ", returnAmount - totalWithVat);
  }, [totalWithVat, setNetPaidAmount, returnAmount, remainingDue]);

  useEffect(() => {
    setTotalPrice(totalWithVat);
  }, [totalWithVat, setTotalPrice]);

  const { toast } = useToast();

  const options: Option[] = [
    { id: "cash", icon: Coins, label: "Cash" },
    { id: "credit", icon: CreditCard, label: "Credit" },
  ];

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handlePrintInvoice = () => {
    setIsPopupOpen(true);
  };

  const handleProceed = (cashbackOption?: string) => {
    console.log("Proceeding with cashback option:", cashbackOption);
    setTimeout(() => {
      setIsPopupOpen(false);
    }, 3000); // Close the popup after 3 seconds to simulate API call
  };

  useEffect(() => {
    if (totalWithVat === 0) {
      if (cashBackAmount !== 0) {
        setReturnType("CASHBACK");
      } else {
        setReturnType("BALANCED");
      }
    } else {
      if (cashBackAmount !== 0) {
        setReturnType("PARTIAL");
      } else {
        setReturnType("EXCHANGE");
      }
    }
  }, [totalWithVat, netPaidAmount, cashBackAmount, setReturnType]);

  useEffect(() => {
    console.log(
      "Discount for selected return items: ",
      discountForSelectedReturnItems,
    );
    console.log("VAT for selected return items: ", vatForSelectedReturnItems);
  }, [discountForSelectedReturnItems, vatForSelectedReturnItems]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div>
          <CardTitle className="group flex items-center gap-2 text-lg w-full">
            {sourceInvoiceId ? (
              <div className="flex-row gap-5 items-center">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="size-7">
                    <AvatarFallback
                      style={{ background: COLOR }}
                      className="text-xs"
                    >
                      {customerName ? getInitials(customerName) : "AN"}
                    </AvatarFallback>
                  </Avatar>
                  <p>{customerName ? customerName : "Anonymous Customer"}</p>
                </div>
                <div>
                  <CardDescription className="flex gap-2">
                    <p>InvoiceNO:</p>
                    <Badge className="rounded-sm" variant="default">
                      {sourceInvoiceId}
                    </Badge>
                  </CardDescription>
                  <CardDescription>{`Issued At: ${dateArrayToString(purchaseDate, false, false)}`}</CardDescription>
                </div>
              </div>
            ) : (
              <div className="flex w-full gap-3 items-center justify-center">
                <CircleAlert className="text-yellow-500 size-8" />
                <p className="w-full text-sm">
                  Please select invoice to continue
                </p>
              </div>
            )}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-5 shadow-sm pt-0">
        <div className="flex flex-col">
          <div className="mt-5">
            <div className="d-flex align justify-between">
              <p className="text-sm text-gray-500">Return Item(s) Value: </p>
              <AmountCard
                amount={
                  returnItemValue ? parseFloat(returnItemValue.toFixed(2)) : 0
                }
                color="#ffffffff"
                fontStyle="font-semibold"
              />
            </div>
            <div className="d-flex align justify-between mt-1">
              <p className="text-sm text-gray-500">
                Discount({returnDiscountPercentage}%):{" "}
              </p>
              <AmountCard
                amount={
                  discountForSelectedReturnItems
                    ? parseFloat(discountForSelectedReturnItems.toFixed(2))
                    : 0
                }
                color="#ffffffff"
                fontStyle="font-semibold"
                minus={true}
              />
            </div>
            <div className="d-flex align justify-between mt-1">
              <p className="text-sm text-gray-500">
                VAT({returnVatPercentage}%):{" "}
              </p>
              <AmountCard
                amount={
                  vatForSelectedReturnItems
                    ? parseFloat(vatForSelectedReturnItems.toFixed(2))
                    : 0
                }
                color="#ffffffff"
                fontStyle="font-semibold"
              />
            </div>
            <div className="d-flex align justify-between mt-1">
              <p className="text-sm text-gray-500">Total Return: </p>
              <AmountCard
                amount={returnAmount ? parseFloat(returnAmount.toFixed(2)) : 0}
                color="#FFAAAA"
                fontStyle="font-semibold"
              />
            </div>
            <hr className="mt-4 mb-4" />
            <div className="d-flex align justify-between mt-2">
              <p className="text-sm text-gray-500">Purchase Amount: </p>
              <AmountCard
                amount={parseFloat(totalWithVat.toFixed(2))}
                color="#B4E380"
                fontStyle="font-semibold"
              />
            </div>
            <hr className="mt-4 mb-4" />
            <div className="d-flex align justify-between mb-2">
              <p className="text-sm text-gray-500">Remaining Due: </p>
              <AmountCard
                amount={remainingDue < 0 ? 0 : remainingDue}
                color="#FFAAAA"
                fontStyle="font-semibold"
              />
            </div>
            <div className="d-flex align justify-between">
              <p className="text-sm text-gray-500">Cashback Amount: </p>
              <AmountCard
                amount={cashBackAmount}
                color="#80CFE3"
                fontStyle="font-semibold"
              />
            </div>
            {/* {((sourceInvoiceId !== undefined) &&
              returnAmount - totalWithVat < 0) && (
              <div className="error-message fade-in mt-4">
                <span className="error-message-icon">⚠️</span>
                {`${
                  "Customer exchange exceeds cashback limit; do not issue cash back."
                }`}
              </div>
            )} */}
            <hr className="mt-4 mb-4" />
            <div className="d-flex align justify-between mt-2">
              <p className="text-sm text-gray-500">Return Type: </p>
              <Badge
                className="rounded-sm"
                variant="secondary"
                color="bg-blue-500"
              >
                {returnType}
              </Badge>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="text-right flex-col gap-10 bg-slate-100 rounded-md p-4">
            <div className="flex justify-between">
              <Label className="text-lg text-left ">Net Total</Label>
              <div className="flex items-center">
                {/* <IconCash className="" color="gray" /> */}
                {netPaidAmount < 0 ? (
                  <Badge className="rounded-sm bg-red-500" variant="default">
                    Cash Out
                  </Badge>
                ) : (
                  <Badge className="rounded-sm bg-green-500" variant="default">
                    Cash In
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex justify-between">
              <p className="text-2xl font-thin align-bottom">Rs.</p>
              {/* <p className="text-4xl font-semibold">{total}</p> */}
              <CurrencyComponent
                amount={
                  netPaidAmount ? parseFloat(netPaidAmount.toFixed(2)) : 0
                }
                currency="LKR"
                withoutCurrency
                mainTextSize="text-2xl"
                subTextSize="text-sm"
              />
            </div>
          </div>
          <div className="d-flex justify-between mt-4">
            <Button
              className="w-full mt-4 mb-3"
              onClick={handlePrintInvoice}
              disabled={
                sourceInvoiceId === undefined ||
                sourceInvoiceId === null ||
                returnAmount === 0
              }
            >
              Create Return
            </Button>
            <Button
              className="mt-4 mb-3 bg-red-400 ml-2 text-white"
              onClick={cancelReturn}
            >
              <Delete className={"mr-2"} /> Clear
            </Button>

            <ReturnPopup
              isOpen={isPopupOpen}
              onClose={() => setIsPopupOpen(false)}
              onProceed={handleProceed}
              invoiceType="CASH"
              creditorSelectKey={creditorSelectKey}
              setCreditorSelectKey={setCreditorSelectKey}
              netPaidAmount={netPaidAmount}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Summary;
