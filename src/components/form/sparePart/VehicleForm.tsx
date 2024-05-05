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
import { useEffect } from "react";
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
  });

  const { data: vehicleBrands } = useQuery({
    queryKey: ["vehicleBrands"],
    queryFn: () => service.fetchVehicleBrands(),
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
        : { label: "", value: "", __isNew__: false } 
    );
    form.setValue(
      "type",
      vehicleModel
        ? {
            value: vehicleModel.vehicleType,
            label: vehicleModel.vehicleType,
            __isNew__: false,
          }
        : { label: "", value: "", __isNew__: false }
    );
    form.setValue("model", vehicleModel ? vehicleModel.model : "");
    form.setValue("chassisNo", vehicleModel ? vehicleModel.chassisNo : "");
    form.setValue(
      "description",
      vehicleModel ? vehicleModel.description || "" : undefined
    );
  };
  

  const typeOptions =
    vehicleTypes?.map((type) => ({
      value: type,
      label: type.type,
      __isNew__: false,
    })) || [];

  const brandOptions =
    vehicleBrands?.map((brand) => ({
      value: brand,
      label: brand.brand,
      __isNew__: false,
    })) || [];

  const createVehicleMutation = useMutation({
    mutationFn: (formData: VehicleModel) =>
      service.createVehicleModel(formData),
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
      form.setValue("model", vehicleModel.model);
      form.setValue("chassisNo", vehicleModel.chassisNo);
      form.setValue("description", vehicleModel.description ?? "");
    }
  }, [vehicleModel, form]);

  console.log(form.getValues());

  return (
    <Form {...form}>
      <form className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="w-full col-span-1 row-span-1">
                <RequiredLabel label="Vehicle Type" />
                <FormControl>
                  <CreatableSelect
                    className="select-place-holder"
                    placeholder={"Select or add new vehicle type"}
                    {...field}
                    isClearable
                    options={typeOptions}
                    value={field.value}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem className="w-full col-span-1 row-span-1">
                <RequiredLabel label="Vehicle Brand" />
                <FormControl>
                  <CreatableSelect
                    className="select-place-holder"
                    placeholder={"Select or add new vehicle brand"}
                    {...field}
                    isClearable
                    options={brandOptions}
                    value={field.value}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem className="w-full col-span-1 row-span-1">
                <RequiredLabel label="Vehicle Model" />
                <FormControl>
                  <Input
                    {...field}
                    className="w-full"
                    placeholder="Please enter vehicle model"
                    value={field.value || ""}
                    disabled={vehicleModel !== null}
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
                <RequiredLabel label="Chassis Number" />
                <FormControl>
                  <Input
                    {...field}
                    className="w-full"
                    placeholder="Please enter chassis number"
                    value={field.value || undefined}
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
