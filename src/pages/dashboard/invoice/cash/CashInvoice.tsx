import InvoiceTable from "./components/InvoiceTable";
import AddItem from "./components/AddItem";
import BillSummary from "./components/BillSummary";
import OutsourcedItemDetails from "./components/OutSourcedItemDetails";
import useCashInvoiceStore from "./context/useCashInvoiceStore";
import CustomerDetails from "@/pages/dashboard/invoice/cash/components/CustomerDetails.tsx";
import Commissions from "@/pages/dashboard/invoice/cash/components/Commisions.tsx";

const CashInvoiceBase: React.FC = () => {
  // const axiosPrivate = useAxiosPrivate();
  const { getOutsourcedItems } = useCashInvoiceStore();
  const hasOutsourcedItems = getOutsourcedItems().length > 0;

  return (
    <div className="mb-20">
      <h2 className="text-2xl font-bold mb-4">Create Cash Invoice</h2>

      <CustomerDetails />
      <AddItem />
      <InvoiceTable />
      <Commissions />
      {hasOutsourcedItems && (
        <div className="pb-[350px]">
          <OutsourcedItemDetails />
        </div>
      )}

      <div className="fixed bottom-0 bg-slate-200 border">
        <BillSummary />
      </div>
    </div>
  );
};

export default CashInvoiceBase;
