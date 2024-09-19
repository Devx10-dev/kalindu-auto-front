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
import {
  Select as SelectComponent,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { z } from "zod";
import Select from "react-select";
import { Skeleton } from "@/components/ui/skeleton";
import { useRef } from "react";

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
    retry: 1,
  });

  const resetForm = () => {
    form.setValue("id", undefined);
    form.setValue("amount", undefined);
    form.setValue("reason", undefined);
    form.setValue("field", undefined);
    form.setValue("type", undefined);
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
        type: formData.type,
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
    return (
      <form className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="w-full col-span-1 row-span-1">
            <Skeleton className="h-6 w-24 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="w-full col-span-1 row-span-1">
            <Skeleton className="h-6 w-24 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="w-full col-span-1 row-span-1">
            <Skeleton className="h-6 w-24 mb-2" />
            <Skeleton className="h-20 w-full" />
          </div>

          <div className="w-full col-span-1 row-span-1">
            <Skeleton className="h-6 w-24 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Skeleton className="h-10 w-24 mr-2" />
          <div className="m-2" style={{ borderLeft: "3px solid #555" }} />
          <Skeleton className="h-10 w-24 mr-2" />
          <Skeleton className="h-10 w-24" />
        </div>
      </form>
    );
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
                <FormControl onKeyDown={(e) => handleKeyDown(e, 1)} ref={(el) => (inputRefs.current[1] = el)}>
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
                <FormControl ref={(el) => (inputRefs.current[2] = el)}>
                  <Input
                    onKeyDown={(e) => handleKeyDown(e, 2)} 
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
            name="type"
            render={({ field }) => (
              <FormItem  >
                <OptionalLabel label="Record Type" />
                <SelectComponent
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl onKeyDown={(e) => handleKeyDown(e, 3)} ref={(el) => (inputRefs.current[3] = el)} >
                    <SelectTrigger>
                      <SelectValue placeholder="Select the record type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem key={Math.random()} value="SALE">
                      Sale
                    </SelectItem>
                    <SelectItem key={Math.random()} value="EXPENSE">
                      Expense
                    </SelectItem>
                    <SelectItem key={Math.random()} value="CREDIT_BALANCE">
                      Credit Balance
                    </SelectItem>
                    <SelectItem
                      key={Math.random()}
                      value="UNSETTLED_CHEQUE_BALANCE"
                    >
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
            name="reason"
            render={({ field }) => (
              <FormItem className="w-full col-span-1 row-span-1">
                <OptionalLabel label="Reason" />
                <FormControl ref={(el) => (inputRefs.current[4] = el)}>
                  <Textarea
                    {...field}
                    className="w-full"
                    onKeyDown={(e) => handleKeyDown(e, 4)}
                    placeholder="Please enter the reason"
                    value={field.value || ""}
                  />
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
            <Button ref={(el) => (inputRefs.current[5] = el)} onClick={form.handleSubmit(handleSubmit)} className="mr-2">
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
