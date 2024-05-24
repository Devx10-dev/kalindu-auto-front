import PageHeader from "@/components/card/PageHeader";
import BillSummaryCard from "@/components/card/invoice/dummy/BillSummaryCard";
import CustomerDetailsForm from "@/components/form/invoice/dummy/CustomerDetailsForm";
import DummyItemForm from "@/components/form/invoice/dummy/DummyItemForm";
import PlusIcon from "@/components/icon/PlusIcon";
import ReceiptIcon from "@/components/icon/ReceiptIcon";
import { FormModal } from "@/components/modal/FormModal";
import DummyInvoiceItemsGrid from "@/components/table/invoice/dummy/DummyInvoiceItemsGrid";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader } from "@/components/ui/card";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import { DummyInvoiceService } from "@/service/invoice/dummy/DummyInvoiceService";
import { useState } from "react";
import { Fragment } from "react/jsx-runtime";

function DummyInvoice() {
  const axiosPrivate = useAxiosPrivate()

  const [show, setShow] = useState(false)

  const dummyInvoiceService = new DummyInvoiceService(axiosPrivate)

  return (
    <Fragment>
      <div className="ml-2">
        <CardHeader>
          <PageHeader
            title="Dummy Invoice"
            description="Dummy invoice is sometimes used to inflate the total amount on the bill for a customer."
            icon={<ReceiptIcon height="30" width="28" color="#162a3b" />}
          />
        </CardHeader>
        <CardContent
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <div style={{ flex: 9, padding: 10 }}>
            <div
              style={{
                padding: 15,
                borderRadius: 5,
                boxShadow:
                  "rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px",
              }}
            >
              <CustomerDetailsForm />
            </div>
            <div className="d-flex justify-start m-2 mt-4">
              <Button className="gap-1" style={{ maxHeight: "35px" }}>
                <PlusIcon height="24" width="24" color="#fff" />
                Item
              </Button>
            </div>
            <DummyInvoiceItemsGrid />
          </div>
          <div style={{ flex: 3 }}>
            <BillSummaryCard />
          </div>
        </CardContent>
      </div>
      <FormModal
          title="Add new Spare Part"
          titleDescription="Add new spare part details to the system"
          show={show}
          onClose={() => setShow(false)}
          component={
            <DummyItemForm
              onClose={() => setShow(false)}
              setSparePart={setSparePart}
              sparePart={sparePart}
              sparePartservice={sparePartService}
              vehicleService={vehicleService}
            />
    </Fragment>
  );
}

export default DummyInvoice;
