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
import { toast } from "@/components/ui/use-toast";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import { DummyInvoiceService } from "@/service/invoice/dummy/DummyInvoiceService";
import { SparePartService } from "@/service/sparePartInventory/sparePartService";
import { OutsourcedItem } from "@/types/invoice/cash/cashInvoiceTypes";
import { DummyInvoiceItem } from "@/types/invoice/dummy/dummyInvoiceTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { randomUUID } from "crypto";
import { useEffect, useState } from "react";
import { Fragment } from "react/jsx-runtime";

function DummyInvoice() {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  const [show, setShow] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [items, setItems] = useState<DummyInvoiceItem[]>([]);
  const [outsourcedItems, setOutsourcedItems] = useState<OutsourcedItem[]>([]);

  const [vatPrecentage, setVatPrecentage] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [isValid, setIsValid] = useState(true);

  const dummyInvoiceService = new DummyInvoiceService(axiosPrivate);
  const sparePartyService = new SparePartService(axiosPrivate);

  const generateInvoiceId = () => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(2); // Last two digits of the year
    const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Month (0-indexed, so +1)
    const day = now.getDate().toString().padStart(2, "0"); // Day of the month

    // Generate a unique 4-digit number based on time
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const uniqueNumber = (parseInt(hours + minutes, 10) % 10000)
      .toString()
      .padStart(4, "0");

    return `INV-DUMMY-${year}${month}${day}${uniqueNumber}`;
  };

  const createDummyInvoiceMutation = useMutation({
    mutationFn: () => {
      const isValid = validateAndRefactoringData();
      setIsValid(isValid);

      if (isValid) {
        return dummyInvoiceService.createDummyInvoice({
          customerName: customerName,
          discount: discountPercentage,
          dummy: true,
          tax: vatPrecentage,
          invoiceItems: items,
          invoiceId: generateInvoiceId(),
          vehicleNo: vehicleNo,
        });
      }
    },
    onSuccess: () => {
      // Handle onSuccess logic here
      if (isValid) {
        queryClient.invalidateQueries({ queryKey: ["dummyInvoices"] });
        toast({
          variant: "default",
          title: "Success",
          description: "Dummy invoive is created.",
        });
      }
    },
    onError: (data) => {
      toast({
        variant: "destructive",
        title: "Dummy Invoice creation is failed",
        description: `${
          data.message.split(" ").at(-1) === "409"
            ? "Invoice ID is already exists!"
            : data.message.split(" ").at(-1) === "412"
              ? "Requested quantity is not available for one of item"
              : data.message
        }`,
        duration: 5000,
      });
    },
  });

  const validateAndRefactoringData = (): boolean => {
    let validationError = "";
    let hasValidationError = false;

    if (customerName.length === 0) {
      hasValidationError = true;
      validationError = "Customer name is required";
    }

    if (!hasValidationError && items.length === 0) {
      validationError = "Items must have at least one";
      hasValidationError = true;
    }

    if (!hasValidationError) {
      items.forEach((item) => {
        if (item.outsourced) {
          const outSourcedPart = outsourcedItems.filter(
            (outsourcedItem) => outsourcedItem.index === item.sparePartId
          )[0];

          if (
            !outSourcedPart ||
            outSourcedPart.companyName === undefined ||
            outSourcedPart.companyName.trim().length <= 0 ||
            outSourcedPart.buyingPrice <= 0
          ) {
            validationError = "Please enter outsource details of " + item.name;
            hasValidationError = true;
            return;
          }

          item.outsourceItem = outSourcedPart;
        }
      });
    }

    if (hasValidationError) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: validationError,
        duration: 3000,
      });
      return false;
    }
    return true;
  };

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
                padding: 15,
                borderRadius: 5,
                boxShadow:
                  "rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px",
              }}
            >
              <CustomerDetailsForm
                customerName={customerName}
                setCustomerName={setCustomerName}
                setVehicleNo={setVehicleNo}
                vehicleNo={vehicleNo}
              />
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
            <div>
              {outsourcedItems.length > 0 && (
                <Card className="mt-4 bg-slate-200">
                  <CardContent className="pl-6 pr-2 pt-4 shadow-sm">
                    <div>
                      <h3 className="text-2xl font-semibold leading-none tracking-tight mb-6">
                        Outsourced Item Details
                      </h3>
                      <div key={Math.random()}>
                        <div className="d-flex gap-8">
                          <div
                            className="grid grid-cols-5 gap-4 w-full"
                            key={Math.random()}
                          >
                            <OptionalLabel label="Item Name" />
                            <OptionalLabel label="Item Code" />
                            <OptionalLabel label="Quantity" />
                            <RequiredLabel label="Company Name" />
                            <RequiredLabel label="Buying Price" />
                          </div>
                          <div className="w-10"></div>
                        </div>
                        {outsourcedItems.map((item, index) => (
                          <OutSourceItemForm
                            outsourceItem={item}
                            outsourceItems={outsourcedItems}
                            setOutsourcedItems={setOutsourcedItems}
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
            <BillSummaryCard
              total={totalPrice}
              createDummyInvoiceMutation={createDummyInvoiceMutation}
              discountPercentage={discountPercentage}
              setDiscountPrecentage={setDiscountPercentage}
              setVatPrecentage={setVatPrecentage}
              vatPercentage={vatPrecentage}
              setCustomerName={setCustomerName}
              setItems={setItems}
              setOutsourcedItems={setOutsourcedItems}
              setVehicleNo={setVehicleNo}
            />
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
            item={null}
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
