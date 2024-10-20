import CreatableSelectErrorMessage from "@/components/formElements/CreatableSelectErrorMessage";
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
import { VehicleService } from "@/service/sparePartInventory/vehicleServices";
import { VehicleModel as VehicleModalDataType } from "@/types/sparePartInventory/vehicleTypes";
import {
  VehicleModel,
  vehicleModelSchema,
} from "@/validation/schema/SparePart/vehicleModelSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastAction } from "@radix-ui/react-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import CreatableSelect from "react-select/creatable";
import { z } from "zod";

type vehicleModelValues = z.infer<typeof vehicleModelSchema>;

const defaultValues: Partial<vehicleModelValues> = {};

export default function VehicleForm({
  service,
  onClose,
  vehicleModel,
  setVehicle,
}: {
  service: VehicleService;
  onClose: () => void;
  vehicleModel: VehicleModalDataType | null;
  setVehicle: React.Dispatch<React.SetStateAction<VehicleModalDataType | null>>;
}) {
  const queryClient = useQueryClient();

  const { data: vehicleTypes } = useQuery({
    queryKey: ["vehicleTypes"],
    queryFn: () => service.fetchVehicleTypes(),
    retry: 2,
  });

  const { data: vehicleBrands } = useQuery({
    queryKey: ["vehicleBrands"],
    queryFn: () => service.fetchVehicleBrands(),
    retry: 2,
  });

  const { data: chassisNos } = useQuery({
    queryKey: ["chassisNos"],
    queryFn: () => service.fetchVehicleChassisNos(),
    retry: 2,
  });

  const form = useForm<vehicleModelValues>({
    resolver: zodResolver(vehicleModelSchema),
    defaultValues,
  });

  const resetForm = () => {
    form.setValue("id", vehicleModel ? vehicleModel.id : undefined);
    form.setValue(
      "brand",
      vehicleModel
        ? {
            value: vehicleModel.vehicleBrand,
            label: vehicleModel.vehicleBrand,
            __isNew__: false,
          }
        : { label: "", value: "", __isNew__: false },
    );
    form.setValue(
      "type",
      vehicleModel
        ? {
            value: vehicleModel.vehicleType,
            label: vehicleModel.vehicleType,
            __isNew__: false,
          }
        : { label: "", value: "", __isNew__: false },
    );
    form.setValue(
      "chassisNo",
      vehicleModel
        ? {
            value: vehicleModel.chassisNo,
            label: vehicleModel.chassisNo,
            __isNew__: false,
          }
        : { label: "", value: "", __isNew__: false },
    );
    form.setValue("model", vehicleModel ? vehicleModel.model : "");
    form.setValue(
      "description",
      vehicleModel ? vehicleModel.description || "" : undefined,
    );
    form.clearErrors();
  };

  const typeOptions =
    vehicleTypes?.map((type) => ({
      value: { id: type.id, value: type.type },
      label: type.type,
      __isNew__: false,
    })) || [];

  const brandOptions =
    vehicleBrands?.map((brand) => ({
      value: { id: brand.id, value: brand.brand },
      label: brand.brand,
      __isNew__: false,
    })) || [];

  const chassisNoOptions =
    chassisNos?.map((chassisNo) => ({
      value: { id: chassisNo.id, value: chassisNo.chassisNo },
      label: chassisNo.chassisNo,
      __isNew__: false,
    })) || [];

  const createVehicleMutation = useMutation({
    mutationFn: (formData: VehicleModel) => {
      return service.createVehicleModel(formData);
    },
    onSuccess: () => {
      // Handle onSuccess logic here
      queryClient.invalidateQueries({ queryKey: ["vehicleModels"] });
      toast({
        variant: "default",
        title: "Success",
        description: "Successfully inserted vehicle.",
        action: (
          <ToastAction altText="View Vehicles">View Vehicles</ToastAction>
        ),
      });
    },
    onError: (data) => {
      toast({
        variant: "destructive",
        title: "Vehicle model creation is failed",
        description: data.message,
        duration: 5000,
      });
    },
  });

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

  const updateVehicleMutation = useMutation({
    mutationFn: (formData: VehicleModel) =>
      service.updateVehicleModel(formData),
    onSuccess: () => {
      // Handle onSuccess logic here
      queryClient.invalidateQueries({ queryKey: ["vehicleModels"] });
      toast({
        variant: "default",
        title: "Success",
        description: "Successfully updated vehicle.",
        action: (
          <ToastAction altText="View Vehicles">View Vehicles</ToastAction>
        ),
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Vehicle model update failed",
        description: error.message,
        duration: 5000,
      });
    },
  });

  const handleCancel = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    setVehicle(null);
    onClose(); // Close the form
  };

  const handleSubmit = async () => {
    console.log("-------------------------");
    console.log(form.getValues());
    try {
      if (form.getValues()) {
        if (vehicleModel === null) {
          await createVehicleMutation.mutateAsync(form.getValues());
          onClose();
        } else {
          await updateVehicleMutation.mutateAsync(form.getValues());
          onClose();
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  useEffect(() => {
    if (vehicleModel) {
      form.setValue("id", vehicleModel.id);
      form.setValue("brand", {
        value: vehicleModel.vehicleBrand,
        label: vehicleModel.vehicleBrand,
        __isNew__: false,
      });
      form.setValue("type", {
        value: vehicleModel.vehicleType,
        label: vehicleModel.vehicleType,
        __isNew__: false,
      });
      form.setValue("chassisNo", {
        value: vehicleModel.chassisNo,
        label: vehicleModel.chassisNo,
        __isNew__: false,
      });
      form.setValue("model", vehicleModel.model);
      form.setValue("description", vehicleModel.description ?? "");
    }
  }, [vehicleModel, form]);

  return (
    <Form {...form}>
      <form className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="type"
            render={({ field, fieldState }) => (
              <FormItem className="w-full col-span-1 row-span-1">
                <RequiredLabel label="Vehicle Type" />
                <FormControl>
                  <CreatableSelect
                    className="select-place-holder"
                    placeholder={"Select or add new vehicle type"}
                    {...field}
                    onKeyDown={form.getValues("type")?.value ? (e) => handleKeyDown(e, 1) : undefined}
                    isClearable
                    options={typeOptions}
                    value={field.value}
                  />
                </FormControl>
                {fieldState.error && (
                  <CreatableSelectErrorMessage
                    error={fieldState.error}
                    label="Vehicle Type"
                    value={field.value}
                  />
                )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="brand"
            render={({ field, fieldState }) => (
              <FormItem className="w-full col-span-1 row-span-1">
                <RequiredLabel label="Vehicle Brand" />
                <FormControl ref={(el) => (inputRefs.current[2] = el)}>
                  <CreatableSelect
                    className="select-place-holder"
                    placeholder={"Select or add new vehicle brand"}
                    {...field}
                    isClearable
                    onKeyDown={form.getValues("brand")?.value ? (e) => handleKeyDown(e, 2) : undefined}
                    options={brandOptions}
                    value={field.value}
                  />
                </FormControl>
                {fieldState.error && (
                  <CreatableSelectErrorMessage
                    error={fieldState.error}
                    label="Vehicle Brand"
                    value={field.value}
                  />
                )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="model"
            render={({ field, fieldState }) => (
              <FormItem className="w-full col-span-1 row-span-1">
                <RequiredLabel label="Vehicle Model" />
                <FormControl ref={(el) => (inputRefs.current[3] = el)}>
                  <Input
                    onKeyDown={(e) => handleKeyDown(e, 3)}
                    {...field}
                    className="w-full"
                    placeholder="Please enter vehicle model"
                    value={field.value || ""}
                    disabled={vehicleModel !== null}
                  />
                </FormControl>
                {fieldState.error && (
                  <FormMessage>{fieldState.error.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="chassisNo"
            render={({ field, fieldState }) => (
              <FormItem className="w-full col-span-1 row-span-1">
                <RequiredLabel label="Chassis No" />
                <FormControl ref={(el) => (inputRefs.current[4] = el)}>
                  <CreatableSelect
                    className="select-place-holder"
                    placeholder={"Select or add new chassis no"}
                    onKeyDown={form.getValues("chassisNo")?.value ? (e) => handleKeyDown(e, 4) : undefined}
                    {...field}
                    isClearable
                    options={chassisNoOptions}
                    value={field.value}
                  />
                </FormControl>
                {fieldState.error && (
                  <CreatableSelectErrorMessage
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
            render={({ field, fieldState }) => (
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
                {fieldState.error && (
                  <FormMessage>{fieldState.error.message}</FormMessage>
                )}
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
            >
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
