import InvoiceTable from "./components/InvoiceTable";
import AddItem from "./components/AddItem";
import BillSummary from "./components/BillSummary";
import OutsourcedItemDetails from "./components/OutSourcedItemDetails";
import useCashInvoiceStore from "./context/useCashInvoiceStore";
import CustomerDetails from "@/pages/dashboard/invoice/cash/components/CustomerDetails.tsx";
import Commissions from "@/pages/dashboard/invoice/cash/components/Commisions.tsx";
import { CardContent, CardHeader } from "@/components/ui/card.tsx";
import PageHeader from "@/components/card/PageHeader.tsx";
import React, { useState } from "react";

import ReceiptIcon from "@/components/icon/ReceiptIcon";
import { FormModal } from "@/components/modal/FormModal.tsx";
import { Button } from "@/components/ui/button.tsx";
import PlusIcon from "@/components/icon/PlusIcon.tsx";
import { SparePartService } from "@/service/sparePartInventory/sparePartService.ts";
import useAxiosPrivate from "@/hooks/usePrivateAxios.ts";

const CashInvoiceBase: React.FC = () => {
  // const axiosPrivate = useAxiosPrivate();
  const { getOutsourcedItems } = useCashInvoiceStore();
  const hasOutsourcedItems = getOutsourcedItems().length > 0;
  const [show, setShow] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const sparePartyService = new SparePartService(axiosPrivate);

  return (
    <div className="mb-20">
      <CardHeader>
        <PageHeader
          title="Cash Invoice"
          description=""
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
          <CustomerDetails />
          {/*<AddItem/>*/}
          <div className="d-flex justify-end m-2 mt-4  gap-10">
            <p className="text-l">Add new item to the invoice</p>
            <Button
              className="gap-1"
              style={{ maxHeight: "35px" }}
              onClick={() => setShow(true)}
            >
              <PlusIcon height="24" width="24" color="#fff" />
              Item
            </Button>
          </div>
          <InvoiceTable />
          <Commissions />
          {hasOutsourcedItems && (
            <div className="pb-[350px]">
              <OutsourcedItemDetails />
            </div>
          )}
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
            sparePartService={sparePartyService}
          />
        }
      />
    </div>
  );
};

export default CashInvoiceBase;
