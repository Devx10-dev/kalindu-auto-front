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

  console.log(selectedCreditor);
  const resetForm = () => {
    setSelectedCreditor(null);

    form.setValue("id", undefined);
    form.setValue("amount", undefined);
    form.setValue("creditInvoice", undefined);
    form.setValue("creditor", undefined);
    form.setValue("type", "Cash");
    form.setValue("remark", undefined);
  };

  const creditorOptions =
    creditors?.map((creditor) => ({
      value: creditor.id,
      label: creditor.contactPersonName,
    })) || [];

  const creditInvoiceOptions =
    creditInvoices?.map((creditInvoice) => ({
      value: creditInvoice.id,
      label: creditInvoice.invoiceId,
    })) || [];

  const createChequeMutation = useMutation({
    mutationFn: (formData: Cheque) =>
      chequeService.createCheque({
        chequeNo: formData.chequeNo,
        amount: formData.amount,
        creditor: {
          creditorID: formData.creditor.value.id.toString(),
          contactPersonName: formData.creditor.value.contactPersonName,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cheques"] });
      toast({
        variant: "default",
        title: "Success",
        description: `Cheque is created successfully.`,
      });
    },
    onError: (data) => {
      toast({
        variant: "destructive",
        title: "Cheque creation is failed",
        description: data.message,
        duration: 5000,
      });
    },
  });

  const handleCancel = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    onClose();
  };

  const handleSubmit = async () => {
    try {
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div
        className={`py-4 w-full ${selectedCreditor === null ? "lg:col-span-12" : "lg:col-span-8"}`}
        style={{ width: "98%" }}
      >
        <Form {...form}>
          <form className="space-y-4">
            <div
              className={`grid grid-cols-1 ${selectedCreditor === null ? "lg:grid-cols-3" : ""} sm:grid-cols-2 gap-4`}
            >
              <FormField
                control={form.control}
                name="creditor"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel label="Creditor" />
                    <FormControl>
                      <Select
                        className="select-place-holder"
                        placeholder={"Select Creditor"}
                        options={creditorOptions}
                        onChange={(selectedOption) => {
                          field.onChange(selectedOption);
                          const selectedCreditor = creditors.find(
                            (creditor) => creditor.id === selectedOption.value
                          );
                          setSelectedCreditor(selectedCreditor || null);
                        }}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="creditInvoice"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel label="Credit Invoice" />
                    <FormControl>
                      <Select
                        className="select-place-holder"
                        placeholder={`${selectedCreditor === null ? "Please select creditor first" : "Select Credit invoice"}`}
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

                    <FormMessage />
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
                          <SelectValue placeholder="Select the Designation" />
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
                        min={0}
                        {...field}
                        placeholder="Please enter amount"
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
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
                    <FormControl>
                      <Textarea placeholder="Add remark" {...field} />
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

      <Card
        style={{
          opacity: selectedCreditor === null ? 0 : 1,
          height: selectedCreditor === null ? "0" : "auto",
          transition: "opacity 0.5s ease, height 0.5s ease",
          overflow: "hidden",
        }}
        className={`lg:col-span-${selectedCreditor === null ? "0" : "4"}`}
      >
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-lg">
              <div className="flex gap-2 items-center">
                <Avatar>
                  <AvatarFallback style={{ background: RANDOM_COLOR }}>
                    {selectedCreditor !== null
                      ? getInitials(selectedCreditor.contactPersonName)
                      : "NA"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p>
                    {selectedCreditor !== null
                      ? truncate(selectedCreditor?.shopName, 20)
                      : ""}
                  </p>
                  <CardDescription>{`Contact Name : ${
                    selectedCreditor !== null
                      ? truncate(selectedCreditor?.contactPersonName, 20)
                      : ""
                  }`}</CardDescription>
                </div>
              </div>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 text-sm">
          <div className="grid gap-3">
            <div className="font-semibold">Creditor Balance Details</div>
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Due Amount</span>
                <span
                  style={{
                    background: "#FFAAAA",
                    paddingLeft: 10,
                    paddingRight: 10,
                    borderRadius: 5,
                  }}
                >
                  Rs {selectedCreditor?.totalDue ?? 0}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Cheque Balance</span>
                <span
                  style={{
                    background: "#B4E380",
                    paddingLeft: 10,
                    paddingRight: 10,
                    borderRadius: 5,
                  }}
                >
                  Rs {selectedCreditor?.chequeBalance ?? 0}
                </span>
              </li>
            </ul>
            <Separator className="my-2" />
            <div className="font-semibold">Contact Details</div>
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Contact No</span>
                <span>{selectedCreditor?.primaryContact ?? ""}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Email Address</span>
                <span>{selectedCreditor?.email ?? ""}</span>
              </li>
            </ul>

            {selectedCreditInvoice !== null && (
              <>
                <Separator className="my-2" />
                <div className="font-semibold">Credit Invoice Details</div>
                <ul className="grid gap-3">
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Invoice ID</span>
                    <span>{selectedCreditInvoice?.invoiceId ?? ""}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span>
                      {selectedCreditInvoice
                        ? convertArrayToISOFormat(
                            selectedCreditInvoice?.issuedTime
                          )
                        : ""}
                    </span>
                  </li>
                </ul>

                <ul className="grid gap-3">
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Amount</span>
                    <span>{selectedCreditInvoice?.totalPrice ?? ""}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Settled Am,ount
                    </span>
                    <span
                      style={{
                        background: "#B4E380",
                        paddingLeft: 10,
                        paddingRight: 10,
                        borderRadius: 5,
                      }}
                    >
                      Rs {selectedCreditInvoice?.settledAmount ?? 0}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Due Amount</span>
                    <span
                      style={{
                        background: "#FFAAAA",
                        paddingLeft: 10,
                        paddingRight: 10,
                        borderRadius: 5,
                      }}
                    >
                      Rs{" "}
                      {selectedCreditInvoice.totalPrice -
                        selectedCreditInvoice.settledAmount ?? 0}
                    </span>
                  </li>
                </ul>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default TransactionForm;
