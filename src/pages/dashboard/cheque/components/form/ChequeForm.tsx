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
import CreditorAPI from "@/pages/dashboard/creditors/api/CreditorAPI";
import { ChequeService } from "@/service/cheque/ChequeService";
import { Creditor } from "@/types/creditor/creditorTypes";
import { Cheque, chequeSchema } from "@/validation/schema/cheque/chequeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { z } from "zod";
import { useRef } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { CheckSquareIcon } from "lucide-react";

function ChequeForm({
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

  type ChequeValues = z.infer<typeof chequeSchema>;
  const defaultValues: Partial<ChequeValues> = {};

  const form = useForm<ChequeValues>({
    resolver: zodResolver(chequeSchema),
    defaultValues,
  });

  const resetForm = () => {
    form.setValue("id", undefined);
    form.setValue("amount", undefined);
    form.setValue("chequeNo", undefined);
    form.setValue("creditor", undefined);
  };

  const creditorOptions =
    creditors?.map((creditor) => ({
      value: {
        id: parseInt(creditor.creditorID.toString()),
        contactPersonName: creditor.contactPersonName,
      },
      label: creditor.shopName,
    })) || [];

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="chequeNo"
            render={({ field }) => (
              <FormItem className="w-full col-span-1 row-span-1">
                <RequiredLabel label="Cheque No" />
                <FormControl ref={(el) => (inputRefs.current[1] = el)}>
                  <Input
                    onKeyDown={(e) => handleKeyDown(e, 1)}
                    {...field}
                    className="w-full"
                    placeholder="Please enter cheque no"
                    value={field.value || ""}
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
                    ref={(el) => (inputRefs.current[2] = el)}
                    options={creditorOptions}
                    value={field.value || ""}
                    onChange={field.onChange}
                    isSearchable={true}
                    onKeyDown={(e) => {
                      if (form.getValues().creditor) {
                        //   e.preventDefault(); // Prevent any action when there's no value
                        // }
                        // else if(e.key === "Enter" && form.getValues().creditor) {
                        handleKeyDown(e, 2); // Move to the next field if a value exists
                      }
                    }}
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
                <FormControl ref={(el) => (inputRefs.current[3] = el)}>
                  <Input
                    onKeyDown={(e) => handleKeyDown(e, 3)}
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
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={handleCancel} variant={"outline"}>
            Cancel
          </Button>
          <div className="m-2" style={{ borderLeft: "3px solid #555" }} />
          <div>
            <Button
              ref={(el) => (inputRefs.current[4] = el)}
              onClick={form.handleSubmit(handleSubmit)}
              disabled={createChequeMutation.isPending}
              className="mr-2"
            >
              {createChequeMutation.isPending ? (
                <ReloadIcon className="mr-2 h-5 w-5 animate-spin" />
              ) : null}
              {createChequeMutation.isPending ? "Saving..." : "Save"}
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

export default ChequeForm;
