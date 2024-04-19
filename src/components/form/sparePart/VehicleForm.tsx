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
import { VehicleService } from "@/service/sparePartInventory/vehicleServices";
import { VehicleModel, vehicleModelSchema } from "@/validation/schema/SparePart/vehicleModelSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastAction } from "@radix-ui/react-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import CreatableSelect from "react-select/creatable";
import { z } from "zod";

type vehicleModelValues = z.infer<typeof vehicleModelSchema>;

const defaultValues: Partial<vehicleModelValues> = {};

export default function VehicleForm({
  service,
  onClose,
}: {
  service: VehicleService;
  onClose: () => void;
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

  const typeOptions =
    vehicleTypes?.map((type) => ({
      value: type,
      label: type.type,
    })) || [];

  const brandOptions =
    vehicleBrands?.map((brand) => ({
      value: brand,
      label: brand.brand,
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
        title: "Something went wrong : " + data.name,
        description: data.message,
        duration: 5000,
      });
    },
  });

  const handleSubmit = async () => {
    try {
      if (form.getValues()) {
        await createVehicleMutation.mutateAsync(form.getValues());
        onClose();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  console.log(form.getValues());

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
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
                <OptionalLabel label="Description" />
                <FormControl>
                  <Input
                    className="w-full"
                    type="text"
                    {...field}
                    placeholder="Add a description"
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={onClose} variant={"outline"}>
            Cancel
          </Button>
          <div className="m-2" style={{ borderLeft: "3px solid #555" }} />
          <div style={{ gap: "8px" }}>
            <Button type="submit">Save</Button>
            <Button type="reset" variant={"outline"}>
              Reset
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
