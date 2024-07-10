import InvoiceTable from "./components/InvoiceTable";
import AddItem from "./components/AddItem";
import BillSummary from "./components/BillSummary";
import OutsourcedItemDetails from "./components/OutSourcedItemDetails";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import CreditorInvoiceAPI from "./api/creditorInvoiceAPI";
import { useQuery } from "@tanstack/react-query";
import Select from "react-select";
import useCreditorInvoiceStore from "./context/useCreditorInvoiceStore";
import { ReceiptIcon } from "lucide-react";
import PageHeader from "@/components/card/PageHeader";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import { SparePartService } from "@/service/sparePartInventory/sparePartService.ts";
import { FormModal } from "@/components/modal/FormModal.tsx";
import { Button } from "@/components/ui/button.tsx";
import PlusIcon from "@/components/icon/PlusIcon.tsx";
import { CardContent, CardHeader } from "@/components/ui/card.tsx";
import Commissions from "@/pages/dashboard/invoice/creditor/components/Commisions.tsx";

const CreditorInvoiceBase: React.FC = () => {
  const axiosPrivate = useAxiosPrivate();
  const creditorService = new CreditorInvoiceAPI(axiosPrivate);
  const sparePartService = new SparePartService(axiosPrivate);
  const {
    setCreditor,
    creditorID,
    creditorName,
    getOutsourcedItems,
    invoiceItemDTOList,
  } = useCreditorInvoiceStore();
  const noCreditorSelected = !creditorID;
  const hasOutsourcedItems = getOutsourcedItems().length > 0;
  const [show, setShow] = useState(false);

  const { data } = useQuery({
    queryKey: ["creditors"],
    queryFn: () => creditorService.fetchCreditors(),
  });

  const creditorData = data?.creditors.map(({ creditorID, shopName }) => ({
    value: parseInt(creditorID),
    label: shopName,
  }));

  useEffect(() => {
    console.log(creditorID, creditorName);
    console.log(data);
  }, [creditorID, creditorName, creditorData]);

  return (
    <div className="mb-20">
      <CardHeader>
        <PageHeader
          title="Creditor Invoice"
          description="Creditor Invoice is issued to the credit customer"
          icon={<ReceiptIcon height="30" width="28" color="#162a3b" />}
        />
      </CardHeader>
      <CardContent
        style={{
          display: "flex",
          gap: "10px",
        }}
      >
        <div
          style={{
            flex: 9,
          }}
        >
          {/* Add creditor data section */}
          <section className="flex flex-col mb-5 gap-2 items-left mt-2 border p-3 rounded-md shadow-sm">
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
          {/*<AddItem/>*/}
          <div className="d-flex justify-start m-2 mt-4  gap-10">
            <Button
              className="gap-1"
              style={{ maxHeight: "35px" }}
              onClick={() => setShow(true)}
            >
              <PlusIcon height="24" width="24" color="#fff" />
              Item
            </Button>
            <p className="text-l">Add new item to the invoice</p>
          </div>
          <InvoiceTable />
          {hasOutsourcedItems && <OutsourcedItemDetails />}
          <Commissions />
        </div>
        <div
          style={{
            flex: 3,
          }}
        >
          <BillSummary />
        </div>
      </CardContent>
      <FormModal
        title="Add New Item"
        titleDescription="Add new spare part item to the invoice"
        show={show}
        onClose={() => setShow(false)}
        component={
          <AddItem
            onClose={() => setShow(false)}
            sparePartService={sparePartService}
          />
        }
      />
    </div>
  );
};

export default CreditorInvoiceBase;
