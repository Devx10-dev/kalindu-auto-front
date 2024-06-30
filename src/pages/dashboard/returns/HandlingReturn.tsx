import PageHeader from "@/components/card/PageHeader";
import DummyItemForm from "@/components/form/invoice/dummy/DummyItemForm";
import OutSourceItemForm from "@/components/form/invoice/dummy/OutSourceItemForm";
import {
  OptionalLabel,
  RequiredLabel,
} from "@/components/formElements/FormLabel";
import LeftRightArrow from "@/components/icon/LeftRightArrow";
import PlusIcon from "@/components/icon/PlusIcon";
import { FormModal } from "@/components/modal/FormModal";
import DummyInvoiceItemsGrid from "@/components/table/invoice/dummy/DummyInvoiceItemsGrid";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import { DummyInvoiceService } from "@/service/invoice/dummy/DummyInvoiceService";
import { ReturnService } from "@/service/return/ReturnService";
import { SparePartService } from "@/service/sparePartInventory/sparePartService";
import { OutsourcedItem } from "@/types/invoice/cash/cashInvoiceTypes";
import { DummyInvoiceItem } from "@/types/invoice/dummy/dummyInvoiceTypes";
import { BaseInvoice } from "@/types/returns/returnsTypes";
import { convertArrayToISOFormat } from "@/utils/dateTime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Select from "react-select";
import { Fragment } from "react/jsx-runtime";

interface InvoiceOption {
  label: string;
  value: BaseInvoice;
}

function HandlingReturn() {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  const [show, setShow] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [items, setItems] = useState<DummyInvoiceItem[]>([]);
  const [outsourcedItems, setOutsourcedItems] = useState<OutsourcedItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [vatPrecentage, setVatPrecentage] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<BaseInvoice>();

  const dummyInvoiceService = new DummyInvoiceService(axiosPrivate);
  const sparePartyService = new SparePartService(axiosPrivate);

  const returnService = new ReturnService(axiosPrivate);

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

  const { data: baseInvoices } = useQuery<BaseInvoice[]>({
    queryKey: ["baseInvoices", searchTerm],
    queryFn: () => returnService.fetchAllInvoiceByGivenTerm(searchTerm),
    retry: 1,
  });

  const invoiceOptions: InvoiceOption[] = baseInvoices?.map((invoice) => ({
    label: invoice.invoiceId,
    value: invoice,
  }));

  console.log(selectedInvoice);

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

  const handleInputChange = (inputValue: string) => {
    setSearchTerm(inputValue);
  };

  return (
    <Fragment>
      <div className="ml-2">
        <CardHeader>
          <PageHeader
            title="Return Invoice Items"
            description="Invoice items are eligible for return or exchange in this surface."
            icon={<LeftRightArrow height="30" width="28" color="#162a3b" />}
          />
        </CardHeader>
        <CardContent
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <div style={{ flex: 7 }}>
            {/* <div
              style={{
                boxShadow:
                  "rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px",
                borderRadius: 5,
              }}
              className="p-6 pt-0"
            > */}
            <div
              style={{
                padding: 15,
                borderRadius: 5,
                boxShadow:
                  "rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px",
              }}
            >
              <RequiredLabel label="Returned Invoice" />
              <Select
                className="select-place-holder"
                placeholder={"Search and select returned invoice"}
                options={invoiceOptions}
                onChange={(option) => setSelectedInvoice(option.value)}
                onInputChange={handleInputChange}
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
            {/* <DummyInvoiceItemsGrid
              items={items}
              outsourcedItems={outsourcedItems}
              setItems={setItems}
              setOutsourcedItems={setOutsourcedItems}
            /> */}
            {/* </div> */}
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

          <div style={{ flex: 5 }}>
            <Card x-chunk="dashboard-07-chunk-1">
              <CardHeader>
                <CardTitle>Returned Invoice</CardTitle>
                <CardDescription>{`Invoice ID : ${selectedInvoice?.invoiceId}`}</CardDescription>
                <div className="d-flex justify-between">
                  <CardDescription>{`Customer : ${selectedInvoice?.customer}`}</CardDescription>
                  <CardDescription>
                    <p
                      className="pl-2 pr-2"
                      style={{
                        background: "#2563eb",
                        color: "#fff",
                        borderRadius: 5,
                        maxWidth: "max-content",
                        fontSize: 12,
                        fontWeight: 400,
                      }}
                    >{`Date : ${selectedInvoice && convertArrayToISOFormat(selectedInvoice?.date)}`}</p>
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px]">Spare Part</TableHead>
                      <TableHead className="w-[100px]">Item Code</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Returned Qty</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedInvoice &&
                      selectedInvoice?.items.map((item) => (
                        <TableRow>
                          <TableCell className="font-semibold">
                            {item.name}
                          </TableCell>
                          <TableCell>{item.code}</TableCell>
                          <TableCell align="right">{item.quantity}</TableCell>
                          <TableCell>
                            <Input
                              id="price-1"
                              type="number"
                              max={item.quantity}
                              min={0}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
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

export default HandlingReturn;
