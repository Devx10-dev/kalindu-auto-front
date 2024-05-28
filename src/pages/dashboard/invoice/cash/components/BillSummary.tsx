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
            (acc:any, item:any) => acc + item.quantity * item.price - item.quantity * item.discount,
            0
        );
    }, [invoiceItemDTOList]);

    const discountedTotal = useMemo(() => subtotal - (discountAmount || 0), [subtotal, discountAmount]);
    const totalWithVat = useMemo(() => discountedTotal + (vatAmount || 0), [discountedTotal, vatAmount]);

    // Update the total price when discountedTotal or vatAmount changes
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
            const createdInvoice = await cashInvoiceService.createCashInvoice(requestData);
            console.log("Cash invoice created:", createdInvoice);
            // Handle success response, such as printing the invoice or displaying a success message
        } catch (error) {
            console.error("Error creating cash invoice:", error);
            // Handle error
        }
    }

    return (
        <Card className="w-full">
            <CardContent className="p-3 shadow-sm  bg-slate-200 w-full">
                <h2 className="text-xl font-bold mb-8">Bill Summary</h2>
                <div className="grid grid-cols-7 gap-4">
                    <div className="flex flex-col gap-2">
                        <Label>Discount Percentage (%)</Label>
                        <Input
                            type="number"
                            value={discountPercentage}
                            onChange={handleDiscountPercentageChange}
                            placeholder="Discount Percentage"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>Discount Amount (LKR)</Label>
                        <Input
                            type="number"
                            value={discountAmount}
                            onChange={handleDiscountAmountChange}
                            placeholder="Discount Amount"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>VAT Percentage (%)</Label>
                        <Input
                            type="number"
                            value={vatPercentage}
                            onChange={handleVatPercentageChange}
                            placeholder="VAT Percentage"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>VAT Amount (LKR)</Label>
                        <Input
                            type="number"
                            value={vatAmount}
                            onChange={handleVatAmountChange}
                            placeholder="VAT Amount"
                        />
                    </div>
                    <span className="text-xl bg-slate-200 text-slate-900 p-5 rounded-md">
            Total : LKR {totalWithVat.toFixed(2)}
          </span>
                    <Button
                        className="mt-4 mb-5"
                        onClick={() => printAndSaveInvoice()}
                    >
                        <Printer className={"mr-2"}/> Print Invoice
                    </Button>
                    <Button className="mt-4 mb-5 bg-red-400 ml-2 text-black">
                        <Delete className={"mr-2"}/> Cancel
                    </Button>
                </div>
                <div className="flex justify-start text-left mt-4">
                    <div className="text-left"></div>
                </div>
            </CardContent>
        </Card>
    );
};

export default BillSummary;
