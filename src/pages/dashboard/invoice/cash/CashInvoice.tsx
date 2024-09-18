import InvoiceTable from "./components/InvoiceTable";
import AddItem from "./components/AddItem";
import BillSummary from "./components/BillSummary";
import OutsourcedItemDetails from "./components/OutSourcedItemDetails";
import useCashInvoiceStore from "./context/useCashInvoiceStore";
import CustomerDetails from "@/pages/dashboard/invoice/cash/components/CustomerDetails.tsx";
import Commissions from "@/pages/dashboard/invoice/cash/components/Commisions.tsx";
import { CardContent, CardHeader } from "@/components/ui/card.tsx";
import PageHeader from "@/components/card/PageHeader.tsx";
import React, { useState,useRef } from "react";

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

  //================ feild navigaton ==================//
  // const itemBtnRef = useRef(null);
  const itemBtnRef = useRef<HTMLButtonElement | null>(null);
  //================ feild navigaton ==================//

  return (
    <div className="mb-20">
      <CardHeader>
        <PageHeader
          title="Cash Invoice"
          description="Cash invoice for customers"
          icon={<ReceiptIcon height="30" width="28" color="#162a3b" />}
        />
      </CardHeader>
      <CardContent className="cash-invoice-contetn flex flex-col md:flex-row gap-4">
        <div className="flex-1 w-full">
          <CustomerDetails  ref={itemBtnRef}/>
          {/*<AddItem/>*/}
          <div className="d-flex justify-start mt-4  gap-10">
            <Button
              className="gap-1"
              style={{ maxHeight: "35px" }}
              ref={itemBtnRef}
              onClick={() => setShow(true)}
            >
              <PlusIcon height="24" width="24" color="#fff" />
              Item
            </Button>
            {/*<p className="text-l">Add new item to the invoice</p>*/}
          </div>
          <InvoiceTable sparePartService={sparePartyService} />

          {hasOutsourcedItems && (
            <div className="pb-[30px]">
              <OutsourcedItemDetails />
            </div>
          )}
          <Commissions />
        </div>

        <div className="flex-1 md:flex-none md:w-1/4 w-full">
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
