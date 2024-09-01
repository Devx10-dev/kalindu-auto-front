import {
  OptionalLabel,
  RequiredLabel,
} from "@/components/formElements/FormLabel";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import CreditorAPI from "@/pages/dashboard/creditors/api/CreditorAPI";
import { ChequeService } from "@/service/cheque/ChequeService";
import { Creditor } from "@/types/creditor/creditorTypes";
import { Cheque } from "@/validation/schema/cheque/chequeSchema";
import { transactionSchema } from "@/validation/schema/creditor/transaction/transactionSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { z } from "zod";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select as SelectComponent,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getRandomColor } from "@/utils/colors";
import { getInitials, truncate } from "@/utils/string";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { CreditInvoice } from "@/types/invoice/credit/creditInvoiceTypes";
import { convertArrayToISOFormat, formatDateToISO } from "@/utils/dateTime";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "lucide-react";
import CreditorDetailsCard from "./CreditorDetailsCard";

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
    null
  );
  const [selectedCreditInvoice, setSelectedCreditInvoice] =
    useState<CreditInvoice | null>(null);

  type transactionValues = z.infer<typeof transactionSchema>;
  const defaultValues: Partial<transactionValues> = {};

  const form = useForm<transactionValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues,
  });

  const { data: creditInvoices } = useQuery({
    queryKey: ["unsettledCreditorInvoices", selectedCreditor],
    queryFn: () =>
      creditorService.fetchUnsettledCreditInvoicesByID(
        selectedCreditor === null ? 0 : parseInt(selectedCreditor.creditorID)
      ),
  });

  const [creditorSelectKey, setCreditorSelectKey] = useState(0);
  const [creditInvoiceSelectKey, setCreditInvoiceSelectKey] = useState(0);

  const resetForm = () => {
    setSelectedCreditor(null);
    setSelectedCreditInvoice(null);

    form.reset({
      id: undefined,
      amount: undefined,
      creditInvoice: undefined,
      creditor: undefined,
      type: "Cash",
      remark: "",
      isPartial: false,
    });

    form.setValue("creditor", null);
    form.setValue("creditInvoice", null);
    form.setValue("remark", "");

    setCreditorSelectKey((prevKey) => prevKey + 1);
    setCreditInvoiceSelectKey((prevKey) => prevKey + 1);
  };

  const creditorOptions =
    creditors?.map((creditor) => ({
      value: parseInt(creditor.creditorID),
      label: creditor.contactPersonName,
    })) || [];

  const creditInvoiceOptions =
    creditInvoices?.map((creditInvoice) => ({
      value: creditInvoice.id,
      label: creditInvoice.invoiceId,
    })) || [];

  const createTransactionMutation = useMutation({
    mutationFn: (data: transactionValues) =>
      creditorService.createCreditorTransaction(data),
    onSuccess: () => {
      // Handle onSuccess logic here
      queryClient.invalidateQueries({ queryKey: ["creditorTransactions"] });
      queryClient.invalidateQueries({
        queryKey: ["creditor", selectedCreditor.creditorID],
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
    try {
      const transaction = form.getValues();

      console.log(transaction.type);
      console.log(
        transaction.amount >
          (selectedCreditor.chequeBalance === undefined
            ? 0
            : parseFloat(selectedCreditor.chequeBalance))
      );

      if (
        transaction.type === "Cheque" &&
        transaction.amount >
          (selectedCreditor.chequeBalance === undefined
            ? 0
            : parseFloat(selectedCreditor.chequeBalance))
      ) {
        toast({
          title: "Validation error",
          description: "Creditor has no enough cheque amount",
          variant: "destructive",
          duration: 5000,
        });

        return;
      }
      if (transaction) {
        const transactionData = {
          creditorID: transaction.creditor.value,
          transactionType: transaction.type.toUpperCase(),
          invoiceNo: selectedCreditInvoice.invoiceId,
          totalPrice: transaction.amount,
          isPartial: transaction.isPartial,
          remark: transaction.remark,
        };

        await createTransactionMutation.mutateAsync(transactionData);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      {selectedCreditor !== null && (
        <Card
          style={{
            opacity: selectedCreditor === null ? 0 : 1,
            height: selectedCreditor === null ? "0" : "auto",
            transition: "opacity 0.5s ease, height 0.5s ease",
            overflow: "hidden",
            minWidth: "350px",
            width: "100%",
          }}
          className="lg:hidden block"
        >
          <CreditorDetailsCard
            color={RANDOM_COLOR}
            selectedCreditInvoice={selectedCreditInvoice}
            selectedCreditor={selectedCreditor}
          />
        </Card>
      )}
      <div
        className={`py-4 w-full ${selectedCreditor === null ? "lg:col-span-12" : "lg:col-span-8"}`}
        style={{ width: "98%" }}
      >
        <Form {...form}>
          <form className="space-y-4">
            <div
              className={`grid grid-cols-1 ${selectedCreditor === null ? "lg:grid-cols-3" : ""} sm:grid-cols-2 gap-6`}
            >
              <FormField
                control={form.control}
                name="creditor"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <RequiredLabel label="Creditor" />
                    <FormControl>
                      <Select
                        key={creditorSelectKey}
                        className="select-place-holder"
                        placeholder={"Please select creditor"}
                        options={creditorOptions}
                        onChange={(selectedOption) => {
                          field.onChange(selectedOption);
                          const selectedCreditor = creditors.find(
                            (creditor) =>
                              parseInt(creditor.creditorID) ===
                              selectedOption.value
                          );
                          setSelectedCreditor(selectedCreditor || null);
                        }}
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
                name="creditInvoice"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <RequiredLabel label="Credit Invoice" />
                    <FormControl>
                      <Select
                        key={creditInvoiceSelectKey}
                        className="select-place-holder"
                        placeholder={`${selectedCreditor === null ? "Please select creditor first" : "Please select Credit invoice"}`}
                        options={creditInvoiceOptions}
                        onChange={(selectedOption) => {
                          field.onChange(selectedOption);
                          const selectedCreditInvoice = creditInvoices.find(
                            (creditInvoice) =>
                              creditInvoice.id === selectedOption.value
                          );
                          setSelectedCreditInvoice(
                            selectedCreditInvoice || null
                          );
                        }}
                        isDisabled={selectedCreditor === null}
                      />
                    </FormControl>

                    {fieldState.error &&
                    (fieldState.error.message === "Required" ||
                      fieldState.error.message ===
                        "Expected object, received null") ? (
                      <p className="error-msg">Credit invoice is required</p>
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
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Please select the transaction type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem key={Math.random()} value="Cash">
                          Cash
                        </SelectItem>
                        <SelectItem key={Math.random()} value="Cheque">
                          Cheque
                        </SelectItem>
                      </SelectContent>
                    </SelectComponent>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel label="Amount" />
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        placeholder={`${selectedCreditInvoice === null ? "Please select credit invoice first" : "Please enter amount"}`}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                        max={
                          selectedCreditInvoice === null
                            ? 1000000
                            : selectedCreditInvoice.totalPrice -
                              selectedCreditInvoice.settledAmount
                        }
                        disabled={selectedCreditInvoice === null}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPartial"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Is partial payment ? </FormLabel>
                      <FormDescription>
                        Indicate whether this transaction involves a payment
                        that is less than the full amount due.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="remark"
                render={({ field }) => (
                  <FormItem>
                    <OptionalLabel label="Remark" />
                    <FormControl>
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
                onClick={form.handleSubmit(handleSubmit)}
                className="px-6"
              >
                Add Transaction
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

      {selectedCreditor !== null && (
        <Card
          style={{
            opacity: selectedCreditor === null ? 0 : 1,
            height: selectedCreditor === null ? "0" : "auto",
            transition: "opacity 0.5s ease, height 0.5s ease",
            overflow: "hidden",
            minWidth: "350px",
            width: "100%",
          }}
          className={`hidden lg:block lg:col-span-4`}
        >
          <CreditorDetailsCard
            color={RANDOM_COLOR}
            selectedCreditInvoice={selectedCreditInvoice}
            selectedCreditor={selectedCreditor}
          />
        </Card>
      )}
    </div>
  );
}

export default TransactionForm;

// grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 sm:grid-cols-2 gap-3
