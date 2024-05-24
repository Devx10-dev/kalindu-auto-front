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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { dummyItemSchema } from "@/validation/schema/invoice/dummy/DummyItemSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastAction } from "@radix-ui/react-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import CreatableSelect from "react-select/creatable";
import { z } from "zod";

type DummyItemValues = z.infer<typeof dummyItemSchema>;

const defaultValues: Partial<DummyItemValues> = {};

export default function DummyItemForm() {
  const queryClient = useQueryClient();

  const { data: chassisNos } = useQuery({
    queryKey: ["chassisNos"],
    queryFn: () => vehicleService.fetchVehicleChassisNos(),
    retry: 2,
  });

  const form = useForm<DummyItemValues>({
    resolver: zodResolver(dummyItemSchema),
    defaultValues,
  });

  const resetForm = () => {
    form.setValue("id", sparePart ? sparePart.id : undefined);
    form.setValue(
      "chassisNo",
      sparePart
        ? {
            value: sparePart.chassisNo,
            label: sparePart.chassisNo,
            __isNew__: false,
          }
        : { label: "", value: "", __isNew__: false }
    );
    form.setValue("partName", sparePart ? sparePart.partName : "");
    form.setValue(
      "quantity",
      sparePart ? sparePart?.quantity?.toString() ?? "0" : "0"
    );
    form.setValue("code", sparePart ? sparePart?.code ?? "" : "");
    form.setValue(
      "description",
      sparePart ? sparePart.description || "" : undefined
    );
  };

  const chassisNoOptions =
    chassisNos?.map((chassisNo) => ({
      value: chassisNo,
      label: chassisNo.chassisNo,
      __isNew__: false,
    })) || [];

  const createSparePartMutation = useMutation({
    mutationFn: (formData: SparePart) =>
      sparePartservice.createSparePart(formData),
    onSuccess: () => {
      // Handle onSuccess logic here
      queryClient.invalidateQueries({ queryKey: ["spareParts"] });
      toast({
        variant: "default",
        title: "Success",
        description: "Successfully inserted spare part.",
        action: (
          <ToastAction altText="View Spare parts">View Spare Parts</ToastAction>
        ),
      });
    },
    onError: (data) => {
      toast({
        variant: "destructive",
        title: "Spare Part creation is failed",
        description: data.message,
        duration: 5000,
      });
    },
  });

  const updateSparePartMutation = useMutation({
    mutationFn: (formData: SparePart) =>
      sparePartservice.updateSparePart(formData),
    onSuccess: () => {
      // Handle onSuccess logic here
      queryClient.invalidateQueries({ queryKey: ["spareParts"] });
      toast({
        variant: "default",
        title: "Success",
        description: "Successfully updated spare part.",
        action: (
          <ToastAction altText="View Spare Parts">View Spare Parts</ToastAction>
        ),
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Spare part update failed",
        description: error.message,
        duration: 5000,
      });
    },
  });

  const handleCancel = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    setSparePart(null);
    onClose(); // Close the form
  };

  const handleSubmit = async () => {
    try {
      if (form.getValues()) {
        if (sparePart === null) {
          await createSparePartMutation.mutateAsync(form.getValues());
          onClose();
        } else {
          await updateSparePartMutation.mutateAsync(form.getValues());
          onClose();
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  useEffect(() => {
    if (sparePart) {
      form.setValue("id", sparePart.id);
      form.setValue("chassisNo", {
        value: sparePart.chassisNo,
        label: sparePart.chassisNo,
        __isNew__: false,
      });
      form.setValue("partName", sparePart.partName);
      form.setValue("code", sparePart.code ?? "");
      form.setValue("quantity", sparePart.quantity?.toString() ?? "0");
      form.setValue("description", sparePart.description ?? "");
    }
  }, [sparePart, form]);

  return (
    <Form {...form}>
      <form className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="partName"
            render={({ field }) => (
              <FormItem className="w-full col-span-1 row-span-1">
                <RequiredLabel label="Spare Part" />
                <FormControl>
                  <Input
                    {...field}
                    className="w-full"
                    placeholder="Please enter spare part"
                    value={field.value || ""}
                    disabled={sparePart !== null}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="w-full col-span-1 row-span-1">
                <RequiredLabel label="Spare Part Code" />
                <FormControl>
                  <Input
                    {...field}
                    className="w-full"
                    placeholder="Please enter spare part code"
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem className="w-full col-span-1 row-span-1">
                <RequiredLabel label="Quantity" />
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    defaultValue={0}
                    {...field}
                    className="w-full"
                    placeholder="Please enter quantity"
                    value={field.value || 0}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="chassisNo"
            render={({ field }) => (
              <FormItem className="w-full col-span-1 row-span-1">
                <RequiredLabel label="Chassis No" />
                <FormControl>
                  <CreatableSelect
                    className="select-place-holder"
                    placeholder={"Select or add new chassis no"}
                    {...field}
                    isClearable
                    options={chassisNoOptions}
                    value={field.value}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full col-span-1 row-span-1">
                <OptionalLabel label="Remark" />
                <FormControl>
                  <Textarea
                    className="w-full"
                    {...field}
                    placeholder="Add a remark"
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
          <div style={{ gap: "8px" }}>
            <Button type="submit" onClick={form.handleSubmit(handleSubmit)}>
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
