import InvoiceTable from "./components/InvoiceTable";
import AddItem from "./components/AddItem";
import BillSummary from "./components/BillSummary";
import OutsourcedItemDetails from "./components/OutSourcedItemDetails";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import CreditorInvoiceAPI from "./api/creditorInvoiceAPI";
import { useQuery } from "@tanstack/react-query";
import Select from "react-select";
import useCreditorInvoiceStore from "./context/useCreditorInvoiceStore";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";

const CreditorInvoiceBase: React.FC = () => {
  const axiosPrivate = useAxiosPrivate();
  const creditorService = new CreditorInvoiceAPI(axiosPrivate);
  const {
    setCreditor,
    creditorID,
    creditorName,
    getOutsourcedItems,
    getRequestData,
    invoiceItemDTOList,
  } = useCreditorInvoiceStore();
  const noCreditorSelected = !creditorID;
  const hasOutsourcedItems = getOutsourcedItems().length > 0;
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ["creditors"],
    queryFn: () => creditorService.fetchCreditors(),
  });

  const creditorData = data?.creditors.map(({ creditorID, shopName }) => ({
    value: parseInt(creditorID),
    label: shopName,
  }));

  //TODO complete this function with the API
  //TODO add printing logic here
  function printAndSaveInvoice() {
    if (!creditorID)
      return toast({
        title: "Please select creditor",
        description: "",
        variant: "destructive",
      });
    if (invoiceItemDTOList.length == 0)
      return toast({
        title: "No items added to the invoice",
        description: "",
        variant: "destructive",
      });
      console.log(data);
      
    console.log(getRequestData());
    navigate("print");
  }

  return (
    <div className="mb-20">
      <h2 className="text-2xl font-bold mb-4">Create Creditor Invoice</h2>

      {/* Add creditor data section */}
      <section className="flex mb-5 gap-5 items-center">
        <Select
          options={creditorData}
          onChange={(selectedOption) => {
            setCreditor(selectedOption?.label, selectedOption?.value);
          }}
          value={{
            value: creditorID,
            label: creditorName,
          }}
          className="w-1/2"
          placeholder="Select Creditor"
        />
        {noCreditorSelected && (
          <span className="text-md text-red-600">
            Please select creditor first
          </span>
        )}
      </section>

      <Dialog>
      <DialogTrigger asChild>
        <Button className="w-32">Add Item</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Add Invoice Items</DialogTitle>
          <DialogDescription>
            You can use TAB to change the input and Press ENTER to add the item
          </DialogDescription>
        </DialogHeader>
        <AddItem />
      </DialogContent>
    </Dialog>
     
      <InvoiceTable />

      {hasOutsourcedItems && (
        <div className="pb-[350px]">
          <OutsourcedItemDetails />
        </div>
      )}
      <div className="fixed bottom-0 bg-slate-200 border">
        <BillSummary printAndSaveInvoice={printAndSaveInvoice} />
      </div>
    </div>
  );
};

export default CreditorInvoiceBase;
