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
import { Cheque, chequeSchema } from "@/validation/schema/cheque/chequeSchema";
import { transactionSchema } from "@/validation/schema/creditor/transaction/transactionSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { z } from "zod";

import {
  Select as SelectComponent,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

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

  type transactionValues = z.infer<typeof transactionSchema>;
  const defaultValues: Partial<transactionValues> = {};

  const form = useForm<transactionValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues,
  });

  const resetForm = () => {
    form.setValue("id", undefined);
    form.setValue("amount", undefined);
    form.setValue("creditInvoice", undefined);
    form.setValue("creditor", undefined);
    form.setValue("type", "Cash");
    form.setValue("remark", undefined);
  };

  const creditorOptions =
    creditors?.map((creditor) => ({
      value: {
        id: parseInt(creditor.creditorID),
        contactPersonName: creditor.contactPersonName,
      },
      label: creditor.contactPersonName,
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
      if (form.getValues()) {
        await createChequeMutation.mutateAsync(form.getValues());
        onClose();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-8">
        <div className="grid grid-cols-3 grid-rows-3 gap-x-7 grid-flow-row mb-10 w-full">
          <FormField
            control={form.control}
            name="creditor"
            render={({ field }) => (
              <FormItem className="w-full col-span-1 row-span-1">
                <RequiredLabel label="Creditor" />
                <FormControl>
                  <Select
                    className="select-place-holder"
                    placeholder={"Select Creditor"}
                    options={creditorOptions}
                    value={field.value || ""}
                    onChange={field.onChange}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="creditor"
            render={({ field }) => (
              <FormItem className="w-full col-span-1 row-span-1">
                <RequiredLabel label="Creditor" />
                <FormControl>
                  <Select
                    className="select-place-holder"
                    placeholder={"Select Creditor"}
                    options={creditorOptions}
                    value={field.value || ""}
                    onChange={field.onChange}
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
              <FormItem className="w-full col-span-1 row-span-1">
                <RequiredLabel label="Amount" />
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    {...field}
                    className="w-full"
                    placeholder="Please enter amount"
                    value={field.value}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
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
              <FormItem className="w-full col-span-1 row-span-1">
                <OptionalLabel label="Remark" />
                <FormControl>
                  <Textarea placeholder="Add remark" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={handleCancel} variant={"outline"}>
            Cancel
          </Button>
          <div className="m-2" style={{ borderLeft: "3px solid #555" }} />
          <div>
            <Button onClick={form.handleSubmit(handleSubmit)} className="mr-2">
              Save
            </Button>
            <Button type="reset" variant={"outline"} onClick={resetForm}>
              Reset
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default TransactionForm;
