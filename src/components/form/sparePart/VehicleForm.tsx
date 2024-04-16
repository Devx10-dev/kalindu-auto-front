import {
  VehicleModel,
  vehicleModelSchema,
} from "@/validation/schema/SparePart/vehicleModelSchema";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import Loading from "@/components/Loading";
import ErrorMessage from "@/components/formElements/ErrorMessage";
import { RequiredLabel } from "@/components/formElements/FormLabel";
import { Input } from "@/components/ui/input";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import {
  fetchVehicleBrands,
  fetchVehicleTypes,
} from "@/service/sparePartInventory/vehicleServices";
import { Option } from "@/types/component/propTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useQuery } from "react-query";
import CreatableSelect from "react-select/creatable";
import { Fragment } from "react/jsx-runtime";

export default function VehicleForm() {
  const axiosPrivate = useAxiosPrivate();
  const {
    register,
    handleSubmit,
    trigger,
    control,
    formState: { errors, isValid },
  } = useForm<VehicleModel>({
    resolver: zodResolver(vehicleModelSchema),
  });

  const {
    isLoading: isVehicleTypesLoading,
    isError: isVehicleTypesError,
    error: vehicleTypesError,
    data: vehicleTypes,
  } = useQuery("vehicle types", () => fetchVehicleTypes(axiosPrivate));

  const {
    isLoading: isVehicleBrandsLoading,
    isError: isVehicleBrandsError,
    error: vehicleBrandsError,
    data: vehicleBrands,
  } = useQuery("vehicle brands", () => fetchVehicleBrands(axiosPrivate));

  const onSubmit: SubmitHandler<VehicleModel> = (data) => {
    console.log(data);
  };

  const vehicleTypeOptions: Option[] = [];
  const vehicleBrandOptions: Option[] = [];

  useEffect(() => {
    vehicleTypes?.forEach((type) => {
      vehicleTypeOptions.push({
        label: type.type,
        value: type.id.toString(),
      });
    });
  }, [isVehicleTypesLoading]);

  useEffect(() => {
    vehicleBrands?.forEach((brand) => {
      vehicleBrandOptions.push({
        label: brand.brand,
        value: brand.id.toString(),
      });
    });
  }, [isVehicleBrandsLoading]);

  console.log(vehicleTypes);
  console.log(vehicleTypeOptions);

  return (
    <Fragment>
      {isVehicleTypesLoading || isVehicleBrandsLoading ? (
        <Loading />
      ) : (
        <Fragment>
          <form onSubmit={handleSubmit(onSubmit)} className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="w-full col-span-1 row-span-1">
                <RequiredLabel label="Vehicle Model" />
                <Controller
                  name="model"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        placeholder="Please enter vehicle model"
                        {...field}
                        className="w-full fs-16"
                      />
                      {errors.model && (
                        <ErrorMessage error={errors.model.message ?? ""} />
                      )}
                    </>
                  )}
                />
              </div>

              <div className="w-full col-span-1 row-span-1">
                <RequiredLabel label="Vehicle Type" />
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <>
                      <CreatableSelect
                        className="select-place-holder"
                        placeholder={"Select or add new vehicle type"}
                        {...field}
                        isClearable
                        options={vehicleTypeOptions}
                      />
                      {errors.model && (
                        <ErrorMessage error={errors.model.message ?? ""} />
                      )}
                    </>
                  )}
                />
              </div>
            </div>
            <input type="submit">Submit</input>
          </form>
        </Fragment>
      )}
    </Fragment>
  );
}
