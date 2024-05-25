import InvoiceTable from "./components/InvoiceTable";
import AddItem from "./components/AddItem";
import BillSummary from "./components/BillSummary";
import OutsourcedItemDetails from "./components/OutSourcedItemDetails";
<<<<<<< HEAD
import CommissionDetails from "./components/CommisionDetails";
=======
// import useAxiosPrivate from "@/hooks/usePrivateAxios";
// import CreditorInvoiceAPI from "./api/cashInvoiceAPI";
import useCashInvoiceStore from "./context/useCashInvoiceStore";
import { useToast } from "@/components/ui/use-toast";
import CustomerDetails from "@/pages/dashboard/invoice/cash/components/CustomerDetails.tsx";
import Commissions from "@/pages/dashboard/invoice/cash/components/Commisions.tsx";

const CreditorInvoiceBase: React.FC = () => {
  // const axiosPrivate = useAxiosPrivate();
  const {
    getOutsourcedItems,
    invoiceItemDTOList,
  } = useCashInvoiceStore();
  const hasOutsourcedItems = getOutsourcedItems().length > 0;
  const { toast } = useToast();
>>>>>>> 1cd666e3224907648aabf4b9a2bc449ca4a2fdc6


  //TODO :: complete this function with the API
  //TODO :: add printing logic here
  function printAndSaveInvoice() {
    if (invoiceItemDTOList.length == 0)
      return toast({
        title: "No items added to the invoice",
        description: "",
        variant: "destructive",
      });

  }

  return (
<<<<<<< HEAD
    <div className="mb-20">
      <CustomerDetails />
      <AddItem />
      <InvoiceTable handleToggleOutsourced={handleToggleOutsourced} />
      <BillSummary />
      <OutsourcedItemDetails
        outsourcedItems={outsourcedItems}
        onCompanyNameChange={handleCompanyNameChange}
        onBuyingPriceChange={handleBuyingPriceChange}
      />
      <CommissionDetails />
    </div>
=======
      <div className="mb-20">
        <h2 className="text-2xl font-bold mb-4">Create Cash Invoice</h2>

        <CustomerDetails />
        <AddItem />

        <InvoiceTable />

        {hasOutsourcedItems && (
            <div className="pb-[350px]">
              <OutsourcedItemDetails />
            </div>
        )}

          <Commissions />

        <div className="fixed bottom-0 bg-slate-200 border">
          <BillSummary printAndSaveInvoice={printAndSaveInvoice} />
        </div>
      </div>
>>>>>>> 1cd666e3224907648aabf4b9a2bc449ca4a2fdc6
  );
};

export default CreditorInvoiceBase;
