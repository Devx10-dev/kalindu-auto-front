import { Button } from "@/components/ui/button";
import { Delete, Printer } from "lucide-react";
import useInvoiceStore from "./context/Store";
import InvoiceTable from "./components/InvoiceTable";
import AddItem from "./components/AddItem";
import CustomerDetails from "./components/CustomerDetails";
import BillSummary from "./components/BillSummary";

const CashInvoice: React.FC = () => {
  // const { items } = useInvoiceStore();

  // const total = items.reduce(
  //   (acc, item) => acc + item.quantity * (item.price-item.discount),
  //   0
  // );

  return (
    <div>
      <CustomerDetails />
      <AddItem />
      <InvoiceTable />
      {/* <div className="flex justify-start text-left">
        <div className="text-left">
          <p className="text-xl bg-slate-200 text-slate-900 p-5 rounded-md">
            Total : {total.toFixed(2)}
          </p>
          <Button className="mt-4 mb-5">
            <Printer className={"mr-2"} />
            Print Invoice
          </Button>
          <Button className="mt-4 mb-5 bg-red-500 ml-2">
            <Delete className={"mr-2"} />
            Cancel
          </Button>
        </div>
      </div> */}
      <BillSummary />
    </div>
  );
};

export default CashInvoice;
