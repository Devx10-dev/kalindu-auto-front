import PageHeader from "@/components/card/PageHeader";
import BillSummaryCard from "@/components/card/invoice/dummy/BillSummaryCard";
import CustomerDetailsForm from "@/components/form/invoice/dummy/CustomerDetailsForm";
import DummyItemForm from "@/components/form/invoice/dummy/DummyItemForm";
import OutSourceItemForm from "@/components/form/invoice/dummy/OutSourceItemForm";
import {
  OptionalLabel,
  RequiredLabel,
} from "@/components/formElements/FormLabel";
import PlusIcon from "@/components/icon/PlusIcon";
import ReceiptIcon from "@/components/icon/ReceiptIcon";
import { FormModal } from "@/components/modal/FormModal";
import DummyInvoiceItemsGrid from "@/components/table/invoice/dummy/DummyInvoiceItemsGrid";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import { DummyInvoiceService } from "@/service/invoice/dummy/DummyInvoiceService";
import { SparePartService } from "@/service/sparePartInventory/sparePartService";
import { OutsourcedItem } from "@/types/invoice/cash/cashInvoiceTypes";
import { DummyInvoiceItem } from "@/types/invoice/dummy/dummyInvoiceTypes";
import { useEffect, useState } from "react";
import { Fragment } from "react/jsx-runtime";

function DummyInvoice() {
  const axiosPrivate = useAxiosPrivate();

  const [show, setShow] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [items, setItems] = useState<DummyInvoiceItem[]>([]);
  const [outsourcedItems, setOutsourcedItems] = useState<OutsourcedItem[]>([]);

  const dummyInvoiceService = new DummyInvoiceService(axiosPrivate);
  const sparePartyService = new SparePartService(axiosPrivate);

  const calculateTotalPrice = () => {
    if (items.length === 0) return;

    let total = 0;
    items.forEach((item) => {
      let itemTotalPrice = item.quantity * item.price;
      if (item.discount !== undefined) {
        itemTotalPrice -= item.discount;
      }
      total += itemTotalPrice;
    });

    setTotalPrice(total);
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [items]);

  console.log(items);
  console.log(outsourcedItems);

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
          <div style={{ flex: 9 }}>
            <div
              style={{
                boxShadow:
                  "rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px",
                borderRadius: 5,
              }}
              className="p-6 pt-0"
            >
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
              <div className="d-flex justify-start m-2 mt-4 mb-4">
                <Button
                  className="gap-1"
                  style={{ maxHeight: "35px" }}
                  onClick={() => setShow(true)}
                >
                  <PlusIcon height="24" width="24" color="#fff" />
                  Item
                </Button>
              </div>
              <DummyInvoiceItemsGrid
                items={items}
                outsourcedItems={outsourcedItems}
                setItems={setItems}
                setOutsourcedItems={setOutsourcedItems}
              />
            </div>
            <div>
              {outsourcedItems.length > 0 && (
                <Card className="mt-4 bg-slate-200">
                  <CardContent className="pl-6 pr-6 pt-4 shadow-sm">
                    <div>
                      <h3 className="text-2xl font-semibold leading-none tracking-tight mb-6">
                        Outsourced Item Details
                      </h3>
                      <div key={Math.random()}>
                        <div
                          className="grid grid-cols-5 gap-4"
                          key={Math.random()}
                        >
                          <OptionalLabel label="Item Name" />
                          <OptionalLabel label="Item Code" />
                          <OptionalLabel label="Quantity" />
                          <RequiredLabel label="Company Name" />
                          <RequiredLabel label="Buying Price" />
                        </div>
                        {outsourcedItems.map((item, index) => (
                          <OutSourceItemForm
                            item={item}
                            items={outsourcedItems}
                            key={Math.random()}
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          <div style={{ flex: 3 }}>
            <BillSummaryCard total={totalPrice} />
          </div>
        </CardContent>
      </div>
      <FormModal
        title="Add new Spare Part Item"
        titleDescription="Add new spare part item to the invoice"
        show={show}
        onClose={() => setShow(false)}
        component={
          <DummyItemForm
            onClose={() => setShow(false)}
            sparePartService={sparePartyService}
            items={items}
            setItems={setItems}
            outsourcedItems={outsourcedItems}
            setOutsourcedItems={setOutsourcedItems}
          />
        }
      />
    </Fragment>
  );
}

export default DummyInvoice;
