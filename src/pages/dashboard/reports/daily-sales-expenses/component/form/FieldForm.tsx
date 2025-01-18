import { RequiredLabel } from "@/components/formElements/FormLabel";
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
import useApiErrorHandler from "@/hooks/useApiErrorHandler";
import { SaleAndExpenseService } from "@/service/salesAndExpenses/SaleAndExpenseService";
import {
  Field,
  fieldSchema,
} from "@/validation/schema/salesAndExpenses/fieldSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { z } from "zod";

function FieldForm({
  onClose,
  salesAndExpenseService,
}: {
  onClose: () => void;
  salesAndExpenseService: SaleAndExpenseService;
}) {
  const queryClient = useQueryClient();
  const { handleError } = useApiErrorHandler();

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

  type FieldValues = z.infer<typeof fieldSchema>;
  const defaultValues: Partial<FieldValues> = {};

  const form = useForm<FieldValues>({
    resolver: zodResolver(fieldSchema),
    defaultValues,
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => salesAndExpenseService.fetchCategories(),
    retry: 2,
  });

  const resetForm = () => {
    form.setValue("id", undefined);
    form.setValue("name", undefined);
    form.setValue("category", undefined);
  };

  const categoryOptions =
    categories?.map((category) => ({
      value: { id: category.id, name: category.name },
      label: category.name,
    })) || [];

  const createFieldMutation = useMutation({
    mutationFn: (formData: Field) =>
      salesAndExpenseService.createField({
        name: formData.name,
        category: {
          id: formData.category.value.id,
          name: formData.category.value.name,
        },
      }),
    onSuccess: () => {
      toast({
        variant: "default",
        title: "Success",
        description: "Successfully inserted field.",
      });
    },
    onError: (error) => {
      handleError(error);
    },
  });

  const handleCancel = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    onClose();
  };

  const handleSubmit = async () => {
    try {
      if (form.getValues()) {
        await createFieldMutation.mutateAsync(form.getValues());
        onClose();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-8">
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="w-full col-span-1 row-span-1">
                <RequiredLabel label="Category" />
                <FormControl
                  ref={(el) => (inputRefs.current[1] = el)}
                  onKeyDown={(e) => {
                    if (form.getValues().category) {
                      //   e.preventDefault(); // Prevent any action when there's no value
                      // } else {
                      handleKeyDown(e, 1); // Move to the next field if a value exists
                    }
                  }}
                >
                  <Select
                    className="select-place-holder"
                    placeholder={"Select category"}
                    options={categoryOptions}
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
            name="name"
            render={({ field }) => (
              <FormItem className="w-full col-span-1 row-span-1">
                <RequiredLabel label="Field Name" />
                <FormControl ref={(el) => (inputRefs.current[2] = el)}>
                  <Input
                    onKeyDown={(e) => handleKeyDown(e, 2)}
                    {...field}
                    className="w-full"
                    placeholder="Please enter field name"
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
            <Button
              ref={(el) => (inputRefs.current[3] = el)}
              onClick={form.handleSubmit(handleSubmit)}
              className="mr-2"
              disabled={createFieldMutation.isPending}
            >
              {createFieldMutation.isPending && (
                <ReloadIcon className="mr-2 h-5 w-5 animate-spin" />
              )}
              {createFieldMutation.isPending ? "Saving..." : "Save"}
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

export default FieldForm;
