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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import { DummyInvoiceService } from "@/service/invoice/dummy/DummyInvoiceService";
import { ReturnService } from "@/service/return/ReturnService";
import { SparePartService } from "@/service/sparePartInventory/sparePartService";
import { OutsourcedItem } from "@/types/invoice/cash/cashInvoiceTypes";
import { DummyInvoiceItem } from "@/types/invoice/dummy/dummyInvoiceTypes";
import { BaseInvoice, ReturnItem } from "@/types/returns/returnsTypes";
import { convertArrayToISOFormat } from "@/utils/dateTime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Select from "react-select";
import { Fragment } from "react/jsx-runtime";
import CashInvoiceBase from "./cash/CashInvoice";
import CreditorInvoiceBase from "./creditor/CreditorInvoiceBase";
import useReturnInvoiceStore from "./context/useReturnInvoiceStore";
import Summary from "./Summary";

interface InvoiceOption {
  label: string;
  value: BaseInvoice;
}

function HandlingReturn() {
  const {
    setSourceInvoiceId,
    addReturnItem,
    setReturnType,
    setCustomer,
    setReturnAmount,
    setPurchaseDate,
    returnType,
  } = useReturnInvoiceStore();
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  const [show, setShow] = useState(false);
  const [items, setItems] = useState<DummyInvoiceItem[]>([]);
  const [outsourcedItems, setOutsourcedItems] = useState<OutsourcedItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [vatPrecentage, setVatPrecentage] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<BaseInvoice>();

  const [returnedQuantities, setReturnedQuantities] = useState<{
    [key: string]: number;
  }>({});
  const [selectedReturnItems, setSelectedReturnItems] = useState<ReturnItem>();

  const [totalReturnValue, setTotalReturnValue] = useState(0);

  const dummyInvoiceService = new DummyInvoiceService(axiosPrivate);
  const sparePartyService = new SparePartService(axiosPrivate);

  const returnService = new ReturnService(axiosPrivate);
  const [activeTab, setActiveTab] = useState<string>("cash");

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
          description: "Dummy invoice is created.",
        });
      }
    },
    onError: (data) => {
      toast({
        variant: "destructive",
        title: "Dummy Invoice creation failed",
        description: `${
          data.message.split(" ").at(-1) === "409"
            ? "Invoice ID already exists!"
            : data.message.split(" ").at(-1) === "412"
              ? "Requested quantity is not available for one of the items"
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
            (outsourcedItem) => outsourcedItem.index === item.sparePartId,
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
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [items]);

  const handleInputChange = (inputValue: string) => {
    setSearchTerm(inputValue);
  };

  const handleReturnedQuantityChange = (
    itemCode: string,
    quantity: number,
    price: number,
    id: number,
  ) => {
    addReturnItem({ id: id, returnedQuantity: quantity });
    setReturnedQuantities((prev) => ({
      ...prev,
      [itemCode]: quantity,
    }));
  };

  useEffect(() => {
    const totalValue = Object.keys(returnedQuantities).reduce(
      (acc, itemCode) => {
        const quantity = returnedQuantities[itemCode];
        const item = selectedInvoice?.items.find(
          (item) => item.code === itemCode,
        );
        return acc + (item ? quantity * item.price : 0);
      },
      0,
    );
    setTotalReturnValue(totalValue);
    setReturnAmount(totalValue);
  }, [returnedQuantities, selectedInvoice]);
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    console.log(tab);
  };

  const handleSourceInvoice = (baseInvoice: BaseInvoice) => {
    setCustomer(baseInvoice.customer);
    setPurchaseDate(baseInvoice.date);
    setReturnType(findReturnType(baseInvoice.invoiceId));
    setSourceInvoiceId(baseInvoice.invoiceId);
    setSelectedInvoice(baseInvoice);
    // setTotalPrice(baseInvoice.totalPrice);
  };

  const findReturnType = (invoiceId: string): string => {
    const parts = invoiceId.split("-");
    const returnType = parts[1];
    return returnType;
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

        {/* main section */}
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
              <RequiredLabel label="Returned Invoice" />
              <Select
                className="select-place-holder"
                placeholder={"Search and select returned invoice"}
                options={invoiceOptions}
                onChange={(option) => {
                  handleSourceInvoice(option.value);
                }}
                onInputChange={handleInputChange}
              />
            </div>
            <div style={{ marginTop: 15 }}>
              <Tabs
                defaultValue="returnItems"
                className="w-[100%]"
                onValueChange={handleTabChange}
              >
                <div>
                  <div className="flex justify-between items-center">
                    <TabsList className="grid w-[40%] grid-cols-2 bg-blue-600 text-slate-50">
                      <TabsTrigger value="returnItems">
                        Return Items
                      </TabsTrigger>
                      <TabsTrigger value="newItems">New Items</TabsTrigger>
                    </TabsList>
                  </div>
                  {/* Return Item view section */}
                  <TabsContent value="returnItems">
                    <Card x-chunk="dashboard-07-chunk-1">
                      <CardHeader>
                        <CardTitle>Returned Invoice</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Spare Part</TableHead>
                              <TableHead>Item Code</TableHead>
                              <TableHead>Unit Price</TableHead>
                              <TableHead>Quantity</TableHead>
                              <TableHead>Returned Qty</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedInvoice &&
                              selectedInvoice?.items.map((item) => (
                                <TableRow key={item.id}>
                                  <TableCell>{item.name}</TableCell>
                                  <TableCell>{item.code}</TableCell>
                                  <TableCell>LKR {item.price}</TableCell>
                                  <TableCell>{item.quantity}</TableCell>
                                  <TableCell>
                                    <Input
                                      id={"" + item.id}
                                      type="number"
                                      max={item.quantity}
                                      min={0}
                                      value={returnedQuantities[item.code] || 0}
                                      onChange={(e) =>
                                        handleReturnedQuantityChange(
                                          item.code,
                                          parseInt(e.target.value, 10),
                                          item.price,
                                          item.id,
                                        )
                                      }
                                    />
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                      <div className="mb-2 ml-2" style={{ paddingLeft: 10 }}>
                        <h3 className="text-xl font-semibold leading-none tracking-tight">
                          Total Return Value: Rs. {totalReturnValue.toFixed(2)}
                        </h3>
                      </div>
                    </Card>
                  </TabsContent>
                  {/* <div className = "mb-4">
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
                </div> */}

                  {/* New invoice section */}
                  <TabsContent value="newItems">
                    <Fragment>
                      {selectedInvoice && (
                        <Tabs
                          defaultValue="cash"
                          className="w-[100%]"
                          onValueChange={handleTabChange}
                        >
                          {returnType === "CREDIT" && (
                            <div>
                              <div className="flex justify-between items-center">
                                <TabsList className="grid w-[100%] grid-cols-2 bg-blue-600 text-slate-50">
                                  <TabsTrigger value="cash">
                                    Cash Invoice
                                  </TabsTrigger>
                                  <TabsTrigger value="creditor">
                                    Creditor Invoice
                                  </TabsTrigger>
                                </TabsList>
                              </div>
                              <TabsContent value="cash">
                                <CashInvoiceBase />
                              </TabsContent>
                              <TabsContent value="creditor">
                                <CashInvoiceBase />
                                {/* <CreditorInvoiceBase /> */}
                              </TabsContent>
                            </div>
                          )}
                          {returnType === "CASH" && (
                            <div>
                              <div className="flex justify-between items-center">
                                <TabsList className="grid w-[40%] grid-cols-1 bg-blue-600 text-slate-50">
                                  <TabsTrigger value="cash">
                                    Cash Invoice
                                  </TabsTrigger>
                                </TabsList>
                              </div>
                              <TabsContent value="cash">
                                <CashInvoiceBase />
                              </TabsContent>
                            </div>
                          )}
                        </Tabs>
                      )}
                    </Fragment>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>

          <div style={{ flex: 3 }}>
            <Summary />
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
