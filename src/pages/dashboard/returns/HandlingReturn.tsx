import AmountCard from "@/components/card/AmountCard";
import PageHeader from "@/components/card/PageHeader";
import DummyItemForm from "@/components/form/invoice/dummy/DummyItemForm";
import { RequiredLabel } from "@/components/formElements/FormLabel";
import LeftRightArrow from "@/components/icon/LeftRightArrow";
import { FormModal } from "@/components/modal/FormModal";
import { CardContent, CardHeader } from "@/components/ui/card";
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
import useDebounce from "@/hooks/useDebounce";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import { DummyInvoiceService } from "@/service/invoice/dummy/DummyInvoiceService";
import { ReturnService } from "@/service/return/ReturnService";
import { SparePartService } from "@/service/sparePartInventory/sparePartService";
import { OutsourcedItem } from "@/types/invoice/cash/cashInvoiceTypes";
import { DummyInvoiceItem } from "@/types/invoice/dummy/dummyInvoiceTypes";
import { BaseInvoice, ReturnItem } from "@/types/returns/returnsTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Select from "react-select";
import { Fragment } from "react/jsx-runtime";
import colors from "../../../assets/colors.json";
import InvoiceTable from "../invoice/creditor/components/InvoiceTable";
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
    setNewInvoiceType,
    returnType,
    resetExchangeItemTable,
    newInvoiceType,
    invoiceItemDTOList,
    setSelectedInvoice,
    selectedInvoice,
    resetState,
  } = useReturnInvoiceStore();
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  const [show, setShow] = useState(false);
  const [items, setItems] = useState<DummyInvoiceItem[]>([]);
  const [outsourcedItems, setOutsourcedItems] = useState<OutsourcedItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [vatPrecentage, setVatPrecentage] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [isValid, setIsValid] = useState(true);

  const [returnedQuantities, setReturnedQuantities] = useState<{
    [key: string]: number;
  }>({});
  const [selectedReturnItems, setSelectedReturnItems] = useState<ReturnItem>();

  const [totalReturnValue, setTotalReturnValue] = useState(0);

  const dummyInvoiceService = new DummyInvoiceService(axiosPrivate);
  const sparePartService = new SparePartService(axiosPrivate);
  const returnService = new ReturnService(axiosPrivate);

  const [activeTab, setActiveTab] = useState<string>("cash");
  const [tabCredit, setTabCredit] = useState(false);
  const [tabCash, setTabCash] = useState(false);
  const [creditorSelectKey, setCreditorSelectKey] = useState(0);

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
    queryKey: ["baseInvoices", debouncedSearchTerm],
    queryFn: () =>
      returnService.fetchAllInvoiceByGivenTerm(debouncedSearchTerm),
    retry: 1,
  });

  const invoiceOptions: InvoiceOption[] = baseInvoices?.map((invoice) => ({
    label: invoice.invoiceId,
    value: invoice,
  }));

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
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [items]);

  const handleInputChange = (inputValue: string) => {
    setSearchTerm(inputValue);
  };

  useEffect(() => {
    if (invoiceItemDTOList[0]) {
      if (newInvoiceType === "CRE") {
        setTabCash(true);
      } else if (newInvoiceType === "CASH") {
        setTabCredit(true);
      } else if (newInvoiceType == undefined) {
        setNewInvoiceType("CASH");
        setTabCredit(true);
      }
    } else {
      setTabCredit(false);
      setTabCash(false);
    }
  }, [invoiceItemDTOList]);

  const handleReturnedQuantityChange = (
    itemCode: string,
    quantity: number,
    price: number,
    id: number
  ) => {
    addReturnItem({ id: id, returnedQuantity: quantity });
    setReturnedQuantities((prev) => ({
      ...prev,
      [id]: quantity,
    }));
  };

  useEffect(() => {
    const totalValue = Object.keys(returnedQuantities).reduce((acc, id) => {
      const quantity = returnedQuantities[id];
      const item = selectedInvoice?.items.find(
        (item) => item.id === Number(id)
      );
      return acc + (item ? quantity * item.price : 0);
    }, 0);
    setTotalReturnValue(totalValue);
    setReturnAmount(totalValue);
  }, [returnedQuantities, selectedInvoice]);
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    console.log(tab);
  };

  const handleTabChange2 = (tab: string) => {
    if (!invoiceItemDTOList[0]) console.log("Tab changed 2", tab);
    setActiveTab(tab);
    if (tab === "creditor") {
      setNewInvoiceType("CRE");
    } else {
      setNewInvoiceType("CASH");
    }
    console.log(tab);
  };
  const handleSourceInvoice = (baseInvoice: BaseInvoice) => {
    setReturnedQuantities({})
    setSelectedInvoice(baseInvoice);
    setCustomer(baseInvoice.customer);
    setPurchaseDate(baseInvoice.date);
    setReturnType(findReturnType(baseInvoice.invoiceId));
    setSourceInvoiceId(baseInvoice.invoiceId);
    resetExchangeItemTable();
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
                key={creditorSelectKey}
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
                    <TabsList className="grid w-[40%] grid-cols-2 bg-primary text-slate-50">
                      <TabsTrigger value="returnItems">
                        Return Items
                      </TabsTrigger>
                      <TabsTrigger value="newItems">Exchange Items</TabsTrigger>
                    </TabsList>
                  </div>
                  {/* Return Item view section */}
                  <TabsContent value="returnItems">
                    <Table className="border rounded-md text-md mt-6 mb-5 table-responsive">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Spare Part</TableHead>
                          <TableHead>Item Code</TableHead>
                          <TableHead style={{ textAlign: "end" }}>
                            Unit Price
                          </TableHead>
                          <TableHead style={{ textAlign: "end" }}>
                            Quantity
                          </TableHead>
                          <TableHead style={{ textAlign: "end" }}>
                            Available Qty
                          </TableHead>
                          <TableHead style={{ textAlign: "end" }}>
                            Returned Qty
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedInvoice ? (
                          selectedInvoice?.items.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>
                                {item?.code.length === 0 ? "-" : item.code}
                              </TableCell>
                              <TableCell align="right">{item.price}</TableCell>
                              <TableCell align="right">
                                {item.quantity}
                              </TableCell>
                              <TableCell align="right">
                                <AmountCard
                                  amount={
                                    item?.availableQuantity ?? item?.quantity
                                  }
                                  color={
                                    item.availableQuantity === undefined ||
                                    item.availableQuantity > 0
                                      ? colors["number-green"]
                                      : colors["number-red"]
                                  }
                                />
                              </TableCell>
                              <TableCell align="right">
                                <Input
                                  id={"" + item.id}
                                  type="number"
                                  max={item.quantity}
                                  min={0}
                                  value={returnedQuantities[item.id]}
                                  onChange={(e) => {
                                    const enteredValue = parseInt(
                                      e.target.value,
                                      10
                                    );
                                    if (enteredValue > item.quantity) {
                                      // Prevent the input from going beyond the max value
                                      e.target.value = item.quantity;
                                    } else if (enteredValue >= 0) {
                                      handleReturnedQuantityChange(
                                        item.code,
                                        enteredValue,
                                        item.price,
                                        item.id
                                      );
                                    }
                                  }}
                                  step={1}
                                  style={{
                                    textAlign: "right",
                                    maxWidth: "140px",
                                  }}
                                  placeholder="Enter return qty"
                                  disabled={
                                    item.availableQuantity !== undefined &&
                                    item.availableQuantity === 0
                                  }
                                />
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-4">
                              Please select the invoice first.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TabsContent>

                  {/* New invoice section */}
                  <TabsContent value="newItems">
                    <InvoiceTable
                      sparePartService={sparePartService}
                      type="RETURN"
                    />
                    {/* <Fragment>
                      {selectedInvoice ? (
                        <Tabs
                          defaultValue={!tabCash ? "cash" : "creditor"}
                          className="w-[100%]"
                          onValueChange={handleTabChange2}
                        >
                          {returnType === "CRE" && (
                            <div>
                              <div className="flex justify-between items-center">
                                <TabsList className="grid w-[100%] grid-cols-2 bg-blue-600 text-slate-50">
                                  <TabsTrigger value="cash" disabled={tabCash}>
                                    Cash Invoice
                                  </TabsTrigger>
                                  <TabsTrigger
                                    value="creditor"
                                    disabled={tabCredit}
                                  >
                                    Creditor Invoice
                                  </TabsTrigger>
                                </TabsList>
                              </div>
                              <TabsContent value="cash">
                                <CashInvoiceBase />
                              </TabsContent>
                              <TabsContent value="creditor">
                                <CreditorInvoiceBase />
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
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4">
                            Please select the invoice first.
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment> */}
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>

          <div style={{ flex: 3 }}>
            <Summary
              creditorSelectKey={creditorSelectKey}
              setCreditorSelectKey={setCreditorSelectKey}
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
            onClose={() => setShow(false)}
            sparePartService={sparePartService}
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
