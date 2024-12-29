import AmountCard from "@/components/card/AmountCard";
import PageHeader from "@/components/card/PageHeader";
import { RequiredLabel } from "@/components/formElements/FormLabel";
import LeftRightArrow from "@/components/icon/LeftRightArrow";
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
import { BaseInvoice, InvoiceID } from "@/types/returns/returnsTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { Fragment } from "react/jsx-runtime";
import colors from "../../../assets/colors.json";
import InvoiceTable from "../invoice/creditor/components/InvoiceTable";
import useReturnInvoiceStore from "./context/useReturnInvoiceStore";
import Summary from "./Summary";
import { TableBodySkeleton } from "../invoice/view-invoices/components/TableSkeleton";

interface InvoiceOption {
  label: string;
  value: string;
}

function HandlingReturn() {
  const {
    sourceInvoiceId,
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
    setSelectedInvoice,
    selectedInvoice,
    resetState,
    discountAmount,
    invoiceItemDTOList,
    vatAmount,
    setSelectedInvoiceType,
    setRemainingDue,
    setCashBackAmount,
    returnAmount,
    remainingDue,
    selectedInvoiceId,
    setSelectedInvoiceId,
  } = useReturnInvoiceStore();
  const axiosPrivate = useAxiosPrivate();

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);


  const [returnedQuantities, setReturnedQuantities] = useState<{
    [key: string]: number;
  }>({});

  const [totalReturnValue, setTotalReturnValue] = useState(0);

  const sparePartService = new SparePartService(axiosPrivate);
  const returnService = new ReturnService(axiosPrivate);

  const [activeTab, setActiveTab] = useState<string>("cash");
  const [tabCredit, setTabCredit] = useState(false);
  const [tabCash, setTabCash] = useState(false);
  const [creditorSelectKey, setCreditorSelectKey] = useState(0);


  const [invoiceOptions, setInvoiceOptions] = useState<InvoiceOption[]>([]);



  const { 
    data: baseInvoices,
    isLoading: baseInvoiceLoading,
  } = useQuery<InvoiceID[]>({
    queryKey: ["baseInvoices", debouncedSearchTerm],
    queryFn: () =>
      returnService.fetchAllInvoiceByGivenTerm(debouncedSearchTerm),
    retry: 1,
  });

  const { 
    data: selectedBaseInvoice,
    isLoading: selectedInvoiceLoading,
  } = useQuery<BaseInvoice>({
    queryKey: ["selectedBaseInvoice", selectedInvoiceId],
    queryFn: () =>
      returnService.fetchInvoiceByInvoiceID(selectedInvoiceId),
    retry: 1,
    enabled: selectedInvoiceId !== null,
    
  });

  // const invoiceOptions: InvoiceOption[] = baseInvoices?.map((invoice) => ({
  //   label: invoice.invoiceID,
  //   value: invoice,
  // }));

  useEffect(() => {
    if (baseInvoices) {
      setInvoiceOptions(baseInvoices.map((invoice) => ({
        label: invoice.invoiceID,
        value: invoice.invoiceID,
      })));
    }
  }, [baseInvoices]);

  useEffect(() => {
    console.log("===================",selectedInvoiceId);
  }
  , [selectedInvoiceId])


  const handleInputChange = (inputValue: string) => {
    setInputText(inputValue)
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
    id: number,
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
        (item) => item.id === Number(id),
      );
      return acc + (item ? quantity * item.price : 0);
    }, 0);
    setTotalReturnValue(totalValue);
    setReturnAmount(totalValue);
  }, [returnedQuantities, selectedInvoice]);
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleSourceInvoice = (baseInvoice: BaseInvoice) => {
    console.log("BAAASE",baseInvoice);
    if (baseInvoice === undefined || baseInvoice === null) return;

    setReturnedQuantities({});
    setSelectedInvoice(baseInvoice);
    setCustomer(baseInvoice?.customer);
    setPurchaseDate(baseInvoice?.date);
    setNewInvoiceType(findInvoiceType(baseInvoice?.invoiceId));
    setSourceInvoiceId(baseInvoice?.invoiceId);
    resetExchangeItemTable();
    setNewInvoiceType(
      baseInvoice?.invoiceId === undefined
        ? ""
        : baseInvoice?.invoiceId.split("-")[1],
    );
    
  };

  useEffect(() => {
    if (selectedBaseInvoice === null) return;
    // this needs to happen only if there is a difference previous selected invoice and the new selected invoice
    // if (selectedBaseInvoice?.invoiceId !== sourceInvoiceId) {
      handleSourceInvoice(selectedBaseInvoice);
    // }
  }, [selectedBaseInvoice, sourceInvoiceId]);

  const findInvoiceType = (invoiceId: string): string => {
    const parts = invoiceId?.split("-");
    const invoiceType = parts[1];
    return invoiceType;
  };


  const subtotal = useMemo(() => {
    return invoiceItemDTOList.reduce(
      (acc: any, item: any) =>
        acc + item.quantity * item.price - item.quantity * item.discount,
      0,
    );
  }, [invoiceItemDTOList]);

  const discountedTotal = useMemo(
    () => subtotal - (discountAmount || 0),
    [subtotal, discountAmount],
  );
  
  const totalWithVat = useMemo(
    () => discountedTotal + (vatAmount || 0),
    [discountedTotal, vatAmount],
  );

  

  useEffect(() => {
    if (selectedInvoice) {
      setSelectedInvoiceType(selectedInvoice.invoiceId.split("-")[1]);
    }
  }, [selectedInvoice]);

  useEffect(() => {
    setCashBackAmount(returnAmount - totalWithVat - remainingDue < 0 ? 0 : returnAmount - totalWithVat - remainingDue);
  }, 
  [returnAmount, totalWithVat, remainingDue,setCashBackAmount])

  useEffect(() => {
    const totalDue = selectedBaseInvoice?.totalPrice - selectedBaseInvoice?.settledAmount;
    let subjectedDue = 0;
    if(totalDue >= returnAmount) {
      subjectedDue = returnAmount
    } else {
      subjectedDue = totalDue
    }
    setRemainingDue(subjectedDue);
  }
  , [returnAmount, selectedBaseInvoice?.totalPrice, selectedBaseInvoice?.settledAmount, setRemainingDue])
  
  const [inputText, setInputText] = useState<string>('')
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
        <CardContent className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-[75%]">
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
                // key={creditorSelectKey}
                className="select-place-holder"
                placeholder={"Search and select returned invoice"}
                options={invoiceOptions}
                onChange={(option) => {
                  // if cleared the selected invoice
                  if (option === null) {
                    // resetState();
                    setSelectedInvoiceId(null);
                    return;
                  }
                  setSelectedInvoiceId(option.value);
                  // setSourceInvoiceId(option.value);
                }}
                onInputChange={handleInputChange}
                isLoading = {baseInvoiceLoading}
                isClearable={true}
                isSearchable={true}
                inputValue={inputText}
                noOptionsMessage={() => "No invoice found for given criteria, please try another one."}
                // value={sourceInvoiceId}
              />
            </div>
            <div style={{ marginTop: 15 }}>
              <Tabs
                defaultValue="returnItems"
                className="w-[100%] h-full"
                onValueChange={handleTabChange}
              >
                <div className="h-full">
                  <div className="flex justify-between items-center">
                    <TabsList className="grid w-full sm:w-[40%] grid-cols-2 bg-primary text-slate-50">
                      <TabsTrigger value="returnItems">
                        Return Items
                      </TabsTrigger>
                      <TabsTrigger value="newItems">Exchange Items</TabsTrigger>
                    </TabsList>
                  </div>
                  {/* Return Item view section */}
                  <TabsContent value="returnItems" className="h-full">
                      <Table className="border rounded-md text-md mt-6 mb-5 table-responsive h-full">
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
                        {selectedInvoiceLoading ? (
                          <TableBodySkeleton cols={6} rows={5} noHeader={true} />
                        ) : (
                        <TableBody>
                          {selectedInvoice ? (
                            selectedInvoice?.items.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>
                                  {item?.code.length === 0 ? "-" : item.code}
                                </TableCell>
                                <TableCell align="right">
                                  {item.price}
                                </TableCell>
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
                                    className="w-fit"
                                    type="number"
                                    max={item.quantity + 1}
                                    min={0}
                                    value={returnedQuantities[item.id] || ""}
                                    onChange={(e) => {
                                      const enteredValue = e.target.value;
                                      if (enteredValue === "") {
                                        handleReturnedQuantityChange(
                                          item.code,
                                          0,
                                          item.price,
                                          item.id,
                                        );
                                      } else {
                                        const parsedValue = parseInt(enteredValue, 10);
                                        if (parsedValue > item.availableQuantity) {
                                          e.target.value = item.availableQuantity.toString();
                                        } else if (parsedValue >= 0) {
                                          handleReturnedQuantityChange(
                                            item.code,
                                            parsedValue,
                                            item.price,
                                            item.id,
                                          );
                                        }
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
                              <TableCell
                                colSpan={6}
                                className="text-center py-4"
                              >
                                Please select the invoice first.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                        )}
                      </Table>
                  </TabsContent>

                  {/* New invoice section */}
                  <TabsContent value="newItems">
                    <InvoiceTable
                      sparePartService={sparePartService}
                      type="RETURN"
                    />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>

          <div className="w-full lg:w-[25%]">
            <Summary
              creditorSelectKey={creditorSelectKey}
              setCreditorSelectKey={setCreditorSelectKey}
              isDataLoading={selectedInvoiceLoading}
            />
          </div>
        </CardContent>
      </div>
    </Fragment>
  );
}

export default HandlingReturn;
