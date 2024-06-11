import React, {useEffect, useMemo} from "react";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Delete, Printer} from "lucide-react";
import useInvoiceStore from "../context/useCashInvoiceStore";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import {useToast} from "@/components/ui/use-toast.ts";
import {CashInvoiceService} from "@/service/invoice/cashInvoiceApi.ts";
import {OptionalLabel} from "@/components/formElements/FormLabel.tsx";

const BillSummary = () => {
    const {
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
    } = useInvoiceStore();

    const axiosPrivate = useAxiosPrivate();
    const cashInvoiceService = new CashInvoiceService(axiosPrivate);

    /*
      const subtotal = invoiceItemDTOList.reduce(
          (acc: any, item: any) => acc + item.quantity * item.price - item.quantity * item.discount,
          0
      );

      const discountedTotal = subtotal - (discountAmount || 0);
      const totalWithVat = discountedTotal + (vatAmount || 0);
      // setTotalPrice(totalWithVat);
  */
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
        setTotalPrice(totalWithVat);
    }, [totalWithVat, setTotalPrice]);

    const handleDiscountPercentageChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const percentage = Math.max(parseFloat(e.target.value), 0);
        setDiscountPercentage(percentage);
        setDiscountAmount((subtotal * percentage) / 100);
    };

    const handleDiscountAmountChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const amount = Math.max(parseFloat(e.target.value), 0);
        setDiscountAmount(amount);
        setDiscountPercentage((amount / subtotal) * 100);
    };

    const handleVatPercentageChange = (
        e: React.ChangeEvent<HTMLInputElement>,
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

    const {toast} = useToast();

    async function printAndSaveInvoice() {
        if (invoiceItemDTOList.length === 0) {
            return toast({
                title: "No items added to the invoice",
                description: "",
                variant: "destructive",
            });
        }

        try {
            const requestData = getRequestData();
            console.log(requestData);
            const createdInvoice =
                await cashInvoiceService.createCashInvoice(requestData);
            console.log("Cash invoice created:", createdInvoice);
            // Handle success response, such as printing the invoice or displaying a success message
        } catch (error) {
            console.error("Error creating cash invoice:", error);
            // Handle error
        }
    }

    return (
        <Card>
            <CardContent className="p-5 shadow-sm pt-0">
                <h3 className="text-2xl font-semibold leading-none tracking-tight mb-4">
                    Bill Summary
                </h3>
                <div className="mt-8">
                    <div className="d-flex justify-between mb-4">
                        <Label>Discount (%)</Label>
                        <Input
                            style={{
                                maxWidth: "100px",
                                textAlign: "right",
                                padding: 2,
                                maxHeight: 30,
                            }}
                            type="number"
                            value={discountPercentage}
                            onChange={handleDiscountPercentageChange}
                            min={0}
                            max={100}
                        />
                    </div>
                    <div className="d-flex justify-between mb-4">
                        <Label>Discount Amount (LKR)</Label>
                        <Input
                            style={{
                                maxWidth: "100px",
                                textAlign: "right",
                                padding: 2,
                                maxHeight: 30,
                            }}
                            type="number"
                            value={discountAmount}
                            onChange={handleDiscountAmountChange}
                        />
                    </div>
                    <div className="d-flex justify-between mb-4">
                        <Label>VAT Percentage (%)</Label>
                        <Input
                            style={{
                                maxWidth: "100px",
                                textAlign: "right",
                                padding: 2,
                                maxHeight: 30,
                            }}
                            type="number"
                            value={vatPercentage}
                            onChange={handleVatPercentageChange}
                            min={0}
                            max={100}
                        />
                    </div>
                    <div className="d-flex justify-between mb-4">
                        <Label>VAT Amount (LKR)</Label>
                        <Input
                            style={{
                                maxWidth: "100px",
                                textAlign: "right",
                                padding: 2,
                                maxHeight: 30,
                            }}

                            type="number"
                            value={vatAmount}
                            onChange={handleVatAmountChange}
                        />
                    </div>

                </div>
                <div className="flex justify-start text-left mt-16">
                    <div className="text-left">
                        <p className="text-xl font-semibold bg-slate-200 text-slate-900 pl-4 pt-2 pb-2 pr-4 rounded-md">
                            Total : LKR {totalWithVat.toFixed(2)}
                        </p>
                        <div className="d-flex">
                            <Button
                                className="mt-4 mb-3"
                                onClick={() => printAndSaveInvoice()}
                            >
                                <Printer className={"mr-2"}/>
                                Print Invoice
                            </Button>
                            <Button
                                className="mt-4 mb-3 bg-red-400 ml-2 text-white">
                                <Delete className={"mr-2"}/> Cancel
                            </Button>
                        </div>

                    </div>

                </div>
            </CardContent>
        </Card>
    );
};

export default BillSummary;
