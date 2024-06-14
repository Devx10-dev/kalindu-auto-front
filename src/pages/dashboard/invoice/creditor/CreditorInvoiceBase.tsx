import InvoiceTable from "./components/InvoiceTable";
import AddItem from "./components/AddItem";
import BillSummary from "./components/BillSummary";
import OutsourcedItemDetails from "./components/OutSourcedItemDetails";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import CreditorInvoiceAPI from "./api/creditorInvoiceAPI";
import { useQuery } from "@tanstack/react-query";
import Select from "react-select";

import useCreditorInvoiceStore from "./context/useCreditorInvoiceStore";

const CreditorInvoiceBase: React.FC = () => {
  const axiosPrivate = useAxiosPrivate();
  const creditorService = new CreditorInvoiceAPI(axiosPrivate);
  const { setCreditor, creditorID, creditorName, getOutsourcedItems } =
    useCreditorInvoiceStore();
  const noCreditorSelected = !creditorID;
  const hasOutsourcedItems = getOutsourcedItems().length > 0;

  const { data } = useQuery({
    queryKey: ["creditors"],
    queryFn: () => creditorService.fetchCreditors(),
  });

  const creditorData = data?.creditors.map(({ id, shopName }) => ({
    value: id,
    label: shopName,
  }));

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

      <AddItem />

      <InvoiceTable />

      {hasOutsourcedItems && <OutsourcedItemDetails />}

      <BillSummary />
    </div>
  );
};

export default CreditorInvoiceBase;
