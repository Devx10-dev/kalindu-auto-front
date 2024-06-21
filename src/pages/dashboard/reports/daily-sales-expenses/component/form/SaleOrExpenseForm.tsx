import {
  OptionalLabel,
  RequiredLabel,
} from "@/components/formElements/FormLabel";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { SaleAndExpenseService } from "@/service/salesAndExpenses/SaleAndExpenseService";
import {
  SaleOrExpense,
  saleOrExpenseSchema,
} from "@/validation/schema/salesAndExpenses/saleOrExpenseSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { z } from "zod";

function SaleOrExpenseForm({
  onClose,
  salesAndExpenseService,
  date,
}: {
  date: string;
  onClose: () => void;
  salesAndExpenseService: SaleAndExpenseService;
}) {
  const queryClient = useQueryClient();

  type SaleOrExpenseValues = z.infer<typeof saleOrExpenseSchema>;
  const defaultValues: Partial<SaleOrExpenseValues> = {};

  const form = useForm<SaleOrExpenseValues>({
    resolver: zodResolver(saleOrExpenseSchema),
    defaultValues,
  });

  const {
    data: fields,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["fields"],
    queryFn: () => salesAndExpenseService.fetchFields(),
    retry: 2,
  });

  const resetForm = () => {
    form.setValue("id", undefined);
    form.setValue("amount", undefined);
    form.setValue("reason", undefined);
    form.setValue("field", undefined);
    form.setValue("isExpense", true);
  };

  const fieldOptions =
    fields?.map((field) => ({
      value: { id: field.id, name: field.name },
      label: field.name,
    })) || [];

  const createSaleOrExpenseMutation = useMutation({
    mutationFn: (formData: SaleOrExpense) =>
      salesAndExpenseService.createSaleOrExpense({
        date: date,
        amount: formData.amount,
        expense: formData.isExpense,
        reason: formData.reason,
        field: { id: formData.field.value.id, name: formData.field.value.name },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dailySummery"] });
      toast({
        variant: "default",
        title: "Success",
        description: `Successfully inserted details.`,
      });
    },
    onError: (data) => {
      toast({
        variant: "destructive",
        title: "Operation is failed",
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
    console.log(form.getValues());
    try {
      if (form.getValues()) {
        await createSaleOrExpenseMutation.mutateAsync(form.getValues());
        onClose();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading fields</div>;
  }

  return (
    <Form {...form}>
      <form className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="field"
            render={({ field }) => (
              <FormItem className="w-full col-span-1 row-span-1">
                <RequiredLabel label="Field" />
                <FormControl>
                  <Select
                    className="select-place-holder"
                    placeholder={"Select field"}
                    options={fieldOptions}
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
            name="reason"
            render={({ field }) => (
              <FormItem className="w-full col-span-1 row-span-1">
                <OptionalLabel label="Reason" />
                <FormControl>
                  <Textarea
                    {...field}
                    className="w-full"
                    placeholder="Please enter the reason"
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isExpense"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-8">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Is an expense?</FormLabel>
                </div>
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

export default SaleOrExpenseForm;
