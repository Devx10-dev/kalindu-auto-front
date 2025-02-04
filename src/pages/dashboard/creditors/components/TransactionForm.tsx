import {
  OptionalLabel,
  RequiredLabel,
} from "@/components/formElements/FormLabel";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import CreditorAPI from "@/pages/dashboard/creditors/api/CreditorAPI";
import { ChequeService } from "@/service/cheque/ChequeService";
import { Creditor, TransactionTypes } from "@/types/creditor/creditorTypes";
import { transactionSchema } from "@/validation/schema/creditor/transaction/transactionSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import Select, { OptionProps, StylesConfig } from "react-select";
import AsyncSelect from "react-select/async";
import { z } from "zod";

import { Card, CardHeader } from "@/components/ui/card";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Select as SelectComponent,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CreditInvoice } from "@/types/invoice/credit/creditInvoiceTypes";
import { getRandomColor } from "@/utils/colors";
import { useEffect, useRef, useState } from "react";
import CreditorDetailsCard from "./CreditorDetailsCard";
import useQueryParams from "@/hooks/getQueryParams";
import { ReloadIcon } from "@radix-ui/react-icons";
import dateArrayToString from "@/utils/dateArrayToString";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftRight, CircleAlert, TimerReset } from "lucide-react";
import PageHeader from "@/components/card/PageHeader";

const RANDOM_COLOR = getRandomColor();

function TransactionForm({
  onClose,
  creditors,
  chequeService,
  creditorService,
}: {
  onClose: () => void;
  creditors: Creditor[];
  chequeService: ChequeService;
  creditorService: CreditorAPI;
}) {
  const queryClient = useQueryClient();

  const [selectedCreditor, setSelectedCreditor] = useState<Creditor | null>(
    null,
  );

  const inputRefs = useRef<any[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const [selectedType, setSelectedType] = useState<TransactionTypes>("CASH");
  const [selectedCreditInvoices, setSelectedCreditInvoices] = useState<
    CreditInvoice[]
  >([]);

  const [creditInvoiceOptions, setCreditInvoiceOptions] = useState<any[]>([]);

  type transactionValues = z.infer<typeof transactionSchema>;
  const defaultValues: Partial<transactionValues> = {};

  const form = useForm<transactionValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues,
  });

  const { data: creditInvoices, isLoading: creditInvoicesLoading } = useQuery({
    queryKey: ["unsettledCreditorInvoices", selectedCreditor],
    queryFn: () =>
      creditorService.fetchUnsettledCreditInvoicesByID(
        selectedCreditor === null
          ? 0
          : parseInt(selectedCreditor.creditorID as string),
      ),
    retry: 1,
  });

  const { data: cheques } = useQuery({
    queryKey: [`nonRedeemCheques-${selectedCreditor?.id}`, selectedCreditor],
    queryFn: () =>
      chequeService.fetchNonRedeemChequesOfCreditor(
        selectedCreditor === null
          ? 0
          : parseInt(selectedCreditor.creditorID.toString()),
      ),
    enabled: selectedCreditor !== null && selectedType === "CHEQUE",
    retry: 1,
  });

  const [creditorSelectKey, setCreditorSelectKey] = useState(0);
  const [creditInvoiceSelectKey, setCreditInvoiceSelectKey] = useState(0);

  const resetForm = () => {
    setSelectedCreditor(null);
    setSelectedCreditInvoices([]);

    form.reset({
      id: undefined,
      amount: undefined,
      creditInvoices: [],
      creditor: undefined,
      type: "CASH",
      remark: "",
    });

    form.setValue("creditor", null);
    form.setValue("creditInvoices", []);
    form.setValue("remark", "");
    form.setValue("amount", undefined);

    setCreditorSelectKey((prevKey) => prevKey + 1);
    setCreditInvoiceSelectKey((prevKey) => prevKey + 1);
  };

  const creditorOptions =
    creditors?.map((creditor) => ({
      value: parseInt(creditor.creditorID.toString()),
      label: creditor?.shopName ?? "-",
    })) || [];

  useEffect(() => {
    if (creditInvoices) {
      const options = creditInvoices.map((creditInvoice) => ({
        value: creditInvoice.id.toString(),
        label: creditInvoice.invoiceId,
        unsettledAmount:
          creditInvoice.totalPrice -
          creditInvoice.settledAmount -
          creditInvoice.pendingPayments,
      }));
      setCreditInvoiceOptions(options);
    }
    console.log("CIIII", creditInvoices);
  }, [creditInvoices]);

  const chequeOptions = cheques?.map((cheque) => ({
    value: cheque.id.toString(),
    label: cheque,
  }));

  const createTransactionMutation = useMutation({
    mutationFn: (data: transactionValues) =>
      creditorService.createCreditorTransaction(data),
    onSuccess: () => {
      // Handle onSuccess logic here
      queryClient.invalidateQueries({
        queryKey: ["allCreditors", "unsettledCreditorInvoices"],
      });
      queryClient.invalidateQueries({
        queryKey: ["creditors", selectedCreditor.creditorID],
      });
      toast({
        variant: "default",
        title: "Success",
        className: " bg-green-200",
        description: "Successfully added Transaction.",
      });

      resetForm();
    },
    onError: (data: any) => {
      toast({
        variant: "destructive",
        title: "Creating transaction failed",
        description: data.response.data,
        duration: 5000,
      });
    },
  });

  const handleSubmit = async () => {
    console.log("FORM", form);
    try {
      console.log("TRANSACTION", form.getValues());
      const transaction = form.getValues();

      if (
        transaction.type === "CHEQUE" &&
        transaction.amount >
          (selectedCreditor.chequeBalance === undefined
            ? 0
            : selectedCreditor.chequeBalance)
      ) {
        toast({
          title: "Validation error",
          description: "Creditor has no enough cheque amount",
          variant: "destructive",
          duration: 5000,
        });

        return;
      }

      const totalSelectedAmount = selectedCreditInvoices.reduce(
        (total, invoice) =>
          total +
          (invoice.totalPrice -
            invoice.settledAmount -
            invoice.pendingPayments),
        0,
      );
      if (transaction.amount > totalSelectedAmount) {
        toast({
          title: "Validation error",
          description: "The entered amount exceeds the payable balance.",
          variant: "destructive",
          duration: 5000,
        });

        return;
      }

      if (transaction) {
        const transactionData = {
          creditorID: transaction.creditor.value,
          transactionType: transaction.type.toUpperCase(),
          //make this into array of string from array of objects
          invoiceIDs: transaction.creditInvoices.map(
            (invoice) => invoice.value,
          ),
          totalPrice: transaction.amount,
          remark: transaction.remark,
          chequeID: transaction.chequeNo,
        };

        await createTransactionMutation.mutateAsync(transactionData);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  useEffect(() => {
    const transaction = form.getValues();
    console.log("TRANSACTION", transaction.creditInvoices);
  }, [form]);

  useEffect(() => {
    console.log("EXECUTED");
    setSelectedCreditInvoices([]);

    form.setValue("creditInvoices", [null]);
    form.setValue("remark", "");
    form.setValue("amount", undefined);

    setCreditInvoiceSelectKey((prevKey) => prevKey + 1);
  }, [selectedCreditor]);

  useEffect(() => {
    console.log("SELECTED", selectedCreditInvoices);
  }, [selectedCreditInvoices]);

  const { queryParams, setQueryParam } = useQueryParams();
  useEffect(() => {
    if (queryParams.creditor && creditors?.length > 0) {
      const creditor = creditors.find(
        (creditor) =>
          creditor.creditorID === String(queryParams.creditor) ||
          creditor.creditorID === Number(queryParams.creditor),
      );

      if (creditor) {
        // Create the option object that react-select expects
        const creditorOption = {
          value: parseInt(creditor.creditorID.toString()),
          label: creditor?.shopName ?? "-",
        };

        setSelectedCreditor(creditor);
        // Set both the form value and directly control the Select value
        form.setValue("creditor", creditorOption, {
          shouldValidate: true, // This will trigger validation
          shouldDirty: true, // This will mark the field as dirty
        });
      }
    }
  }, [queryParams.creditor, creditors, form]);

  useEffect(() => {
    if (selectedCreditor) {
      setQueryParam("creditor", selectedCreditor.creditorID);
    }
  }, [selectedCreditor, setQueryParam]);

  useEffect(() => {
    console.log(selectedCreditor);
  }, [selectedCreditor]);

  const [value, setValue] = useState([]);

  useEffect(() => {
    console.log("VALUE", value);
  }, [value]);

  useEffect(() => {
    console.log("FORM VALUE", form.getValues());
  }, [form.getValues(), selectedCreditInvoices, selectedCreditor]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div className={`py-4 w-full lg:col-span-8`} style={{ width: "98%" }}>
        <CardHeader className="pl-0">
          <PageHeader
            title="Add Transaction"
            description="Record a creditor's transaction details"
            icon={<ArrowLeftRight />}
          />
        </CardHeader>
        <Form {...form}>
          <form className="space-y-4">
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6`}>
              <FormField
                control={form.control}
                name="creditor"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <RequiredLabel label="Creditor" />
                    <FormControl ref={(el) => (inputRefs.current[1] = el)}>
                      <Select
                        key={creditorSelectKey}
                        className="select-place-holder"
                        placeholder={"Please select creditor"}
                        options={creditorOptions}
                        onKeyDown={(e) => handleKeyDown(e, 1)}
                        onChange={(selectedOption) => {
                          field.onChange(selectedOption);
                          const selectedCreditor = creditors.find(
                            (creditor) =>
                              parseInt(creditor.creditorID.toString()) ===
                              selectedOption.value,
                          );
                          setSelectedCreditor(selectedCreditor);
                        }}
                        value={field.value}
                      />
                    </FormControl>
                    {fieldState.error &&
                    (fieldState.error.message === "Required" ||
                      fieldState.error.message ===
                        "Expected object, received null") ? (
                      <p className="error-msg">Creditor is required</p>
                    ) : (
                      <FormMessage />
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel label="Transaction Type" />
                    <SelectComponent
                      onValueChange={(selectedType) => {
                        field.onChange(selectedType);
                        setSelectedType(selectedType as TransactionTypes);
                      }}
                      value={field.value}
                    >
                      <FormControl
                        onKeyDown={(e) => handleKeyDown(e, 2)}
                        ref={(el) => (inputRefs.current[2] = el)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Please select the transaction type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem key={Math.random()} value="CASH">
                          Cash
                        </SelectItem>
                        <SelectItem key={Math.random()} value="CHEQUE">
                          Cheque
                        </SelectItem>
                        <SelectItem key={Math.random()} value="DEPOSIT">
                          Deposit
                        </SelectItem>
                      </SelectContent>
                    </SelectComponent>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="creditInvoices"
                render={({ field, fieldState }) => (
                  <FormItem className="col-span-2">
                    <RequiredLabel label="Credit Invoices" />
                    <FormControl ref={(el) => (inputRefs.current[3] = el)}>
                      <Select
                        key={creditInvoiceSelectKey}
                        onKeyDown={(e) => handleKeyDown(e, 3)}
                        isDisabled={selectedCreditor === null}
                        value={value}
                        isMulti
                        name="Invoices"
                        options={creditInvoiceOptions}
                        isLoading={creditInvoicesLoading}
                        onChange={(selectedOptions) => {
                          console.log("SELECTED1", selectedOptions);
                          field.onChange(selectedOptions);
                          setValue(selectedOptions);
                          const selectedCreditInvoices = creditInvoices.filter(
                            (creditInvoice) =>
                              selectedOptions.filter(
                                (option) =>
                                  option.value === creditInvoice.id.toString(),
                              ).length > 0,
                          );
                          console.log("SELECTED2", selectedCreditInvoices);
                          console.log(
                            "SELECTED3",
                            selectedOptions.map((option) => option.value),
                          );
                          setSelectedCreditInvoices(selectedCreditInvoices);
                        }}
                        closeMenuOnSelect={false}
                        components={{ Option }}
                        styles={{ ...colourStyles }}
                      ></Select>
                    </FormControl>

                    {fieldState.error &&
                    (fieldState.error.message === "Required" ||
                      fieldState.error.message ===
                        "Expected string, received null") ? (
                      <p className="error-msg">Credit invoice is required</p>
                    ) : (
                      <FormMessage />
                    )}
                  </FormItem>
                )}
              />

              {selectedType === "CHEQUE" && (
                <FormField
                  control={form.control}
                  name="chequeNo"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <RequiredLabel label="Cheque" />
                      <SelectComponent
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select the cheque - [Cheque No - Cheque Amount]" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {chequeOptions?.map((chequeOption) => (
                            <SelectItem
                              key={Math.random()}
                              value={chequeOption.value}
                            >
                              {`${chequeOption.label.chequeNo} - ${chequeOption.label?.availableAmount} (available amount)`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </SelectComponent>
                      {fieldState.error &&
                      (fieldState.error.message === "Required" ||
                        fieldState.error.message ===
                          "Expected number, received nan") ? (
                        <p className="error-msg">Amount is required</p>
                      ) : (
                        <FormMessage />
                      )}
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel label="Amount" />
                    <FormControl
                      onKeyDown={(e) => handleKeyDown(e, 4)}
                      ref={(el) => (inputRefs.current[4] = el)}
                    >
                      <Input
                        type="number"
                        {...field}
                        placeholder={`${selectedCreditInvoices.length === 0 ? "Please select credit invoice first" : "Please enter amount"}`}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                        value={field.value ?? ""}
                        min={0}
                        disabled={selectedCreditInvoices.length === 0}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="remark"
                render={({ field }) => (
                  <FormItem>
                    <OptionalLabel label="Remark" />
                    <FormControl
                      onKeyDown={(e) => handleKeyDown(e, 5)}
                      ref={(el) => (inputRefs.current[5] = el)}
                    >
                      <Textarea
                        placeholder="Add remark"
                        {...field}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-start gap-2 py-4">
              <Button
                ref={(el) => (inputRefs.current[5] = el)}
                onClick={form.handleSubmit(handleSubmit)}
                className="px-6"
                disabled={createTransactionMutation.isPending}
              >
                {createTransactionMutation.isPending && (
                  <ReloadIcon className="mr-2 h-5 w-5 animate-spin" />
                )}
                {createTransactionMutation.isPending
                  ? "Adding..."
                  : "Add Transaction"}
              </Button>
              <Button
                type="reset"
                variant={"outline"}
                onClick={resetForm}
                className="px-6"
              >
                Reset
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <Card
        style={{
          transition: "opacity 0.5s ease, height 0.5s ease",
          overflow: "hidden",
          minWidth: "350px",
          width: "100%",
        }}
        className={`hidden lg:block lg:col-span-4 mt-5`}
      >
        <CreditorDetailsCard
          color={RANDOM_COLOR}
          selectedCreditInvoices={selectedCreditInvoices}
          selectedCreditor={selectedCreditor}
        />
      </Card>
    </div>
  );
}

const Option = (props) => {
  const {
    children,
    className,
    cx,
    getStyles,
    isDisabled,
    isFocused,
    isSelected,
    innerRef,
    innerProps,
  } = props;

  return (
    <div
      ref={innerRef}
      css={getStyles("option", props)}
      className={cx(
        {
          option: true,
          "option--is-disabled": isDisabled,
          "option--is-focused": isFocused,
          "option--is-selected": isSelected,
        },
        className,
        "hover:bg-gray-100 cursor-pointer",
      )}
      {...innerProps}
    >
      <div className="flex justify-between items-center p-2">
        <div>{children}</div>
        {props.data.unsettledAmount > 0 && (
          <Badge
            variant="secondary"
            className="text-xs rounded-sm bg-yellow-200"
          >
            <TimerReset className="h-3 w-3 mr-1" />
            Rs. {props.data.unsettledAmount}
          </Badge>
        )}
      </div>
    </div>
  );
};

const colourStyles: StylesConfig = {
  control: (styles) => ({ ...styles, backgroundColor: "white" }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      cursor: isDisabled ? "not-allowed" : "default",
    };
  },
  multiValue: (styles, { data }) => {
    return {
      ...styles,
    };
  },
  multiValueLabel: (styles, { data }) => ({
    ...styles,
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
  }),
};

export default TransactionForm;
