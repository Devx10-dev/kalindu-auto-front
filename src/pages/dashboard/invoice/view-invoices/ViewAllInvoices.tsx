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

export function ViewAllInvoices() {

    // export type Invoice = {
    //     id?: number;
    //     invoiceNo?: string;
    //     customerName?: string;
    //     customerId?: number;
    //     invoiceDate?: string;
    //     dueDate?: string;
    //     totalAmount?: number;
    //     status?: string;
    // };
    

     // Arrat of vehicle models
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
    ];

   

    // different more realistic data mix paid unpaid and use different names
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
        <Tabs defaultValue="cash" className="w-[100%]">
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
            <TabsContent value="cash">
                <InvoiceTable invoices={invoices} />
            </TabsContent>
            <TabsContent value="creditor">
                <InvoiceTable invoices={invoices2} />
            </TabsContent>
            <TabsContent value="dummy">
                <InvoiceTable invoices={invoices} />
            </TabsContent>
        </Tabs>
    </Fragment>
  )
}
