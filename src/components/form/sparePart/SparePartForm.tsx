import {
  OptionalLabel,
  RequiredLabel,
} from "@/components/formElements/FormLabel";
import SelectErrorMessage from "@/components/formElements/SelectErrorMessage";
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
import { SparePartService } from "@/service/sparePartInventory/sparePartService";
import { VehicleService } from "@/service/sparePartInventory/vehicleServices";
import { SparePartItem } from "@/types/sparePartInventory/sparePartTypes";
import {
  SparePart,
  spaerPartSchema,
} from "@/validation/schema/SparePart/sparePartSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { ToastAction } from "@radix-ui/react-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { isNumberObject } from "util/types";
import { z } from "zod";

type SparePartValues = z.infer<typeof spaerPartSchema>;

const defaultValues: Partial<SparePartValues> = {};

export default function SparePartForm({
  vehicleService,
  sparePartservice,
  onClose,
  sparePart,
  setSparePart,
}: {
  vehicleService: VehicleService;
  sparePartservice: SparePartService;
  onClose: () => void;
  sparePart: SparePartItem | null;
  setSparePart: React.Dispatch<React.SetStateAction<SparePartItem | null>>;
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
  const { data: chassisNos } = useQuery({
    queryKey: ["chassisNos"],
    queryFn: () => vehicleService.fetchVehicleChassisNos(),
    retry: 2,
  });

  const form = useForm<SparePartValues>({
    resolver: zodResolver(spaerPartSchema),
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
          }
        : undefined,
    );
    form.setValue("partName", sparePart ? sparePart.partName : "");
    form.setValue(
      "quantity",
      sparePart ? sparePart?.quantity?.toString() ?? "0" : "",
    );
    form.setValue("code", sparePart ? sparePart?.code ?? "" : "");
    form.setValue(
      "description",
      sparePart ? sparePart.description || "" : undefined,
    );

    form.clearErrors();
  };

  const chassisNoOptions =
    chassisNos?.map((chassisNo) => ({
      value: chassisNo.chassisNo,
      label: chassisNo.chassisNo,
    })) || [];

  const createSparePartMutation = useMutation({
    mutationFn: (formData: SparePart) => {
      const qty = parseInt(formData.quantity);
      return sparePartservice.createSparePart(formData);
    },
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

    onClose(); // Close the form
    setSparePart(null);
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
                <FormControl ref={(el) => (inputRefs.current[1] = el)}>
                  <Input
                    onKeyDown={(e) => handleKeyDown(e, 1)}
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
                <FormControl ref={(el) => (inputRefs.current[2] = el)}>
                  <Input
                    onKeyDown={(e) => handleKeyDown(e, 2)}
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
                <FormControl ref={(el) => (inputRefs.current[3] = el)}>
                  <Input
                    onKeyDown={(e) => handleKeyDown(e, 3)}
                    type="number"
                    min={0}
                    {...field}
                    className="w-full"
                    placeholder="Please enter quantity"
                    value={field.value !== undefined ? field.value : ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="chassisNo"
            render={({ field, fieldState }) => (
              <FormItem className="w-full col-span-1 row-span-1">
                <RequiredLabel label="Chassis No" />
                <FormControl>
                  <Select
                    className="select-place-holder"
                    placeholder={"Select Chassis No"}
                    options={chassisNoOptions}
                    ref={(el) => (inputRefs.current[4] = el)}
                    onKeyDown={(e) => {
                      if (form.getValues().chassisNo) {
                        //   e.preventDefault(); // Prevent any action when there's no value
                        // } else {
                        handleKeyDown(e, 4); // Move to the next field if a value exists
                      }
                    }}
                    value={field.value || ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                {fieldState.error && (
                  <SelectErrorMessage
                    error={fieldState.error}
                    label="Chassis No"
                    value={field.value}
                  />
                )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full col-span-1 row-span-1">
                <OptionalLabel label="Remark" />
                <FormControl ref={(el) => (inputRefs.current[5] = el)}>
                  <Textarea
                    onKeyDown={(e) => handleKeyDown(e, 5)}
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
            <Button
              ref={(el) => (inputRefs.current[6] = el)}
              type="submit"
              onClick={form.handleSubmit(handleSubmit)}
              disabled={
                createSparePartMutation.isPending ||
                updateSparePartMutation.isPending
              }
            >
              {(createSparePartMutation.isPending ||
                updateSparePartMutation.isPending) && (
                <ReloadIcon className="mr-2 h-5 w-5 animate-spin" />
              )}
              {createSparePartMutation.isPending ? "Saving..." : "Save"}
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
