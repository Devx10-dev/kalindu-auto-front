import {
  OptionalLabel,
  RequiredLabel,
} from "@/components/formElements/FormLabel";
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
import { data } from "@/data";
import { Option } from "@/types/component/propTypes";
import { VehicleModelFormData } from "@/types/sparePartInventory/vehicleTypes";
import { vehicleFormSchema } from "@/validation/schema/SparePart/vehicleFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CreatableSelect from "react-select/creatable";
import { z } from "zod";

type AccountFormValues = z.infer<typeof vehicleFormSchema>;

const defaultValues: Partial<AccountFormValues> = {};
export function VehicleForm() {
  const form = useForm<VehicleModelFormData>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues,
  });

  function onSubmit(data: VehicleModelFormData) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  const vehicleTypeOptions: Option[] = [];
  const vehicleBrandOptions: Option[] = [];

  data.map((vehicle) => {
    vehicleTypeOptions.push({
      label: vehicle.type.type,
      value: vehicle.type.type,
    });
    vehicleBrandOptions.push({
      label: vehicle.brand.brand,
      value: vehicle.brand.brand,
    });
  });

  return (
    <div className="p-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem className="w-full col-span-1 row-span-1">
                  <FormLabel className="text-color">
                    <RequiredLabel label="vehicle model" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Please enter vehicle model"
                      {...field}
                      className="w-full fs-16"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={() => (
                <FormItem className="w-full col-span-1 row-span-1">
                  <FormLabel className="text-color">
                    <RequiredLabel label="vehicle type" />
                  </FormLabel>
                  <FormControl>
                    <CreatableSelect
                      className="select-place-holder"
                      isClearable
                      placeholder={"Select or add a new vehicle type"}
                      options={vehicleTypeOptions}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="brand"
              render={() => (
                <FormItem className="w-full col-span-1 row-span-1">
                  <FormLabel className="text-color">
                    <RequiredLabel label="vehicle brand" />
                  </FormLabel>
                  <FormControl>
                    <CreatableSelect
                      className="select-place-holder"
                      placeholder={"Select or add a new vehicle brand"}
                      isClearable
                      options={vehicleBrandOptions}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="w-full col-span-1 row-span-1">
                    <FormLabel className="text-color">
                      <OptionalLabel label="description" />
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Add a description ..."
                        className="w-full fs-16"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
