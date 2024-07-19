import InvoiceTable from "./components/InvoiceTable";
import AddItem from "./components/AddItem";
import BillSummary from "./components/BillSummary";
import OutsourcedItemDetails from "./components/OutSourcedItemDetails";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import CreditorInvoiceAPI from "./api/creditorInvoiceAPI";
import { useQuery } from "@tanstack/react-query";
import Select from "react-select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useCreditorInvoiceStore from "./context/useCreditorInvoiceStore";
import { Button } from "@/components/ui/button";
import { PlusIcon, ReceiptIcon } from "lucide-react";
import PageHeader from "@/components/card/PageHeader";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";

const CreditorInvoiceBase: React.FC = () => {
  const axiosPrivate = useAxiosPrivate();
  const creditorService = new CreditorInvoiceAPI(axiosPrivate);
  const {
    setCreditor,
    creditorID,
    creditorName,
    getOutsourcedItems,
    invoiceItemDTOList,
  } = useCreditorInvoiceStore();
  const noCreditorSelected = !creditorID;
  const hasOutsourcedItems = getOutsourcedItems().length > 0;

  const { data } = useQuery({
    queryKey: ["creditors"],
    queryFn: () => creditorService.fetchCreditors(),
  });

  const creditorData =
    data.creditors !== undefined &&
    data?.creditors.map(({ creditorID, shopName }) => ({
      value: parseInt(creditorID),
      label: shopName,
    }));

  useEffect(() => {
    console.log(creditorID, creditorName);
    console.log(data);
  }, [creditorID, creditorName, creditorData]);

  return (
    <div className="mb-20 flex w-full gap-10 p-10">
      <div className="w-3/4">
        <PageHeader
          title="Creditor Invoice"
          description="Creditor Invoice is issued to the credit customer"
          icon={<ReceiptIcon height="30" width="28" color="#162a3b" />}
        />

        {/* Add creditor data section */}
        <section className="flex flex-col mb-5 gap-2 items-left mt-10 border p-5 rounded-md shadow-sm">
          <Label className="">Select Creditor</Label>
          <Select
            options={creditorData}
            onChange={(selectedOption) => {
              console.log(selectedOption);

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
            <span className="text-md text-red-600">No Creditor Selected</span>
          )}
        </section>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-1 mt-5" style={{ maxHeight: "35px" }}>
              <PlusIcon height="24" width="24" color="#fff" />
              Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:min-w-[900px]">
            <DialogHeader>
              <DialogTitle>Add Invoice Items</DialogTitle>
              <DialogDescription>Add Invoice Items</DialogDescription>
            </DialogHeader>
            {/* Custom add item component */}
            <AddItem />
          </DialogContent>
        </Dialog>

        {invoiceItemDTOList.length > 0 ? (
          <InvoiceTable />
        ) : (
          <Label className="ml-5 text-gray-500">
            Please add items to the invoice
          </Label>
        )}

        {hasOutsourcedItems && <OutsourcedItemDetails />}
      </div>
      <BillSummary />
    </div>
  );
};

export default CreditorInvoiceBase;
