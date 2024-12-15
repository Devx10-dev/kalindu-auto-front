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
import { SaleAndExpenseService } from "@/service/salesAndExpenses/SaleAndExpenseService";
import {
  Category,
  categorySchema,
} from "@/validation/schema/salesAndExpenses/categorySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRef } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";

function CategoryForm({
  onClose,
  salesAndExpenseService,
}: {
  onClose: () => void;
  salesAndExpenseService: SaleAndExpenseService;
}) {
  type FieldValues = z.infer<typeof categorySchema>;
  const defaultValues: Partial<FieldValues> = {};

  const form = useForm<FieldValues>({
    resolver: zodResolver(categorySchema),
    defaultValues,
  });

  const resetForm = () => {
    form.setValue("id", undefined);
    form.setValue("name", undefined);
  };

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

  const createCategoryMutation = useMutation({
    mutationFn: (formData: Category) =>
      salesAndExpenseService.createCategory({
        name: formData.name,
      }),
    onSuccess: () => {
      toast({
        variant: "default",
        title: "Success",
        description: "Successfully inserted Category.",
      });
    },
    onError: (data) => {
      toast({
        variant: "destructive",
        title: "Category creation is failed",
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
        await createCategoryMutation.mutateAsync(form.getValues());
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
            name="name"
            render={({ field }) => (
              <FormItem className="w-full col-span-1 row-span-1">
                <RequiredLabel label="Category Name" />
                <FormControl ref={(el) => (inputRefs.current[1] = el)}>
                  <Input
                    onKeyDown={(e) => handleKeyDown(e, 1)}
                    {...field}
                    className="w-full"
                    placeholder="Please enter category name"
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
              ref={(el) => (inputRefs.current[2] = el)}
              onClick={form.handleSubmit(handleSubmit)}
              className="mr-2"
              disabled={createCategoryMutation.isPending}
            >
              {createCategoryMutation.isPending && (
                <ReloadIcon className="mr-2 h-5 w-5 animate-spin" />
              )}
              {createCategoryMutation.isPending ? "Saving..." : "Save"}
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

export default CategoryForm;
