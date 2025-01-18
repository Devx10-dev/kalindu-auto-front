import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  CreditCard,
  Coins,
  CheckCircle,
  Smartphone,
  Laptop,
  Tablet,
  Monitor,
  Landmark,
  Banknote,
  Save,
} from "lucide-react";
import IconRadioGroup from "./IconRadioGroup";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/utils/string";
import { Badge } from "@/components/ui/badge";
import { CardDescription } from "@/components/ui/card";
import AmountCard from "@/components/card/AmountCard";
import useReturnInvoiceStore from "../context/useReturnInvoiceStore";
import InlineIconRadioGroup from "./InlineIconRadioGroup";
import MultiSelectPriceInput from "./MultiSelectPriceInput";
import { toast } from "@/components/ui/use-toast";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import { ReturnService } from "@/service/return/ReturnService";
import CurrencyComponent from "../../invoice/view/components/CurrencyComponent";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InvoiceState } from "@/types/returns/returnsTypes";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";

interface ReturnPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: (
    cashbackType: string,
    paymentDetails: { [key: string]: number | null },
  ) => void;
  invoiceType: string;
  creditorSelectKey: number;
  setCreditorSelectKey: React.Dispatch<React.SetStateAction<number>>;
  netPaidAmount?: number;
}

const ReturnPopup: React.FC<ReturnPopupProps> = ({
  isOpen,
  onClose,
  onProceed,
  invoiceType,
  creditorSelectKey,
  setCreditorSelectKey,
  netPaidAmount,
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPaymentStep, setShowPaymentStep] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<{
    [key: string]: number | null;
  }>({});
  const [createResponse, setCreateResponse] = useState<InvoiceState | null>(
    null,
  );
  const [invoiceNavigation, setInvoiceNavigation] = useState<boolean>(false);

  const {
    customerName,
    sourceInvoiceId,
    invoiceItemDTOList,
    discountAmount,
    vatAmount,
    returnAmount,
    totalPrice,
    returnType,
    cashbackType,
    setCashbackType,
    selectedInvoiceType,
    newInvoiceType,
    setNewInvoiceType,
    getRequestData,
    resetState,
    payments,
    setPayments,
    cashBackAmount,
    remainingDue,
  } = useReturnInvoiceStore();

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

  const paymentDifference = useMemo(() => {
    return Math.max(0, totalWithVat - returnAmount + remainingDue);
  }, [totalWithVat, returnAmount, remainingDue]);

  useEffect(() => {
    if (isOpen) {
      setShowConfirmation(false);
      setShowSuccess(false);
      setShowPaymentStep(false);
      setPaymentDetails({});
      setInvoiceNavigation(false);
      setCreateResponse(null);
    }
  }, [isOpen]);

  const handleProceed = () => {
    if (
      (returnType === "CASHBACK" || returnType === "PARTIAL") &&
      !cashbackType
    ) {
      //   alert('Please select a cashback option');
      toast({
        title: "Invalid return details",
        description:
          "Please select a cashback option! This will determine how the return amount will be processed.",
        variant: "destructive",
      });
      return;
    }
    if (returnType === "PARTIAL" && !returnAmount) {
      //   alert('Please enter the return amount');
      toast({
        title: "Invalid return details",
        description:
          "Please enter the return amount! This will determine the amount to be returned to the customer.",
        variant: "destructive",
      });
      return;
    }
    if (returnType === "EXCHANGE" && !newInvoiceType) {
      alert("Please select a new invoice type");
      toast({
        title: "Invalid return details",
        description:
          "Please select a new invoice type! This will determine how the return amount will be processed.",
        variant: "destructive",
      });
      return;
    }
    if (returnType === "EXCHANGE" && paymentDifference > 0) {
      setShowPaymentStep(true);
    } else {
      setShowConfirmation(true);
    }
  };

  const handlePaymentProceed = () => {
    const totalPayment = Object.values(paymentDetails).reduce(
      (sum, value) => sum + (value || 0),
      0,
    );
    if (totalPayment !== paymentDifference) {
      //   alert('The total payment must equal the payment difference');
      toast({
        title: "Invalid payment details",
        description:
          "The total payment must equal the payment difference! Please adjust the payment amounts.",
        variant: "destructive",
      });
      return;
    }
    setShowPaymentStep(false);
    setShowConfirmation(true);
  };

  const queryClient = useQueryClient();
  const createReturnMutation = useMutation({
    mutationFn: (requestData: InvoiceState) =>
      returnInvoiceService.createReturnInvoice(requestData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["returns"] });
      toast({
        title: "Invoice created successfully",
        description: "The cash invoice has been created and printed.",
        variant: "default",
      });
      setShowConfirmation(false);
      setShowSuccess(true);
      cancelReturn();
    },
    onError: (data) => {
      toast({
        title: "Error creating return",
        description: "Failed to create the Return. Please try again.",
        variant: "destructive",
      });
    },
  });

  const cashbackOptions = [
    {
      id: "CASHBACK",
      icon: Coins,
      label: "Cash Out",
      disabled: false,
    },
    {
      id: "ACCOUNT_CREDIT",
      icon: CreditCard,
      label: "Refund to Credit Account",
      disabled: selectedInvoiceType === "CASH",
    },
  ];

  const exchangeInvoiceOptions = [
    {
      id: "CASH",
      icon: Coins,
      label: "Cash Invoice",
      disabled: false,
    },
    {
      id: "CRE",
      icon: CreditCard,
      label: "Credit Invoice",
      disabled: selectedInvoiceType === "CASH",
    },
  ];

  const paymentOptions = [
    { id: "CASH", icon: Banknote, label: "Cash" },
    { id: "DEPOSIT", icon: Landmark, label: "Deposit" },
    {
      id: "CREDIT",
      icon: CreditCard,
      label: "Credit",
      disabled: newInvoiceType === "CASH",
    },
  ];

  const axiosPrivate = useAxiosPrivate();
  const returnInvoiceService = new ReturnService(axiosPrivate);

  const cancelReturn = () => {
    resetState();
    setCreditorSelectKey(creditorSelectKey + 1);
  };

  async function handleConfirm() {
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

      const createdInvoice =
        await createReturnMutation.mutateAsync(requestData);
      setCreateResponse(createdInvoice);
    } catch (error) {
      toast({
        title: "Error creating invoice",
        description: "Failed to create the cash invoice. Please try again.",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    if (paymentDetails) {
      let payments = Object.entries(paymentDetails).map(([method, amount]) => {
        if (amount > 0) {
          return { paymentType: method, amount: amount };
        }
      });
      payments = payments.filter((payment) => payment !== undefined);
      setPayments(payments);
    }
  }, [paymentDetails]);

  useEffect(() => {
    setNewInvoiceType(selectedInvoiceType === "CASH" ? "CASH" : "CRE");
  }, [selectedInvoiceType, setNewInvoiceType]);

  const navigate = useNavigate();

  const handlePrint = () => {
    if (createResponse) {
      if (
        !createResponse.returnedCreditInvoice &&
        createResponse.returnedInvoice
      ) {
        navigate(
          `/dashboard/invoice/cash/${createResponse.creditInvoice.invoiceId}`,
        );
      } else if (
        !createResponse.returnedInvoice &&
        createResponse.returnedCreditInvoice
      ) {
        navigate(
          `/dashboard/invoice/creditor/${createResponse.creditInvoice.invoiceId}`,
        );
      }
    }
  };

  useEffect(() => {
    if (createResponse) {
      if (
        createResponse.returnType === "PARTIAL" ||
        createResponse.returnType === "EXCHANGE"
      ) {
        setInvoiceNavigation(true);
      }
    }
  }, [createResponse, invoiceNavigation]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={true}>
      <DialogContent
        className="sm:max-w-[800px] max-w-[95vw] max-h-[90vh] overflow-y-auto py-0"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader className="text-center sticky top-0 z-100 bg-white py-5">
          <DialogTitle className="">
            {!showConfirmation &&
              !showSuccess &&
              !showPaymentStep &&
              "Return Confirmation"}
            {showConfirmation && "Confirm Return"}
            {showPaymentStep && "Additional Payment Required"}
          </DialogTitle>
        </DialogHeader>
        {!showSuccess && (
          <div className="grid p-4 border border-muted-gray bg-muted-background rounded-md w-full">
            <div className="grid grid-cols-3 gap-2 w-full h-full">
              {/* <div className='flex flex-row gap-10 col-span-3 row-span-1 '> */}
              {/* <div className="flex flex-col gap-1 col-span-1">
                        <p className="text-sm text-muted-foreground">Customer</p>
                        <div className="flex items-center gap-2 mb-2">
                            <Avatar className="size-7">
                            <AvatarFallback className="text-xs">
                                {customerName ? getInitials(customerName) : "AN"}
                            </AvatarFallback>
                            </Avatar>
                            <p>{customerName ? customerName : "Anonymous Customer"}</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 col-span-2">
                        <p className="text-sm text-muted-foreground">Invoice</p>
                        <CardDescription className="flex gap-2"><Badge className="rounded-sm" variant="default">{sourceInvoiceId}</Badge></CardDescription>
                    </div> */}
              {/* </div> */}
              {/* <div className="flex flex-col col-span-1 gap-1">
                    <p className="text-sm text-muted-foreground">Return Type</p>
                    <CardDescription className="flex gap-2"><Badge className="rounded-sm" variant="secondary">{returnType}</Badge></CardDescription>
                </div> */}
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground">Returned Amount</p>
                <AmountCard
                  amount={
                    returnAmount ? parseFloat(returnAmount.toFixed(2)) : 0
                  }
                  color="#FFAAAA"
                  fontStyle="font-semibold"
                  withoutCurrency={false}
                />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground">Remaining Due</p>
                <AmountCard
                  amount={
                    remainingDue ? parseFloat(remainingDue.toFixed(2)) : 0
                  }
                  color="#FFAAAA"
                  fontStyle="font-semibold"
                  withoutCurrency={false}
                />
              </div>
              <div className="text-right flex-row gap-10 bg-slate-100 rounded-md p-4 w-full row-span-2 ">
                <div className="flex flex-col gap-1 justify-between h-full">
                  <div className="flex justify-between">
                    <Label className="text-lg text-left ">Net Total</Label>
                    <div className="flex items-center">
                      {/* <IconCash className="" color="gray" /> */}
                      {netPaidAmount < 0 ? (
                        <Badge
                          className="rounded-sm bg-red-500"
                          variant="default"
                        >
                          Cash Out
                        </Badge>
                      ) : (
                        <Badge
                          className="rounded-sm bg-green-500"
                          variant="default"
                        >
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
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground">
                  Amount Purchased
                </p>
                <AmountCard
                  amount={parseFloat(totalWithVat.toFixed(2))}
                  color="#B4E380"
                  fontStyle="font-semibold"
                  withoutCurrency={false}
                />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground">Cash Back</p>
                <AmountCard
                  amount={cashBackAmount}
                  color="#80CFE3"
                  fontStyle="font-semibold"
                  withoutCurrency={false}
                />
              </div>
              {/* <Separator className='col-span-3 my-3'/> */}
            </div>
          </div>
        )}
        {!showConfirmation && !showSuccess && !showPaymentStep && (
          <>
            {(returnType === "CASHBACK" || returnType === "PARTIAL") && (
              <div className="flex flex-col gap-2 justify-between items-right">
                <div className="flex flex-col gap-2">
                  <Label>Select Cashback Option:</Label>
                  <p className="text-md text-muted-foreground">
                    Please select a cashback option. This will determine how the
                    return amount will be processed.
                  </p>
                </div>
                <InlineIconRadioGroup
                  options={cashbackOptions}
                  value={cashbackType}
                  onChange={setCashbackType}
                  size="sm"
                />
                <p className="text-sm text-muted-foreground">
                  {cashbackType === "CASHBACK" && (
                    <span>
                      Info: Cash out the return amount to the customer.
                    </span>
                  )}
                  {cashbackType === "ACCOUNT-CREDIT" && (
                    <span>
                      Info: Refund the return amount to the customer's credit
                      account.
                    </span>
                  )}
                </p>
              </div>
            )}
            {(returnType === "EXCHANGE" || returnType === "PARTIAL") && (
              <div className="flex flex-col gap-2 justify-between items-right">
                <div className="flex flex-col gap-2">
                  <Label>Select Returning Invoice Type</Label>
                  <p className="text-md text-muted-foreground">
                    Please select a new invoice type for the customer. This will
                    determine how the exchange items will be processed.
                  </p>
                </div>
                <InlineIconRadioGroup
                  options={exchangeInvoiceOptions}
                  value={newInvoiceType}
                  onChange={setNewInvoiceType}
                  size="sm"
                />
                <p className="text-sm text-muted-foreground">
                  {newInvoiceType === "CASH" && (
                    <span>
                      Info: Create a new cash invoice for the exchange.
                    </span>
                  )}
                  {newInvoiceType === "CRE" && (
                    <span>
                      Info: Create a new credit invoice for the exchange.
                    </span>
                  )}
                </p>
              </div>
            )}
            {returnType === "BALANCED" && (
              <div className="flex flex-col gap-2 justify-between items-right">
                <div className="flex flex-col gap-2">
                  <Label>Return is Balanced</Label>
                  <p className="text-md text-muted-foreground">
                    The return amount is balanced with the remaining due amount.
                    No additional payment required and no cashback is done.
                  </p>
                </div>
              </div>
            )}

            {/* <DialogFooter className=''>
              <Button onClick={onClose} variant="outline">Cancel</Button>
              <Button onClick={handleProceed}>Proceed</Button>
            </DialogFooter> */}
          </>
        )}
        {showPaymentStep && (
          <>
            <div className="pb-4">
              <div className="flex-row justify-between items-center">
                <p className="mb-4">Please select the payment method:</p>
              </div>
              <div className="relative">
                <MultiSelectPriceInput
                  options={paymentOptions}
                  onChange={setPaymentDetails}
                  size="sm"
                  totalAmount={paymentDifference}
                />
              </div>
            </div>
            {/* <DialogFooter>
              <Button onClick={() => setShowPaymentStep(false)} variant="outline">Back</Button>
              <Button onClick={handlePaymentProceed}>Proceed to Confirmation</Button>
            </DialogFooter> */}
          </>
        )}
        {showConfirmation && (
          <>
            <div className="py-4">
              <div className="mt-4 p-4 border border-muted-gray bg-muted-background rounded-md">
                <h4 className="font-semibold mb-2">Selected Options:</h4>
                {returnType === "CASHBACK" && (
                  <p>
                    <strong>Cashback Method:</strong>{" "}
                    {cashbackType === "CASHBACK"
                      ? "Cash Out"
                      : "Refund to Credit Account"}
                  </p>
                )}
                {returnType === "PARTIAL" && (
                  <>
                    <p>
                      <strong>Partial Return Amount:</strong> Rs.{" "}
                      {returnAmount.toFixed(2)}
                    </p>
                    <p>
                      <strong>Cashback Method:</strong>{" "}
                      {cashbackType === "CASHBACK"
                        ? "Cash Out"
                        : "Refund to Credit Account"}
                    </p>
                  </>
                )}
                {returnType === "EXCHANGE" && (
                  <>
                    <p>
                      <strong>New Invoice Type:</strong>{" "}
                      {newInvoiceType === "CASH"
                        ? "Cash Invoice"
                        : "Credit Invoice"}
                    </p>
                    {paymentDifference > 0 && (
                      <>
                        <p>
                          <strong>Additional Payment Required:</strong> Rs.{" "}
                          {paymentDifference.toFixed(2)}
                        </p>
                        <p>
                          <strong>Payment Methods:</strong>
                        </p>
                        <ul className="list-disc list-inside">
                          {Object.entries(paymentDetails).map(
                            ([method, amount]) => (
                              <li key={method}>
                                {method}: Rs. {amount?.toFixed(2)}
                              </li>
                            ),
                          )}
                        </ul>
                      </>
                    )}
                  </>
                )}
                {returnType === "BALANCED" && (
                  <p>
                    Return amount is balanced with the remaining due amount. No
                    additional payment required and no cashback is done
                  </p>
                )}
              </div>
              <p className="font-semibold mt-4">
                Are you sure you want to process this return?
              </p>
            </div>
            {/* <DialogFooter>
              <Button onClick={() => setShowConfirmation(false)} variant="outline">Back</Button>
              <Button onClick={handleConfirm}>Complete</Button>
            </DialogFooter> */}
          </>
        )}
        {showSuccess && (
          <>
            <div className="py-4 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4 animate-bounce" />
              <p className="text-xl font-bold">Return Created Successfully!</p>
            </div>
          </>
        )}

        {/* Get all the fotterls to single component */}
        {!showConfirmation && !showSuccess && !showPaymentStep && (
          <DialogFooter className="sticky bottom-0 z-100 bg-white py-5">
            <div className="flex flex-row w-full justify-end gap-3">
              <Button
                onClick={onClose}
                variant="destructive"
                className="bg-red-400"
              >
                Cancel
              </Button>
              <Button onClick={handleProceed}>Next</Button>
            </div>
          </DialogFooter>
        )}
        {showPaymentStep && (
          <DialogFooter className="sticky bottom-0 z-100 bg-white py-5">
            <Button onClick={() => setShowPaymentStep(false)} variant="outline">
              Back
            </Button>
            <Button onClick={handlePaymentProceed}>
              Proceed to Confirmation
            </Button>
          </DialogFooter>
        )}
        {showConfirmation && (
          <DialogFooter className="sticky bottom-0 z-100 bg-white py-5">
            <Button
              onClick={() => setShowConfirmation(false)}
              variant="outline"
              disabled={createReturnMutation.isPending}
            >
              Back
            </Button>

            <Button
              onClick={handleConfirm}
              disabled={createReturnMutation.isPending}
            >
              {createReturnMutation.isPending ? (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {createReturnMutation.isPending ? "Creating..." : "Complete"}
            </Button>
          </DialogFooter>
        )}
        {showSuccess && (
          <DialogFooter className="sticky bottom-0 z-100 bg-white py-5">
            {invoiceNavigation && (
              <Button onClick={handlePrint}>View & Print Invoice</Button>
            )}
            <Button
              onClick={() => {
                cancelReturn();
                onClose();
              }}
              variant="destructive"
              className="bg-red-400"
            >
              Close
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReturnPopup;
