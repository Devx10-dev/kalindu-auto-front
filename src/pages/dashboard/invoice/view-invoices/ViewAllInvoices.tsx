import PageHeader from "@/components/card/PageHeader"
import InvoiceIcon from "@/components/icon/InvoiceIcon"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Fragment } from "react/jsx-runtime"
import InvoiceTable from "./components/InvoiceTable"
import { useEffect, useState } from "react"
import { DateRangePicker } from "./components/DateRangePicker"
import { Invoice } from "@/types/Invoices/invoiceTypes"
import useAxiosPrivate from "@/hooks/usePrivateAxios"
import { CashInvoiceService } from "@/service/invoice/cashInvoiceApi"
import { useQuery } from "@tanstack/react-query"
import { InvoiceList, InvoiceState } from "@/types/invoice/cashInvoice"
import Loading from "@/components/Loading"

export function ViewAllInvoices() {

    // active tab state
    const [activeTab, setActiveTab] = useState<string>("cash");
    const [cashInvoices, setCashInvoices] = useState<InvoiceList>({} as InvoiceList);
    const [creditorInvoices, setCreditorInvoices] = useState<Invoice[]>([]);
    const [dummyInvoices, setDummyInvoices] = useState<Invoice[]>([]);

    const axiosPrivate = useAxiosPrivate();

    const invoiceService = new CashInvoiceService(axiosPrivate);

    const { 
        data: cashInvoiceData,
        isLoading: cashInvoiceLoading,
        error: cashInvoiceError, 
    
    } = useQuery<InvoiceList>({
        queryKey: ["cashInvoices"],
        queryFn: () => invoiceService.fetchCashInvoices(),
        retry: 1,
    });

    useEffect(() => {
        
        if (cashInvoiceLoading) {
            console.log("loading");
        }else{
            console.log("loaded");
        }
    }, [cashInvoices], [cashInvoiceLoading]);

    // on tab change
    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        console.log(tab);
    }

     const invoices = [
        {
            id: 1,
            invoiceNo: "INV-0001",
            customerName: "John Doe",
            customerId: 1,
            invoiceDate: "2021-09-01",
            dueDate: "2021-09-30",
            totalAmount: 10000,
            status: "paid",
        },
        {
            id: 2,
            invoiceNo: "INV-0002",
            customerName: "Jane Doe",
            customerId: 2,
            invoiceDate: "2021-09-01",
            dueDate: "2021-09-30",
            totalAmount: 20000,
            status: "paid",
        },
        {
            id: 3,
            invoiceNo: "INV-0003",
            customerName: "John Doe",
            customerId: 1,
            invoiceDate: "2021-09-01",
            dueDate: "2021-09-30",
            totalAmount: 30000,
            status: "paid",
        },
        {
            id: 4,
            invoiceNo: "INV-0004",
            customerName: "Jane Doe",
            customerId: 2,
            invoiceDate: "2021-09-01",
            dueDate: "2021-09-30",
            totalAmount: 40000,
            status: "paid",
        },
        {
            id: 5,
            invoiceNo: "INV-0001",
            customerName: "John Doe",
            customerId: 1,
            invoiceDate: "2021-09-01",
            dueDate: "2021-09-30",
            totalAmount: 10000,
            status: "paid",
        },
        {
            id: 6,
            invoiceNo: "INV-0002",
            customerName: "Jane Doe",
            customerId: 2,
            invoiceDate: "2021-09-01",
            dueDate: "2021-09-30",
            totalAmount: 20000,
            status: "paid",
        },
        {
            id: 7,
            invoiceNo: "INV-0003",
            customerName: "John Doe",
            customerId: 1,
            invoiceDate: "2021-09-01",
            dueDate: "2021-09-30",
            totalAmount: 30000,
            status: "paid",
        },
        {
            id: 8,
            invoiceNo: "INV-0004",
            customerName: "Jane Doe",
            customerId: 2,
            invoiceDate: "2021-09-01",
            dueDate: "2021-09-30",
            totalAmount: 40000,
            status: "paid",
        },
    ];
    const invoices2 = [
        {
            id: 1,
            invoiceNo: "INV-001",
            customerName: "John Doe",
            customerId: 1,
            invoiceDate: "2021-10-01",
            dueDate: "2021-10-15",
            totalAmount: 2000,
            status: "paid",
        },
        {
            id: 2,
            invoiceNo: "INV-002",
            customerName: "Jane Doe",
            customerId: 2,
            invoiceDate: "2021-10-02",
            dueDate: "2021-10-16",
            totalAmount: 3000,
            status: "unpaid",
        },
        {
            id: 3,
            invoiceNo: "INV-003",
            customerName: "Doe John",
            customerId: 3,
            invoiceDate: "2021-10-03",
            dueDate: "2021-10-17",
            totalAmount: 4000,
            status: "paid",
        },
        {
            id: 4,
            invoiceNo: "INV-004",
            customerName: "Doe Jane",
            customerId: 4,
            invoiceDate: "2021-10-04",
            dueDate: "2021-10-18",
            totalAmount: 5000,
            status: "unpaid",
        },
    ];


        

  return (
    <Fragment>
        <Tabs defaultValue="cash" className="w-[100%]" onValueChange={handleTabChange}>
            <div className="flex justify-between items-center">       
                {/* <h1 className="text-2xl font-semibold">View Invoices</h1> */}
                <CardHeader>
                <PageHeader 
                    title="Invoices"
                    description="All your invoices are listed here."
                    icon= {<InvoiceIcon height="30" width="28" color="#162a3b" />}
                />
                </CardHeader>
                <TabsList className="grid w-[40%] grid-cols-3">
                    {/* <TabsTrigger value="all">All</TabsTrigger> */}
                    <TabsTrigger value="cash">Cash</TabsTrigger>
                    <TabsTrigger value="creditor">Creditor</TabsTrigger>
                    <TabsTrigger value="dummy">Dummy</TabsTrigger>
                </TabsList>
            </div>
            <div
                    className="flex-row gap-3 mb-4 py-1 px-3 space-x-4 h-content-center"
                    style={{
                    borderRadius: "5px",
                    boxShadow:
                        "rgba(255, 255, 255, 0.1) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.20) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
                    }}
            >
                <div className="d-flex gap-3 mb-4">
                <Input type="text" placeholder="Search for Invoices" />
                <DateRangePicker />
                <Button variant={"outline"} >
                    Reset
                </Button>
                <Button variant={"default"}>Filter</Button>
                </div>
            </div>
            <TabsContent value="cash">
                {cashInvoiceLoading ?
                    <Loading />
                    :
                    <InvoiceTable invoices={cashInvoiceData} type="cash" />
                }
            </TabsContent>
            <TabsContent value="creditor">
                {/* <InvoiceTable invoices={invoices2} type="creditor" /> */}
            </TabsContent>
            <TabsContent value="dummy">
                {/* <InvoiceTable invoices={invoices} type="dummy" /> */}
            </TabsContent>
        </Tabs>
    </Fragment>
  )
}
